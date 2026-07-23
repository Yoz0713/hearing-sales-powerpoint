import { useCallback, useEffect, useRef, useState } from 'react';
import { BACKGROUND_STORY, OPENING_LINE, buildSystemPrompt } from './persona';
import {
  CONVERSE_SCHEMA,
  INITIAL_GATE_STATE,
  isOpen,
  mergeVerdict,
  parseConverse,
  type GateState,
} from './gate';
import { converse, type ChatMsg } from './api';

const MAX_INPUT = 300;
const MAX_TURNS = 24; // 使用者發言上限，超過就收尾

type Screen = 'story' | 'chat';

export function App() {
  const [screen, setScreen] = useState<Screen>('story');
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'model', text: OPENING_LINE }]);
  const [gate, setGate] = useState<GateState>(INITIAL_GATE_STATE);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const opened = isOpen(gate);
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const reachedLimit = userTurns >= MAX_TURNS;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || reachedLimit) return;

    const history: ChatMsg[] = [...messages, { role: 'user', text }];
    setMessages(history);
    setInput('');
    setBusy(true);
    setError(null);

    try {
      // 單次呼叫：同時判定這一則命中的準則 + 產生陳先生的回覆。
      // 系統提示帶入「目前累積關卡狀態」，模型據此決定是否在這一則鬆口。
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
  }, [input, busy, reachedLimit, messages, gate]);

  const restart = () => {
    setMessages([{ role: 'model', text: OPENING_LINE }]);
    setGate(INITIAL_GATE_STATE);
    setInput('');
    setError(null);
    setScreen('story');
  };

  if (screen === 'story') {
    return (
      <main className="screen screen--story">
        <p className="eyebrow">顧問式對話練習</p>
        <h1>先理解人，<br />再讓他願意開口</h1>
        <article className="story-card">
          {BACKGROUND_STORY.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
        <button className="btn btn--primary" onClick={() => setScreen('chat')}>
          開始對話
        </button>
      </main>
    );
  }

  return (
    <main className="screen screen--chat">
      <header className="chat-head">
        <div className="chat-head__who">
          <span className="chat-head__name">陳先生</span>
          <span className={`chat-head__state${opened ? ' is-open' : ''}`}>
            {opened ? '願意多說了' : '有點防備'}
          </span>
        </div>
        <div className="gate-chips" aria-label="你已經問到的重點">
          <span className={`gate-chip${gate.lifeContext ? ' is-hit' : ''}`}>生活情境</span>
          <span className={`gate-chip${gate.realConcern ? ' is-hit' : ''}`}>真正顧慮</span>
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
        {!opened && !busy && gate.lastNotPushy === false && (
          <p className="coach-hint">先別急著介紹產品，試著多問問他的生活與感受。</p>
        )}
        {opened && (
          <p className="coach-hint coach-hint--good">陳先生開始信任你了 —— 順著他多聊一點。</p>
        )}
        {error && <p className="chat-error">{error}</p>}
      </div>

      <footer className="chat-input">
        {reachedLimit ? (
          <div className="chat-done">
            <p>這一輪先到這裡。{opened ? '你成功讓陳先生開口了！' : '這次他還沒完全打開，換個問法再試一次。'}</p>
            <button className="btn btn--ghost" onClick={restart}>再練一次</button>
          </div>
        ) : (
          <>
            <textarea
              value={input}
              maxLength={MAX_INPUT}
              placeholder="用一個開放式問題問問看…"
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
    </main>
  );
}
