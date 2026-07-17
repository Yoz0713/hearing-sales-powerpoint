import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

export function CounselingWrsPage() {
  const animate = useCallback((scope: HTMLElement) => { gsap.from(scope.querySelectorAll('.js-wrs-wave'), { scaleY: 0.12, transformOrigin: 'center bottom', stagger: 0.05, duration: motion.duration.base, ease: motion.ease.enter }); }, []);
  return <SlideShell className="counseling counseling-wrs" animate={animate}>
    <div className="wrs-copy"><p className="counseling-kicker">WRS</p><h1 className="counseling-title">聽得到，還要聽得懂</h1><p className="wrs-statement fragment">測試神經與大腦對於語言的理解能力是否有退化。</p><p className="wrs-detail fragment">諮商時，強調刺激音量與結果分數。</p></div>
    <div className="wrs-wave" aria-hidden="true">{[42, 86, 128, 184, 144, 96, 172, 226, 154, 88, 132].map((height, index) => <i key={index} className="js-wrs-wave" style={{ height }} />)}</div>
  </SlideShell>;
}
