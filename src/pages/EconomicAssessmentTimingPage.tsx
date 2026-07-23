import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const OBSERVATION_STEPS = [
  { label: '病史詢問', fragmentIndex: 0 },
  { label: 'COSI', fragmentIndex: 1 },
  { label: '檢查', fragmentIndex: 2 },
  { label: '衛教', fragmentIndex: 3 },
] as const;

const TRIAL_STEP = { label: '試聽', fragmentIndex: 5 } as const;

/** D18.5：強調經濟能力與等級範圍必須在試聽前完成初步判斷。 */
export function EconomicAssessmentTimingPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-timing-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-timing-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.2')
      .from(scope.querySelector('.js-timing-intro'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.2')
      .from(scope.querySelectorAll('.js-timing-line'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.1');
  }, []);

  return (
    <SlideShell fullBleed className="economic-capacity economic-capacity--timing" animate={animate}>
      <main className="economic-capacity__stage economic-timing__stage">
        <header className="economic-capacity__nav js-timing-nav">
          <BrandLogo className="economic-capacity__logo" />
          <i aria-hidden="true" />
          <span>試聽之前</span>
        </header>

        <div className="economic-timing__heading">
          <h1 className="js-timing-title">經濟能力要在試聽前完成判斷</h1>
          <p className="js-timing-intro">
            等級建議要接得住客戶的生活需求，也要落在他能承擔的範圍。
          </p>
        </div>

        <div className="economic-timing__flow" aria-label="試聽前分成觀察與決策兩個階段">
          <article className="economic-timing__group economic-timing__group--observe">
            <header className="economic-timing__group-heading">
              <h2>觀察並完成等級判斷</h2>
            </header>
            <div className="economic-timing__track economic-timing__track--four">
              <span className="economic-timing__line js-timing-line" aria-hidden="true" />
              {OBSERVATION_STEPS.map((step) => (
                <article
                  key={step.label}
                  className="economic-timing__step fragment"
                  data-fragment-index={step.fragmentIndex}
                >
                  <span className="economic-timing__dot" aria-hidden="true" />

                  <h3>{step.label}</h3>
                </article>
              ))}
            </div>
          </article>

          <div className="economic-timing__decision fragment" data-fragment-index={4}>
            <span aria-hidden="true" />
            <p>最後決定點</p>
            <b>確認試聽等級</b>
          </div>

          <article className="economic-timing__group economic-timing__group--decide">
            <header className="economic-timing__group-heading">
              <h2>依等級試聽</h2>
            </header>
            <div className="economic-timing__track economic-timing__track--one">
              <span className="economic-timing__line js-timing-line" aria-hidden="true" />
              <article
                className="economic-timing__step economic-timing__step--trial fragment"
                data-fragment-index={TRIAL_STEP.fragmentIndex}
              >
                <span className="economic-timing__dot" aria-hidden="true" />

                <h3>{TRIAL_STEP.label}</h3>
              </article>
            </div>
          </article>
        </div>

        <div className="economic-timing__late-slot fragment" data-fragment-index={6}>
          <div
            className="economic-timing__late-stack fragment fade-out"
            data-fragment-index={7}
            aria-label="兩種不理想的試聽等級選擇方式"
          >
            <div className="economic-timing__late">
              <span className="economic-timing__late-mark" aria-hidden="true">×</span>
              <p>
                <s>先選高單價助聽器</s>
                <i aria-hidden="true">→</i>
                <s>客戶嚇到</s>
                <i aria-hidden="true">→</i>
                <s>才降等級或急著說服</s>
              </p>
            </div>
            <div className="economic-timing__late">
              <span className="economic-timing__late-mark" aria-hidden="true">×</span>
              <p>
                <s>先選中間價位助聽器</s>
                <i aria-hidden="true">→</i>
                <s>客戶 OK</s>
                <i aria-hidden="true">→</i>
                <s>很難再找理由往上推</s>
              </p>
            </div>
          </div>

          <div
            className="economic-timing__late economic-timing__late--ideal fragment"
            data-fragment-index={7}
            aria-label="理想的試聽等級選擇方式"
          >
            <span className="economic-timing__late-mark economic-timing__late-mark--ideal" aria-hidden="true">○</span>
            <div className="economic-timing__branch-rail">
              <svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 20 60 H 210 C 250 60 250 25 300 25 H 980" />
                <path d="M 210 60 C 250 60 250 95 300 95 H 980" />
                <circle cx="210" cy="60" r="8" />
              </svg>
              <span className="economic-timing__branch-origin">預算判斷</span>
              <p className="economic-timing__branch economic-timing__branch--known">
                <b>成功判斷出預算</b>
                <i aria-hidden="true">→</i>
                <strong>拿相應款式</strong>
              </p>
              <p className="economic-timing__branch economic-timing__branch--unknown">
                <b>還是無頭緒</b>
                <i aria-hidden="true">→</i>
                <strong>i50 出手</strong>
              </p>
            </div>
          </div>
        </div>


      </main>
    </SlideShell>
  );
}
