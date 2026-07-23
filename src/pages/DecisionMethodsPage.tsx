import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const METHODS = [
  {
    key: 'summary',
    name: '總結式',
    question: '把客戶已經說過的話，整理成一個決定。',
    cue: '目標　／　試聽感受　／　目前顧慮',
    line: '「您最在意的是聚餐聽清楚；剛才也感受到人聲更容易辨識。」',
  },
  {
    key: 'choice',
    name: '二選一',
    question: '把差異說清楚，讓客戶依優先順序選。',
    cue: '預算先控制　或　多人情境處理能力',
    line: '「您想先保留預算彈性，還是把聚餐時的處理能力放在前面？」',
  },
  {
    key: 'action',
    name: '行動式',
    question: '方向明確後，才一起約定下一步。',
    cue: '確認方向　→　安排下一個具體行動',
    line: '「如果方向已經清楚，我們就把下一步安排好。」',
  },
] as const;

/** D24：三種收尾不是話術選單，而是幫客戶整理已經形成的決定。 */
export function DecisionMethodsPage() {
  // GSAP 僅負責頁首進場；收尾路徑與猶豫迴圈交給 Reveal fragments。
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
        <h1 className="counseling-title js-decision-title">成交不是施壓，是幫客戶整理決定</h1>
        <p className="decision-methods__lead js-decision-lead">
          同一個客戶，可以用不同方式收尾；共同目的只有一個：讓決定回到客戶手上。
        </p>
      </header>

      <main className="decision-methods__paths" aria-label="三種自然推進方式">
        {METHODS.map((method, index) => (
          <article
            key={method.key}
            className={`decision-path decision-path--${method.key} fragment`}
            data-fragment-index={index}
          >
            <p className="decision-path__name">{method.name}</p>
            <h2>{method.question}</h2>
            <p className="decision-path__cue">{method.cue}</p>
            <blockquote>{method.line}</blockquote>
          </article>
        ))}
      </main>

      <footer className="decision-methods__loop fragment" data-fragment-index={METHODS.length}>
        <div>
          <p>如果客戶仍然猶豫</p>
          <strong>不要再推一次，先回到理解。</strong>
        </div>
        <p className="decision-loop__questions">卡在哪裡？　還有什麼疑慮？　誰需要一起討論？</p>
      </footer>
    </SlideShell>
  );
}
