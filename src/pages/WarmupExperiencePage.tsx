import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';

interface RevealFragmentEvent extends Event {
  fragment?: Element;
}

/**
 * D04 正式頁：兩道提問共用同一個 fragment index（暖色卡 fade-out、冷色卡 fade-in），
 * 讓 Reveal 原生機制一次只顯示一題；情境光暈的暖／冷切換則跟著同一個節點狀態走，
 * 讓「信任的溫度」與「被推銷的壓迫感」直接體現在畫面上，而不是用文字說明。
 */
export function WarmupExperiencePage() {
  const [isCold, setIsCold] = useState(false);
  const coldRef = useRef<HTMLDivElement>(null);

  useSlideReset(
    useCallback(() => {
      setIsCold(false);
      coldRef.current?.classList.remove('visible', 'current-fragment');
    }, []),
  );

  useEffect(() => {
    const handleShown = (event: Event) => {
      if ((event as RevealFragmentEvent).fragment === coldRef.current) setIsCold(true);
    };
    const handleHidden = (event: Event) => {
      if ((event as RevealFragmentEvent).fragment === coldRef.current) setIsCold(false);
    };
    document.addEventListener('fragmentshown', handleShown);
    document.addEventListener('fragmenthidden', handleHidden);
    return () => {
      document.removeEventListener('fragmentshown', handleShown);
      document.removeEventListener('fragmenthidden', handleHidden);
    };
  }, []);

  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-warmup-kicker'), {
        y: 20,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-warmup-scene'), {
        y: 30,
        opacity: 0,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.15')
      .from(scope.querySelector('.js-warmup-footnote'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell
      fullBleed
      className={`warmup-experience${isCold ? ' warmup-experience--cold' : ''}`}
      animate={animate}
    >
      <div className="warmup-experience__stage">
        <p className="warmup-experience__kicker js-warmup-kicker">開場暖身・回想一段購買經驗</p>

        <div className="warmup-experience__scene js-warmup-scene">
          <div className="warmup-experience__phase warmup-experience__phase--warm fragment fade-out" data-fragment-index="0">
            <h1 className="warmup-experience__question">
              最舒服的一次購買經驗是什麼？
              <br />
              對方做了什麼，讓你願意相信他？
            </h1>
          </div>

          <div ref={coldRef} className="warmup-experience__phase warmup-experience__phase--cold fragment" data-fragment-index="0">
            <h1 className="warmup-experience__question">
              最不舒服的一次銷售經驗是什麼？
              <br />
              哪一個瞬間讓你想離開？
            </h1>
          </div>
        </div>


      </div>
    </SlideShell>
  );
}
