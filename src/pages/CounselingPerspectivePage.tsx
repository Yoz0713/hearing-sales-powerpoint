import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

export function CounselingPerspectivePage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.emphasis } })
      .from(scope.querySelector('.js-perspective-title'), { x: -72, opacity: 0, duration: motion.duration.slow })
      .from(scope.querySelector('.js-perspective-orbit'), { scale: 0.72, rotate: -10, opacity: 0, duration: motion.duration.slow }, '-=0.45')
      .from(scope.querySelectorAll('.js-perspective-panel'), { y: 42, opacity: 0, stagger: 0.14, duration: motion.duration.base }, '-=0.35');
  }, []);
  return <SlideShell className="counseling counseling-perspective" animate={animate}>
    <div className="counseling-perspective__copy"><p className="counseling-kicker">衛教與諮商</p><h1 className="counseling-display js-perspective-title">理解，不等於接受</h1></div>
    <div className="perspective-orbit js-perspective-orbit" aria-hidden="true"><span /><i /><b /></div>
    <div className="perspective-panels">
      <article className="perspective-panel perspective-panel--education js-perspective-panel fragment"><h2>衛教</h2><p>讓客戶理解自身聽力問題，與助聽器的專業知識。</p></article>
      <article className="perspective-panel perspective-panel--counsel js-perspective-panel fragment"><h2>諮商</h2><p>連結聽力損失與日常生活，願意採取行動改善聆聽狀況。</p></article>
    </div>
  </SlideShell>;
}
