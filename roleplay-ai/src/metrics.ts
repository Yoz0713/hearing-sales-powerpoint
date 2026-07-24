/**
 * 對話效率的觀測值。刻意跟 `gate.ts` 分開，有兩個理由：
 *
 * 1. `INITIAL_GATE_STATE` 是模組層級常數。把 `Date.now()` 寫進去會被凍結在 JS 載入那一刻，
 *    第二輪練習（restart）拿到的會是上一輪的起始時間，所有計時全錯。
 * 2. `mergeVerdict` 是不看時間的純函式，好測。混入時間戳就再也測不動了。
 *
 * 所以：關卡狀態歸 GateState，時間與次數統計歸這裡，兩邊在 App 層各自 setState。
 */
import type { GateVerdict } from './gate';

/**
 * 單回合思考時間的上限。超過就當成學員離開畫面（放下手機、切去別的 app），
 * 整筆不列入平均 —— 一次 20 分鐘的樣本會把平均徹底毀掉，夾到上限一樣失真。
 */
const THOUGHT_CAP_MS = 120_000;

export interface Metrics {
  /** 陳先生最近一次發言的時間，是下一則「思考時間」的起點。 */
  lastReplyAt: number;
  /** 列入平均的思考時間總和（毫秒）。 */
  thoughtMs: number;
  /** 列入平均的回合數；超過上限的回合不計，所以可能少於實際發言數。 */
  thoughtTurns: number;
  /** 被判定為推銷的回合數。 */
  pushyTurns: number;
  /** 離題的回合數。會從推銷率的分母扣掉，免得亂打一通稀釋掉真實表現。 */
  offTopicTurns: number;
}

export function createMetrics(now: number): Metrics {
  return { lastReplyAt: now, thoughtMs: 0, thoughtTurns: 0, pushyTurns: 0, offTopicTurns: 0 };
}

/** 學員按下送出：收下這一回合的思考時間。呼叫失敗也算，訊息已經送出去了。 */
export function recordSend(m: Metrics, sentAt: number): Metrics {
  const elapsed = sentAt - m.lastReplyAt;
  if (elapsed < 0 || elapsed > THOUGHT_CAP_MS) return m;
  return { ...m, thoughtMs: m.thoughtMs + elapsed, thoughtTurns: m.thoughtTurns + 1 };
}

/** 陳先生回覆完：累計這一則的判定，並把思考計時的起點移到現在。 */
export function recordReply(m: Metrics, repliedAt: number, v: GateVerdict): Metrics {
  return {
    ...m,
    lastReplyAt: repliedAt,
    // 離題的話不算推銷 —— 那是兩回事，混在一起算學員會被重複扣分。
    pushyTurns: m.pushyTurns + (!v.notPushy && !v.offTopic ? 1 : 0),
    offTopicTurns: m.offTopicTurns + (v.offTopic ? 1 : 0),
  };
}

/** 平均思考秒數；沒有有效樣本時回 null，由 UI 決定怎麼顯示。 */
export function avgThoughtSec(m: Metrics): number | null {
  return m.thoughtTurns > 0 ? m.thoughtMs / m.thoughtTurns / 1000 : null;
}
