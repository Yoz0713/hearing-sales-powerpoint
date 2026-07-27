import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const HESITATION_PATHS = [
  {
    key: 'necessity',
    question: '卡在哪裡？',
    answer: '「我覺得現在還好，還沒有非戴不可。」',
    diagnosis: '介入必要性還沒成立',
    nextMove: '回到病史、COSI 與報告，讓他自己說出生活影響。',
  },
  {
    key: 'effect',
    question: '還有什麼疑慮？',
    answer: '「不確定戴了有沒有差，也怕自己戴不習慣。」',
    diagnosis: '效果還沒被感覺',
    nextMove: '回到最在意的場景試聽，只驗證一個具體差異。',
  },
  {
    key: 'decision-maker',
    question: '誰需要一起討論？',
    answer: '「我要回去問女兒，她也會一起決定。」',
    diagnosis: '關鍵決策者不在場',
    nextMove: '邀請家人加入，同步理解結果、需求與方案差異。',
  },
] as const;

/** D24：客戶猶豫時，先診斷是哪一段尚未完成，再回到前段補足。 */
export function DecisionMethodsPage() {
  // GSAP 僅負責頁首進場；三條診斷路徑與結論交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-decision-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-decision-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-decision-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling decision-methods" animate={animate}>
      <header className="decision-methods__heading">
        <p className="counseling-kicker js-decision-kicker">最後決定</p>
        <h1 className="counseling-title js-decision-title">客戶仍然猶豫，就先不要再推</h1>
        <p className="decision-methods__lead js-decision-lead">
          猶豫通常不是最後一句話沒說好，而是前面有一段還沒完成。
        </p>
        <span className="decision-methods__rule" aria-hidden="true" />
      </header>

      <main className="decision-diagnostic" aria-label="客戶猶豫時的三條診斷路徑">
        <div className="decision-diagnostic__head" aria-hidden="true">
          <span>先問</span>
          <span>客戶可能在說</span>
          <span>判斷後，回到前段補</span>
        </div>

        <div className="decision-diagnostic__rows">
          {HESITATION_PATHS.map((path, index) => (
            <article
              key={path.key}
              className={`hesitation-path hesitation-path--${path.key} fragment`}
              data-fragment-index={index}
            >
              <h2 className="hesitation-path__ask">{path.question}</h2>
              <blockquote className="hesitation-path__voice">{path.answer}</blockquote>
              <div className="hesitation-path__return">
                {/* 全頁唯一朝左的元素：回補的方向與前兩欄相反。 */}
                <span className="hesitation-path__turn" aria-hidden="true" />
                <p className="hesitation-path__diagnosis">{path.diagnosis}</p>
                <strong className="hesitation-path__move">{path.nextMove}</strong>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer
        className="decision-methods__close fragment"
        data-fragment-index={HESITATION_PATHS.length}
      >
        <span>先找出哪一段沒完成，再回去補</span>
        <strong>不要把同一套產品再講一次。</strong>
      </footer>
    </SlideShell>
  );
}
