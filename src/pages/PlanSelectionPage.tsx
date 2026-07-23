import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const COMPARISON_PATHS = [
  {
    key: 'standard',
    number: '01',
    eyebrow: '先建立標準款的效果',
    title: '先從標準款開始',
    outcome: '往上推有阻礙',
    steps: [
      {
        label: '先試聽',
        copy: '標準款就已經聽得不錯。',
      },
      {
        label: '想再往上推',
        copy: '只能用更多高階功能，問客人願不願意錦上添花。',
      },
    ],
    conclusion: '高階款變成加分選項，不再是解決問題的必要條件。',
  },
  {
    key: 'premium',
    number: '02',
    eyebrow: '先建立高階款的效果',
    title: '先從高階款開始',
    outcome: '高階款成為基準',
    steps: [
      {
        label: '先試聽',
        copy: '先感受高階款的音質與降噪。',
      },
      {
        label: '客人詢問等級差異',
        copy: '說明高階款優勢：往下聽，效果會比現在試聽的差。',
      },
    ],
    conclusion: '預算足夠的客人，通常不願意繼續往下試聽。',
  },
] as const;

/**
 * D22：預算範圍已確認時，從不同等級起手試聽，
 * 對後續推進高階款造成的差異。
 */
export function PlanSelectionPage() {
  // GSAP 只負責頁首；比較路徑與原則帶交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-plan-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-plan-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-plan-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling plan-selection" animate={animate}>
      <header className="plan-selection__heading">
        <p className="counseling-kicker js-plan-kicker">提出方案</p>
        <h1 className="counseling-title js-plan-title">想推頂級款?</h1>
        <p className="plan-selection__lead js-plan-lead">
          先抓出客戶預算的上限，再來結合COSI困擾做說明
        </p>
      </header>
      <main className="plan-selection__comparison" aria-label="高階款的試聽起手方式比較">
        <p className="plan-comparison__premise">
          <span>前提</span>
          客戶預算範圍已抓準，目標是推高階款。
        </p>

        <div className="plan-comparison__paths">
          {COMPARISON_PATHS.map((path, index) => (
          <article
            key={path.key}
            className={`plan-comparison__path plan-comparison__path--${path.key} fragment`}
            data-fragment-index={index}
          >
            <div className="plan-path__head">
              <span className="plan-path__number">{path.number}</span>
              <div>
                <p>{path.eyebrow}</p>
                <h2>{path.title}</h2>
              </div>
              <span className="plan-path__outcome">{path.outcome}</span>
            </div>

            <ol className="plan-path__steps">
              {path.steps.map((step) => (
                <li key={step.label}>
                  <span>{step.label}</span>
                  <strong>{step.copy}</strong>
                </li>
              ))}
            </ol>

            <p className="plan-path__conclusion">
              <span>結果</span>
              {path.conclusion}
            </p>
          </article>
          ))}
        </div>
      </main>

      <footer className="plan-selection__close fragment" data-fragment-index={COMPARISON_PATHS.length}>

        <strong>需求若能合理化，就優先推到預算範圍內最能解決問題的上限。</strong>
      </footer>
    </SlideShell>
  );
}
