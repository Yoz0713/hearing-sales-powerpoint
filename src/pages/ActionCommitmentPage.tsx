import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { useObserverMarks } from '../context/ObserverMarksContext';
import { OBSERVER_STAGES } from './RoleplayObserverPage';
import { motion } from '../tokens/motion';

interface LedgerLine {
  text: string;
  /** 三句主線各自來自哪一段課程；只在收斂那一步顯示。 */
  from?: string;
}

/**
 * 今天講過的話，依課程順序排成 3 欄 × 8 列。
 * 索引 6／7／8 正好落在第三列（畫面正中央那一帶），
 * 那三格放的是全場真正的主線——所以其餘 21 句淡出後，
 * 留下的不是散落的殘句，而是一橫排對齊的三句話。
 */
const LEDGER: readonly LedgerLine[] = [
  { text: '回想一筆舒服，也回想一筆不舒服的購買' },
  { text: '找到你的慣性，也找到盲點' },
  { text: '王先生不是不需要，而是還沒準備好' },
  { text: '十個流程，客戶心裡只有三個問題' },
  { text: '客戶說出口的，只是冰山一角' },
  { text: '第一印象的目標，是讓客戶敢說真話' },

  { text: '客戶排斥的不是購買，是被推銷', from: '開場與風格' },
  { text: '沒有行動，不等於沒有需求', from: '改變動機' },
  { text: '異議不是拒絕，是還有疑慮沒被理解', from: '異議實戰' },

  { text: '一場選配，情緒該怎麼分配？' },
  { text: '病史問得深，後續才有切入點' },
  { text: '探尋來訪的真實動機' },
  { text: '病史之外，還要看見客戶的生活' },
  { text: '檢查的過程，也在建立信任與病識感' },
  { text: '不要只報數字，讓客戶看懂自己的位置' },
  { text: '理解，不等於接受' },
  { text: '先讓客戶想嘗試，再討論介入' },
  { text: '經濟能力，要在試聽前完成判斷' },
  { text: '用需求合理化，推到預算的上限' },
  { text: '客戶仍然猶豫，就先不要再推' },
  { text: '「太貴了」背後，是預算還是效果？' },
  { text: '觀察的不是話術，是客戶有沒有被理解' },
  { text: '先理解人，再提出方案' },
  { text: '心裡的三道門，只能照順序開' },
];

/**
 * D33：課程結尾 - 客戶要的不是被說服，是被理解。
 *
 * 這頁沿用 P.12「10 → 3」的收斂手法，放大成整場的比例：42 → 3 → 1。
 * 版面不重排，只是雜訊逐步排掉——今天講過的 24 句話淡出後，中央那一列
 * 留下三句同一個句型的話（「不是 A，是 B」），最後連它們也退場，
 * 由第四個同句型的句子落在同一個位置收尾。
 *
 * 頁尾回指 P.40 標成「下一輪想調整」的那一段；講師沒標記時只留下提問。
 */
export function ActionCommitmentPage() {
  const { adjust } = useObserverMarks();
  const marked = OBSERVER_STAGES.find((stage) => stage.id === adjust);

  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-finale-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-finale-count'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.1')
      // 今天講過的話一句一句浮上來，像把一整天重新攤在桌上。
      // 淡入放在容器上、位移放在每一行：行本身的 opacity 之後要交給收斂狀態控制，
      // GSAP 不能在上面留下 inline opacity，否則會蓋掉淡出。
      .from(scope.querySelector('.js-finale-ledger'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.28')
      .from(scope.querySelectorAll('.js-finale-line'), {
        y: 14,
        duration: motion.duration.fast,
        stagger: 0.022,
      }, '<');
  }, []);

  return (
    <SlideShell fullBleed className="finale" animate={animate}>
      <main className="finale__stage">
        <header className="finale__nav js-finale-nav">
          <BrandLogo className="finale__logo" />
          <div className="finale__nav-trail">
            <span>課程結尾</span>
            <i aria-hidden="true" />
          </div>
        </header>

        {/* 三行計數疊在同一格，靠狀態切換，數字不重排、只是一直變少。 */}
        <div className="finale__count js-finale-count">
          <p className="finale-count finale-count--all">
            <b>42</b>
            <span>今天走過的每一頁</span>
          </p>
          <p className="finale-count finale-count--three">
            <b>3</b>
            <span>其實只講了三件事，而且是同一個句型</span>
          </p>
          <p className="finale-count finale-count--one">
            <b>1</b>
            <span>而這三件事，是同一件事</span>
          </p>
        </div>

        <div className="finale__ledger js-finale-ledger" aria-label="今天課程講過的重點">
          {LEDGER.map((line) => (
            <p
              key={line.text}
              className={`finale-line${line.from ? ' finale-line--key' : ''} js-finale-line`}
            >
              {line.from && <span className="finale-line__from">{line.from}</span>}
              {line.text}
            </p>
          ))}

          {/* 第四個同句型的句子，落在剛才那三句的正中央。 */}
          <p className="finale__answer fragment" data-fragment-index={1}>
            客戶要的，從來不是<span>被說服</span>，是<strong>被理解<i aria-hidden="true" /></strong>。
          </p>
        </div>

        {/* 只改樣式、不新增元素的那一步，需要一個看不見的節點當開關。 */}
        <i className="finale__cut fragment js-finale-cut" data-fragment-index={0} aria-hidden="true" />

        <footer className="finale__handover fragment" data-fragment-index={2}>
          <p className="finale__handover-label">帶回現場</p>
          <p className="finale__handover-ask">明天第一位客戶，你打算多問哪一句話？</p>
          {marked && (
            <p className="finale__handover-mark">
              <span>下一輪想調整</span>
              {marked.name}
            </p>
          )}
        </footer>
      </main>
    </SlideShell>
  );
}
