// GSAP easing 非 CSS 值，於 JS 端匯出（見 DESIGN.md §9 / §11）。
export const motion = {
  duration: { instant: 0.15, fast: 0.3, base: 0.5, slow: 0.8, countUp: 1.2 },
  ease: {
    standard: 'power2.out',
    emphasis: 'power3.out',
    enter: 'back.out(1.4)',
    count: 'power1.inOut',
  },
  fragmentStagger: 0.08,
} as const;
