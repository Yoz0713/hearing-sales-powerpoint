import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

export function CounselingOtoscopyPage() {
  const animate = useCallback((scope: HTMLElement) => { gsap.from(scope.querySelector('.js-otoscopy-lens'), { scale: 0.55, opacity: 0, duration: motion.duration.slow, ease: motion.ease.enter }); }, []);
  return <SlideShell className="counseling counseling-exam counseling-otoscopy" animate={animate}>
    <div className="exam-lens js-otoscopy-lens" aria-hidden="true"><i /><b /></div>
    <div className="exam-copy"><p className="counseling-kicker">耳鏡檢查結果說明</p><h1 className="counseling-title">先排除外耳因素</h1><p className="exam-statement fragment">若不是外耳問題導致，需婉轉告知：聽力狀況無法逆轉。</p></div>
  </SlideShell>;
}
