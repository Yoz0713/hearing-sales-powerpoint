import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useObserverMarks } from '../context/ObserverMarksContext';
import { OBSERVER_STAGES } from './RoleplayObserverPage';
import { motion } from '../tokens/motion';

/**
 * D33：最後行動題與結尾 - 下一次選配，我準備改變什麼？
 * 課程壓軸頁，讓學員帶走具體的行動承諾（少說一句、多問一句），
 * 並以「讓客戶為自己的生活做出選擇」金句圓滿收尾。
 *
 * 頁首下方回指 P42 標成「下一輪想調整」的那一段：先在那裡粗選面向，
 * 在這裡寫成一句話。講師沒標記時降級為中性提問，高度不變、不跑版。
 */
export function ActionCommitmentPage() {
  const { adjust } = useObserverMarks();
  const marked = OBSERVER_STAGES.find((stage) => stage.id === adjust);

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
      }, '-=0.15')
      .from(scope.querySelector('.js-action-recall'), {
        y: 16,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling action-commitment" animate={animate}>
      <header className="action-commitment__heading">
        <p className="counseling-kicker js-action-kicker">課程結尾 · 行動承諾</p>
        <h1 className="counseling-title js-action-title">下一次選配，我準備改變什麼？</h1>
        <p className="action-commitment__lead js-action-lead">
          {marked
            ? '把剛才標要調整的那一段，寫成明天在現場真的說得出口的一句話。'
            : '把今天的思考，轉成明天在選配現場的第一個具體改變。'}
        </p>
      </header>

      <div className="action-recall js-action-recall">
        <p className="action-recall__label">
          {marked ? '你剛才標要調整的那一段' : '四段裡，下一輪你最想調整哪一段？'}
        </p>
        <ul className="action-recall__rail">
          {OBSERVER_STAGES.map((stage) => (
            <li
              key={stage.id}
              className={`action-recall__stage${stage.id === adjust ? ' is-marked' : ''}`}
              aria-current={stage.id === adjust ? 'true' : undefined}
            >
              <span className="action-recall__chip">{stage.name}</span>
            </li>
          ))}
        </ul>
      </div>

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
            多問一句與生活情境有關的追問，找到客戶深層的需求。
          </p>
        </article>
      </main>

      <footer className="action-commitment__closing fragment" data-fragment-index="2">
        <div className="closing-banner">
          <p className="closing-banner__lead">顧問式選配的核心信念</p>
          <blockquote className="closing-banner__quote">
            好的選配，是在協助客戶<br />
            <em>為自己的生活做出選擇。</em>
          </blockquote>
        </div>
      </footer>
    </SlideShell>
  );
}
