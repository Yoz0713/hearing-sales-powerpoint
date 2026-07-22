import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * 四個判準維度：左為傳統（產品出發、低彩度），右為顧問式（生活與決定出發）。
 * 最後一列「目標」是整條軸的落點，收束到協助決定，銜接 D09。
 */
const DIMENSIONS = [
  { key: 'origin', label: '起點', traditional: '從產品開始', consultative: '從客戶的生活開始' },
  { key: 'method', label: '方法', traditional: '說服與回答', consultative: '釐清問題背後的問題' },
  { key: 'value', label: '價值', traditional: '規格越高越好', consultative: '適合客戶才是最好' },
  { key: 'goal', label: '目標', traditional: '完成成交', consultative: '協助做出合適決定' },
] as const;

/** D08 正式頁：用一條左→右的觀點轉換軸，建立傳統與顧問式銷售的行為判準。 */
export function SalesModelComparisonPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-shift-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-shift-title'), {
        y: 32,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.06')
      .from(scope.querySelector('.js-shift-lead'), {
        y: 16,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.24')
      .from(scope.querySelector('.js-shift-poles'), {
        y: 20,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.12')
      .from(scope.querySelectorAll('.js-shift-row'), {
        x: -28,
        opacity: 0,
        stagger: 0.08,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.18');
  }, []);

  return (
    <SlideShell fullBleed className="model-shift" animate={animate}>
      <main className="model-shift__stage">
        <header className="model-shift__nav js-shift-nav">
          <BrandLogo className="model-shift__logo" />
          <span className="model-shift__hint">先口頭改寫，再看右側</span>
        </header>

        <div className="model-shift__intro">
          <h1 className="model-shift__title js-shift-title">同一個產品，兩種完全不同的出發點</h1>
          <p className="model-shift__lead js-shift-lead">
            產品規格一模一樣。真正決定客戶感受的，是你從軸的哪一端開始這場對話。
          </p>
        </div>

        <div className="model-shift__axis">
          <div className="model-shift__poles js-shift-poles">
            <span className="model-shift__poles-spacer" aria-hidden="true" />
            <span className="model-shift__pole model-shift__pole--from">從產品出發</span>
            <span className="model-shift__track" aria-hidden="true">
              <em>觀點轉換</em>
              <i />
            </span>
            <span className="model-shift__pole model-shift__pole--to">從生活與決定出發</span>
          </div>

          <ol className="model-shift__rows" aria-label="傳統銷售與顧問式銷售的四個判準">
            {DIMENSIONS.map((dimension, index) => (
              <li
                key={dimension.key}
                className={`model-shift__row js-shift-row${dimension.key === 'goal' ? ' model-shift__row--landing' : ''}`}
              >
                <span className="model-shift__label">{dimension.label}</span>
                <p className="model-shift__from">{dimension.traditional}</p>
                <span className="model-shift__arrow" aria-hidden="true" />
                <p
                  className="model-shift__to fragment"
                  data-fragment-index={index}
                >
                  {dimension.consultative}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </SlideShell>
  );
}
