import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { BrandLogo } from '../components/brand/BrandLogo';
import { motion } from '../tokens/motion';
import consultationImage from '../../assets/impression-appearance/eye-contact.png';

const PRINCIPLES = ['理解', '提問', '引導'];

/** D01 正式頁：重新定義課程從產品介紹走向顧問式決策引導。 */
export function CoursePositioningPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-positioning-logo'), {
        y: -22,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-positioning-kicker'), {
        y: 22,
        duration: motion.duration.base,
      }, '-=0.08')
      .from(scope.querySelectorAll('.js-positioning-line'), {
        y: 54,
        stagger: 0.12,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.24')
      .from(scope.querySelector('.js-positioning-underline'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.38')
      .from(scope.querySelector('.js-positioning-image'), {
        scale: 0.86,
        transformOrigin: 'center center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.58')
      .from(scope.querySelectorAll('.js-positioning-slice'), {
        scaleY: 0,
        opacity: 0,
        stagger: 0.09,
        transformOrigin: 'center bottom',
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.5')
      .from(scope.querySelectorAll('.js-positioning-principle'), {
        y: 28,
        opacity: 0,
        stagger: motion.fragmentStagger,
        duration: motion.duration.base,
      }, '-=0.42');
  }, []);

  return (
    <SlideShell fullBleed className="course-positioning" animate={animate}>
      <main className="course-positioning__stage">
        <div className="course-positioning__copy">
          <BrandLogo className="course-positioning__logo js-positioning-logo" />

          <div className="course-positioning__headline">
            <p className="course-positioning__kicker js-positioning-kicker">
              顧問式助聽器選配實戰
            </p>
            <h1 className="course-positioning__title">
              <span className="js-positioning-line">從介紹產品，</span>
              <span className="course-positioning__title-focus js-positioning-line">
                到協助客戶做決定
                <i className="js-positioning-underline" aria-hidden="true" />
              </span>
            </h1>
          </div>

          <div className="course-positioning__principles" aria-label="顧問式銷售的三個核心動作">
            {PRINCIPLES.map((principle, index) => (
              <div key={principle} className="course-positioning__principle js-positioning-principle">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{principle}</strong>
              </div>
            ))}
          </div>

          <div className="course-positioning__close fragment">
            <p>不是被動等著客戶表達</p>
            <strong>而是透過提問去引導客人</strong>
          </div>
        </div>

        <figure className="course-positioning__visual">
          <img
            className="course-positioning__image js-positioning-image"
            src={consultationImage}
            alt="聽力師專注傾聽客戶說明生活困擾"
          />
          <div className="course-positioning__slices" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <i
                key={index}
                className={`course-positioning__slice course-positioning__slice--${index + 1} js-positioning-slice`}
              />
            ))}
          </div>
          <figcaption>
            <span>顧問式對話</span>
            <strong>先讓對方願意說，才知道該怎麼幫。</strong>
          </figcaption>
        </figure>
      </main>
    </SlideShell>
  );
}
