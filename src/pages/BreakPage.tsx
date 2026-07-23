import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D13 (P14)：中場休息頁 - 休息十分鐘
 * 標示上半場結束、下半場預告，營造極簡靜謐沉浸的中場停頓感。
 */
export function BreakPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.emphasis } })
      .from(scope.querySelector('.js-break-logo'), {
        y: -20,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-break-tag'), {
        scale: 0.8,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.1')
      .from(scope.querySelector('.js-break-title'), {
        y: 36,
        opacity: 0,
        filter: 'blur(8px)',
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-break-time'), {
        y: 20,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.2')
      .from(scope.querySelector('.js-break-next'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell fullBleed backgroundTexture="none" className="break-page" animate={animate}>
      <div className="break-page__backdrop" aria-hidden="true">
        <span className="break-page__halo" />
      </div>

      <main className="break-page__stage">
        <header className="break-page__header">
          <BrandLogo className="break-page__logo js-break-logo" />
          <span className="break-page__tag js-break-tag">10 MIN BREAK · 中場休息</span>
        </header>

        <div className="break-page__hero">
          <h1 className="break-page__title js-break-title">休息十分鐘</h1>
          <div className="break-page__time-badge js-break-time">
            <strong className="time-badge__target">01:10</strong>
            <span className="time-badge__label">回到教室</span>
          </div>
        </div>

        <footer className="break-page__next js-break-next">
          <div className="next-card">
            <span className="next-card__label">下半場預告</span>
            <p className="next-card__text">
              把理解、檢查、方案與決策串成一條完整選配流程
            </p>
          </div>
        </footer>
      </main>
    </SlideShell>
  );
}
