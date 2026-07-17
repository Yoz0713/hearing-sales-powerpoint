import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface HiddenReason {
  id: string;
  title: string;
  body: string;
  /** 「怕被推銷」最直接影響聽力師該怎麼應對，用橘色強調這一格。 */
  emphasis?: boolean;
}

const HIDDEN_REASONS: HiddenReason[] = [
  {
    id: 'stigma',
    title: '怕被貼標籤',
    body: '戴助聽器等於承認自己老了。抗拒「老人、殘障」的社會標籤，於是把問題說小、說輕。',
  },
  {
    id: 'sales',
    title: '怕被推銷',
    body: '怕一講出真困擾，就被業務抓著猛推高價機。先說「隨便看看」，觀察你值不值得信任。',
    emphasis: true,
  },
  {
    id: 'face',
    title: '放不下面子',
    body: '不想在家人面前顯得依賴、成為負擔，寧可淡化困擾，也不願承認「我需要幫忙」。',
  },
  {
    id: 'unaware',
    title: '自己也沒察覺',
    body: '把聽不清楚歸因於「別人講太小聲」，低估聽損衝擊，常是被家人半哄半騙帶來的。',
  },
];

export function CounselingHiddenMotivePage() {
  // GSAP 只負責頁首與水面明線進場（scaleX 由中央往兩側展開，當全頁分界的視覺定錨）；
  // 說出口的引言、四格原因、收尾句一律交給 Reveal 原生 fragment，避免 GSAP 對
  // fragment 節點寫 inline opacity 與 Reveal 狀態打架（同 CounselingHistoryPage）。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-hidden-kicker'), { x: -28, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-hidden-title'), { y: 20, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-hidden-line'), { scaleX: 0, transformOrigin: 'center', duration: motion.duration.slow, ease: motion.ease.emphasis }, '-=0.1');
  }, []);

  return (
    <SlideShell fullBleed className="counseling-hidden" animate={animate}>
      <div className="hidden-daylight">
        <div className="hidden-head">
          <p className="counseling-kicker js-hidden-kicker">衛教與諮商</p>
          <h1 className="counseling-title js-hidden-title">客戶說出口的，只是冰山一角</h1>
        </div>
        <figure className="hidden-spoken fragment" data-fragment-index="1">
          <figcaption className="hidden-spoken__label">他嘴上說</figcaption>
          <blockquote className="hidden-spoken__text">「隨便看看啦，醫生叫我來的。」</blockquote>
        </figure>
      </div>

      <div className="hidden-surface">
        <span className="hidden-surface__up">說出口的</span>
        <span className="hidden-surface__rule js-hidden-line" aria-hidden="true" />
        <span className="hidden-surface__down">沒說出口的</span>
      </div>

      <div className="hidden-deep">
        <div className="hidden-grid">
          {HIDDEN_REASONS.map((reason) => (
            <article
              key={reason.id}
              className={`hidden-cell fragment${reason.emphasis ? ' hidden-cell--key' : ''}`}
              data-fragment-index="2"
            >
              <h2 className="hidden-cell__title">{reason.title}</h2>
              <p className="hidden-cell__body">{reason.body}</p>
            </article>
          ))}
        </div>

        <div className="hidden-close fragment" data-fragment-index="3">
          <p className="hidden-close__eyebrow">先接住情緒，再談方案</p>
          <p className="hidden-close__text">
            客戶不是不說，是還沒覺得安全。別急著推銷——先讓他願意把水面下的話講出來。
          </p>
        </div>
      </div>
    </SlideShell>
  );
}
