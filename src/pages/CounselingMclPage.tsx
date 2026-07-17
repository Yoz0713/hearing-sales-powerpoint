import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

export function CounselingMclPage() {
  const animate = useCallback((scope: HTMLElement) => { gsap.from(scope.querySelector('.js-mcl-dial'), { rotate: -100, scale: 0.7, opacity: 0, duration: motion.duration.slow, ease: motion.ease.emphasis }); }, []);
  return <SlideShell className="counseling counseling-mcl" animate={animate}>
    <div className="mcl-dial js-mcl-dial" aria-hidden="true"><i /><span>剛剛好</span></div><div className="mcl-copy"><p className="counseling-kicker">MCL</p><h1 className="counseling-title">找到剛剛好的音量</h1><p className="mcl-quote fragment">「MCL 就像電視音量，找到剛剛好的音量很重要。」</p><p className="mcl-detail fragment">諮商時，強調一般說話音量落在哪個範圍。</p></div>
  </SlideShell>;
}
