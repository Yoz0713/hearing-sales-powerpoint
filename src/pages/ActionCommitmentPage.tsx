import { useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { useObserverMarks } from '../context/ObserverMarksContext';
import { OBSERVER_STAGES } from './RoleplayObserverPage';
import { motion } from '../tokens/motion';

/**
 * 今天講過的話，依課程順序排成 3 欄 × 8 列。
 * 24 句話等重擺著，沒有預先標好的重點 —— 哪一句是重中之重，由講師當場點。
 */
const LEDGER: readonly string[] = [
  '回想一筆舒服，也回想一筆不舒服的購買',
  '找到你的慣性，也找到盲點',
  '王先生不是不需要，而是還沒準備好',
  '十個流程，客戶心裡只有三個問題',
  '客戶說出口的，只是冰山一角',
  '第一印象的目標，是讓客戶敢說真話',

  '客戶排斥的不是購買，是被推銷',
  '沒有行動，不等於沒有需求',
  '異議不是拒絕，是還有疑慮沒被理解',

  '一場選配，情緒該怎麼分配？',
  '病史問得深，後續才有切入點',
  '探尋來訪的真實動機',
  '病史之外，還要看見客戶的生活',
  '檢查的過程，也在建立信任與病識感',
  '不要只報數字，讓客戶看懂自己的位置',
  '理解，不等於接受',
  '先讓客戶想嘗試，再討論介入',
  '經濟能力，要在試聽前完成判斷',
  '用需求合理化，推到預算的上限',
  '客戶仍然猶豫，就先不要再推',
  '「太貴了」背後，是預算還是效果？',
  '四個任務，對話要怎麼走？',
  '先理解人，再提出方案',
  '心裡的三道門，只能照順序開',
];

/**
 * D33：課程結尾 - 客戶要的不是被說服，是被理解。
 *
 * 收斂的節奏是 43 →（你圈起來的）→ 1，但中間那一步不是動畫，是互動：
 * 整天講過的話攤在桌上，講師用滑鼠點出當場認定的重中之重，被點的那幾句
 * 亮起來、其餘退到背景。收斂多少、收斂在哪，每一場都可以不一樣。
 *
 * 版面全程不重排，只是雜訊逐步排掉；最後那三句話待過的位置，由結論句接手。
 * 頁尾回指 P.40 標成「下一輪想調整」的那一段；講師沒標記時只留下提問。
 */
export function ActionCommitmentPage() {
  const { adjust } = useObserverMarks();
  const marked = OBSERVER_STAGES.find((stage) => stage.id === adjust);

  /** 講師當場點亮的句子。可以複選，再點一次取消。 */
  const [picked, setPicked] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = useCallback((text: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (!next.delete(text)) next.add(text);
      return next;
    });
  }, []);

  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-finale-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-finale-count'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.1')
      // 今天講過的話一句一句浮上來，像把一整天重新攤在桌上。
      // 淡入放在容器上、位移放在每一行：行本身的 opacity 之後要交給點選狀態控制，
      // GSAP 不能在上面留下 inline opacity，否則會蓋掉淡出。
      .from(scope.querySelector('.js-finale-ledger'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.28')
      .from(scope.querySelectorAll('.js-finale-line'), {
        y: 14,
        duration: motion.duration.fast,
        stagger: 0.022,
      }, '<');
  }, []);

  return (
    <SlideShell
      fullBleed
      className={`finale${picked.size > 0 ? ' has-marks' : ''}`}
      animate={animate}
    >
      <main className="finale__stage">
        <header className="finale__nav js-finale-nav">
          <BrandLogo className="finale__logo" />

        </header>

        {/* 三行計數疊在同一格，靠狀態切換，數字不重排、只是一直變少。 */}
        <div className="finale__count js-finale-count">
          <p className="finale-count finale-count--all">
            <b>43</b>
            <span>今天走過的每一頁</span>
          </p>
          <p className="finale-count finale-count--picked" aria-live="polite">
            <span>今天的須牢記的</span>
            <b>{picked.size}</b>
            <span>個重點</span>
          </p>

        </div>

        <div className="finale__ledger js-finale-ledger" role="group" aria-label="今天課程講過的重點，點選標記">
          {LEDGER.map((text) => {
            const isPicked = picked.has(text);
            return (
              <button
                key={text}
                type="button"
                className={`finale-line${isPicked ? ' is-picked' : ''} js-finale-line`}
                aria-pressed={isPicked}
                onClick={(event) => {
                  toggle(text);
                  // 滑鼠點完就交還焦點：Reveal 的 Space 是「下一步」，
                  // 焦點留在按鈕上會讓同一個 Space 又把這句話切掉。
                  if (event.detail > 0) event.currentTarget.blur();
                }}
              >
                <span className="finale-line__mark" aria-hidden="true" />
                <span className="finale-line__text">{text}</span>
              </button>
            );
          })}

          {/* 結論句，落在剛才那些話待過的位置。 */}
          <p className="finale__answer fragment" data-fragment-index={0}>
            客戶要的，從來不是<span>被說服</span>，是<strong>被理解<i aria-hidden="true" /></strong>。
          </p>
        </div>

        <footer className="finale__handover fragment" data-fragment-index={1}>
          <p className="finale__handover-label">帶回門市</p>
          <p className="finale__handover-ask">明天第一位客戶，你打算多問哪一句話？</p>
          {marked && (
            <p className="finale__handover-mark">
              <span>下一輪想調整</span>
              {marked.name}
            </p>
          )}
        </footer>
      </main>
    </SlideShell>
  );
}
