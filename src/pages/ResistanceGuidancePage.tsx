import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';
import { BrandLogo } from '../components/brand/BrandLogo';
interface Probe {
  key: string;
  /** 這一層追問的類型（真實序列：場景 → 他的應對 → 他的選擇）。 */
  depth: string;
  question: string;
  /** 問完換得什麼——三題的收穫本身也在加深，這是本頁的論點。 */
  yields: string;
}

/**
 * 三題一律問「他做過的事」，不問感覺、也不問預測。
 * 病識感還沒建立的客戶，一被問感受或未來，標準答案就是「沒什麼感覺」
 * 「不會怎樣」，問完就沒牌了；問行為則不容否認。
 */
const PROBES: Probe[] = [
  {
    key: 'moment',
    depth: '發生時刻',
    question: '您自己在生活中，什麼時候最容易發現聽不清楚？',
    yields: '一個具體場景',
  },
  {
    key: 'cope',
    depth: '應對方式',
    question: '你',
    yields: '他正在付出的心力',
  },
  {
    key: 'priority',
    depth: '優先順序',
    question: '幫他總結問題，並排列優先順序',
    yields: '對於客戶來說最重要的需求',
  },
];

/**
 * D12：把一句威嚇式結論，換成三層都只問「他做過的事」的追問。
 * 左欄是被劃掉的那句話（橘＝疑慮與轉折），右欄是三層提問與各自換來的收穫；
 * 「得到」的遞進（場景 → 力氣 → 理由）才是這頁真正要留下的東西。
 */
export function ResistanceGuidancePage() {
  // GSAP 只推頁首與左欄那句話（含劃線）；三層提問與收尾交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-guidance-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-guidance-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-guidance-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-guidance-said'), {
        y: 20,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.2')
      .from(scope.querySelectorAll('.js-guidance-strike'), {
        scaleX: 0,
        transformOrigin: 'left center',
        stagger: motion.fragmentStagger,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.1');
  }, []);

  return (
    <SlideShell className="counseling resistance-guidance" animate={animate}>
      <header className="resistance-guidance__heading">

        <BrandLogo className="resistance-case__logo" />

        <h1 className="counseling-title js-guidance-title">先問，不要急著說服</h1>
        <p className="resistance-guidance__lead js-guidance-lead">
          客戶缺的通常不是產品資訊，而是一個屬於他自己的改變理由。
        </p>
      </header>

      <main className="resistance-guidance__body">
        <div className="resistance-guidance__said js-guidance-said">
          <p className="guidance-said__label">我們最常脫口而出的那一句</p>
          {/* 每行各自一條劃線：單一絕對定位的線在兩行之間會落空。 */}
          <blockquote className="guidance-said__quote">
            <span className="guidance-said__line">
              您的聽力已經中度了，
              <i className="guidance-said__strike js-guidance-strike" aria-hidden="true" />
            </span>
            <span className="guidance-said__line">
              不戴只會越來越嚴重。
              <i className="guidance-said__strike js-guidance-strike" aria-hidden="true" />
            </span>
          </blockquote>

          <p className="guidance-said__verdict fragment" data-fragment-index="0">
            每個字都對——但它要求他<b>當場承認自己錯了</b>。
          </p>
        </div>

        <ol className="resistance-guidance__probes" aria-label="三個依序推進的追問">
          {PROBES.map((probe, index) => (
            <li
              key={probe.key}
              className={`guidance-probe guidance-probe--${probe.key} fragment`}
              data-fragment-index={index + 1}
            >
              <div className="guidance-probe__head">
                <span className="guidance-probe__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="guidance-probe__depth">{probe.depth}</span>
              </div>
              <p className="guidance-probe__question">{probe.question}</p>
              <p className="guidance-probe__yield">
                <span>得到</span>
                <strong>{probe.yields}</strong>
              </p>
            </li>
          ))}
        </ol>
      </main>

      <footer className="resistance-guidance__close fragment" data-fragment-index="4">

        <strong>需求，是他自己說出來的，不是你塞給他的。</strong>
      </footer>
    </SlideShell>
  );
}
