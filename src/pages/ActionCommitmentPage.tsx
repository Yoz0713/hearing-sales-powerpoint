import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D33：最後行動題與結尾 - 下一次選配，我準備改變什麼？
 * 課程壓軸頁，讓學員帶走具體的行動承諾（少說一句、多問一句），
 * 並以「讓客戶為自己的生活做出選擇」金句圓滿收尾。
 */
export function ActionCommitmentPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-action-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-action-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-action-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling action-commitment" animate={animate}>
      <header className="action-commitment__heading">
        <p className="counseling-kicker js-action-kicker">課程結尾 · 行動承諾</p>
        <h1 className="counseling-title js-action-title">下一次選配，我準備改變什麼？</h1>
        <p className="action-commitment__lead js-action-lead">
          把今天的思考，轉成明天在選配現場的第一個具體改變。
        </p>
      </header>

      <main className="action-commitment__grid" aria-label="兩個具體行動承諾">
        <article className="action-card action-card--minus fragment" data-fragment-index="0">
          <div className="action-card__head">
            <span className="action-card__tag">01 / 減法行動</span>
            <span className="action-card__badge action-card__badge--minus">少說</span>
          </div>
          <h2 className="action-card__question">我準備少說哪一句話？</h2>
          <p className="action-card__hint">
            少一點急著解釋規格與話術，多給客戶說出困擾的時間。
          </p>
        </article>

        <article className="action-card action-card--plus fragment" data-fragment-index="1">
          <div className="action-card__head">
            <span className="action-card__tag">02 / 加法行動</span>
            <span className="action-card__badge action-card__badge--plus">多問</span>
          </div>
          <h2 className="action-card__question">我準備多問客戶哪一個問題？</h2>
          <p className="action-card__hint">
            多問一句與生活情境有關的追問，找到背後真正的改變理由。
          </p>
        </article>
      </main>

      <footer className="action-commitment__closing fragment" data-fragment-index="2">
        <div className="closing-banner">
          <p className="closing-banner__lead">顧問式選配的核心信念</p>
          <blockquote className="closing-banner__quote">
            好的選配，是讓客戶在充分理解後，<br />
            <em>為自己的生活做出選擇。</em>
          </blockquote>
        </div>
      </footer>
    </SlideShell>
  );
}
