import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

export function CounselingAudiogramPage() {
  const animate = useCallback((scope: HTMLElement) => { gsap.from(scope.querySelectorAll('.js-audio-note'), { opacity: 0, y: 28, stagger: 0.12, duration: motion.duration.base, ease: motion.ease.enter }); }, []);
  return <SlideShell className="counseling counseling-audiogram" animate={animate}>
    <div className="audiogram-copy"><p className="counseling-kicker">聽力圖結果說明</p><h1 className="counseling-title">把圖表，翻成生活語言</h1><ul className="audiogram-notes"><li className="js-audio-note fragment">白話解釋聽力圖，連結客戶主述。</li><li className="js-audio-note fragment">COSI 未主述時，推敲生活中的困擾。</li><li className="js-audio-note fragment">評估是否可達聽障手冊標準。</li></ul></div>
    <div className="audiogram-visual" aria-label="聽力圖示意"><span className="audiogram-quiet">25 dB<br />聽力正常標準</span><span className="audiogram-speech">50–60 dB<br />一般說話音量</span><svg viewBox="0 0 760 520" role="img" aria-label="聽力圖與音量參考線"><path d="M76 68V450H690" className="audiogram-axis" /><path d="M76 180H690M76 300H690" className="audiogram-guide" /><path d="M126 164L238 195L346 236L462 282L582 338L654 360" className="audiogram-line" /><circle cx="126" cy="164" r="12" /><circle cx="238" cy="195" r="12" /><circle cx="346" cy="236" r="12" /><circle cx="462" cy="282" r="12" /><circle cx="582" cy="338" r="12" /><circle cx="654" cy="360" r="12" /></svg></div>
  </SlideShell>;
}
