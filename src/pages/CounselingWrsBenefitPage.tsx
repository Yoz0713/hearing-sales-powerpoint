import { useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';

const BANDS = [
  { id: 'excellent', score: '>90%', result: '正常範圍', benefit: '佳' },
  { id: 'good', score: '75–90%', result: '稍微困難', benefit: '不錯，可提升交流能力' },
  { id: 'moderate', score: '60–75%', result: '中等困難', benefit: '可能有耳蝸後病變，助聽器效益有限，吵雜環境聆聽更困難' },
  { id: 'low', score: '50–60%', result: '辨識力差', benefit: '可能有耳蝸後病變，助聽器效益有限，吵雜環境聆聽更困難' },
  { id: 'poor', score: '<50%', result: '辨識力非常差', benefit: '效益非常差，需搭配溝通技巧' },
] as const;

export function CounselingWrsBenefitPage() {
  const [selected, setSelected] = useState<(typeof BANDS)[number]['id'] | null>(null);
  useSlideReset(() => setSelected(null));
  const animate = useCallback((scope: HTMLElement) => { gsap.from(scope.querySelectorAll('.js-wrs-band'), { opacity: 0, y: 58, stagger: 0.09, duration: motion.duration.base, ease: motion.ease.enter }); }, []);
  return <SlideShell className="counseling counseling-benefit" animate={animate}>
    <div className="benefit-heading"><p className="counseling-kicker">WRS 結果說明</p><h1 className="counseling-title">分數，決定期待怎麼說</h1></div>
    <div className={`wrs-accordion${selected ? ' has-selection' : ''}`}>{BANDS.map((band) => { const active = selected === band.id; return <button key={band.id} type="button" className={`wrs-band js-wrs-band${active ? ' is-active' : ''}`} onClick={() => setSelected(band.id)} aria-pressed={active}><span className="wrs-band__score">{band.score}</span><span className="wrs-band__result">{band.result}</span>{active && <span className="wrs-band__benefit">{band.benefit}</span>}</button>; })}</div>
    <p className="benefit-close fragment">衛教助聽器可防止 WRS 退化，以及早期佩戴的好處。</p>
  </SlideShell>;
}
