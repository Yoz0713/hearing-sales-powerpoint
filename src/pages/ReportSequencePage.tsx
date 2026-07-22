import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

type Tier = 'data' | 'life' | 'agree';

interface ReportStep {
  key: string;
  index: string;
  /** 這一步在做什麼（動作名，襯線）。 */
  move: string;
  /** 這一步實際會說出口的一句話。 */
  say: string;
  tier: Tier;
  /** 整體結論與生活連結是兩個要被記住的錨點：實心節點。 */
  anchor?: boolean;
}

/** 數據 → 困難 → 生活 → 認同 → 方向：一路把冷數字翻回客戶的生活。 */
const STEPS: ReportStep[] = [
  { key: 'sum', index: '01', move: '讀報告重點', say: '最吃力的是聽清楚子音。', tier: 'data', anchor: true },
  { key: 'diff', index: '02', move: '對照病史', say: '這也對上您說的逐年變差。', tier: 'data' },
  { key: 'life', index: '03', move: '連回 COSI', say: '所以家族聚餐才特別吃力。', tier: 'life', anchor: true },
  { key: 'agree', index: '04', move: '說出關聯', say: '數字正在解釋您的生活困擾。', tier: 'agree' },
  { key: 'next', index: '05', move: '邀請確認', say: '這和您遇到的一樣嗎？', tier: 'agree' },
];

/**
 * D19：報告不是念數字，而是建立共同理解。
 * 左側一張冷冰冰的檢查報告，沿著青→橘→綠的閱讀路徑五步回溫成客戶點得了頭的話，
 * 最後落進底部確認句。整體結論與生活連結（實心節點）是要被記住的兩個錨點。
 */
export function ReportSequencePage() {
  // GSAP 只負責標題、報告晶片與軸線的進場；五步與確認句交給 Reveal 原生 fragment。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-report-kicker'), { x: -28, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-report-title'), { y: 22, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-report-intro'), { opacity: 0, duration: motion.duration.base }, '-=0.15')
      .from(scope.querySelector('.js-report-origin'), {
        x: -20,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.1')
      .from(scope.querySelector('.js-report-spine'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.35');
  }, []);

  return (
    <SlideShell className="counseling report-slide" animate={animate}>
      <header className="report-heading">
        <p className="counseling-kicker js-report-kicker">衛教與諮商</p>
        <h1 className="counseling-title js-report-title">報告不是念數字，而是建立共同理解</h1>
        <p className="report__intro js-report-intro">
          別急著逐格念數字——先把它翻成一句，客戶點得了頭的話。
        </p>
      </header>

      <div className="report-path" aria-label="從檢查數據到共同理解的五步閱讀路徑">
        <figure className="report-origin js-report-origin">
          <figcaption className="report-origin__eyebrow">你手上的</figcaption>
          <p className="report-origin__value">
            55<span>dB HL</span>
          </p>
          <svg className="report-origin__audiogram" viewBox="0 0 104 46" aria-hidden="true" focusable="false">
            <polyline points="10,11 40,17 72,31 96,39" fill="none" />
            <circle cx="10" cy="11" r="4.5" />
            <circle cx="40" cy="17" r="4.5" />
            <circle cx="72" cy="31" r="4.5" />
            <circle cx="96" cy="39" r="4.5" />
          </svg>
          <p className="report-origin__caption">一張檢查報告</p>
        </figure>

        <ol className="report-path__flow">
          <span className="report-path__spine js-report-spine" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <li
              key={step.key}
              className={`report-station report-station--${step.tier}${step.anchor ? ' report-station--anchor' : ''} fragment`}
              data-fragment-index={i}
            >
              <p className="report-station__move">
                <span className="report-station__index">{step.index}</span>
                {step.move}
              </p>
              <span className="report-station__node" aria-hidden="true" />
              <p className="report-station__say">{step.say}</p>
            </li>
          ))}
        </ol>
      </div>

      <footer className="report-confirm fragment" data-fragment-index={STEPS.length}>
        <div className="report-confirm__main">

          <p className="report-confirm__quote">「這和您剛才描述的情況一致嗎？」</p>
        </div>
        <p className="report-confirm__note">一句話，收束整份報告</p>
      </footer>
    </SlideShell>
  );
}
