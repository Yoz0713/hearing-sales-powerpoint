import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface Gate {
  key: 'trust' | 'need' | 'buy';
  index: string;
  name: string;
  /** 第 12 頁的原句：客戶最想被解答的三個問題。 */
  question: string;
  passed: string;
  stuck: string;
}

const GATES: readonly Gate[] = [
  {
    key: 'trust',
    index: '01',
    name: '信任你',
    question: '我可以相信你，也能放心說嗎？',
    passed: '他開始講自己的困擾',
    stuck: '「我只是陪家人來看看」',
  },
  {
    key: 'need',
    index: '02',
    name: '相信要處理',
    question: '我真的需要現在處理嗎？',
    passed: '他自己說「不能再拖了」',
    stuck: '「還沒那麼嚴重吧」',
  },
  {
    key: 'buy',
    index: '03',
    name: '跟你買',
    question: '哪個選擇適合我？',
    passed: '他問「那要怎麼開始？」',
    stuck: '「我回去再想想」',
  },
];

interface ReturnArc {
  key: string;
  /** 卡住的那一關 → 真正要回去處理的那一關。 */
  from: string;
  to: string;
  insight: string;
  fragmentIndex: number;
}

const RETURN_ARCS: readonly ReturnArc[] = [
  {
    key: 'buy-to-need',
    from: '03',
    to: '02',
    insight: '不買，通常不是嫌貴，是還不覺得需要',
    fragmentIndex: 3,
  },
  {
    key: 'need-to-trust',
    from: '02',
    to: '01',
    insight: '不覺得需要，通常是還不夠相信你',
    fragmentIndex: 4,
  },
];

/**
 * D32：課程總結（二） - 客戶心裡的三道門，只能照順序開。
 * 三張門卡沿用第 12 頁的三個問題與階段色（青／橘／綠）作為視覺回指；
 * 本頁主角是兩道往回的弧線：卡在後面一關，要回頭處理前面那一關。
 */
export function SummaryDecisionPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-journey-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-journey-heading'), {
        x: -30,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.12')
      .from(scope.querySelector('.js-journey-recall'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.28')
      // 底線由左往右畫出來＝這條路只有一個方向，弧線才有東西可以往回跳。
      .from(scope.querySelector('.js-journey-baseline'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.2')
      .from(scope.querySelectorAll('.js-journey-door'), {
        scaleY: 0,
        transformOrigin: 'center top',
        opacity: 0,
        duration: motion.duration.base,
        stagger: 0.08,
      }, '-=0.5');
  }, []);

  return (
    <SlideShell fullBleed className="journey" animate={animate}>
      <main className="journey__stage">
        <header className="journey__nav js-journey-nav">
          <BrandLogo className="journey__logo" />

        </header>

        <div className="journey__heading">
          <div className="js-journey-heading">
            <p className="journey__kicker">客戶的心路歷程</p>
            <h1 className="journey__title">心裡的三道門，只能照順序開</h1>
          </div>
          <p className="journey__recall js-journey-recall">
            <span>P.12</span>
            客戶最想被解答的三個問題
          </p>
        </div>

        <div className="journey__map">
          <div className="journey__track">
            <ol className="journey__gates" aria-label="客戶決定跟你買之前，依序要通過的三道門">
              {GATES.map((gate, index) => (
                <li
                  key={gate.key}
                  className={`journey-gate journey-gate--${gate.key} fragment`}
                  data-fragment-index={index}
                >
                  <p className="journey-gate__label">
                    <span aria-hidden="true">{gate.index}</span>
                    {gate.name}
                  </p>
                  <blockquote className="journey-gate__ask">{gate.question}</blockquote>
                  <dl className="journey-gate__signals">
                    <div className="journey-signal journey-signal--pass">
                      <dt>過關</dt>
                      <dd>{gate.passed}</dd>
                    </div>
                    <div className="journey-signal journey-signal--stuck">
                      <dt>卡住</dt>
                      <dd>{gate.stuck}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>

            {/* 兩道門檻：不是裝飾，是「這一關沒過就進不去下一關」的分界。 */}
            <i className="journey__door journey__door--first js-journey-door" aria-hidden="true" />
            <i className="journey__door journey__door--second js-journey-door" aria-hidden="true" />
          </div>

          <div className="journey__returns">
            <span className="journey__baseline js-journey-baseline" aria-hidden="true" />

            {RETURN_ARCS.map((arc) => (
              <div
                key={arc.key}
                className={`journey-return journey-return--${arc.key} fragment`}
                data-fragment-index={arc.fragmentIndex}
              >
                <svg
                  className="journey-return__arc"
                  viewBox="0 0 612 74"
                  width="612"
                  height="74"
                  aria-hidden="true"
                >
                  <path className="journey-return__curve" d="M 604 4 C 604 68, 8 68, 8 16" />
                  <path className="journey-return__head" d="M 8 2 L 0 18 L 16 18 Z" />
                </svg>
                <p className="journey-return__label">
                  <b>
                    <span>{`卡在 ${arc.from}`}</span>
                    <i aria-hidden="true" />
                    <span>{`回到 ${arc.to}`}</span>
                  </b>
                  {arc.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        <footer className="journey__verdict fragment" data-fragment-index={5}>
          <p>
            客戶卡在哪一關，就<strong>回去處理哪一關</strong>。往前推，只會讓他更用力把門關上。
          </p>
        </footer>
      </main>
    </SlideShell>
  );
}
