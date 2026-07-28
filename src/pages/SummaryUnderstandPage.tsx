import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface Principle {
  id: 'person' | 'life' | 'reason';
  index: string;
  before: string;
  focus: string;
  after: string;
  action?: string;
}

const PRINCIPLES: readonly Principle[] = [
  {
    id: 'person',
    index: '01',
    before: '先',
    focus: '理解人',
    after: '，再理解問題。',
  },
  {
    id: 'life',
    index: '02',
    before: '先談',
    focus: '生活',
    after: '，再談產品。',
  },
  {
    id: 'reason',
    index: '03',
    before: '先建立',
    focus: '改變理由',
    after: '，再',
    action: '提出方案',
  },
];

/** D31：用三個順序收斂顧問式銷售的前半段。 */
export function SummaryUnderstandPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-summary-understand-nav'), {
        y: -18,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-summary-understand-heading'), {
        x: -30,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.12')
      .from(scope.querySelector('.js-summary-understand-guide'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.2')
      .from(scope.querySelector('.js-summary-understand-sequence'), {
        y: 20,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.34');
  }, []);

  return (
    <SlideShell fullBleed className="summary-understand" animate={animate}>
      <main className="summary-understand__stage">
        <header className="summary-understand__nav js-summary-understand-nav">
          <BrandLogo className="summary-understand__logo" />
          <div className="summary-understand__nav-trail">
            <span>課程總結</span>
            <i aria-hidden="true" />
          </div>
        </header>

        <div className="summary-understand__content">
          <header className="summary-understand__heading js-summary-understand-heading">
            <p>顧問式銷售</p>
            <h1>先理解人，再提出方案</h1>
          </header>

          <span className="summary-understand__guide js-summary-understand-guide" aria-hidden="true" />

          <ol
            className="summary-understand__sequence js-summary-understand-sequence"
            aria-label="顧問式銷售前半段的三個核心順序"
          >
            {PRINCIPLES.map((principle, index) => (
              <li
                key={principle.id}
                className={`summary-understand__line summary-understand__line--${principle.id} fragment`}
                data-fragment-index={index}
              >
                <span className="summary-understand__index">{principle.index}</span>
                <p>
                  <span>{principle.before}</span>
                  <strong>{principle.focus}</strong>
                  <span>{principle.after}</span>
                  {principle.action && <strong className="summary-understand__action">{principle.action}</strong>}
                  {principle.action && <i className="summary-understand__extension" aria-hidden="true" />}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </SlideShell>
  );
}
