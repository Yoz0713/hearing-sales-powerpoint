import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface Tip {
  id: string;
  icon: string;
  title: string;
  body: string;
}

const TIPS: Tip[] = [
  { id: 'pace', icon: '🐢', title: '語速放慢', body: '對聽力損失的客戶尤其重要。' },
  { id: 'articulation', icon: '🔊', title: '咬字清晰、音量適中', body: '不必刻意提高音量喊話，加重子音、放慢咬字比單純提高音量更有效。' },
  { id: 'tone', icon: '🎵', title: '語調溫和有起伏', body: '避免單調的機械節奏，適度抑揚頓挫能傳遞真誠與耐心，更像一個活生生的人。' },
  { id: 'smile', icon: '🙂', title: '聲音裡帶著微笑', body: '微笑會改變聲音的音質與親和力，讓客戶卸下戒心、更願意敞開溝通。' },
];

/**
 * 第一印象：聲音與語調四要點。承接 ImpressionAppearancePage（55% 視覺），
 * 本頁對應 7-38-55 法則中 38% 的聲音構面，版面與動畫機制完全比照沿用。
 */
export function ImpressionTonePage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.from(scope.querySelector('.js-tone-lead'), {
      y: 24,
      opacity: 0,
      duration: motion.duration.base,
      ease: motion.ease.standard,
    });
  }, []);

  return (
    <SlideShell animate={animate}>
      <div className="impression-tone">
        <p className="impression-tone__lead js-tone-lead">
          如何營造那關鍵的 <span className="impression-percent">38%</span> (聲音與語調) 呢？
        </p>
        <div className="tip-grid">
          {TIPS.map((tip) => (
            <div key={tip.id} className="tip-card">
              <div className="flip-card__identity">
                <span className="flip-card__icon" aria-hidden="true">
                  {tip.icon}
                </span>
                <div className="flip-card__identity-text">
                  <span className="flip-card__title">{tip.title}</span>
                </div>
              </div>
              <p className="tip-card__body">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
