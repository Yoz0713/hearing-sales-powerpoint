import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const INNER_VOICE = [
  '我可以放心說。',
  '對方願意聽。',
  '對方不會立刻逼我買東西。',
  '我的問題會被認真處理。',
] as const;

/** D15：第一印象的成功標準，是讓客戶的戒心逐漸降下來。 */
export function ReceptionTrustPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-reception-trust-nav'), {
        y: -14,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelectorAll('.js-reception-trust-title-word'), {
        yPercent: 72,
        opacity: 0.1,
        duration: motion.duration.base,
        stagger: 0.08,
        ease: motion.ease.emphasis,
      }, '-=0.04')
      .from(scope.querySelectorAll('.js-reception-trust-wave'), {
        scaleY: 0.18,
        transformOrigin: 'center center',
        stagger: 0.05,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.32')
      .from(scope.querySelector('.js-reception-trust-rail'), {
        scaleY: 0,
        transformOrigin: 'center top',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.22');
  }, []);

  return (
    <SlideShell fullBleed className="reception-trust" animate={animate}>
      <main className="reception-trust__stage">
        <header className="reception-trust__nav js-reception-trust-nav">
          <BrandLogo className="reception-trust__logo" />
          <i aria-hidden="true" />
        </header>

        <h1 className="reception-trust__title" aria-label="第一印象的目標，是讓客戶敢說真話">
          <span className="js-reception-trust-title-word">第一印象的目標，</span>
          <span className="reception-trust__wave" aria-hidden="true">
            {[18, 34, 52, 34, 18].map((height, index) => (
              <i key={index} className="js-reception-trust-wave" style={{ height }} />
            ))}
          </span>
          <span className="js-reception-trust-title-word">是讓客戶敢說真話</span>
        </h1>

        <div className="reception-trust__voice" aria-label="客戶逐漸降低戒心時的內心話">
          <div className="reception-trust__rail js-reception-trust-rail" aria-hidden="true" />
          {INNER_VOICE.map((line, index) => (
            <p
              key={line}
              className={`reception-trust__line reception-trust__line--${index + 1} fragment`}
              data-fragment-index={index}
            >
              <i aria-hidden="true" />
              <span>{line}</span>
            </p>
          ))}
        </div>
      </main>
    </SlideShell>
  );
}
