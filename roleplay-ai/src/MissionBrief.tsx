/**
 * 任務簡報內容。兩處共用：對話前的簡報畫面（`brief--page`）與對話中的任務面板（`brief--sheet`）。
 * 兩個 variant 的差別只在字級與間距，由 CSS 的 modifier class 控制，結構完全相同。
 */
import { MISSION } from './persona';

export function MissionBrief() {
  return (
    <>
      <p className="brief-eyebrow">
        <span className="brief-eyebrow__mark" aria-hidden="true" />
        任務簡報
      </p>

      <blockquote className="brief-quote">
        {MISSION.blockLine.split('\n').map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </blockquote>
      <p className="brief-lede">{MISSION.lede}</p>

      <dl className="brief-facts">
        {MISSION.facts.map((f) => (
          <div className="brief-fact" key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      {/* 真的是一條流程，所以用序列表達：前三步門市已經做完，第四步才是學員的事。 */}
      <ol className="brief-steps">
        {MISSION.steps.map((step, i) => {
          const done = i < MISSION.done;
          return (
            <li key={step} className={`brief-step${done ? ' is-done' : ' is-now'}`}>
              <span className="brief-step__tick" aria-hidden="true">{done ? '✓' : '▸'}</span>
              <span className="brief-step__label">{step}</span>
              {!done && <span className="brief-step__badge">換你</span>}
            </li>
          );
        })}
      </ol>

      <p className="brief-objective">{MISSION.objective}</p>

      <aside className="brief-hint">
        <p className="brief-hint__label">Tips</p>
        <p className="brief-hint__text">{MISSION.hint}</p>
      </aside>
    </>
  );
}
