import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * 第一印象章節的收尾提問：承接聲音語調頁的「和善親切」基調，拋出反問句，
 * 作為進入下一頁互動練習（一場選配，情緒該怎麼分配？）前的轉場提問。
 * 整頁只有一句大標題，沒有其他資訊，靠版面本身的份量製造停頓感。
 */
export function ImpressionProvocationPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.emphasis } })
      .from(scope.querySelector('.js-provocation-line-one'), {
        y: 42,
        opacity: 0,
        filter: 'blur(10px)',
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-provocation-line-two'), {
        y: 34,
        opacity: 0,
        filter: 'blur(8px)',
        duration: motion.duration.slow,
      }, '-=0.28')
      .from(scope.querySelector('.js-provocation-emphasis'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.fast,
      }, '-=0.32');
  }, []);

  return (
    <SlideShell fullBleed backgroundTexture="none" className="impression-provocation" animate={animate}>
      <div className="impression-provocation__content">
        <h1 className="impression-provocation__title js-provocation-title">
          <span className="impression-provocation__line js-provocation-line-one">選配過程中，就應該</span>
          <span className="impression-provocation__line impression-provocation__line--question js-provocation-line-two">
            <em className="js-provocation-emphasis">全程</em>保持和善親切嗎？
          </span>
        </h1>
      </div>
    </SlideShell>
  );
}
