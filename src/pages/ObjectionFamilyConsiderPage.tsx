import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D28：把「回去討論」與「再考慮看看」並置成兩條未完成的對話線。
 * 各三層——客戶說 → 先問清楚（橘、追問卡點）→ 尊重＋協助（深綠、保留決定權）——
 * 最後兩條線收束到同一個後續節點：整理資料、約定追蹤，而不是成交或結束。
 * 與 D27 共用 objection-duo 版型與 fragment 手法。
 */
const OBJECTIONS = [
  {
    key: 'family',
    type: '與家人一起',
    tag: '「回去討論」',
    quote: '「我回去跟家人討論一下。」',
    probe: '會和誰談？對方最在意的是效果、價格，還是適應？',
    support: '一起決定沒問題；我先把檢查結果、建議方案與差異整理好，讓你好轉述。',
  },
  {
    key: 'self',
    type: '自己再想想',
    tag: '「再考慮看看」',
    quote: '「讓我再考慮考慮。」',
    probe: '目前最需要考慮的，是哪一個部分？',
    support: '尊重你的步調；若還不想說，我們約一個回來確認的時間。',
  },
] as const;

export function ObjectionFamilyConsiderPage() {
  // GSAP 只負責頁首與底線；兩條對話線與收束節點交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-consider-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-consider-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-consider-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-consider-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling objection-duo objection-consider" animate={animate}>
      <header className="objection-duo__heading">
        <p className="counseling-kicker js-consider-kicker">異議處理</p>
        <h1 className="counseling-title js-consider-title">「回去討論」與「再考慮看看」</h1>
        <p className="objection-duo__lead js-consider-lead">
          尊重延後，但先問清楚卡點，並約好下一步。
        </p>
        <span className="objection-duo__rule js-consider-rule" aria-hidden="true" />
      </header>

      <main className="objection-duo__pair" aria-label="回去討論與再考慮看看兩條對話線">
        <div className="duo-cols">
          {OBJECTIONS.map((item, index) => (
            <article
              key={item.key}
              className={`duo-col ${index === 1 ? 'duo-col--right' : ''} fragment`}
              data-fragment-index={index}
            >
              <div className="duo-col__head">
                <p className="duo-col__type">{item.type}</p>
                <p className="duo-col__tag">{item.tag}</p>
              </div>
              <div className="duo-layer duo-layer--quote">
                <p className="duo-layer__role duo-layer__role--quote">客戶說</p>
                <p className="duo-quote">{item.quote}</p>
              </div>
              <div className="duo-layer duo-layer--concern">
                <p className="duo-layer__role duo-layer__role--concern">先問清楚</p>
                <p className="duo-text">{item.probe}</p>
              </div>
              <div className="duo-layer duo-layer--respond">
                <p className="duo-layer__role duo-layer__role--respond">尊重＋協助</p>
                <p className="duo-text">{item.support}</p>
              </div>
            </article>
          ))}
        </div>

        <svg className="duo-merge fragment" data-fragment-index="2" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          <path d="M25 0 L50 24" />
          <path d="M75 0 L50 24" />
        </svg>

        <footer className="duo-close fragment" data-fragment-index="2">
          <span className="duo-close__label">不是成交，也不是結束</span>
          <strong>整理好資料，約好下一次確認。</strong>
        </footer>
      </main>
    </SlideShell>
  );
}
