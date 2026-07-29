/**
 * 課後報告裡的逐字稿。
 *
 * 刻意不重播對話畫面的左右氣泡：回顧時這是一份**文件**，不是一場對話，
 * 所以改成單欄劇本式排版，讓人可以一路往下讀自己講過的話。
 *
 * 左側那條脊線是這一頁的重點。里程碑落在哪一句，脊線上就長出一個節點；
 * 節點之間的距離＝推進那一關花了幾輪，最後一個節點之後轉成虛線並以空心環收尾 ——
 * 對話在哪裡失去動力，不用讀完就看得出來。
 */
import { useState } from 'react';
import type { ChatMsg } from './api';
import type { MilestoneTurns } from './gate';

interface Props {
  messages: ChatMsg[];
  /** 各里程碑達成於哪一則（`GateState.milestoneTurns`）。 */
  milestoneTurns: MilestoneTurns;
  /** 里程碑名稱，順序需與 milestoneTurns 對齊。 */
  labels: readonly string[];
  /** 陳先生答應了嗎 —— 決定脊線末端是實心收合還是空心敞開。 */
  accepted: boolean;
}

export function Transcript({ messages, milestoneTurns, labels, accepted }: Props) {
  const [open, setOpen] = useState(false);

  const hits = milestoneTurns.filter((t): t is number => t !== null);
  // 脊線只在「第一個到最後一個里程碑之間」是實線：那一段才是真的有在推進。
  // 開場到第一個里程碑之間還沒動起來，之後則是空轉，兩頭都畫虛線才誠實。
  const firstMark = hits.length ? Math.min(...hits) : Infinity;
  const lastMark = hits.length ? Math.max(...hits) : -Infinity;

  return (
    <section className="report-block transcript">
      <button
        className="transcript__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="transcript__toggle-label">逐字稿</span>
        <span className="transcript__toggle-meta">
          {messages.filter((m) => m.role === 'user').length} 次發言 · {hits.length} / {labels.length} 個里程碑
        </span>
        <span className={`transcript__chevron${open ? ' is-open' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <ol className="script">
          {messages.map((m, i) => {
            // 同一則可能同時達成兩個里程碑（例如接住擔心的同一句話就開口邀約）。
            const marks = milestoneTurns.flatMap((t, idx) => (t === i ? [idx] : []));
            return (
              <li
                key={i}
                className={`script__line script__line--${m.role} ${
                  i >= firstMark && i <= lastMark ? 'is-live' : 'is-cold'
                }`}
              >
                {marks.map((idx) => (
                  <p className="script__mark" key={idx}>
                    <span className="script__mark-dot">{idx + 1}</span>
                    {labels[idx]}
                  </p>
                ))}
                <p className="script__who">{m.role === 'user' ? '你' : '陳先生'}</p>
                <p className="script__text">{m.text}</p>
              </li>
            );
          })}
          <li className={`script__end${accepted ? ' is-closed' : ''}`}>
            <span className="script__end-ring" aria-hidden="true" />
            {accepted ? '陳先生答應了，這一輪走完。' : '對話停在這裡。'}
          </li>
        </ol>
      )}
    </section>
  );
}
