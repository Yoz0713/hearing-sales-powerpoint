import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface Dialogue {
  id: string;
  stage: string;
  question: string;
  answer: string;
  insight: string;
  /** 關鍵一問：確認醫生已判定聽力無法回復，用橘色強調突顯。 */
  emphasis?: boolean;
}

const DIALOGUES: Dialogue[] = [
  {
    id: 'referral',
    stage: '是否需轉介',
    question: '這次是突然聽不清楚，哪一邊比較嚴重？有耳鳴、暈眩或疼痛的狀況嗎？',
    answer: '右耳是這幾天突然變悶，也一直耳鳴。',
    insight: '突發性聽損或中耳炎的可能性，後續檢測上也能多留意。',
  },
  {
    id: 'economy',
    stage: '病識感評估',
    question: '平常在家裡或和人聊天時，有沒有覺得比較聽不清楚？',
    answer: '家人常說電視太大聲，但我覺得是他們講話太小聲。',
    insight: '了解客戶如何看待聽力困擾，判斷目前的病識感與衛教起點',
  },
  {
    id: 'ear-history',
    stage: '確認耳朵病史',
    question: '耳朵這樣多久了？有看過醫生嗎？醫生怎麼說？',
    answer: '兩年前有去看，醫生說是老化，沒辦法治療。',
    insight: '確認醫生已判定聽力無法回復，這是後續建議的專業前提',
    emphasis: true,
  },
];

export function CounselingHistoryPage() {
  // 只用最單純的頁首進場（kicker→title→intro）；三張病歷卡則各自交給
  // Reveal 原生 fragment 由左至右揭示，避免 GSAP 對 fragment 節點寫入
  // inline opacity 而與 Reveal 狀態打架。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-history-kicker'), { x: -28, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-history-title'), { y: 20, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-history-intro'), { opacity: 0, duration: motion.duration.base }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling counseling-history" animate={animate}>
      <header className="history-heading">
        <p className="counseling-kicker js-history-kicker">衛教與諮商</p>
        <h1 className="counseling-title js-history-title">病史詢問，看見耳朵之外的全貌</h1>
        <p className="counseling-intro js-history-intro">
          病史詢問不是填表，而是判斷是否轉介、盤點全貌的起點。
        </p>
      </header>

      <div className="history-charts">
        {DIALOGUES.map((dialogue) => (
          <article
            key={dialogue.id}
            className={`history-chart fragment${dialogue.emphasis ? ' history-chart--key' : ''}`}
            data-fragment-index={dialogue.id === 'referral' ? 1 : dialogue.id === 'economy' ? 2 : 3}
          >
            <span className="history-chart__tab">{dialogue.stage}</span>

            <div className="history-bubble history-bubble--ask">
              <span className="history-bubble__who">聽力師</span>
              <p className="history-bubble__text">{dialogue.question}</p>
            </div>

            <div className="history-bubble history-bubble--reply">
              <span className="history-bubble__who">客戶</span>
              <p className="history-bubble__text">{dialogue.answer}</p>
            </div>

            <div className="history-chart__insight">
              <span className="history-chart__insight-label">聽出了什麼</span>
              <p className="history-chart__insight-text">{dialogue.insight}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="impression-speed__twist fragment" data-fragment-index="4">
        <p className="impression-speed__twist-eyebrow">問診的黃金提問</p>
        <p className="impression-speed__twist-body">
          「醫生說，聽力還會不會恢復？」——問到這句話，才確認客戶站在正確的認知起點上。
        </p>
      </div>
    </SlideShell>
  );
}
