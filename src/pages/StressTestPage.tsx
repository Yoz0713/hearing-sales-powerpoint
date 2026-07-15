import { useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { BigNumberLayout } from '../components/layouts/BigNumberLayout';
import { SlidePopup } from '../components/overlay/SlidePopup';
import { useRevealControl } from '../context/RevealControlContext';
import { useSlideIndex } from '../context/SlideIndexContext';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';

const TARGET = 1280;

/**
 * 框架壓力測試頁（非正式內容）。一次驗證五件事：GSAP count-up timeline、
 * GSAP stagger 進場、Reveal 原生 fragment、R 鍵雙層重置
 * （React 資料 setClicks(0) + 動畫 revert+replay）、以及頁內 Popup。
 */
export function StressTestPage() {
  const control = useRevealControl();
  const index = useSlideIndex();

  // React 資料層：點擊計數，證明 R 也會重置資料而不只是動畫。
  const [clicks, setClicks] = useState(0);
  useSlideReset(() => setClicks(0));

  // Popup 開關狀態：純 React state，不依賴 Reveal fragment，R 鍵與離頁都能可靠清空。
  const [activePopup, setActivePopup] = useState<string | null>(null);
  useSlideReset(() => setActivePopup(null));
  useEffect(
    () =>
      control.onSlideChanged((active) => {
        if (active !== index) setActivePopup(null);
      }),
    [control, index],
  );

  // GSAP 進場：count-up + stagger。以選擇器操作，gsap.context 已 scope 到本頁。
  const animate = useCallback((scope: HTMLElement) => {
    const numEl = scope.querySelector<HTMLElement>('.js-bignum');
    const counter = { v: 0 };
    gsap.fromTo(
      counter,
      { v: 0 },
      {
        v: TARGET,
        duration: motion.duration.countUp,
        ease: motion.ease.count,
        onUpdate: () => {
          if (numEl) numEl.textContent = Math.round(counter.v).toLocaleString();
        },
      },
    );
    gsap.from(scope.querySelectorAll('.js-stagger'), {
      opacity: 0,
      y: 24,
      duration: motion.duration.base,
      ease: motion.ease.enter,
      stagger: motion.fragmentStagger,
      delay: 0.15,
    });
  }, []);

  return (
    <SlideShell animate={animate}>
      <BigNumberLayout
        eyebrow="框架壓力測試 · 非正式內容"
        value={<span className="js-bignum">0</span>}
        unit="家客戶"
        title="這張壓力測試頁同時壓測 GSAP / Reveal fragment / R 重置"
      >
        <ul className="vslice-points">
          <li className="js-stagger">GSAP count-up 由 gsap.context() 建立</li>
          <li className="js-stagger">離頁時 ctx.revert() 自動清除，無殘留 inline style</li>
          <li className="fragment">這行是 Reveal 原生 fragment（按方向鍵逐步揭示）</li>
        </ul>
        <button type="button" className="vslice-btn" onClick={() => setClicks((c) => c + 1)}>
          React 資料層測試：已點擊 {clicks} 次（按 R 歸零）
        </button>
        <button type="button" className="vslice-btn" onClick={() => setActivePopup('demo')}>
          Popup 測試：點我跳出說明（按 R 或離頁自動關閉）
        </button>
        <p className="vslice-hint">
          快捷鍵： <kbd>→</kbd> 翻頁 · <kbd>R</kbd> 重置本頁 · <kbd>B</kbd> 黑屏
        </p>
      </BigNumberLayout>
      <SlidePopup open={activePopup === 'demo'} onClose={() => setActivePopup(null)}>
        <h3>頁內 Popup 示範</h3>
        <p>
          這個 popup 的開關是純 React state，不是 Reveal fragment，所以按 <kbd>R</kbd>{' '}
          或離開此頁都會正確關閉，不會殘留。
        </p>
      </SlidePopup>
    </SlideShell>
  );
}
