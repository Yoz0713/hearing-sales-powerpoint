import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

export function CounselingTympanogramPage() {
  const animate = useCallback((scope: HTMLElement) => { const path = scope.querySelector<SVGPathElement>('.js-tymp-path'); if (path) gsap.from(path, { strokeDashoffset: 860, duration: 1.2, ease: motion.ease.standard }); }, []);
  return <SlideShell className="counseling counseling-exam counseling-tymp" animate={animate}>
    <div className="tymp-copy"><p className="counseling-kicker">鼓室圖結果說明</p><h1 className="counseling-title">再確認中耳狀況</h1><p className="exam-statement fragment">若非外耳、中耳問題，需婉轉告知：聽力狀況無法逆轉。</p></div>
    <svg className="tymp-chart" viewBox="0 0 660 420" role="img" aria-label="鼓室圖示意"><path d="M56 338H620M110 64V338" className="tymp-axis" /><path className="tymp-path js-tymp-path" d="M130 310C210 300 240 225 302 142C342 89 383 84 425 138C470 197 496 281 582 310" /></svg>
  </SlideShell>;
}
