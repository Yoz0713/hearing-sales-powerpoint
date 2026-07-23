import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D19：用年齡常模解釋客戶的聽力位置，再把落差連回 COSI 情境。
 * 常模數值須依門市採用的資料來源、頻率與性別計算，頁面不虛構固定區間。
 */
export function ReportSequencePage() {
  // GSAP 只負責頁首與結構線；三個講解主題交給 Reveal 原生 fragments。
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
      }, '-=0.25')
      .from(scope.querySelector('.js-report-intro'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling report-slide" animate={animate}>
      <header className="report-heading">
        <p className="counseling-kicker js-report-kicker">衛教與諮商</p>
        <h1 className="counseling-title js-report-title">透過講解報告， <br /> 讓客戶看懂自己的位置</h1>
      </header>

      <main className="report-story" aria-label="同年齡比較、同聽力反查年齡，再連結 COSI 困擾">
        <article className="report-age-peer fragment" data-fragment-index="0">
          <p className="report-story__eyebrow"><span className="report-story__index">01</span>　同年齡比較</p>
          <h2>跟我一樣年紀的人，<br />正常聽力落在哪裡？</h2>
          <div className="report-compare" aria-label="依客戶年齡查詢同齡正常範圍，再標示客戶聽閾">
            <div>
              <span>客戶年齡</span>
              <strong>例：50 歲</strong>
            </div>
            <b aria-hidden="true">→</b>
            <div>
              <span>同齡其他客人</span>
              <strong>正常範圍</strong>
            </div>
          </div>
        </article>

        <article className="report-hearing-age fragment" data-fragment-index="1">
          <p className="report-story__eyebrow"><span className="report-story__index">02</span>　同聽力反查</p>
          <h2>跟我相同的聽力，<br />通常是幾歲的人？</h2>
          <div className="report-compare" aria-label="依客戶目前聽閾反查常見年齡帶">
            <div>
              <span>目前聽閾</span>
              <strong>例：40 dB HL</strong>
            </div>
            <b aria-hidden="true">→</b>
            <div>
              <span>同聽力其他客人</span>
              <strong>68~75 歲</strong>
            </div>
          </div>
        </article>

        <article className="report-cosi fragment" data-fragment-index="2">
          <p className="report-cosi__label"><span className="report-story__index">03</span>　連結 COSI</p>
          <blockquote>聽誰講話都可以，唯獨孫子講話的時候都聽不清楚。</blockquote>
          <strong>透過聽力報告解釋為什麼會有這樣的狀況</strong>
        </article>
      </main>


    </SlideShell>
  );
}
