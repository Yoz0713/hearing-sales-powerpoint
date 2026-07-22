import { useCallback, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

type ReasonDecoration = 'circle' | 'underline' | 'bracket' | 'slash';

interface WallReason {
  text: string;
  x: string;
  y: string;
  rotate: string;
  size: string;
  decoration: ReasonDecoration;
}

interface ReasonZone {
  key: string;
  label: string;
  prompt: string;
  reasons: WallReason[];
}

const REASON_ZONES: ReasonZone[] = [
  {
    key: 'awareness',
    label: '病識感',
    prompt: '問題離自己還很遠',
    reasons: [
      { text: '我沒有那麼嚴重', x: '8%', y: '28%', rotate: '-2deg', size: '44px', decoration: 'underline' },
      { text: '現在還能忍', x: '50%', y: '51%', rotate: '2deg', size: '39px', decoration: 'circle' },
      { text: '是家人比較困擾', x: '12%', y: '72%', rotate: '-1deg', size: '36px', decoration: 'bracket' },
    ],
  },
  {
    key: 'identity',
    label: '身份焦慮',
    prompt: '害怕改變別人眼中的自己',
    reasons: [
      { text: '戴了就代表老了', x: '27%', y: '31%', rotate: '2deg', size: '44px', decoration: 'circle' },
      { text: '我怕以後會依賴', x: '45%', y: '66%', rotate: '-2deg', size: '39px', decoration: 'slash' },
    ],
  },
  {
    key: 'experience',
    label: '效果經驗',
    prompt: '過去的失望還留在心裡',
    reasons: [
      { text: '以前戴過，不好用', x: '8%', y: '31%', rotate: '1deg', size: '42px', decoration: 'slash' },
      { text: '真的會有效嗎？', x: '37%', y: '68%', rotate: '-2deg', size: '44px', decoration: 'circle' },
    ],
  },
  {
    key: 'decision',
    label: '決策風險',
    prompt: '不決定，看起來最安全',
    reasons: [
      { text: '我要先問家人', x: '24%', y: '25%', rotate: '-2deg', size: '38px', decoration: 'bracket' },
      { text: '價位到底差在哪？', x: '46%', y: '49%', rotate: '1deg', size: '36px', decoration: 'underline' },
      { text: '萬一選錯怎麼辦', x: '28%', y: '73%', rotate: '-1deg', size: '42px', decoration: 'circle' },
    ],
  },
];

/** D10 正式頁：把客戶不行動的十個原因，寫成四片互相牽動的心理塗鴉牆。 */
export function ResistanceReasonsPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-reasons-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-reasons-title'), {
        y: 34,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.05')
      .from(scope.querySelector('.js-reasons-lead'), {
        y: 16,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.24')
      .from(scope.querySelector('.js-reasons-wall'), {
        y: 24,
        scale: 0.985,
        opacity: 0,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.12')
      .from(scope.querySelectorAll('.js-reasons-line'), {
        strokeDashoffset: 1,
        opacity: 0,
        stagger: 0.08,
        duration: motion.duration.slow,
      }, '-=0.52');
  }, []);

  return (
    <SlideShell fullBleed className="resistance-wall" animate={animate}>
      <main className="resistance-wall__stage">
        <header className="resistance-wall__nav js-reasons-nav">
          <BrandLogo className="resistance-wall__logo" />

        </header>

        <div className="resistance-wall__intro">
          <h1 className="resistance-wall__title js-reasons-title">客戶為什麼不願意現在處理？</h1>
          <p className="resistance-wall__lead js-reasons-lead">
            不是藉口，而是還沒有被理解的顧慮。
          </p>
        </div>

        <div className="resistance-wall__canvas js-reasons-wall" aria-label="客戶不願意現在處理的十個常見原因">
          <svg className="resistance-wall__doodles" viewBox="0 0 1728 660" aria-hidden="true">
            <path className="js-reasons-line" pathLength="1" d="M 76 292 C 238 258, 370 305, 518 277 S 742 240, 851 304" />
            <path className="js-reasons-line" pathLength="1" d="M 1652 302 C 1462 262, 1338 306, 1188 282 S 990 251, 875 307" />
            <path className="js-reasons-line" pathLength="1" d="M 92 372 C 264 410, 398 360, 545 385 S 736 430, 852 352" />
            <path className="js-reasons-line" pathLength="1" d="M 1630 376 C 1460 416, 1312 368, 1182 392 S 1004 426, 876 352" />
          </svg>

          <div className="resistance-wall__zones">
            {REASON_ZONES.map((zone, zoneIndex) => (
              <article
                key={zone.key}
                className={`resistance-wall__zone resistance-wall__zone--${zone.key} fragment`}
                data-fragment-index={zoneIndex}
              >
                <header className="resistance-wall__zone-heading">
                  <h2>{zone.label}</h2>
                  <p>{zone.prompt}</p>
                </header>
                <ul className="resistance-wall__reasons">
                  {zone.reasons.map((reason) => (
                    <li
                      key={reason.text}
                      className={`resistance-wall__reason resistance-wall__reason--${reason.decoration}`}
                      style={{
                        '--reason-x': reason.x,
                        '--reason-y': reason.y,
                        '--reason-rotate': reason.rotate,
                        '--reason-size': reason.size,
                      } as CSSProperties}
                    >
                      {reason.text}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="resistance-wall__truth fragment" data-fragment-index={REASON_ZONES.length}>
            <span>沒有行動</span>
            <b>不等於</b>
            <strong>沒有需求</strong>
          </div>
        </div>
      </main>
    </SlideShell>
  );
}
