import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * D27：把「還不嚴重」與「會不會依賴」並置。
 * 兩欄等高等重，各三層——客戶說 → 真正在意 → 這樣回應——
 * 讓學員先辨識背後的病識感與風險認知，再給資訊回應。
 * 與 D28 共用 objection-duo 版型與 fragment 手法。
 */
const OBJECTIONS = [
  {
    key: 'severity',
    type: '嚴重程度',
    tag: '「還不嚴重」',
    quote: '「還沒那麼嚴重，等真的不行再說。」',
    concern: '病識感還沒到位，把困擾當成「還能忍」，而不是「該處理」。',
    respond: '一起分出可接受與已造成困擾，約好觀察期限，以及哪些變化出現時要回來重看。',
  },
  {
    key: 'dependency',
    type: '依賴風險',
    tag: '「會不會依賴」',
    quote: '「一直戴，會不會反而更依賴？」',
    concern: '擔心戴了助聽器，會讓自己的聽力變得更差。',
    respond: '聽得清楚不等於退化；用漸進適應與後續微調，避免一開始聲音太刺激。',
  },
] as const;

export function ObjectionWaitDependencyPage() {
  // GSAP 只負責頁首與底線；兩則異議與收尾交給 Reveal fragments。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-wait-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-wait-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-wait-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-wait-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell className="counseling objection-duo objection-wait" animate={animate}>
      <header className="objection-duo__heading">
        <p className="counseling-kicker js-wait-kicker">異議處理</p>
        <h1 className="counseling-title js-wait-title">「還不嚴重」與「會不會依賴」</h1>
        <p className="objection-duo__lead js-wait-lead">
          先聽出擔心的是什麼，再決定要補上哪一種資訊。
        </p>
        <span className="objection-duo__rule js-wait-rule" aria-hidden="true" />
      </header>

      <main className="objection-duo__pair" aria-label="還不嚴重與會不會依賴兩則異議">
        <div className="duo-cols">
          {OBJECTIONS.map((item, index) => (
            <article
              key={item.key}
              className={`duo-col ${index === 1 ? 'duo-col--right' : ''} fragment`}
              data-fragment-index={index}
            >
              <div className="duo-col__head">
                <p className="duo-col__type">{item.type}</p>
                <p className="duo-col__tag">{item.tag}</p>
              </div>
              <div className="duo-layer duo-layer--quote">
                <p className="duo-layer__role duo-layer__role--quote">客戶說</p>
                <p className="duo-quote">{item.quote}</p>
              </div>
              <div className="duo-layer duo-layer--concern">
                <p className="duo-layer__role duo-layer__role--concern">真正在意</p>
                <p className="duo-text">{item.concern}</p>
              </div>
              <div className="duo-layer duo-layer--respond">
                <p className="duo-layer__role duo-layer__role--respond">這樣回應</p>
                <p className="duo-text">{item.respond}</p>
              </div>
            </article>
          ))}
        </div>

        <footer className="duo-close fragment" data-fragment-index="2">
          <span className="duo-close__label">可以延後，但別留一句模糊的「再看看」</span>
          <strong>說好要看什麼、什麼時候回來。</strong>
        </footer>
      </main>
    </SlideShell>
  );
}
