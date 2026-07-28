import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface LifeStop {
  key: string;
  index: string;
  place: string;
  /** 這一站要看見的生活切面（環境文字，取代病歷欄位）。 */
  scene: string;
  /** 只會得到一格答案的封閉式問法。 */
  closed: string;
  /** 追到場景的開放式問法。 */
  open: string;
  /** 情境卡掛在軌跡線的上方或下方，交錯出「一路走過」的節奏。 */
  side: 'up' | 'down';
  /** 過往經驗＝軌跡最深處，銜接病史與病識感。 */
  terminus?: boolean;
}

const STOPS: LifeStop[] = [
  {
    key: 'home',
    index: '01',
    place: '家中角色',
    scene: '和誰住、還在不在工作、一天繞著誰轉',
    closed: '您平常一個人住嗎？',
    open: '家裡誰最常找您說話？都聊些什麼？',
    side: 'up',
  },
  {
    key: 'communication',
    index: '02',
    place: '社交場合',
    scene: '電話、視訊、餐廳、多人談話裡最常漏聽的時刻',
    closed: '您平常會用電話嗎？',
    open: '電話、餐廳還是多人場合，哪裡最困擾？',
    side: 'down',
  },
  {
    key: 'past',
    index: '03',
    place: '過往經驗',
    scene: '戴過沒有、對效果與外觀留下什麼印象',
    closed: '以前戴過助聽器嗎？',
    open: '那副後來為什麼收起來？最不能接受哪一點？',
    side: 'up',
    terminus: true,
  },
];

/**
 * D17：病史之外，還要看見客戶的生活。
 * 分兩個狀態、疊在同一個置中格，避免高度不足把內容切掉：
 *  1. 先只顯示標題（整頁置中）。
 *  2. 按一下 → 標題退場、生活軌跡淡入並置中（兩者不同時出現）。
 * 之後每按一下揭示一個生活切面，最後帶出底部原則，回到病史與病識感。
 */
export function LifestyleContextPage() {
  // 只用 GSAP 做「標題狀態」的進場（kicker→title→intro）；標題退場、軌跡線畫出、
  // 三張情境卡與底部原則全部交給 Reveal 原生 fragment 的 .visible 狀態驅動 CSS 轉場，
  // 不讓 GSAP 對 fragment 節點寫入 inline opacity 而與 Reveal 打架。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-lifepath-kicker'), { x: -28, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-lifepath-title'), { y: 22, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-lifepath-intro'), { opacity: 0, duration: motion.duration.base }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling lifepath-slide" animate={animate}>
      <div className="lifepath-stage">
        {/* 路徑狀態：預設隱藏，第 0 步淡入；一旦 .visible 就讓標題退場（兩者不同時出現）。
            DOM 上放在標題之前，讓後方的 ~ 選擇器能在路徑出現時關掉標題。 */}
        <div className="lifepath-view fragment" data-fragment-index="0">
          <div className="lifepath" aria-label="客戶的生活軌跡：家中角色、溝通現場、過往經驗">
            <span className="lifepath__spine" aria-hidden="true" />

            <div className="lifepath__origin">
              <span className="lifepath__origin-dot" aria-hidden="true" />
              <span className="lifepath__origin-label">同一位客戶</span>
              <span className="lifepath__origin-sub">三個生活切面</span>
            </div>

            <ol className="lifepath__stops">
              {STOPS.map((stop, index) => (
                <li
                  key={stop.key}
                  className={`lifepath__stop lifepath__stop--${stop.side}${stop.terminus ? ' lifepath__stop--terminus' : ''} fragment`}
                  data-fragment-index={index + 1}
                >
                  <div className="lifepath__panel">
                    <p className="lifepath__place">
                      <span className="lifepath__index">{stop.index}</span>
                      {stop.place}
                    </p>
                    <p className="lifepath__scene">{stop.scene}</p>
                    <p className="lifepath__q lifepath__q--closed">
                      <span className="lifepath__tag">只問表面</span>
                      {stop.closed}
                    </p>
                    <p className="lifepath__q lifepath__q--open">
                      <span className="lifepath__tag lifepath__tag--probe">追問場景</span>
                      {stop.open}
                    </p>
                  </div>
                  <span className="lifepath__node" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>

          <footer className="lifepath-principle fragment" data-fragment-index={STOPS.length + 1}>
            <p className="lifepath-principle__text">
              別讓答案停在表面——客戶的回答往往都可以再繼續追問：<b>「那是什麼場景？」</b>
            </p>

          </footer>
        </div>

        {/* 標題狀態：整頁置中，路徑出現後淡出退場。 */}
        <header className="lifepath-heading">
          <p className="counseling-kicker js-lifepath-kicker">衛教與諮商</p>
          <h1 className="counseling-title js-lifepath-title">COSI在問什麼?</h1>
          <p className="lifepath__intro js-lifepath-intro">
            妳好不好奇客戶的生活，人事時地物有深入探討嗎?
          </p>
        </header>
      </div>
    </SlideShell>
  );
}
