import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * P39：隨堂測驗操作說明。
 *
 * 夾在 QR 頁（掃碼）與復盤頁（講評）中間，只做一件事：
 * 讓沒用過的人在抬頭看投影幕的三秒內，知道手機上那幾個地方按下去會怎樣。
 *
 * 版面是一張標註圖，不是條列說明：畫面本身放大擺中間，說明用髮絲引線拉到右邊。
 * 手機內的 UI 全部照 roleplay-ai/src/styles.css 的真實樣式重畫（含森林綠 header、
 * 里程碑四小格、教練提示膠囊），學員在手機上看到的就是投影幕上這一個。
 *
 * 刻意不畫的東西：header 右側的「剩 N 則」倒數。
 * 那個護欄平常不會出現，先講只會讓人為了省回合不敢好好問，跟練習要教的事相反。
 */

/** 引線：手機右緣的錨點 → 走一段直角 → 右側說明卡左緣。座標系＝舞台 1760×740。 */
const LEADERS = [
  { id: 'mission', anchor: [750, 92], points: '750,92 790,92 790,80 900,80' },
  { id: 'hint', anchor: [750, 575], points: '750,575 815,575 815,273 900,273' },
  { id: 'bail', anchor: [750, 633], points: '750,633 840,633 840,466 900,466' },
  { id: 'input', anchor: [750, 692], points: '750,692 865,692 865,659 900,659' },
] as const;

export function RoleplayHowToPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-howto-kicker'), {
        x: -24,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-howto-title'), {
        y: 18,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.26')
      .from(scope.querySelector('.js-howto-lead'), {
        y: 12,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.3')
      .from(scope.querySelector('.js-howto-mini'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.28')
      .from(scope.querySelector('.js-howto-phone'), {
        y: 26,
        opacity: 0,
        duration: motion.duration.slow,
      }, '-=0.4');
  }, []);

  return (
    <SlideShell className="counseling roleplay-howto" animate={animate}>
      <header className="howto__head">
        <p className="counseling-kicker js-howto-kicker">操作說明</p>
        <h1 className="counseling-title js-howto-title">掃完碼，畫面就長這樣</h1>
        <p className="howto__lead js-howto-lead">
          跟平常傳訊息一樣打字就好。開始之前，先認得畫面上這四個地方。
        </p>
        <span className="howto__rule" aria-hidden="true" />
      </header>

      <div className="howto__stage">
        {/* 第一頁：任務簡報。畫成縮圖就好，它只需要被認出來。 */}
        <figure className="howto-mini js-howto-mini">
          <figcaption className="howto-cap">
            <span className="howto-cap__step">第一頁</span>
            <span className="howto-cap__name">任務簡報</span>
          </figcaption>

          <div className="mini" aria-label="任務簡報畫面示意">
            <div className="mini__screen">
              <div className="mini__body">
                <p className="mini__quote"><span>還好啦，</span><span>沒那麼嚴重</span></p>
                <p className="mini__lede">這句話的後面，藏著他不想承認的理由。</p>
                <dl className="mini__facts">
                  <div><dt>對象</dt><dd>陳先生・65 歲・退休老師</dd></div>
                  <div><dt>陪同</dt><dd>太太。是她硬把他帶來的</dd></div>
                  <div><dt>態度</dt><dd>覺得沒那麼嚴重，勉強才來</dd></div>
                </dl>
                <p className="mini__tip">
                  <span>Tips</span>
                  提供方案之前，先挖掘他真正的需求，再化解他的排斥原因。
                </p>
              </div>
              <div className="mini__foot"><span className="mini__go">進入門市</span></div>
            </div>
          </div>

          <p className="howto-mini__note">
            讀完背景，按最下面的<strong>「進入門市」</strong>。
          </p>
        </figure>

        <span className="howto-arrow" aria-hidden="true" />

        {/* 第二頁：對話。這一頁是主角，所有標註都掛在它身上。 */}
        <figure className="howto-phone js-howto-phone">
          <figcaption className="howto-cap">
            <span className="howto-cap__step">第二頁</span>
            <span className="howto-cap__name">跟陳先生對話</span>
          </figcaption>

          <div className="phone" aria-label="對話畫面示意">
            <div className="phone__screen">
              <div className="ui-head">
                <div className="ui-head__who">
                  <span className="ui-head__name">陳先生</span>
                  <span className="ui-head__state">有點防備</span>
                </div>
                <span className="ui-toggle">
                  <span className="ui-bars" aria-hidden="true">
                    <span className="is-hit" /><span /><span /><span />
                  </span>
                  任務
                </span>
              </div>

              <div className="ui-log">
                <p className="ui-bubble ui-bubble--model">
                  （有點防備）欸…我就是被我太太拉來看看的啦，你們這個…好像都很貴齁？
                </p>
                <p className="ui-bubble ui-bubble--user">
                  陳先生，您平常在家看電視，音量大概開到多少？
                </p>
                <p className="ui-bubble ui-bubble--model">
                  就…比我太太習慣的大聲一點啦，還好。
                </p>
                <p className="ui-bubble ui-bubble--user">
                  那出去跟朋友吃飯的時候呢？
                </p>
                <p className="ui-bubble ui-bubble--model">
                  就…人多的時候啦。上次同事聚餐，我幾乎都插不上話。
                </p>
                <p className="ui-hint">他剛剛透露了一點什麼。順著那句話再問下去。</p>
              </div>

              <p className="ui-bail">先到這裡，看回饋</p>

              <div className="ui-input">
                <span className="ui-input__field">用一個開放式問題問問看…</span>
                <span className="ui-input__send">送出</span>
              </div>
            </div>
          </div>
        </figure>

        {LEADERS.map((leader, index) => (
          <div
            key={leader.id}
            className="howto-leader fragment"
            data-fragment-index={index}
            aria-hidden="true"
          >
            <svg width="1760" height="740" viewBox="0 0 1760 740">
              <polyline points={leader.points} />
              <circle cx={leader.anchor[0]} cy={leader.anchor[1]} r="6" />
            </svg>
          </div>
        ))}

        <div className="howto-notes">
          <article className="note fragment" data-fragment-index={0}>
            <div className="note__plate note__plate--dark">
              <span className="ui-toggle ui-toggle--specimen">
                <span className="ui-bars" aria-hidden="true">
                  <span className="is-hit" /><span className="is-hit" /><span /><span />
                </span>
                任務
              </span>
            </div>
            <div className="note__copy">
              <p className="note__where">右上角</p>
              <p className="note__text">
                點開來看陳先生的完整背景和四個任務進度，四小格亮起來就是過一關。
                看完按<strong>「回到對話」</strong>回來。
              </p>
            </div>
          </article>

          <article className="note fragment" data-fragment-index={1}>
            <div className="note__plate">
              <span className="ui-hint ui-hint--specimen">先別急著介紹產品，多問問他的生活。</span>
            </div>
            <div className="note__copy">
              <p className="note__where">對話中間</p>
              <p className="note__text">
                卡住的時候，中間會浮出一行小字告訴你方向。看到就順著它換個問法。
              </p>
            </div>
          </article>

          <article className="note fragment" data-fragment-index={2}>
            <div className="note__plate">
              <span className="ui-bail ui-bail--specimen">先到這裡，看回饋</span>
            </div>
            <div className="note__copy">
              <p className="note__where">輸入框上方</p>
              <p className="note__text">
                真的談不下去，按這裡就能收尾。它會再問你一次，確定了才直接跳到講師點評。
              </p>
            </div>
          </article>

          <article className="note fragment" data-fragment-index={3}>
            <div className="note__plate">
              <span className="ui-input ui-input--specimen">
                <span className="ui-input__field">用一個開放式問題問問看…</span>
                <span className="ui-input__send">送出</span>
              </span>
            </div>
            <div className="note__copy">
              <p className="note__where">畫面最下面</p>
              <p className="note__text">
                像平常講話那樣打字，按<strong>「送出」</strong>他就會回你。
              </p>
            </div>
          </article>
        </div>
      </div>
    </SlideShell>
  );
}
