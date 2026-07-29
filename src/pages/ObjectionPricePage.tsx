import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D26：把「太貴了」拆成效果與預算兩條等重路徑。
 * 中央先辨識真正顧慮（不預設所有「太貴」都是價格），
 * 再對稱地分岔成效果（青）與預算（橘），最後收束到同一個合適方案。
 * 與 D25 共用頁首、卡片與節點語彙，並同樣以「先辨識、再回應」為軸。
 */
const TONES = [
  '這麼貴，真的差那麼多？',
  '超出我的預算了。',
  '我再回去想想價錢。',
] as const;

const BRANCHES = [
  {
    key: 'effect',
    eyebrow: '效果疑慮',
    worry: '不確定值不值得',
    action: '回到需求與試聽，讓他重看在意的情境、親耳驗證改善。',
  },
  {
    key: 'budget',
    eyebrow: '預算問題',
    worry: '總金額超出預期',
    action: '談等級、單／雙耳、付款、服務與年限，算整體成本而不只看標價。',
  },
] as const;

export function ObjectionPricePage() {
  // GSAP 只負責頁首與底線；分岔路徑的先後順序交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-price-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-price-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-price-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-price-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling objection-price" animate={animate}>
      <header className="objection-price__heading">
        <p className="counseling-kicker js-price-kicker">異議處理</p>
        <h1 className="counseling-title js-price-title">「太貴了」背後，是預算還是效果？</h1>
        <p className="objection-price__lead js-price-lead">
          別急著解釋價格，先聽出他擔心的是哪一種。
        </p>
        <span className="objection-price__rule js-price-rule" aria-hidden="true" />
      </header>

      <main className="objection-price__flow" aria-label="從一句太貴，對稱分岔成效果與預算兩條路徑">
        <div className="objection-price__stem">
          <div className="op-tones fragment" data-fragment-index="0">
            <p className="op-tones__label">同一句「太貴」，可能是——</p>
            <ul className="op-tones__chips">
              {TONES.map((tone) => <li key={tone}>{tone}</li>)}
            </ul>
            <p className="op-understand">「這確實是一筆需要認真評估的支出。」</p>
          </div>

          <div className="op-pivot fragment" data-fragment-index="1">
            <p className="op-pivot__label">先辨識，再回應</p>
            <p className="op-pivot__q">
              是<span className="op-pivot__effect">不確定能不能帶來足夠改善</span>，
              還是<span className="op-pivot__budget">總金額超出預期</span>？
            </p>
          </div>
        </div>

        <div className="op-split fragment" data-fragment-index="2">
          <svg className="op-fork" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M50 0 L22 24" />
            <path d="M50 0 L78 24" />
          </svg>
          <div className="op-branches">
            {BRANCHES.map((branch) => (
              <article key={branch.key} className={`op-branch op-branch--${branch.key}`}>
                <p className="op-branch__eyebrow">{branch.eyebrow}</p>
                <p className="op-branch__worry">{branch.worry}</p>
                <p className="op-branch__action">{branch.action}</p>
              </article>
            ))}
          </div>
        </div>

        <footer className="op-converge fragment" data-fragment-index="3">
          <strong>為這位客戶，找到剛好的方案。</strong>
        </footer>
      </main>
    </SlideShell>
  );
}
