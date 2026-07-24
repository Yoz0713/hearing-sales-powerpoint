import { useCallback, useEffect, useRef, useState } from 'react';
import {
  OPENING_LINE,
  buildReviewPrompt,
  buildSystemPrompt,
  formatTranscript,
} from './persona';
import {
  CONVERSE_SCHEMA,
  INITIAL_GATE_STATE,
  REVIEW_SCHEMA,
  mergeVerdict,
  parseConverse,
  parseReview,
  stageOf,
  type GateState,
  type ReviewResult,
  type Stage,
} from './gate';
import { converse, requestReview, type ChatMsg } from './api';
import { MissionBrief } from './MissionBrief';
import { useViewportFit } from './useViewportFit';

const MAX_INPUT = 300;
const MAX_TURNS = 24; // 使用者發言上限，超過就收尾

type Screen = 'story' | 'chat' | 'report';

/** 對話畫面 header 上，陳先生當下的狀態標籤。 */
const STATE_LABEL: Record<Stage, string> = {
  closed: '有點防備',
  open: '願意多說了',
  ready: '心防放下了',
  accepted: '答應你了',
};

/** 四個里程碑，依序點亮。 */
const MILESTONES = ['問到生活情境', '問到真正顧慮', '回應他的擔心', '成功開口邀約'] as const;

function hitCount(gate: GateState): boolean[] {
  return [gate.lifeContext, gate.realConcern, gate.addressedConcern, gate.accepted];
}

export function App() {
  const [screen, setScreen] = useState<Screen>('story');
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'model', text: OPENING_LINE }]);
  const [gate, setGate] = useState<GateState>(INITIAL_GATE_STATE);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  const stage = stageOf(gate);
  const hits = hitCount(gate);
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const reachedLimit = userTurns >= MAX_TURNS;
  // 陳先生答應邀約＝這一輪走完了；用完發言次數則是時間到收尾。
  const finished = stage === 'accepted' || reachedLimit;

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    stickToBottom();
  }, [messages, busy, stickToBottom]);

  // 鍵盤開合會改變可見高度；跟著把最新幾則訊息拉回視野內（用 auto，不要跟鍵盤動畫打架）。
  useViewportFit(screen === 'chat', () => stickToBottom('auto'));

  // 任務面板：Esc 關閉。
  useEffect(() => {
    if (!briefOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBriefOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [briefOpen]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || finished) return;

    const history: ChatMsg[] = [...messages, { role: 'user', text }];
    setMessages(history);
    setInput('');
    setBusy(true);
    setError(null);

    try {
      // 單次呼叫：同時判定這一則命中的準則 + 產生陳先生的回覆。
      // 系統提示帶入「目前累積關卡狀態」，模型據此決定這一則要演哪個階段。
      const { reply, verdict } = parseConverse(
        await converse(buildSystemPrompt(gate), CONVERSE_SCHEMA, history),
      );
      setGate(mergeVerdict(gate, verdict));
      setMessages([...history, { role: 'model', text: reply || '……（陳先生沉默了一下）' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '連線出了點問題，請再試一次。');
    } finally {
      setBusy(false);
    }
  }, [input, busy, finished, messages, gate]);

  const openReview = useCallback(async () => {
    if (reviewing) return;
    setReviewing(true);
    setError(null);
    try {
      const raw = await requestReview(
        buildReviewPrompt(gate, userTurns),
        REVIEW_SCHEMA,
        formatTranscript(messages),
      );
      setReview(parseReview(raw));
      setScreen('report');
    } catch {
      setError('回饋還沒產出來，請再按一次。');
    } finally {
      setReviewing(false);
    }
  }, [reviewing, gate, userTurns, messages]);

  const restart = () => {
    setMessages([{ role: 'model', text: OPENING_LINE }]);
    setGate(INITIAL_GATE_STATE);
    setInput('');
    setError(null);
    setReview(null);
    setBriefOpen(false);
    setScreen('story');
  };

  if (screen === 'story') {
    return (
      <main className="screen screen--story brief brief--page">
        <div className="brief-scroll">
          <MissionBrief />
        </div>
        <footer className="brief-foot">
          <button className="btn btn--go" onClick={() => setScreen('chat')}>
            進入門市
          </button>
        </footer>
      </main>
    );
  }

  if (screen === 'report' && review) {
    return (
      <main className="screen screen--report">
        <div className="report-scroll">
          <p className="eyebrow">課後回饋</p>
          <h1 className="report-title">
            {gate.accepted ? '你讓陳先生點頭了' : '這一輪還沒走完'}
          </h1>

          <ol className="milestones">
            {MILESTONES.map((label, i) => (
              <li key={label} className={`milestone${hits[i] ? ' is-hit' : ''}`}>
                <span className="milestone__dot">{hits[i] ? '✓' : i + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          {review.summary && <p className="report-summary">{review.summary}</p>}

          {review.didWell.length > 0 && (
            <section className="report-block report-block--good">
              <h2>你做對的地方</h2>
              {review.didWell.map((item, i) => (
                <div className="report-item" key={i}>
                  <p className="report-item__point">{item.point}</p>
                  <p className="report-item__detail">{item.detail}</p>
                </div>
              ))}
            </section>
          )}

          {review.toImprove.length > 0 && (
            <section className="report-block report-block--work">
              <h2>下次可以更好</h2>
              {review.toImprove.map((item, i) => (
                <div className="report-item" key={i}>
                  <p className="report-item__point">{item.point}</p>
                  <p className="report-item__detail">{item.detail}</p>
                </div>
              ))}
            </section>
          )}

          {review.keyMoment && (
            <section className="report-block report-block--key">
              <h2>關鍵訊號</h2>
              <p className="report-item__detail">{review.keyMoment}</p>
            </section>
          )}
        </div>

        <footer className="report-foot">
          <button className="btn btn--primary" onClick={restart}>再練一次</button>
        </footer>
      </main>
    );
  }

  const hitTotal = hits.filter(Boolean).length;

  return (
    <main className="screen screen--chat">
      <header className="chat-head">
        <div className="chat-head__who">
          <span className="chat-head__name">陳先生</span>
          <span className={`chat-head__state${stage === 'closed' ? '' : ' is-open'}`}>
            {STATE_LABEL[stage]}
          </span>
        </div>
        {/* 進度條本身就是開關：隨時點開任務簡報。 */}
        <button
          className="mission-toggle"
          onClick={() => setBriefOpen(true)}
          aria-haspopup="dialog"
          aria-label={`打開任務面板，目前進度 ${hitTotal} / ${MILESTONES.length}`}
        >
          <span className="mission-toggle__bars" aria-hidden="true">
            {hits.map((hit, i) => (
              <span key={i} className={hit ? 'is-hit' : ''} />
            ))}
          </span>
          任務
        </button>
      </header>

      <div className="chat-log" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble bubble--${m.role}`}>
            {m.text}
          </div>
        ))}
        {busy && (
          <div className="bubble bubble--model bubble--typing" aria-label="陳先生正在回應">
            <span /><span /><span />
          </div>
        )}
        {/* 教練提示：一次只出現一則，優先講最急的那件事。 */}
        {!busy && (() => {
          if (gate.lastInviteDeclined)
            return <p className="coach-hint">他還沒準備好。先把他真正的擔心接住，再邀請他。</p>;
          if (stage === 'closed' && !gate.lastNotPushy)
            return <p className="coach-hint">先別急著介紹產品，試著多問問他的生活與感受。</p>;
          if (stage === 'open')
            return (
              <p className="coach-hint coach-hint--good">
                陳先生說出心裡的話了 —— 先好好回應他的擔心，別跳回產品和價格。
              </p>
            );
          if (stage === 'ready')
            return (
              <p className="coach-hint coach-hint--good">
                他的心防放下了，但他不會自己開口。換你主動提出下一步。
              </p>
            );
          return null;
        })()}
        {error && <p className="chat-error">{error}</p>}
      </div>

      <footer className="chat-input">
        {finished ? (
          <div className="chat-done">
            <p>
              {gate.accepted
                ? '陳先生答應你了！這一輪走完了。'
                : stage === 'ready'
                  ? '時間到了。他其實已經願意了，可惜你沒有開口邀請他。'
                  : '這一輪先到這裡。換個問法再試一次。'}
            </p>
            <div className="chat-done__actions">
              <button className="btn btn--primary" onClick={() => void openReview()} disabled={reviewing}>
                {reviewing ? '講師正在看逐字稿…' : '看講師回饋'}
              </button>
              <button className="btn btn--ghost" onClick={restart}>再練一次</button>
            </div>
          </div>
        ) : (
          <>
            <textarea
              value={input}
              maxLength={MAX_INPUT}
              placeholder={stage === 'ready' ? '換你開口邀請他…' : '用一個開放式問題問問看…'}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              disabled={busy}
            />
            <button className="btn btn--send" onClick={() => void send()} disabled={busy || !input.trim()}>
              送出
            </button>
          </>
        )}
      </footer>

      {briefOpen && (
        <div className="sheet-backdrop" onClick={() => setBriefOpen(false)}>
          <section
            className="sheet brief brief--sheet"
            role="dialog"
            aria-modal="true"
            aria-label="任務面板"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__scroll">
              <MissionBrief />
              <ol className="milestones milestones--panel">
                {MILESTONES.map((label, i) => (
                  <li key={label} className={`milestone${hits[i] ? ' is-hit' : ''}`}>
                    <span className="milestone__dot">{hits[i] ? '✓' : i + 1}</span>
                    {label}
                  </li>
                ))}
              </ol>
            </div>
            <footer className="sheet__foot">
              <button className="btn btn--go" onClick={() => setBriefOpen(false)}>
                回到對話
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
