import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface Segment { id: string; label: string; percent: number; color: string; description: string; }

const SEGMENTS: Segment[] = [
  { id: 'visual', label: '視覺（外表）', percent: 55, color: 'var(--chart-seq-1)', description: '對方怎麼看你' },
  { id: 'tone', label: '聲音與語調', percent: 38, color: 'var(--chart-seq-3)', description: '對方怎麼聽你' },
  { id: 'words', label: '語言內容', percent: 7, color: 'var(--chart-seq-5)', description: '你實際說了什麼' },
];

/** 第一印象：7-38-55 法則。依 Reveal 順序顯示三根直條與說明。 */
export function ImpressionRulePage() {
  const animate = useCallback((scope: HTMLElement) => {
    const tl = gsap.timeline({ defaults: { ease: motion.ease.standard } });
    tl.from(scope.querySelector('.js-rule-eyebrow'), {
      x: -40,
      opacity: 0,
      duration: motion.duration.base,
    }).from(
      scope.querySelector('.js-rule-title'),
      { y: 16, opacity: 0, duration: motion.duration.base },
      '-=0.3',
    );

  }, []);

  return (
    <SlideShell animate={animate}>
      <div className="impression-rule">
        <p className="layout-bignumber__eyebrow js-rule-eyebrow">第一印象最重要的部分是什麼呢?</p>
        <h2 className="layout-bignumber__title js-rule-title"><span className="impression-rule__numbers">7-38-55</span> 法則</h2>

        <div className="stat-breakdown stat-breakdown--vertical" role="img" aria-label="第一印象由視覺 55%、聲音與語調 38%、語言內容 7% 組成">
          {SEGMENTS.map((seg) => (
            <div key={seg.id} className="vertical-stat fragment">
              <div className="vertical-stat__plot">
                <div className="vertical-stat__bar" style={{ height: `${seg.percent}%`, background: seg.color }} />
                <strong className="vertical-stat__value" style={{ bottom: `calc(${seg.percent}% + var(--space-3))` }}>{seg.percent}%</strong>
              </div>
              <div className="vertical-stat__label"><span className="vertical-stat__dot" style={{ background: seg.color }} /><b>{seg.label}</b><small>{seg.description}</small></div>
            </div>
          ))}
        </div>

        <div className="impression-speed__twist fragment">
          <p className="impression-speed__twist-eyebrow">第一印象的關鍵</p>
          <p className="impression-speed__twist-body">第一印象中，只有 7% 來自你說的內容，剩下的 93% 來自客戶對你外表、語調與肢體語言的觀感。</p>
        </div>
      </div>
    </SlideShell>
  );
}
