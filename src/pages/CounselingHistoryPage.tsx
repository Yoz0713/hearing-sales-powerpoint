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
  /** 最能直接轉成試聽驗證重點的卡片，用橘色強調突顯。 */
  emphasis?: boolean;
}

const DIALOGUES: Dialogue[] = [
  {
    id: 'progression',
    stage: '病程與變化',
    question: '聽力是從什麼時候開始變差？這段時間是慢慢變化，還是最近明顯加重？',
    answer: '大概兩三年了，最近半年越來越明顯。',
    insight: '病程長度與變化速度，提供後續談必要性、急迫性與合理期待的依據。',
  },
  {
    id: 'treatment',
    stage: '過往處理',
    question: '之前看過醫生或做過哪些處理？醫生怎麼說？效果維持多久？',
    answer: '看過醫生，也吃過藥；醫生說是老化造成，聽力不會恢復。',
    insight: '知道哪些方法已嘗試、哪些期待已落空，才能把對話轉向聽力補償與下一步。',
  },
  {
    id: 'device-experience',
    stage: '配戴經驗',
    question: '以前戴過助聽器嗎？後來為什麼沒有繼續使用？',
    answer: '戴過，但覺得太吵、聲音不自然，後來就收起來了。',
    insight: '失敗經驗就是試聽驗證清單：優先處理太吵、自然度與配戴接受度。',
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
        <h1 className="counseling-title js-history-title">病史問得深，後續才有切入點</h1>
        <p className="counseling-intro js-history-intro">
          問完不是為了完成表格，而是要知道：現在為何處理、哪些路走不通、方案要先證明什麼。
        </p>
      </header>

      <div className="history-charts">
        {DIALOGUES.map((dialogue, index) => (
          <article
            key={dialogue.id}
            className={`history-chart fragment${dialogue.emphasis ? ' history-chart--key' : ''}`}
            data-fragment-index={index + 1}
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
              <span className="history-chart__insight-label">後續切入點</span>
              <p className="history-chart__insight-text">{dialogue.insight}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="impression-speed__twist fragment" data-fragment-index="4">
        <p className="impression-speed__twist-eyebrow">病史的注意事項</p>

        <p className="history-safety-note">
          若問到需轉介的警訊，仍應先依專業流程轉介耳鼻喉科評估。
        </p>
      </div>
    </SlideShell>
  );
}
