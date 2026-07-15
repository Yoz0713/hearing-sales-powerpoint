import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { CoverLayout } from '../components/layouts/CoverLayout';
import { BrandLogo } from '../components/brand/BrandLogo';
import { motion } from '../tokens/motion';

/** 封面頁：銷售經驗分享。每個元素分件 GSAP 進場，可被 R 重播。 */
export function CoverPage() {
  const animate = useCallback((scope: HTMLElement) => {
    void scope;
    const tl = gsap.timeline({ defaults: { ease: motion.ease.standard } });
    tl.from('.js-cover-panel', {
      xPercent: 18,
      opacity: 0,
      duration: motion.duration.slow,
      ease: motion.ease.emphasis,
    })
      .from(
        '.js-cover-badge',
        { scale: 0.6, opacity: 0, transformOrigin: '50% 60%', duration: motion.duration.base, ease: motion.ease.enter },
        '-=0.45',
      )
      .from('.js-cover-logo', { y: -24, opacity: 0, duration: motion.duration.base }, '-=0.5')
      .from('.js-cover-title', { x: -48, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from('.js-cover-author', { x: -28, opacity: 0, duration: motion.duration.fast }, '-=0.3')
      .from(
        '.js-cover-colorbar i',
        { scaleX: 0, transformOrigin: 'left center', stagger: motion.fragmentStagger, duration: motion.duration.fast },
        '-=0.2',
      );
  }, []);

  return (
    <SlideShell fullBleed animate={animate}>
      <CoverLayout logo={<BrandLogo />}>
        <h1 className="cover__title js-cover-title">銷售經驗分享</h1>
        <p className="cover__author js-cover-author">撰寫者：游閔暘</p>
      </CoverLayout>
    </SlideShell>
  );
}
