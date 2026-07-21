import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';
import postureImage from '../../assets/impression-appearance/posture.png';
import eyeContactImage from '../../assets/impression-appearance/eye-contact.png';
import smileImage from '../../assets/impression-appearance/smile.png';

const OBJECTIVE_PATHS = [
  {
    title: '認識自己',
    tone: 'orange',
    image: postureImage,
    imagePosition: '70% 44%',
    outcomes: ['覺察自己的銷售風格', '理解傳統與顧問式銷售的差異'],
  },
  {
    title: '理解(控制)客戶',
    tone: 'cyan',
    image: eyeContactImage,
    imagePosition: '66% 38%',
    outcomes: ['透過提問挖掘需求與動機', '主導選配流程'],
  },
  {
    title: '引導決定',
    tone: 'green',
    image: smileImage,
    imagePosition: '67% 40%',
    outcomes: ['排除客戶的疑慮、願意接受你的建議', '引導合適的下一步'],
  },
] as const;

/** D02 正式頁：將六項課程目標整理成三條可記憶的能力路徑。 */
export function CourseObjectivesPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-objectives-nav'), {
        y: -20,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-objectives-kicker'), {
        y: 18,
        duration: motion.duration.fast,
      }, '-=0.08')
      .from(scope.querySelectorAll('.js-objectives-title-word'), {
        y: 46,
        stagger: 0.08,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.18')
      .from(scope.querySelectorAll('.js-objectives-inline-image'), {
        scale: 0.72,
        stagger: 0.07,
        duration: motion.duration.base,
        ease: motion.ease.enter,
      }, '-=0.52')
      .from(scope.querySelector('.js-objectives-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.3');
  }, []);

  return (
    <SlideShell fullBleed className="course-objectives" animate={animate}>
      <main className="course-objectives__stage">
        <header className="course-objectives__header">
          <div className="course-objectives__nav js-objectives-nav">
            <BrandLogo className="course-objectives__logo" />

          </div>

          <div className="course-objectives__heading">
            <div>
              <h1 className="course-objectives__title">
                <span className="js-objectives-title-word">課程中重要的三件事</span>
              </h1>
            </div>
          </div>
          <i className="course-objectives__rule js-objectives-rule" aria-hidden="true" />
        </header>

        <div className="course-objectives__paths" aria-label="三組課程學習目標">
          {OBJECTIVE_PATHS.map((path, index) => (
            <article
              key={path.title}
              className={`course-objectives__path course-objectives__path--${path.tone} fragment`}
              data-fragment-index={index}
            >
              <figure className="course-objectives__media">
                <img src={path.image} alt="" style={{ objectPosition: path.imagePosition }} />
              </figure>
              <div className="course-objectives__path-copy">
                <span className="course-objectives__path-index">0{index + 1}</span>
                <h2>{path.title}</h2>
                <ul>
                  {path.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </main>
    </SlideShell>
  );
}
