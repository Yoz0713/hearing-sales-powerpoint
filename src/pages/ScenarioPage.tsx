import { useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';
import confusedElderSvg from '../../assets/困惑的長輩.svg';

interface Option {
  id: string;
  icon: string;
  label: string;
  title: string;
  content: string;
  ratingTitle: string;
  ratingContent: string;
}

const OPTIONS: Option[] = [
  {
    id: 'A',
    icon: '📊',
    label: '選項 A',
    title: '規格派',
    content: '「伯伯，助聽器的好壞主要跟音質與降噪技術有關係。頂規款有 20 個通道，音質會比較自然清晰，且降噪功能會讓你在吵雜的環境中會比較舒服；入門款通道數比較少，比較適合居家安靜環境。」',
    ratingTitle: '傳統技術思維',
    ratingContent: '這是最常見的「規格腦」，一開始就做產品比較，完全沒有帶入任何客戶的生活情境，因此難以讓客戶產生共鳴。',
  },
  {
    id: 'B',
    icon: '🤝',
    label: '選項 B',
    title: '同理心派',
    content: '「伯伯，其實不一定越貴越好，適合您的最重要。這要看您平常的生活環境，如果您很少出門，入門款其實就夠用了；如果您很常出門社交，可能才需要高階的助聽器。您平常會常去哪些地方呢？」',
    ratingTitle: '知道概念，但落入被動',
    ratingContent: '很有同理心，也是培訓常教的「看COSI推薦」。但被動地將產品好壞與「出門頻率」掛鉤，且太早給出「入門款可能就夠用」的限制，失去了挖掘深層痛點與提高客單價的機會。',
  },
  {
    id: 'C',
    icon: '🧭',
    label: '選項 C',
    title: '顧問主導派',
    content: '「伯伯，您的問題其實很多人都會問，但真正的原因都不太一樣。我想先了解，是什麼原因讓您想比較這兩款的差異呢？是擔心效果不夠好，還是有預算上的考量？」',
    ratingTitle: '真正的顧問式思維',
    ratingContent: '這是唯一一個「反問」的選項，直接去探討客戶提問的動機（恐懼 vs. 預算）。這能把發言權和主導權拿回來，可以讓我們了解接下來的諮詢應該要聚焦在「心魔」上還是「價格」上。',
  },
  {
    id: 'D',
    icon: '⚖️',
    label: '選項 D',
    title: '價值折衷派',
    content: '「伯伯，高階款主要是針對環境噪音處理比較細緻。其實如果覺得頂規預算太高，我們通常會推薦中間這個高階款，它的 CP 值最高，大部分功能都有，我拿這款給您戴戴看？」',
    ratingTitle: '常見的門市談判技巧',
    ratingContent: '典型的「向下銷售」，還沒開始諮詢、還不知道聽力狀況，就自動幫客戶「降級」到中階款，提早喪失了談判空間。',
  },
];

export function ScenarioPage() {
  // 儲存已被翻轉的卡片 ID
  const [flippedCards, setFlippedCards] = useState<ReadonlySet<string>>(() => new Set());

  // R 鍵或換頁時重置卡片狀態為正面
  useSlideReset(
    useCallback(() => {
      setFlippedCards(new Set());
    }, [])
  );

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // GSAP 頁面載入進場動畫：只做步驟一(提問+插圖)的進場，卡片網格是 Reveal
  // fragment，交給按下鍵時 reveal.js 自己的 fragment 過渡處理，不重複用 GSAP 控制。
  const animate = useCallback((scope: HTMLElement) => {
    const tl = gsap.timeline({ defaults: { ease: motion.ease.standard } });
    tl.from(scope.querySelector('.js-scenario-intro-image'), {
      scale: 0.85,
      opacity: 0,
      duration: motion.duration.base,
    }).from(
      scope.querySelector('.js-scenario-intro-question'),
      {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      },
      '-=0.25'
    );
  }, []);

  return (
    <SlideShell animate={animate}>
      <div className="scenario-page">
        <div className="scenario-intro">
          <img
            className="scenario-intro__image js-scenario-intro-image"
            src={confusedElderSvg}
            alt="困惑的長輩"
          />
          <blockquote className="scenario-intro__question js-scenario-intro-question">
            「你們那個最高階的助聽器，跟入門款到底差在哪裡？有需要買到那麼貴的嗎？」
          </blockquote>
        </div>

        <div className="scenario-grid fragment">
          {OPTIONS.map((opt) => {
            const isFlipped = flippedCards.has(opt.id);
            const isRecommended = opt.id === 'C';
            return (
              <div
                key={opt.id}
                className={`flip-card${isFlipped ? ' is-flipped' : ''}`}
                onClick={() => toggleFlip(opt.id)}
              >
                <div className="flip-card__inner">
                  {/* 正面：四張卡片視覺完全等重，不洩題，讓學員先猜再翻 */}
                  <div className="flip-card__front">
                    <div className="flip-card__identity">
                      <span className="flip-card__icon" aria-hidden="true">
                        {opt.icon}
                      </span>
                      <div className="flip-card__identity-text">
                        <span className="flip-card__title">{opt.label}</span>
                      </div>
                    </div>
                    <blockquote className="flip-card__quote">
                      <p>{opt.content}</p>
                    </blockquote>

                  </div>

                  {/* 背面：點評，推薦解法只在這裡才揭曉 */}
                  <div className={`flip-card__back${isRecommended ? ' flip-card__back--recommend' : ''}`}>
                    <div className="flip-card__identity">
                      <span className="flip-card__icon" aria-hidden="true">
                        {opt.icon}
                      </span>
                      <div className="flip-card__identity-text">
                        <span className="flip-card__eyebrow">{opt.label}</span>
                        {isRecommended && <span className="flip-card__badge">🌟 推薦解法</span>}
                        <span className="flip-card__title">{opt.ratingTitle}</span>
                      </div>
                    </div>
                    <div className="flip-card__body">
                      <p>{opt.ratingContent}</p>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
}
