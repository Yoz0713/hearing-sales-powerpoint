import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const STEPS = [
  { id: 'otoscopy', number: '01', title: '耳鏡檢查' },
  { id: 'tympanogram', number: '02', title: '鼓室圖' },
  { id: 'hearing', number: '03', title: '聽力與語音測試' },
];
export function CounselingFlowPage() {
  // Reveal fragment 是流程卡的唯一控制者；GSAP 只處理初始可見的頁首，避免
  // 對尚未揭示的卡片寫入 inline opacity 而與 Reveal 狀態衝突。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-flow-kicker'), { x: -28, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-flow-title'), { y: 20, opacity: 0, duration: motion.duration.base }, '-=0.25');
  }, []);
  return <SlideShell className="counseling counseling-flow counseling-flow--redesign" animate={animate}>
    <div className="flow-redesign__intro">
      <p className="counseling-kicker js-flow-kicker">衛教與諮商</p>
      <h1 className="counseling-title js-flow-title">釐清問題，<br />是諮商的開始</h1>
      <p className="flow-redesign__lead">由外而內，讓每一步檢查都成為客戶理解自身狀況的起點。</p>
    </div>
    <div className="flow-redesign__canvas" aria-label="檢查流程">
      <div className="flow-redesign__track js-flow-track" aria-hidden="true" />
      <div className="flow-redesign__steps">
        {STEPS.map((step) => <article key={step.id} className="flow-checkpoint fragment"><span className="flow-checkpoint__number">{step.number}</span><h2>{step.title}</h2><i aria-hidden="true" /></article>)}
      </div>
      <p className="flow-redesign__conclusion fragment">簡述檢查流程，讓客戶知道我們正在一起釐清問題。</p>
    </div>
  </SlideShell>;
}
