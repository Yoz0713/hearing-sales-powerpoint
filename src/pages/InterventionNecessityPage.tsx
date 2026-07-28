import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/** 客戶用來延後決定的話，語氣要像門市現場聽到的，不是教科書。 */
const SURFACE_QUOTES = [
  '等真的聽不到再說啦。',
  '我這年紀，大家都嘛這樣。',
] as const;

/** 他心裡秤的左盤：今天就要付出的，樣樣具體、樣樣算得出來。 */
const COST_NOW = [
  '一筆不小的錢',
  '承認自己老了',
  '從此離不開它',
] as const;

/** 右盤：早就在發生，但被他歸成「以後的事」。 */
const COST_LATER = [
  '聽錯話，愈來愈少開口',
  '不想去人多的地方',
  '家人開始替他回答',
] as const;

/**
 * 第 14 頁：接在「我可以信任你嗎」之後，處理客戶的第二個心理問題——
 * 我真的需要現在處理嗎。重點不是衛教後果，是讓聽力師看懂他的內心戲：
 * 他心裡在秤兩邊，一邊清清楚楚是今天的帳，一邊模模糊糊推給以後，
 * 所以「再等等」永遠划算。把右邊那一盤變清楚，才是說服的起點。
 */
export function InterventionNecessityPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-necessity-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-necessity-title'), {
        y: 32,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.05')
      .from(scope.querySelector('.js-necessity-lead'), {
        y: 16,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.24')
      .from(scope.querySelector('.js-necessity-surface'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.1')
      .from(scope.querySelector('.js-necessity-scales-label'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.2');
  }, []);

  return (
    <SlideShell fullBleed className="necessity" animate={animate}>
      <main className="necessity__stage">
        <header className="necessity__nav js-necessity-nav">
          <BrandLogo className="necessity__logo" />
        </header>

        <div className="necessity__intro">
          <h1 className="necessity__title js-necessity-title">:我真的需要現在處理嗎?</h1>
          <p className="necessity__lead js-necessity-lead">
            他不是在算需不需要，<br />是在算自己是不是那種人。
          </p>
        </div>

        <figure className="necessity__surface js-necessity-surface">
          <div className="necessity__surface-body">
            <span className="necessity__surface-label">他嘴上說</span>
            {SURFACE_QUOTES.map((quote) => (
              <blockquote key={quote} className="necessity__surface-quote">{quote}</blockquote>
            ))}
          </div>
        </figure>

        {/*
          內心戲＝一場他自己在做的比較。左盤是今天的帳：金額、面子、往後的日子，
          筆筆清楚；右盤其實正在發生，卻被他推給「以後」，所以看起來是糊的。
          最後一步把右盤調清楚——那正是聽力師要做的事。
        */}
        <section className="necessity__scales" aria-label="客戶心裡在秤的兩件事">
          <p className="necessity__scales-label js-necessity-scales-label">他心裡真正在秤的</p>

          <div className="necessity__pans">
            <article className="necessity__pan necessity__pan--now fragment" data-fragment-index={0}>
              <h2 className="necessity__pan-title">今天就要付</h2>
              <ul className="necessity__pan-list">
                {COST_NOW.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>

            <span className="necessity__axis fragment" data-fragment-index={2} aria-hidden="true">
              <i />
              <b>所以，再等等</b>
              <i />
            </span>

            <article className="necessity__pan necessity__pan--later fragment" data-fragment-index={1}>
              <h2 className="necessity__pan-title">以後才會痛</h2>
              <ul className="necessity__pan-list">
                {COST_LATER.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="necessity__pan-note">早就在發生了，只是他還沒算進來。</p>
            </article>
          </div>

          <p className="necessity__clarify fragment" data-fragment-index={3}>
            你的工作，是把右邊這一盤變清楚。
          </p>
        </section>

        <footer className="necessity__close fragment" data-fragment-index={4}>
          <span className="necessity__close-eyebrow">所以，一步一步來</span>
          <p className="necessity__close-text">
            他缺的不是資訊，是一個現在就要處理的理由。先讓他看懂報告，再讓他親耳比較，最後才談現在做和以後做的差別。
          </p>
        </footer>
      </main>
    </SlideShell>
  );
}
