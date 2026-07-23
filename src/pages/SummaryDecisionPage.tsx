import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D32：課程總結（二） - 成交，是協助客戶做出合適決定
 * 用最後兩個核心觀念重塑對「價格與價值」以及「成交與決定」的定義。
 */
export function SummaryDecisionPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-summary-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-summary-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-summary-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling summary-decision" animate={animate}>
      <header className="summary-decision__heading">
        <p className="counseling-kicker js-summary-kicker">課程總結</p>
        <h1 className="counseling-title js-summary-title">成交，是協助客戶做出合適決定</h1>
        <p className="summary-decision__lead js-summary-lead">
          重新定義選配現場的最後一步：不是說服，而是讓決定自然發生。
        </p>
      </header>

      <main className="summary-decision__grid" aria-label="顧問式銷售的兩大核心對比">
        <article className="summary-card summary-card--value fragment" data-fragment-index="0">
          <div className="summary-card__tag">核心 01</div>
          <h2 className="summary-card__statement">
            價格要和 <em>價值</em> 一起討論
          </h2>
          <div className="summary-card__contrast">
            <div className="contrast-item contrast-item--avoid">
              <span>傳統迷思</span>
              <p>怕談價格，客人嫌貴就急著打折或降等級</p>
            </div>
            <div className="contrast-item contrast-item--adopt">
              <span>顧問觀點</span>
              <p>沒有連回生活說清楚價值，再便宜對客戶都是昂貴</p>
            </div>
          </div>
        </article>

        <article className="summary-card summary-card--decision fragment" data-fragment-index="1">
          <div className="summary-card__tag">核心 02</div>
          <h2 className="summary-card__statement">
            成交不是說服，是 <em>協助做決定</em>
          </h2>
          <div className="summary-card__contrast">
            <div className="contrast-item contrast-item--avoid">
              <span>傳統迷思</span>
              <p>用力推銷、營造期限壓力，試圖壓制所有異議</p>
            </div>
            <div className="contrast-item contrast-item--adopt">
              <span>顧問觀點</span>
              <p>站在客戶身邊，幫他釐清顧慮並看清合適的選項</p>
            </div>
          </div>
        </article>
      </main>

      <footer className="summary-decision__footer fragment" data-fragment-index="2">
        <span>顧問式選配的終點</span>
        <strong>讓客戶在充分理解與安全感中，為自己的生活做出選擇。</strong>
      </footer>
    </SlideShell>
  );
}
