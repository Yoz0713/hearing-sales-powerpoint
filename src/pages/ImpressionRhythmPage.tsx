import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';

interface FlowStep {
  id: number;
  number: string;
  title: string;
  isSerious: boolean;
}

const FLOW_STEPS: FlowStep[] = [
  { id: 1, number: '01', title: '接待', isSerious: false },
  { id: 2, number: '02', title: '了解病史動機', isSerious: false },
  { id: 3, number: '03', title: 'COSI', isSerious: false },
  { id: 4, number: '04', title: '聽力檢測', isSerious: true },
  { id: 5, number: '05', title: '講解報告', isSerious: true },
  { id: 6, number: '06', title: '挖掘客戶對助聽器的想法', isSerious: false },
  { id: 7, number: '07', title: '討論介入的必要性', isSerious: true },
  { id: 8, number: '08', title: '試聽體驗', isSerious: false },
  { id: 9, number: '09', title: '最後做決定', isSerious: true },
];

const RELAXED_STEPS = FLOW_STEPS.filter((step) => !step.isSerious);
const SERIOUS_STEPS = FLOW_STEPS.filter((step) => step.isSerious);

/**
 * Reveal.js 的 fragmentshown/fragmenthidden 是 bubbles:true 的原生 DOM event，
 * 從 dom.wrapper（.reveal 根節點）派發，event.fragment 是變成 visible/hidden
 * 的那個 DOM 節點。在 document 上監聽即可收到，不需要額外的 deck context。
 */
interface RevealFragmentEvent extends Event {
  fragment?: Element;
}

export function ImpressionRhythmPage() {
  const [markedIds, setMarkedIds] = useState<ReadonlySet<number>>(() => new Set());
  const [revealed, setRevealed] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const classificationRef = useRef<HTMLDivElement>(null);
  const [flowViewBox, setFlowViewBox] = useState('0 0 100 100');
  const [flowPaths, setFlowPaths] = useState<string[]>([]);

  useSlideReset(
    useCallback(() => {
      setMarkedIds(new Set());
      setRevealed(false);
      // Reveal.js 的 fragment 節點掛在常駐 DOM 上（SlidesDeck 只掛載一次），
      // 一旦被翻過一次，.visible 會停留在該節點上，不會因為換頁而自動清除。
      // 下次不管從前頁或後頁重新進入本頁，Reveal 都會把它當成「已經翻過」，
      // 直接略過、跳去下一張投影片，導致這裡的比對步驟被跳過。手動清掉相關
      // fragment class，讓 Reveal 重新把它們視為尚未顯示，才能跟 React state
      // 保持一致。
      triggerRef.current?.classList.remove('visible', 'current-fragment');
      gridRef.current?.classList.remove('visible', 'current-fragment');
      classificationRef.current?.classList.remove('visible', 'current-fragment');
    }, []),
  );

  // 正解揭曉使用一個不可見的 fragment 標記步驟；分類區則完全交給 Reveal
  // 原生 fragment 做顯示／隱藏，不再操作九宮格節點或執行版面重排。
  useEffect(() => {
    const handleShown = (event: Event) => {
      const fragment = (event as RevealFragmentEvent).fragment;
      if (fragment === triggerRef.current) setRevealed(true);
    };
    const handleHidden = (event: Event) => {
      const fragment = (event as RevealFragmentEvent).fragment;
      if (fragment === triggerRef.current) setRevealed(false);
    };
    document.addEventListener('fragmentshown', handleShown);
    document.addEventListener('fragmenthidden', handleHidden);
    return () => {
      document.removeEventListener('fragmentshown', handleShown);
      document.removeEventListener('fragmenthidden', handleHidden);
    };
  }, []);

  // 流程箭頭改用實測座標畫，不再用手調的 0-100 百分比路徑：格子間距一改
  // （列間距、欄間距、跟標題的間距）百分比就會跟著跑掉，箭頭要嘛對不齊、
  // 要嘛整條被卡片蓋住看不見。這裡直接量 9 張卡片相對於 stage 容器的實際
  // 像素位置來算路徑，不論之後間距怎麼調整都一定對齊；viewBox 也改成跟
  // stage 實際尺寸相同的像素座標，CSS 那邊的 stroke-width 因此也要改成
  // 像素值（不能再用 0-100 系統下的小數）。
  useLayoutEffect(() => {
    const computePaths = () => {
      const stage = stageRef.current;
      const grid = gridRef.current;
      if (!stage || !grid) return;
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('.rhythm-node'));
      if (cards.length < 9) return;

      const stageRect = stage.getBoundingClientRect();
      if (stageRect.width === 0 || stageRect.height === 0) return;

      const rects = cards.map((card) => {
        const r = card.getBoundingClientRect();
        return {
          left: r.left - stageRect.left,
          right: r.right - stageRect.left,
          top: r.top - stageRect.top,
          bottom: r.bottom - stageRect.top,
          centerX: r.left - stageRect.left + r.width / 2,
          centerY: r.top - stageRect.top + r.height / 2,
        };
      });

      // 同排：從左卡片右緣中點，水平連到右卡片左緣中點。
      const rowArrow = (fromIndex: number, toIndex: number) => {
        const a = rects[fromIndex];
        const b = rects[toIndex];
        const y = (a.centerY + b.centerY) / 2;
        return `M ${a.right} ${y} H ${b.left}`;
      };

      // 換行：從該排最後一張卡片中央往下，在兩排中間轉 90 度往左，
      // 走到下一排第一張卡片的水平中心，再往下進入卡片。
      const wrapArrow = (fromIndex: number, toIndex: number) => {
        const a = rects[fromIndex];
        const b = rects[toIndex];
        const midY = (a.bottom + b.top) / 2;
        const startY = a.bottom + (midY - a.bottom) * 0.4;
        const endY = b.top - (b.top - midY) * 0.4;
        return `M ${a.centerX} ${startY} V ${midY} H ${b.centerX} V ${endY}`;
      };

      setFlowPaths([
        rowArrow(0, 1),
        rowArrow(1, 2),
        wrapArrow(2, 3),
        rowArrow(3, 4),
        rowArrow(4, 5),
        wrapArrow(5, 6),
        rowArrow(6, 7),
        rowArrow(7, 8),
      ]);
      setFlowViewBox(`0 0 ${stageRect.width} ${stageRect.height}`);
    };

    computePaths();
    // 字型載入完成後版面可能微調，重新量一次確保箭頭對齊。
    document.fonts?.ready.then(computePaths).catch(() => { });
    const handleResize = () => requestAnimationFrame(computePaths);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMark = (id: number) => {
    if (revealed) return; // 正解揭曉後鎖定標記，避免比對結果被誤觸改變
    setMarkedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 只用最單純的 kicker/title 兩段式進場（跟其他頁一致的既有慣例），
  // 9 宮格與 twist 提示句一律交給 Reveal 原生機制顯示，不再用 GSAP
  // querySelector 指定多個目標，避免換頁時序造成「元素進場失敗」。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-rhythm-kicker'), { opacity: 0, y: 18, duration: motion.duration.fast })
      .from(scope.querySelector('.js-rhythm-title'), { opacity: 0, y: 28, duration: motion.duration.base }, '-=0.15');
  }, []);

  return (
    <SlideShell
      className={`impression-rhythm${revealed ? ' impression-rhythm--revealed' : ''}`}
      animate={animate}
    >
      <header className="impression-rhythm__heading">
        <h1 className="impression-rhythm__title js-rhythm-title">什麼時候要停止輕鬆的氛圍?</h1>
      </header>

      <div ref={stageRef} className="impression-rhythm__stage">
        <svg className="impression-rhythm__flow-lines" viewBox={flowViewBox} aria-hidden="true" focusable="false">
          <defs>
            <marker id="rhythm-flow-arrow" viewBox="0 0 8 8" refX="6.8" refY="4" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
          </defs>
          {flowPaths.map((d, index) => (
            <path key={index} d={d} markerEnd="url(#rhythm-flow-arrow)" />
          ))}
        </svg>
        <div ref={gridRef} className="impression-rhythm__grid fragment fade-out" data-fragment-index="1" aria-label="選配流程的情緒標記">
          {FLOW_STEPS.map((step) => {
            const isMarked = markedIds.has(step.id);
            const isCorrect = revealed && isMarked && step.isSerious;
            const isWrong = revealed && isMarked && !step.isSerious;
            const isMissed = revealed && !isMarked && step.isSerious;
            const stateClass = isCorrect
              ? ' rhythm-node--correct'
              : isWrong
                ? ' rhythm-node--wrong'
                : isMissed
                  ? ' rhythm-node--missed'
                  : '';
            return (
              <button
                key={step.id}
                type="button"
                className={`rhythm-node${isMarked ? ' rhythm-node--marked' : ''}${stateClass}`}
                onClick={() => toggleMark(step.id)}
                aria-pressed={isMarked}
              >
                <span className="rhythm-node__number">{step.number}</span>
                <span className="rhythm-node__title">{step.title}</span>
                <span className="rhythm-node__state" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <div ref={classificationRef} className="rhythm-classification fragment" data-fragment-index="1" aria-label="選配流程的情緒分類">
          <div className="rhythm-classification__column rhythm-classification__column--relaxed">
            <h2>輕鬆氛圍</h2>
            <p className="rhythm-classification__intro">保持友善，讓個案願意開口。</p>
            <ul>
              {RELAXED_STEPS.map((step) => (
                <li key={step.id}><span>{step.number}</span>{step.title}</li>
              ))}
            </ul>
            <p className="rhythm-classification__footer">關係先行，才聽得見需求。</p>
          </div>
          <div className="rhythm-classification__column rhythm-classification__column--serious">
            <h2>嚴肅認真</h2>
            <p className="rhythm-classification__intro">展現專業與對客人的擔憂，引導個案做決策。</p>
            <ul>
              {SERIOUS_STEPS.map((step) => (
                <li key={step.id}><span>{step.number}</span>{step.title}</li>
              ))}
            </ul>
            <p className="rhythm-classification__footer">建立危機感讓客戶有記憶點</p>
          </div>
        </div>
      </div>

      <span
        ref={triggerRef}
        className="impression-rhythm__reveal-trigger fragment"
        data-fragment-index="0"
        aria-hidden="true"
      />

      <div className="impression-speed__twist fragment" data-fragment-index="1">
        <p className="impression-speed__twist-eyebrow">情緒不是一成不變</p>
        <p className="impression-speed__twist-body">
          一路微笑，像只想做生意；一路嚴肅，又會讓個案想逃跑。
        </p>
      </div>
    </SlideShell>
  );
}
