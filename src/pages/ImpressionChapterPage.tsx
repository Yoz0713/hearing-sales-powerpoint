import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const BARS = [18, 30, 48, 72, 42, 86, 56, 36, 68, 92, 52, 26];

export function ImpressionChapterPage() {
  const animate = useCallback((scope: HTMLElement) => {
    const tl = gsap.timeline({ defaults: { ease: motion.ease.emphasis } });
    tl.from(scope.querySelector('.js-impression-chapter-word'), { 
      scale: 0.84, 
      opacity: 0, 
      duration: motion.duration.slow 
    })
    .from(scope.querySelectorAll('.js-impression-chapter-bar'), { 
      scaleY: 0, 
      transformOrigin: 'center bottom', 
      stagger: 0.045, 
      duration: motion.duration.base 
    }, '-=0.5');
  }, []);

  return <SlideShell fullBleed backgroundTexture="none" className="impression-chapter" animate={animate}>
    <div className="impression-chapter__halo" aria-hidden="true" />
    <main className="impression-chapter__content">
      <h1 className="impression-chapter__title js-impression-chapter-word">第一印象</h1>
    </main>
    <div className="impression-chapter__bars" aria-hidden="true">{BARS.map((height, index) => <i key={index} className="js-impression-chapter-bar" style={{ height: `${height}%` }} />)}</div>
  </SlideShell>;
}
