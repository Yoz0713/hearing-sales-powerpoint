import { useCallback, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * 反思階梯的三階：眉標本身即敘事（辨識 → 優勢 → 代價），
 * 強調色由翠綠往橘遞降，隱喻「優勢一路走下去就成了盲點」。
 */
const REFLECTION_STEPS = [
  { key: 'recognize', label: '自我認識', question: '我最接近哪一種風格？' },
  { key: 'strength', label: '優勢', question: '這種風格曾經怎麼幫助我？' },
  { key: 'cost', label: '代價', question: '我曾經因此錯失什麼成交機會？' },
] as const;

const SALES_STYLE_REMINDER = [
  '產品專家型',
  '關係經營型',
  '問題解決型',
  '成交導向型',
] as const;

/** D07 正式頁：把銷售風格辨識收束成一段可書寫的自我反思階梯。 */
export function SalesStyleReflectionPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-reflection-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-reflection-title'), {
        y: 34,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.06')
      .from(scope.querySelector('.js-reflection-lead'), {
        y: 18,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.26')
      .from(scope.querySelector('.js-reflection-reminder'), {
        x: 16,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.2');
  }, []);

  return (
    <SlideShell fullBleed className="reflection" animate={animate}>
      <main className="reflection__stage">
        <header className="reflection__nav js-reflection-nav">
          <BrandLogo className="reflection__logo" />
        </header>

        <div className="reflection__intro">
          <h1 className="reflection__title js-reflection-title">找到你的慣性，也找到盲點</h1>
          <p className="reflection__lead js-reflection-lead">
            風格不是拿來分類的標籤。 <br /> 透過這三個問題，看看自己的優勢，是從哪一步開始變成看不見的代價。
          </p>
        </div>

        <aside className="reflection__reminder js-reflection-reminder" aria-label="上一頁的四種銷售風格">
          <span className="reflection__reminder-kicker">上一頁速記</span>
          <ul className="reflection__reminder-list">
            {SALES_STYLE_REMINDER.map((style) => (
              <li key={style}>{style}</li>
            ))}
          </ul>
        </aside>

        <ol className="reflection__stairs" aria-label="三個依序推進的反思問題">
          {REFLECTION_STEPS.map((step, index) => (
            <li
              key={step.key}
              className={`reflection__step reflection__step--${step.key} fragment`}
              data-fragment-index={index}
              style={{ '--step-depth': index } as CSSProperties}
            >
              <span className="reflection__eyebrow">{step.label}</span>
              <p className="reflection__question">{step.question}</p>
              <i className="reflection__rule" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <footer className="reflection__landing fragment" data-fragment-index={REFLECTION_STEPS.length}>
          <span className="reflection__landing-turn" aria-hidden="true" />
          <div className="reflection__landing-copy">
            <span className="reflection__landing-kicker">追根結柢，答案不在風格本身</span>
            <p className="reflection__landing-line">
              沒有最好的風格，而是能不能<strong>因客戶而調整</strong>。
            </p>
          </div>
        </footer>
      </main>
    </SlideShell>
  );
}
