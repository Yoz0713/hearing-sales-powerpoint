import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { BigNumberLayout } from '../components/layouts/BigNumberLayout';
import { motion } from '../tokens/motion';

/**
 * 第一印象：建立速度（7 秒 count-up）+ 首因效應。用 BigNumberLayout 撐出單一
 * 主視覺重心，首因效應以整塊 callout 包成 fragment 揭曉，避免揭曉前留下一個
 * 空白卡片佔位。
 */
export function ImpressionSpeedPage() {
  const animate = useCallback((scope: HTMLElement) => {
    const tl = gsap.timeline({ defaults: { ease: motion.ease.standard } });
    tl.from(scope.querySelector('.js-impression-speed-eyebrow'), {
      x: -40,
      opacity: 0,
      duration: motion.duration.base,
    });

    const valueEl = scope.querySelector<HTMLElement>('.js-impression-speed-value');
    if (valueEl) {
      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: 7,
          duration: 0.6,
          ease: motion.ease.count,
          onUpdate: () => {
            valueEl.textContent = `${Math.round(counter.v)}`;
          },
        },
        '-=0.2',
      );
    }

    tl.from(
      scope.querySelector('.js-impression-speed-title'),
      { y: 20, opacity: 0, duration: motion.duration.base },
      '-=0.3',
    ).from(
      scope.querySelector('.js-impression-speed-body'),
      { y: 16, opacity: 0, duration: motion.duration.base },
      '-=0.25',
    );
  }, []);

  return (
    <SlideShell animate={animate}>
      <BigNumberLayout
        value={<span className="js-impression-speed-value">0</span>}
        unit="秒"
        title={
          <span className="js-impression-speed-title">
            第一印象的建立，只需要七秒就會結束<br /> 而這七秒可能攸關整場選配的成敗。
          </span>
        }
      >
        <p className="impression-speed__body js-impression-speed-body">
          這個印象將牽動後續客戶對你的信任感。
        </p>
        <div className="impression-speed__twist fragment">
          <p className="impression-speed__twist-eyebrow">首因效應</p>
          <p className="impression-speed__twist-body">
            人習慣維持既有評價。一旦對某人有了初步評價，之後他說的、做的每一件事，都會被這最初的印象牽著走。
          </p>
        </div>
      </BigNumberLayout>
    </SlideShell>
  );
}
