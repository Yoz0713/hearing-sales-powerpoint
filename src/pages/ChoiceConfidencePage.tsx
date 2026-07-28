import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/** 走到這一步他已經願意戴了，話術也跟著換：不再是拒絕，是要去外面確認。 */
const SURFACE_QUOTES = [
  '我再去別家看看。',
  '網路上好像比較便宜。',
] as const;

interface ChoiceRow {
  item: string;
  answer: string;
  /** 他唯一填得出來的那一欄。 */
  fillable?: boolean;
}

/** 他心裡那張比較表：三欄裡只有一欄他填得出來。 */
const COMPARE_ROWS: ChoiceRow[] = [
  { item: '我需要甚麼功能', answer: '型錄我看不懂' },
  { item: '我適合哪種等級', answer: '聽起來都差不多' },
  { item: '價錢差多少', answer: '這個我會算', fillable: true },
];

/**
 * 第 15 頁：客戶的第三個心理問題——哪個選擇適合我。前兩關都過了，他信你、
 * 也接受要戴，卻還是想再去別家看看。原因不是別家比較好，是他手上那張比較表
 * 只有價格那一欄填得出來，於是只能用價格決定。
 */
export function ChoiceConfidencePage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-choice-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-choice-title'), {
        y: 32,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.05')
      .from(scope.querySelector('.js-choice-lead'), {
        y: 16,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.24')
      .from(scope.querySelector('.js-choice-surface'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.1')
      .from(scope.querySelector('.js-choice-sheet-label'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.2');
  }, []);

  return (
    <SlideShell fullBleed className="choice" animate={animate}>
      <main className="choice__stage">
        <header className="choice__nav js-choice-nav">
          <BrandLogo className="choice__logo" />
        </header>

        <div className="choice__intro">
          <h1 className="choice__title js-choice-title">:哪個選擇適合我?</h1>
          <p className="choice__lead js-choice-lead">
            他已經信你，也接受要戴了。<br />剩最後一件事：為什麼是在你這裡買。
          </p>
        </div>

        <figure className="choice__surface js-choice-surface">
          <div className="choice__surface-body">
            <span className="choice__surface-label">他嘴上說</span>
            {SURFACE_QUOTES.map((quote) => (
              <blockquote key={quote} className="choice__surface-quote">{quote}</blockquote>
            ))}
          </div>
        </figure>

        {/*
          他不是在比店，是在找一個不會後悔的理由。可是判斷助聽器好壞的三欄裡，
          規格他看不懂、效果他聽不出差別——只剩價格填得出來，於是價格就成了
          他唯一的決策依據，也就成了他跑第二家、第三家的理由。
        */}
        <section className="choice__sheet" aria-label="客戶心裡那張比較表">
          <p className="choice__sheet-label js-choice-sheet-label">他手上那張比較表</p>

          <ul className="choice__rows">
            {COMPARE_ROWS.map((row, index) => (
              <li
                key={row.item}
                className={`choice__row fragment${row.fillable ? ' choice__row--fillable' : ''}`}
                data-fragment-index={index}
              >
                <span className="choice__row-item">{row.item}</span>
                <span className="choice__row-answer">{row.answer}</span>
              </li>
            ))}
          </ul>

          <div className="choice__verdict fragment" data-fragment-index={COMPARE_ROWS.length}>
            <p className="choice__verdict-line">
              三欄裡只有一欄他填得出來——所以他當然去比價，去多看幾家。
            </p>
            <p className="choice__verdict-turn">前兩欄，只有你替他填得出來。</p>
          </div>
        </section>

        <footer className="choice__close fragment" data-fragment-index={COMPARE_ROWS.length + 1}>
          <span className="choice__close-eyebrow">所以，別急著降價</span>
          <p className="choice__close-text">
            他要的不是更便宜，是一個不會後悔的理由。別家能報同一個價，但只有你手上有他的檢查結果，和他說過的生活。
          </p>
        </footer>
      </main>
    </SlideShell>
  );
}
