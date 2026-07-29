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
import { createMetrics, recordReply, recordSend, type Metrics } from './metrics';
import { calculateRating } from './rating';
import { MissionBrief } from './MissionBrief';
import { Transcript } from './Transcript';
import { useViewportFit } from './useViewportFit';

const MAX_INPUT = 300;
// 學員發言則數的護欄。這不是計時 —— 這場對話沒有任何時間限制。
// 加了「先到這裡，看回饋」之後，這條線幾乎不會被觸發，它只負責擋住無限刷 API 的情況。
const MAX_TURNS = 18;
/** 剩幾則開始在 header 顯示倒數。 */
const WARN_TURNS = 5;

type Screen = 'story' | 'chat' | 'report';

/** 對話畫面 header 上，陳先生當下的狀態標籤。 */
const STATE_LABEL: Record<Stage, string> = {
  closed: '有點防備',
  open: '願意多說了',
  ready: '心防放下了',
  accepted: '答應你了',
};

/**
 * 收尾確認裡，依陳先生當下的階段告訴學員「你正要放棄什麼」。
 * 這是他離開前最後一次教學，所以不寫成通用的「確定要離開嗎」——
 * 語意對齊 persona.ts 的 buildReviewPrompt，講的是同一件事。
 * accepted 用不到（那時 finished 為真，收尾鍵根本不顯示），留空補齊型別。
 */
const BAIL_NOTE: Record<Stage, string> = {
  closed: '他還在防備，真正不想戴的原因還沒說出口。多問幾個關於他生活的問題，他可能就鬆口了。',
  open: '他剛剛把最難開口的話說出來了，而你還沒接住那份難堪。這時候走，他會覺得說了也是白說。',
  ready: '他的心防已經放下了，只差你開口邀他。現在走，這一輪會停在最可惜的地方。',
  accepted: '',
};

/** 四個里程碑，依序點亮。 */
const MILESTONES = ['問到生活情境', '讓他說出真正顧慮', '回應他的擔心', '成功開口邀約'] as const;

function hitCount(gate: GateState): boolean[] {
  return [
    gate.lifeContext,
    gate.identityConcernDisclosed,
    gate.identityConcernAddressed,
    gate.accepted,
  ];
}

export function App() {
  const [screen, setScreen] = useState<Screen>('story');
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'model', text: OPENING_LINE }]);
  const [gate, setGate] = useState<GateState>(INITIAL_GATE_STATE);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [bailOpen, setBailOpen] = useState(false);
  // 時間與次數統計。與 gate 分開存，理由見 metrics.ts 的檔頭。
  const [metrics, setMetrics] = useState<Metrics>(() => createMetrics(Date.now()));

  const stage = stageOf(gate);
  const hits = hitCount(gate);
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const reachedLimit = userTurns >= MAX_TURNS;
  // 陳先生答應邀約＝這一輪走完了；講滿則數則是撞到護欄收尾。
  // 學員自己按「先到這裡，看回饋」是第三種收尾，走 openReview() 直接進報告頁，不經過這裡。
  const finished = stage === 'accepted' || reachedLimit;
  const turnsLeft = MAX_TURNS - userTurns;
  const showTurnsLeft = !finished && turnsLeft <= WARN_TURNS;

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

  // 疊在對話上的兩層（任務面板、收尾確認）：Esc 一律關掉，退回對話。
  useEffect(() => {
    if (!briefOpen && !bailOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setBriefOpen(false);
      setBailOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [briefOpen, bailOpen]);

  // 確認框一開，焦點就落在安全選項上：鍵盤直接 Enter 是「回去繼續談」，不是結束。
  const bailCancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (bailOpen) bailCancelRef.current?.focus();
  }, [bailOpen]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || finished) return;

    const history: ChatMsg[] = [...messages, { role: 'user', text }];
    setMessages(history);
    setInput('');
    setBusy(true);
    setError(null);
    // 思考時間在送出當下就結算：訊息已經進對話了，後面呼叫失敗也不該讓這一回合憑空消失。
    const sentAt = Date.now();
    setMetrics((m) => recordSend(m, sentAt));

    try {
      // 單次呼叫：同時判定這一則命中的準則 + 產生陳先生的回覆。
      // 系統提示帶入「目前累積關卡狀態」，模型據此決定這一則要演哪個階段。
      const { reply, verdict } = parseConverse(
        await converse(buildSystemPrompt(gate), CONVERSE_SCHEMA, history),
      );
      // 里程碑要記在「學員這一則」上，它在 history 的最後一格。
      setGate(mergeVerdict(gate, verdict, history.length - 1));
      setMetrics((m) => recordReply(m, Date.now(), verdict));
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
    setReviewError(null);
    try {
      const raw = await requestReview(
        buildReviewPrompt(gate, userTurns),
        REVIEW_SCHEMA,
        formatTranscript(messages),
      );
      setReview(parseReview(raw));
    } catch (err) {
      // 原本這裡整個吞掉，畫面只說「沒有載入」，連是額度不夠還是連線壞掉都看不出來。
      setReview(null);
      setReviewError(err instanceof Error ? err.message : '未知的錯誤');
    } finally {
      setReviewing(false);
      // 評等與數據是本機算的，講師點評抓不到也要看得到；報告頁裡再給重試。
      setScreen('report');
    }
  }, [reviewing, gate, userTurns, messages]);

  const restart = () => {
    setMessages([{ role: 'model', text: OPENING_LINE }]);
    setGate(INITIAL_GATE_STATE);
    setMetrics(createMetrics(Date.now()));
    setInput('');
    setError(null);
    setReview(null);
    setReviewError(null);
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
          <button
            className="btn btn--go"
            onClick={() => {
              // 思考時間從進門市那一刻開始算，第一句才有起點。
              setMetrics(createMetrics(Date.now()));
              setScreen('chat');
            }}
          >
            進入門市
          </button>
        </footer>
      </main>
    );
  }

  if (screen === 'report') {
    const rating = calculateRating(gate, metrics, userTurns);
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

          {/* 評等：等級 + 三軸拆解。分數不做黑箱，每一軸都把依據的原始數字放在旁邊。 */}
          <section className={`rating rating--${rating.tier.toLowerCase()}`}>
            <div className="rating__head">
              <span className="rating__tier">{rating.tier}</span>
              <div className="rating__id">
                <p className="rating__title">{rating.title}</p>
                <p className="rating__score">
                  <span className="rating__score-num">{rating.score}</span>
                  <span className="rating__score-max">/ 100</span>
                </p>
              </div>
            </div>

            <dl className="rating__axes">
              {rating.axes.map((axis) => (
                <div className="rating__axis" key={axis.key}>
                  <dt>{axis.label}</dt>
                  <dd className="rating__axis-evidence">{axis.evidence}</dd>
                  <dd className="rating__axis-score">{axis.score}</dd>
                </div>
              ))}
            </dl>

            <p className="rating__aside">
              平均思考{' '}
              <span className="rating__aside-num">
                {rating.avgThoughtSec === null ? '—' : rating.avgThoughtSec.toFixed(1)}
              </span>{' '}
              秒／句
              <span className="rating__aside-note">不列入評分</span>
            </p>
          </section>

          {!review && (
            <section className="report-block report-block--retry">
              <h2>講師點評</h2>
              <p className="report-item__detail">
                點評這次沒有載入{reviewError ? `：${reviewError}` : ''}。上面的評等與數據是本機算的，不受影響。
              </p>
              <button className="btn btn--ghost" onClick={() => void openReview()} disabled={reviewing}>
                {reviewing ? '重抓中…' : '重抓點評'}
              </button>
            </section>
          )}

          {review?.summary && <p className="report-summary">{review.summary}</p>}

          {review && review.didWell.length > 0 && (
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

          {review && review.toImprove.length > 0 && (
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

          {review?.keyMoment && (
            <section className="report-block report-block--key">
              <h2>關鍵訊號</h2>
              <p className="report-item__detail">{review.keyMoment}</p>
            </section>
          )}

          {/* 逐字稿放最後：它是查證用的原始材料，評等與點評才是先要看的結論。 */}
          <Transcript
            messages={messages}
            milestoneTurns={gate.milestoneTurns}
            labels={MILESTONES}
            accepted={gate.accepted}
          />
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
        <div className="chat-head__tail">
          {/*
            倒數只在最後幾則出現。全程掛計數器會讓學員為了省回合而不敢好好問，
            那跟這個練習要教的事正好相反；快撞到護欄時才提醒，才不會變成催促。
          */}
          {showTurnsLeft && (
            <span
              className="chat-head__turns"
              aria-live="polite"
              aria-label={`這一輪還可以再發言 ${turnsLeft} 則`}
            >
              剩 {turnsLeft} 則
            </span>
          )}
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
        </div>
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
        {/*
          教練提示：一次只出現一則。
          先講「你剛剛那一則」的問題（離題／時機未到／太推銷），這幾則任何階段都要能出現；
          都沒問題時才回到階段層級的指引。順序＝優先權，別依賴階段去擋訊息層級的提示。
          收尾後（finished）整塊收起來：那時 send() 已被鎖住，gate 不會再更新，
          留著只會把最後一則的提示永遠凍在畫面上，跟旁邊的收尾結論打架。
        */}
        {!busy && !finished && (() => {
          if (gate.lastOffTopic)
            return <p className="coach-hint">陳先生聽不懂這句話。回到他的聽力、生活和感受上。</p>;
          if (gate.lastInviteDeclined)
            return <p className="coach-hint">他還沒準備好。先把他真正的擔心接住，再邀請他。</p>;
          if (gate.lastInviteRefused)
            return (
              <p className="coach-hint">
                他沒有接受。剛剛那段話又講回產品了 —— 回到他的感受，再重新邀他一次。
              </p>
            );
          if (!gate.lastNotPushy)
            return <p className="coach-hint">先別急著介紹產品，試著多問問他的生活與感受。</p>;
          // 他已經丟出含蓄提示卻還沒明說 —— 這時最常見的失誤是急著給方案，而不是追問那句提示。
          if (!gate.identityConcernDisclosed && gate.concernProbeCount >= 2)
            return <p className="coach-hint">他剛剛透露了一點什麼。順著那句話再問下去，先別急著給方案。</p>;
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

      {/*
        卡住的學員也要走得到講師回饋 —— 那才是這個練習真正要教的東西。
        沒有這個出口，只有「陳先生點頭」和「講滿 MAX_TURNS」兩條路能進報告頁，
        最需要回饋的人反而得一路硬撐到護欄才看得到。
        提早收尾在分數上沒有好處（paceScore 沒成交一律 40），所以不必擔心它誘導放棄。
        第 3 則之後才出現：最短通關路徑是 4 則，這個門檻擋不到任何正常流程，
        只是不讓人一進門市就先看到「結束」。
      */}
      {!finished && userTurns >= 3 && (
        <button
          className="chat-bail"
          onClick={() => setBailOpen(true)}
          disabled={busy || reviewing}
          aria-haspopup="dialog"
        >
          {reviewing ? '講師正在看逐字稿…' : '先到這裡，看回饋'}
        </button>
      )}

      <footer className="chat-input">
        {finished ? (
          <div className="chat-done">
            <p>
              {gate.accepted
                ? '陳先生答應你了！這一輪走完了。'
                : stage === 'ready'
                  ? '這一輪的發言次數用完了。他其實已經願意了，可惜你沒有開口邀請他。'
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

      {/*
        收尾確認。刻意不用任務面板那套 bottom sheet ——
        面板是「翻閱」的姿態（滑上來、隨手關掉），確認是相反的姿態：
        停下來、正視一個不可逆的決定，所以做置中卡片。
        安全選項才是主要按鈕；結束降級成文字鍵，誤觸的代價太大。
      */}
      {bailOpen && (
        <div className="confirm-backdrop" onClick={() => setBailOpen(false)}>
          <section
            className="confirm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="confirm__eyebrow">
              <span className="mission-toggle__bars" aria-hidden="true">
                {hits.map((hit, i) => (
                  <span key={i} className={hit ? 'is-hit' : ''} />
                ))}
              </span>
              已完成 {hitTotal} / {MILESTONES.length}
            </p>

            <h2 className="confirm__title" id="bail-title">陳先生還坐在你對面</h2>
            <p className="confirm__body">{BAIL_NOTE[stage]}</p>


            <div className="confirm__actions">
              <button
                ref={bailCancelRef}
                className="btn btn--go"
                onClick={() => setBailOpen(false)}
              >
                回去繼續談
              </button>
              <button
                className="confirm__leave"
                onClick={() => {
                  setBailOpen(false);
                  void openReview();
                }}
              >
                結束，看結果
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
