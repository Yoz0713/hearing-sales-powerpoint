import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface ProcessStage {
  key: string;
  question: string;
  title: string;
  steps: string[];
  span: 3 | 4;
}

const PROCESS_STAGES: ProcessStage[] = [
  {
    key: 'understand',
    question: '我可以相信你，也能放心說嗎？',
    title: '建立信任與理解問題',
    steps: ['第一印象', '病史蒐集', 'COSI', '聽力檢測'],
    span: 4,
  },
  {
    key: 'necessity',
    question: '我真的需要現在處理嗎？',
    title: '建立介入必要性',
    steps: ['報告講解', '助聽器經驗', '介入的必要性'],
    span: 3,
  },
  {
    key: 'decision',
    question: '哪個選擇適合我？',
    title: '提出方案與協助決策',
    steps: ['提供方案', '試聽', '最後決定'],
    span: 3,
  },
];

const TEN_DOTS = Array.from({ length: 10 }, (_, index) => index);

/** D14：用三個客戶決策問題統整十個顧問式選配步驟。 */
export function ConsultativeProcessOverviewPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-process-overview-nav'), {
        y: -14,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelectorAll('.js-process-overview-title-word'), {
        yPercent: 70,
        opacity: 0.1,
        duration: motion.duration.base,
        stagger: 0.07,
        ease: motion.ease.emphasis,
      }, '-=0.04')
      .from(scope.querySelector('.js-process-overview-lead'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.22')
      .from(scope.querySelector('.js-process-overview-compression'), {
        scale: 0.8,
        rotate: -3,
        opacity: 0,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.46')
      .from(scope.querySelectorAll('.js-process-overview-stage'), {
        y: 62,
        scale: 0.96,
        opacity: 0,
        duration: motion.duration.base,
        stagger: 0.12,
        ease: motion.ease.emphasis,
      }, '-=0.3')
      .from(scope.querySelector('.js-process-overview-track'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.22');
  }, []);

  return (
    <SlideShell fullBleed className="process-overview" animate={animate}>
      <main className="process-overview__stage">
        <header className="process-overview__nav js-process-overview-nav">
          <BrandLogo className="process-overview__logo" />
        </header>

        <div className="process-overview__hero">
          <div className="process-overview__hero-copy">
            <h1 className="process-overview__title" aria-label="十個步驟，其實只有三個決策階段">
              <span className="process-overview__title-line">
                <span className="js-process-overview-title-word">十個流程，</span>
              </span>
              <span className="process-overview__title-line process-overview__title-line--accent">
                <span className="js-process-overview-title-word">客戶心裡始終只在意三個問題</span>
              </span>
            </h1>

          </div>

          <div className="process-overview__compression js-process-overview-compression" aria-hidden="true">
            <span className="process-overview__compression-from">10</span>
            <div className="process-overview__compression-bridge">
              <div className="process-overview__compression-dots">
                {TEN_DOTS.map((dot) => <i key={dot} />)}
              </div>
              <b />
            </div>
            <strong>3</strong>
          </div>
        </div>

        <div className="process-overview__path" aria-label="顧問式選配的三個決策階段">
          <div className="process-overview__track js-process-overview-track" aria-hidden="true" />
          {PROCESS_STAGES.map((stage, index) => (
            <article
              key={stage.key}
              className={`process-overview__phase process-overview__phase--${stage.key} process-overview__phase--span-${stage.span} js-process-overview-stage`}
            >
              <span className="process-overview__phase-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <blockquote>{stage.question}</blockquote>
              <h2>{stage.title}</h2>
              <ul
                className="process-overview__steps fragment"
                data-fragment-index={index}
                style={{ gridTemplateColumns: `repeat(${stage.steps.length}, minmax(0, 1fr))` }}
                aria-label={`${stage.title}所包含的步驟`}
              >
                {stage.steps.map((step) => (
                  <li key={step}><span>{step}</span></li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <footer className="process-overview__handoff fragment" data-fragment-index={3}>
          <p><strong>十步</strong>是工作順序，<strong>三階段</strong>才是客戶的決策歷程。</p>

        </footer>
      </main>
    </SlideShell>
  );
}
