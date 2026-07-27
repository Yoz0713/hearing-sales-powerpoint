import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface TrustInsight {
  key: string;
  title: string;
  body: string;
}

/** 專講「怕被推銷」：提醒聽力師別只信客戶的表面話，要靠信任讓他自己說出口。 */
const INSIGHTS: TrustInsight[] = [
  {
    key: 'surface',
    title: '別急著相信表面話',
    body: '很多人一聽到「體驗看看」就當真，卻忘了那多半是防備，不是他真正的想法。',
  },
  {
    key: 'reason',
    title: '沒有人無緣無故來檢查',
    body: '他願意走進來，代表心裡已經有困擾，只是還沒打算讓你知道。',
  },
  {
    key: 'trust',
    title: '先把信任養起來',
    body: '顧慮不會因為你追問就消失，是等他覺得安全了，才會自己說出口。',
  },
];

/** 第 9 頁：客戶說出口的，只是冰山一角——一句防備話，底下四個沒說出口的顧慮。 */
export function CounselingHiddenMotivePage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-unspoken-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-unspoken-title'), {
        y: 32,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.05')
      .from(scope.querySelector('.js-unspoken-lead'), {
        y: 16,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.24')
      .from(scope.querySelector('.js-unspoken-surface'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.1')
      .from(scope.querySelector('.js-unspoken-depthlabel'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.18');
  }, []);

  return (
    <SlideShell fullBleed className="unspoken" animate={animate}>
      <main className="unspoken__stage">
        <header className="unspoken__nav js-unspoken-nav">
          <BrandLogo className="unspoken__logo" />
        </header>

        <div className="unspoken__intro">
          <h1 className="unspoken__title js-unspoken-title">客戶說出口的，只是冰山一角</h1>
          <p className="unspoken__lead js-unspoken-lead">
            先聽懂他沒說的，<br />透過提問去引導。
          </p>
        </div>

        <figure className="unspoken__surface js-unspoken-surface">
          <div className="unspoken__surface-body">
            <span className="unspoken__surface-label">他嘴上說</span>
            <blockquote className="unspoken__surface-quote">隨便看看啦，醫生叫我來的。</blockquote>
            <blockquote className="unspoken__surface-quote">我聽得還好只是想來體驗聽力檢測。</blockquote>
            <blockquote className="unspoken__surface-quote">你們小姐建議我來檢查看看</blockquote>
          </div>
        </figure>

        <div className="unspoken__depth">

          <div className="unspoken__focus">
            <div className="unspoken__focus-card fragment" data-fragment-index={0}>
              <span className="unspoken__focus-tag">他心裡最在意的一件事</span>
              <h2 className="unspoken__focus-title">怕被推銷</h2>
              <p className="unspoken__focus-body">
                怕一講出真困擾，就被業務抓著猛推。所以先說表面理由，一邊觀察你值不值得信任。
              </p>
            </div>
            <ul className="unspoken__insights" aria-label="面對防備話的三個提醒">
              {INSIGHTS.map((insight, index) => (
                <li
                  key={insight.key}
                  className="unspoken__insight fragment"
                  data-fragment-index={index + 1}
                >
                  <h3 className="unspoken__insight-title">{insight.title}</h3>
                  <p className="unspoken__insight-body">{insight.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="unspoken__close fragment" data-fragment-index={INSIGHTS.length + 1}>
          <p className="unspoken__close-text">
            客戶不是不說，是還沒覺得安全。別急著推銷——先讓他願意把內心話講出來。
          </p>
        </footer>
      </main>
    </SlideShell>
  );
}
