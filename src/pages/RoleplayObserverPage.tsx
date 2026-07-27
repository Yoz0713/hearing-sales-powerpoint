import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useSlideReset } from '../hooks/useSlideReset';
import { useObserverMarks, type ObserverMark } from '../context/ObserverMarksContext';
import { motion } from '../tokens/motion';

const MARK_LABEL: Record<ObserverMark, string> = {
  keep: '這一段最有幫助',
  adjust: '下一輪想調整這裡',
};

/**
 * 四段軌跡依對話實際發生的先後排列：先聽、再問、產品出現的時機、最後推進。
 * 順序本身就是觀察重點，因此不另外編號。
 * 由 P45（ActionCommitmentPage）匯入取用段名，回指學員標成「下一輪想調整」的那一段。
 */
export const OBSERVER_STAGES = [
  {
    id: 'listen',
    moment: '對話前段',
    name: '傾聽',
    asks: ['你說得比客戶多嗎？', '是先理解再回答，還是聽到關鍵字就開始講？'],
  },
  {
    id: 'explore',
    moment: '對話中段',
    name: '探索',
    asks: ['有沒有追問到具體情境？', '有沒有找到真正的顧慮，還是停在第一句話？'],
  },
  {
    id: 'timing',
    moment: '產品出現之前',
    name: '時機',
    asks: ['產品有沒有出現得太早？'],
    note: '這一項最常中槍。',
  },
  {
    id: 'advance',
    moment: '對話收尾',
    name: '推進',
    asks: ['有沒有協助客戶找到下一步？'],
  },
] as const;

/**
 * D30：作答／角色扮演之後的回饋頁。
 * 四段可觀察的行為排成一條連續軌跡，點一下依序標記「最有幫助 → 下一輪調整 → 取消」；
 * 兩種標記各自全頁只能存在一個，用結構強制「只講一個做得好、一個要調整」。
 * 不計分、不排名，未標記的段落全部維持中性；顏色只出現在被選中的那兩段。
 * 軌跡一次顯示（GSAP），終點問題交給 Reveal fragment，在回饋結束後才落下。
 *
 * 標記狀態放在 ObserverMarksContext：其中的「下一輪想調整」會被 P45 回指，
 * 讓學員把這一段寫成具體的一句話。
 */
export function RoleplayObserverPage() {
  const marks = useObserverMarks();

  // R 鍵或離頁再進入：清空兩個標記，回到全中性的軌跡。
  // 只在「進入」本頁時觸發，因此往後翻到 P45 的路上標記會保留。
  const { clear } = marks;
  useSlideReset(useCallback(() => clear(), [clear]));

  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-observer-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-observer-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-observer-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-observer-rule'), {
        y: 18,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.35')
      .from(scope.querySelector('.js-observer-rail'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.2')
      .from(scope.querySelectorAll('.js-observer-stage'), {
        y: 26,
        opacity: 0,
        duration: motion.duration.base,
        stagger: 0.1,
      }, '-=0.55')
      .from(scope.querySelector('.js-observer-drop'), {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling roleplay-observer" animate={animate}>
      <header className="roleplay-observer__head">
        <div className="roleplay-observer__intro">
          <p className="counseling-kicker js-observer-kicker">作答後講評</p>
          <h1 className="counseling-title js-observer-title">
            觀察的不是話術，是客戶有沒有被理解
          </h1>
          <p className="roleplay-observer__lead js-observer-lead">
            不評分個性，只看剛才那段對話裡，四個真的發生過的行為。
          </p>
        </div>

        <aside className="observer-rule js-observer-rule" aria-label="回饋原則">
          <p className="observer-rule__label">回饋原則</p>
          <ul className="observer-rule__legend">
            <li className="observer-rule__item observer-rule__item--keep">
              只挑一段最有幫助的
            </li>
            <li className="observer-rule__item observer-rule__item--adjust">
              只挑一段下一輪要調整的
            </li>
          </ul>
          <p className="observer-rule__note">講太多，一個都改不掉。</p>
          {marks.adjust && (
            <p className="observer-rule__carry">這一段會帶到最後一頁。</p>
          )}
        </aside>
      </header>

      <main className="observer-track" aria-label="四段可觀察的行為">
        <span className="observer-track__rail js-observer-rail" aria-hidden="true" />
        <span className="observer-track__terminus" aria-hidden="true" />
        <span className="observer-track__drop js-observer-drop" aria-hidden="true" />

        {OBSERVER_STAGES.map((stage) => {
          const mark: ObserverMark | null =
            marks.keep === stage.id ? 'keep' : marks.adjust === stage.id ? 'adjust' : null;
          return (
            <button
              key={stage.id}
              type="button"
              className={`observer-stage js-observer-stage${mark ? ` is-${mark}` : ''}`}
              onClick={() => marks.toggle(stage.id)}
            >
              <span className="observer-stage__moment">{stage.moment}</span>
              <span className="observer-stage__node" aria-hidden="true" />
              <span className="observer-stage__name">{stage.name}</span>
              <span className="observer-stage__asks">
                {stage.asks.map((ask) => (
                  <span key={ask} className="observer-stage__ask">{ask}</span>
                ))}
                {'note' in stage && <span className="observer-stage__note">{stage.note}</span>}
              </span>
              <span className="observer-stage__mark">
                {mark ? MARK_LABEL[mark] : '點一下標記'}
              </span>
            </button>
          );
        })}
      </main>

      <footer className="observer-end">
        <p className="observer-end__question fragment" data-fragment-index="0">
          客戶有沒有感到被理解？
        </p>
        <p className="observer-end__note fragment" data-fragment-index="1">
          有人講得結結巴巴，但客戶願意一直講下去——那就是好的選配。
        </p>
      </footer>
    </SlideShell>
  );
}
