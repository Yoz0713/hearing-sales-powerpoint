import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';
import warmthImage from '../../assets/impression-appearance/smile.png';
import confusedCustomerImage from '../../assets/困惑的長輩.svg';

const LIKED_BEHAVIORS = ['願意傾聽', '理解需求', '釐清問題', '給予方案'];
const DISLIKED_BEHAVIORS = ['照SOP走', '只顧講話', '目的很強', '忽略需求'];

interface RevealFragmentEvent extends Event {
  fragment?: Element;
}

/** D05 正式頁：把暖身感受收斂成顧問式銷售的核心行為對照。 */
export function SalesBehaviorContrastPage() {
  const [isConclusionFocused, setIsConclusionFocused] = useState(false);
  const conclusionRef = useRef<HTMLElement>(null);

  useSlideReset(
    useCallback(() => {
      setIsConclusionFocused(false);
      conclusionRef.current?.classList.remove('visible', 'current-fragment');
      if (conclusionRef.current) {
        gsap.set(conclusionRef.current.querySelectorAll('.js-conclusion-word'), { clearProps: 'all' });
      }
    }, []),
  );

  useEffect(() => {
    const handleShown = (event: Event) => {
      if ((event as RevealFragmentEvent).fragment === conclusionRef.current) {
        setIsConclusionFocused(true);
        const node = conclusionRef.current;
        if (node) {
          gsap.fromTo(
            node.querySelectorAll('.js-conclusion-word'),
            { opacity: 0, y: 22, scale: 0.82 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: motion.duration.base,
              stagger: motion.fragmentStagger,
              delay: 0.22,
              ease: motion.ease.enter,
            },
          );
        }
      }
    };
    const handleHidden = (event: Event) => {
      if ((event as RevealFragmentEvent).fragment === conclusionRef.current) {
        setIsConclusionFocused(false);
      }
    };

    document.addEventListener('fragmentshown', handleShown);
    document.addEventListener('fragmenthidden', handleHidden);
    return () => {
      document.removeEventListener('fragmentshown', handleShown);
      document.removeEventListener('fragmenthidden', handleHidden);
    };
  }, []);

  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-behavior-nav'), {
        y: -20,
        duration: motion.duration.fast,
      })
      .from(scope.querySelectorAll('.js-behavior-title-line'), {
        y: 48,
        stagger: 0.1,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.08')
      .from(scope.querySelector('.js-behavior-underline'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.38')
      .from(scope.querySelectorAll('.js-behavior-media'), {
        scale: 0.86,
        stagger: 0.12,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.42');
  }, []);

  return (
    <SlideShell
      fullBleed
      className={`sales-behavior${isConclusionFocused ? ' sales-behavior--conclusion' : ''}`}
      animate={animate}
    >
      <main className="sales-behavior__stage">
        <header className="sales-behavior__nav js-behavior-nav">
          <BrandLogo className="sales-behavior__logo" />

        </header>

        <div className="sales-behavior__heading">
          <h1>
            <span className="js-behavior-title-line">客戶排斥的不是購買，</span>
            <span className="sales-behavior__heading-focus js-behavior-title-line">
              是被推銷
              <i className="js-behavior-underline" aria-hidden="true" />
            </span>
          </h1>
        </div>

        <div className="sales-behavior__contrast" aria-label="客戶不喜歡與喜歡的銷售行為對照">
          <article className="sales-behavior__panel sales-behavior__panel--disliked fragment" data-fragment-index="0">
            <img className="sales-behavior__illustration js-behavior-media" src={confusedCustomerImage} alt="面對推銷感到困惑的長輩" />
            <div className="sales-behavior__panel-heading">
              <span>傳統銷售</span>
              <strong>感受到被推著走</strong>
            </div>
            <div className="sales-behavior__behaviors">
              {DISLIKED_BEHAVIORS.map((behavior) => <strong key={behavior}>{behavior}</strong>)}
            </div>
          </article>

          <article className="sales-behavior__panel sales-behavior__panel--liked fragment" data-fragment-index="1">
            <img className="sales-behavior__photo js-behavior-media" src={warmthImage} alt="聽力師對客戶溫暖微笑" />
            <div className="sales-behavior__panel-shade" aria-hidden="true" />
            <div className="sales-behavior__panel-heading">
              <span>顧問式銷售</span>
              <strong>感受到被理解</strong>
            </div>
            <div className="sales-behavior__behaviors">
              {LIKED_BEHAVIORS.map((behavior) => <strong key={behavior}>{behavior}</strong>)}
            </div>
          </article>
        </div>

        <footer ref={conclusionRef} className="sales-behavior__conclusion fragment" data-fragment-index="2">
          <div className="sales-behavior__conclusion-copy js-conclusion-word">
            <span>顧問式銷售的核心就是</span>
          </div>
          <div className="sales-behavior__conclusion-actions">
            <strong className="js-conclusion-word">提問</strong><i /><strong className="js-conclusion-word">傾聽</strong><i /><strong className="js-conclusion-word">引導</strong>
          </div>
        </footer>
      </main>
    </SlideShell>
  );
}
