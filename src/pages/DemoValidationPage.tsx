import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/** D23：輕度聽損的試聽，重點不在證明聽不到，而是感覺到更輕鬆。 */
export function DemoValidationPage() {
  // GSAP 僅負責頁首；四個試聽重點與收尾由 Reveal fragments 逐步揭示。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-demo-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-demo-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-demo-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling demo-validation" animate={animate}>
      <header className="demo-validation__heading">
        <p className="counseling-kicker js-demo-kicker">輕度聽損試聽</p>
        <h1 className="counseling-title js-demo-title">輕度聽損的試聽，要讓效果被感覺到</h1>
        <p className="demo-validation__lead js-demo-lead">
          不是證明他聽不到，而是讓他發現：戴上之後，聽得更輕鬆。
        </p>
      </header>

      <main className="demo-validation__bento" aria-label="輕度聽損的四個試聽重點">
        <article className="mild-trial mild-trial--volume fragment" data-fragment-index={0}>
          <div>
            <p className="mild-trial__eyebrow">先讓效果被感覺到</p>
            <h2>音量先調到 90% 以上</h2>
          </div>
          <div className="mild-volume__signal" aria-label="音量設定 90% 以上">
            <strong>90%+</strong>
            <span>先把效果開出來</span>
          </div>
          <p className="mild-trial__body">
            輕度聽損在日常常仍能聽到聲音；試聽一開始，要先讓客戶明確感覺有差異。
          </p>
        </article>

        <article className="mild-trial mild-trial--effort fragment" data-fragment-index={1}>
          <div>
            <p className="mild-trial__eyebrow">先肯定，再帶出差異</p>
            <h2>不是聽得到，而是聽得更輕鬆</h2>
          </div>
          <div className="mild-effort__contrast">
            <p><span>平常</span>安靜環境裡，也能和他人交談。</p>
            <p><span>戴上後</span>不用專心、認真，也能聽清楚別人的談話。</p>
          </div>
          <blockquote>「原本就聽得到，但現在不必那麼費力。」</blockquote>
        </article>

        <article className="mild-trial mild-trial--lifestyle fragment" data-fragment-index={2}>
          <p className="mild-trial__eyebrow">讓每天配戴有理由</p>
          <h2>藍芽與隱形程度</h2>
          <dl className="mild-lifestyle__list">
            <div>
              <dt>藍芽</dt>
              <dd>通話、影音更方便</dd>
            </div>
            <div>
              <dt>隱形</dt>
              <dd>降低外觀顧慮</dd>
            </div>
          </dl>
        </article>

        <article className="mild-trial mild-trial--wrs fragment" data-fragment-index={3}>
          <div>
            <p className="mild-trial__eyebrow">回到聽力報告</p>
            <h2>WRS 是及早處理的理由</h2>
          </div>
          <div className="mild-wrs__points">
            <p><span>WRS 高低</span>對應現在的語音理解狀態。</p>
            <p><span>年紀輕就已有聽損</span>越早處理，越早維持聽覺刺激與溝通能力。</p>
          </div>
        </article>
      </main>

      <footer className="demo-validation__action fragment" data-fragment-index={4}>
        <span>對輕度客戶來說</span>
        <strong>不必專心、也能聽清楚，才是他可能願意做出改變的理由。</strong>
      </footer>
    </SlideShell>
  );
}
