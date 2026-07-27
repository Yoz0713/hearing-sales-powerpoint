import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';
import hearingAidPhoto from '../../assets/HA-BG.jpg';

const CHAT_PROMPTS = ['家裡長輩聽力如何？', '有沒有戴助聽器？', '實際效果怎麼樣？'] as const;

const READINESS_SIGNALS = {
  active: ['主動詢問', '想拿起來看', '表示想嘗試'],
  invited: ['開始認同困難', '疑問變得具體', '不再立即否定'],
} as const;

/**
 * D19.6：在正式討論介入必要性前，先用聊天與實物降低距離，
 * 讓客戶主動靠近解決方式，或在訊號成熟時接受一次低壓力的試聽邀請。
 */
export function TrialReadinessPage() {
  // GSAP 只負責頁首與路徑底線；教學區塊的先後順序交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-readiness-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-readiness-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-readiness-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-readiness-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling trial-readiness" animate={animate}>
      <header className="trial-readiness__heading">
        <p className="counseling-kicker js-readiness-kicker">衛教與諮商</p>
        <h1 className="counseling-title js-readiness-title">先讓客戶想嘗試，再討論介入</h1>
        <p className="trial-readiness__lead js-readiness-lead">
          不是急著給建議，而是讓客戶自己向前一步。
        </p>
        <span className="trial-readiness__rule js-readiness-rule" aria-hidden="true" />
      </header>

      <main className="trial-readiness__route" aria-label="從自然聊天到試聽邀請的路徑">
        <article className="readiness-stage readiness-stage--chat fragment" data-fragment-index="0">
          <p className="readiness-stage__step">從別人的經驗開始</p>
          <h2>聊聊家裡長輩</h2>
          <ul className="readiness-stage__prompts">
            {CHAT_PROMPTS.map((prompt) => <li key={prompt}>{prompt}</li>)}
          </ul>
          <p className="readiness-stage__note">先談別人，客戶比較容易說出自己的印象。</p>
        </article>

        <article className="readiness-stage readiness-stage--object fragment" data-fragment-index="1">
          <p className="readiness-stage__step">把可能性放到眼前</p>
          <div className="readiness-device">
            <img
              className="readiness-device__photo"
              src={hearingAidPhoto}
              alt="三款不同外型的助聽器"
            />
          </div>
          <h2>拿出現在的助聽器</h2>
          <p>不急著完整介紹，只讓它從抽象印象，變成可以看、可以理解的東西。</p>
        </article>

        <article className="readiness-stage readiness-stage--signal fragment" data-fragment-index="2">
          <p className="readiness-stage__step">先讀訊號</p>
          <h2>客戶有沒有靠近？</h2>
          <p>提問變具體、願意多看一眼，都是準備向前的線索。</p>
          <span className="readiness-stage__turn" aria-hidden="true">→</span>
        </article>

        <div className="readiness-branches fragment" data-fragment-index="3">
          <article className="readiness-branch readiness-branch--active">
            <p>客戶主動靠近</p>
            <h2>順勢讓他體驗</h2>
            <ul>
              {READINESS_SIGNALS.active.map((signal) => <li key={signal}>{signal}</li>)}
            </ul>
          </article>

          <article className="readiness-branch readiness-branch--invite">
            <p>時機已經成熟</p>
            <h2>輕度邀請試聽</h2>
            <ul>
              {READINESS_SIGNALS.invited.map((signal) => <li key={signal}>{signal}</li>)}
            </ul>
            <blockquote>「要不要先戴看看，感受一下現在的助聽器？」</blockquote>
          </article>
        </div>
      </main>

      <footer className="trial-readiness__close fragment" data-fragment-index="4">
        <span>不是推他做決定</span>
        <strong>是創造一個，他願意再往前一步的時機。</strong>
      </footer>
    </SlideShell>
  );
}
