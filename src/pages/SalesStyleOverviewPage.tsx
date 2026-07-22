import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const SALES_STYLES = [
  {
    id: 'expert',
    title: '產品專家型',
    strength: '專業清楚',
    blindSpot: '說得多、問得少',
  },
  {
    id: 'relationship',
    title: '關係經營型',
    strength: '容易建立信任',
    blindSpot: '不敢談價格與決定',
  },
  {
    id: 'solver',
    title: '問題解決型',
    strength: '分析與建議精準',
    blindSpot: '忽略情緒',
  },
  {
    id: 'closer',
    title: '成交導向型',
    strength: '推進有力',
    blindSpot: '速度超過客戶準備',
  },
] as const;

/** D06 正式頁：以四個同權重水平切片，協助學員辨識自然銷售傾向。 */
export function SalesStyleOverviewPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-style-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-style-title'), {
        y: 36,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.05')
      .from(scope.querySelector('.js-style-intro'), {
        y: 18,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.24')
      .from(scope.querySelector('.js-style-board'), {
        y: 30,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.12');
  }, []);

  return (
    <SlideShell fullBleed className="sales-style-overview" animate={animate}>
      <main className="sales-style-overview__stage">
        <header className="sales-style-overview__nav js-style-nav">
          <BrandLogo className="sales-style-overview__logo" />
          <i className="sales-style-overview__nav-rule" aria-hidden="true" />
        </header>

        <div className="sales-style-overview__hero">
          <h1 className="sales-style-overview__title js-style-title">你習慣用哪一種方式幫客戶？</h1>
          <div className="sales-style-overview__prompt">
            <span>先別選理想中的你</span>
            <strong>只選最像平常的自己</strong>
          </div>
          <p className="sales-style-overview__intro js-style-intro">
            每種風格都有優勢，也都有容易忽略的地方。
          </p>
        </div>

        <div className="sales-style-overview__board js-style-board" role="table" aria-label="四種銷售風格的優勢與盲點">
          <div className="sales-style-overview__row" role="row">
            <div className="sales-style-overview__corner" role="columnheader">

            </div>
            {SALES_STYLES.map((style) => (
              <h2 key={`${style.id}-title`} className="sales-style-overview__type" role="columnheader">
                {style.title}
              </h2>
            ))}
          </div>

          <div className="sales-style-overview__row" role="row">
            <div className="sales-style-overview__row-label" role="rowheader">優勢</div>
            {SALES_STYLES.map((style) => (
              <p key={`${style.id}-strength`} className="sales-style-overview__value" role="cell">
                {style.strength}
              </p>
            ))}
          </div>

          <div className="sales-style-overview__row" role="row">
            <div className="sales-style-overview__row-label" role="rowheader">盲點</div>
            {SALES_STYLES.map((style) => (
              <p key={`${style.id}-risk`} className="sales-style-overview__value sales-style-overview__value--risk" role="cell">
                {style.blindSpot}
              </p>
            ))}
          </div>
        </div>

      </main>
    </SlideShell>
  );
}
