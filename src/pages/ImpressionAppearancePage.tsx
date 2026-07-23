import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';
import groomingImage from '../../assets/impression-appearance/grooming.png';
import postureImage from '../../assets/impression-appearance/posture.png';
import smileImage from '../../assets/impression-appearance/smile.png';
import eyeContactImage from '../../assets/impression-appearance/eye-contact.png';

interface Tip {
  id: string;
  icon: string;
  title: string;
  body: string;
  image: string;
}

const TIPS: Tip[] = [
  { id: 'grooming', icon: '👔', title: '整潔的儀容', body: '衣著得體、頭髮整潔，展現專業形象。', image: groomingImage },
  { id: 'posture', icon: '🧍', title: '自信的體態', body: '站姿、坐姿端正，讓人感受到自信與可靠。', image: postureImage },
  { id: 'smile', icon: '😊', title: '適度的微笑', body: '微笑傳遞友善與親和力，有助拉近與客戶的距離。', image: smileImage },
  { id: 'eye-contact', icon: '👀', title: '眼神交流', body: '適當的眼神接觸代表尊重與專注，能增強信任感。', image: eyeContactImage },
];

/**
 * 第一印象：外表四要點。一律可見的教學卡片格（非翻牌測驗，這裡沒有隱藏的
 * 對錯需要猜）。GSAP 只顧開場一句銜接文案，四張卡片整組交給 Reveal 原生
 * fragment 一次揭曉，呼應 ScenarioPage 的慣例。
 */
export function ImpressionAppearancePage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.from(scope.querySelector('.js-appearance-lead'), {
      y: 24,
      opacity: 0,
      duration: motion.duration.base,
      ease: motion.ease.standard,
    });
  }, []);

  return (
    <SlideShell animate={animate}>
      <div className="impression-appearance">
        <p className="impression-appearance__lead js-appearance-lead">
          如何營造那十分關鍵的 <span className="impression-percent">55%</span> (視覺) 呢？
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
              <img className="tip-card__image" src={tip.image} alt="" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
