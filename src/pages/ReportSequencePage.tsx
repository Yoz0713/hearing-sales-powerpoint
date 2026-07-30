import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface Lookup {
  key: string;
  step: string;
  /** 客戶心裡的問題。 */
  ask: string;
  /** 拿什麼去查。 */
  fromLabel: string;
  fromValue: string;
  /** 查出來是什麼——這一格是每張卡的重點。 */
  toLabel: string;
  toValue: string;
  /** 標記哪一格是查常模得到的，該格數值需標示為示意。 */
  normSide: 'from' | 'to';
  /** 所以呢。 */
  conclusion: string;
}

const LOOKUPS: Lookup[] = [
  {
    key: 'peer',
    step: '同年齡比較',
    ask: '跟我一樣年紀的人，正常聽力落在哪裡？',
    fromLabel: '同齡（50 歲）正常聽力',
    fromValue: '15–20 dB',
    normSide: 'from',
    toLabel: '這位客戶',
    toValue: '40 dB',
    conclusion: '明顯偏離同齡的正常範圍。',
  },
  {
    key: 'age',
    step: '同聽力反查',
    ask: '跟我相同的聽力，通常是幾歲的人？',
    fromLabel: '這位客戶的聽閾',
    fromValue: '40 dB',
    normSide: 'to',
    toLabel: '這樣的聽力常見於',
    toValue: '68–75 歲',
    conclusion: '他今年 50 歲，聽力表現卻像 68–75 歲。',
  },
];

/**
 * D19：講解報告的三步。兩張對照卡各自完成一次查表（拿什麼去查 → 查到什麼 → 所以呢），
 * 數字直接寫在畫面上；第三步用橘色把數據接回客戶自己的生活場景。
 * 常模數值依門市資料來源計算，頁面只放示意值並在頁尾標注。
 */
export function ReportSequencePage() {
  // GSAP 只推頁首；兩張卡與 COSI 交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-report-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-report-title'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling report-slide" animate={animate}>
      <header className="report-heading">
        <p className="counseling-kicker js-report-kicker">衛教與諮商</p>
        <h1 className="counseling-title js-report-title">
          透過講解報告，<br />讓客戶看懂自己的位置
        </h1>
      </header>

      <main className="report-body">
        <div className="report-lookups" aria-label="同年齡比較與同聽力反查兩種查法">
          {LOOKUPS.map((item, index) => (
            <article
              key={item.key}
              className="report-card fragment"
              data-fragment-index={index}
            >
              <p className="report-card__step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.step}
              </p>
              <h2 className="report-card__ask">{item.ask}</h2>

              <dl className="report-card__data">
                <div>
                  <dt>
                    {item.fromLabel}
                    {item.normSide === 'from' && <i>例</i>}
                  </dt>
                  <dd>{item.fromValue}</dd>
                </div>
                <div className="report-card__data-result">
                  <dt>
                    {item.toLabel}
                    {item.normSide === 'to' && <i>例</i>}
                  </dt>
                  <dd>{item.toValue}</dd>
                </div>
              </dl>

              <p className="report-card__conclusion">{item.conclusion}</p>
            </article>
          ))}
        </div>

        <article className="report-cosi fragment" data-fragment-index="2">
          <p className="report-cosi__step"><span>03</span>連結 COSI</p>
          <blockquote>聽誰講話都可以，唯獨孫子講話的時候都聽不清楚。</blockquote>
          <p className="report-cosi__action">用這份報告，解釋為什麼會這樣。</p>
        </article>


      </main>
    </SlideShell>
  );
}
