import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D25：把「異議處理五步驟」收成接住 → 釐清 → 回應三個群組，
 * 走一條往返式對話路徑（聽與理解朝向客戶、資訊與確認回到共同決策），
 * 並讓第五步「確認疑慮」在未解除時回連第三步「再釐清一次」。
 */
const GROUPS = [
  {
    key: 'catch',
    eyebrow: '接住 · 朝向客戶',
    steps: [
      { n: '1', title: '先聽完', note: '不打斷，也不急著反駁。' },
      { n: '2', title: '表示理解', note: '讓客戶知道，這個顧慮很合理。' },
    ],
  },
  {
    key: 'clarify',
    eyebrow: '釐清 · 客戶真正的問題',
    steps: [
      { n: '3', title: '確認真正疑慮', note: '透過反問去釐清問題' },
    ],
  },
  {
    key: 'respond',
    eyebrow: '回應 · 回到共同決策',
    steps: [
      { n: '4', title: '提供相關資訊', note: '只給和他的需求有關的。' },
      { n: '5', title: '確認疑慮解除', note: '這個顧慮，現在放下了嗎？' },
    ],
  },
] as const;

export function ObjectionStepsPage() {
  // GSAP 只負責頁首與底線；五步驟群組的先後順序交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-objection-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-objection-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-objection-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-objection-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling objection-steps" animate={animate}>
      <header className="objection-steps__heading">
        <p className="counseling-kicker js-objection-kicker">異議處理</p>
        <h1 className="counseling-title js-objection-title">異議不是拒絕，是還有疑慮沒被理解</h1>
        <p className="objection-steps__lead js-objection-lead">
          每一句異議，都是一個還沒被接住的顧慮。
        </p>
        <span className="objection-steps__rule js-objection-rule" aria-hidden="true" />
      </header>

      <main className="objection-steps__route" aria-label="異議處理的往返式路徑">
        {GROUPS.map((group, index) => (
          <article
            key={group.key}
            className={`objection-group objection-group--${group.key} fragment`}
            data-fragment-index={index}
          >
            <p className="objection-group__eyebrow">{group.eyebrow}</p>
            <ol className="objection-group__steps">
              {group.steps.map((step) => (
                <li key={step.n} className="objection-step">
                  <span className="objection-step__node" aria-hidden="true">{step.n}</span>
                  <span className="objection-step__body">
                    <strong>{step.title}</strong>
                    <span>{step.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </article>
        ))}

        <div className="objection-loop fragment" data-fragment-index="3">
          <span className="objection-loop__arrow" aria-hidden="true">↩</span>
          <p>
            疑慮還沒放下？回到 <strong>③ 確認真正疑慮</strong>，再釐清一次。
          </p>
        </div>
      </main>

    </SlideShell>
  );
}
