import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface LearningChapterSpec {
  id: 'self' | 'customer';
  prelude: string;
  title: string;
  lead: string;
  orbitWords: readonly [string, string, string];
  path: readonly [string, string, string];
  ghostWord: string;
}

const SELF_AWARENESS: LearningChapterSpec = {
  id: 'self',
  prelude: '在理解客戶以前',
  title: '認識自己',
  lead: '先理解自己的銷售風格與習慣，才知道如何改變。',
  orbitWords: ['風格', '習慣', '盲點'],
  path: ['擺脫習慣', '辨識優勢', '找到盲點'],
  ghostWord: '突破',
};

const CUSTOMER_UNDERSTANDING: LearningChapterSpec = {
  id: 'customer',
  prelude: '在提出建議以前',
  title: '理解客戶',
  lead: '先聽懂沒有行動背後的顧慮，才能找到真正的改變理由。',
  orbitWords: ['表面', '顧慮', '動機'],
  path: ['聽見表面', '理解顧慮', '找到動機'],
  ghostWord: '靠近',
};

function LearningChapterPage({ spec }: { spec: LearningChapterSpec }) {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.emphasis } })
      .from(scope.querySelector('.js-learning-chapter-nav'), {
        y: -18,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-learning-chapter-prelude'), {
        x: -34,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.05')
      .from(scope.querySelector('.js-learning-chapter-title'), {
        x: -84,
        opacity: 0,
        duration: motion.duration.slow,
      }, '-=0.14')
      .from(scope.querySelector('.js-learning-chapter-lead'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.32')
      .from(scope.querySelector('.js-learning-chapter-orbit'), {
        scale: 0.68,
        rotate: -12,
        opacity: 0,
        duration: motion.duration.slow,
        ease: motion.ease.enter,
      }, '-=0.58')
      .from(scope.querySelectorAll('.js-learning-chapter-orbit-word'), {
        scale: 0.75,
        opacity: 0,
        stagger: 0.09,
        duration: motion.duration.fast,
      }, '-=0.3')
      .from(scope.querySelectorAll('.js-learning-chapter-step'), {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: motion.duration.base,
      }, '-=0.2');
  }, []);

  return (
    <SlideShell fullBleed className={`learning-chapter learning-chapter--${spec.id}`} animate={animate}>
      <main className="learning-chapter__stage">
        <header className="learning-chapter__nav js-learning-chapter-nav">
          <BrandLogo className="learning-chapter__logo" />
          <i aria-hidden="true" />
        </header>

        <div className="learning-chapter__hero">
          <div className="learning-chapter__copy">
            <p className="learning-chapter__prelude js-learning-chapter-prelude">{spec.prelude}</p>
            <h1 className="learning-chapter__title js-learning-chapter-title">{spec.title}</h1>
            <p className="learning-chapter__lead js-learning-chapter-lead">{spec.lead}</p>
          </div>

          <div className="learning-chapter__visual" aria-hidden="true">
            <span className="learning-chapter__ghost">{spec.ghostWord}</span>
            <div className="learning-chapter__orbit js-learning-chapter-orbit">
              <i className="learning-chapter__orbit-core" />
              {spec.orbitWords.map((word, index) => (
                <span
                  key={word}
                  className={`learning-chapter__orbit-word learning-chapter__orbit-word--${index + 1} js-learning-chapter-orbit-word`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ol className="learning-chapter__path" aria-label={`${spec.title}的三個學習方向`}>
          {spec.path.map((step, index) => (
            <li key={step} className="learning-chapter__step js-learning-chapter-step">
              <span>0{index + 1}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </main>
    </SlideShell>
  );
}

export function SelfAwarenessChapterPage() {
  return <LearningChapterPage spec={SELF_AWARENESS} />;
}

export function CustomerUnderstandingChapterPage() {
  return <LearningChapterPage spec={CUSTOMER_UNDERSTANDING} />;
}
