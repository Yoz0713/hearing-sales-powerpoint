/**
 * 關卡機制（寫在前端）。本版把「判定」與「回覆」合併成單次結構化輸出：
 * 模型一次回傳八個布林判斷 + 陳先生的回覆。判斷排在 reply 之前（先判定、再一致地寫回覆）。
 *
 * 四個階段：防備 → 鬆口(open) → 心防放下(ready) → 答應邀約(accepted)。
 * 最後一步一定要由學員主動邀請；陳先生不會自己提（見 persona.ts 的 NEVER_INITIATE）。
 */

/** 單一回合的判定準則。 */
export interface GateVerdict {
  /** 是否問了關於「生活情境」的開放式問題（作息、社交、什麼場合／跟誰聽不清）。 */
  lifeContext: boolean;
  /** 是否有效探索價格以外、不願配戴或嘗試的原因。 */
  concernProbe: boolean;
  /** 是否直接探索外觀、被看見、顯老、標籤，或有意義地追問陳先生給的相關提示。 */
  identityProbe: boolean;
  /** 陳先生在這一則 reply 是否明確說出外觀／身份標籤焦慮。 */
  identityConcernDisclosed: boolean;
  /** 是否具體回應／同理陳先生先前已說出口的外觀／身份標籤焦慮。 */
  identityConcernAddressed: boolean;
  /** 這一則是否明確提出下一步邀約（試戴、約時間、請他帶太太一起來）。 */
  invited: boolean;
  /** 這一則是否「沒有」急著介紹產品／報價／說服（true = 沒有推銷）。 */
  notPushy: boolean;
  /**
   * 這一則是否離題／無厘頭／亂碼，與這場諮詢無關。
   * 獨立於 notPushy：離題不是推銷，硬塞進 notPushy 只會讓教練提示對不上學員說的話。
   */
  offTopic: boolean;
}

/**
 * 四個里程碑分別是被哪一則**學員訊息**達成的（`messages` 的索引），null = 還沒達成。
 * 順序對齊 UI 的 MILESTONES：生活情境／說出真正顧慮／回應他的擔心／成功開口邀約。
 * 記學員那一則而不是陳先生的回覆：回顧逐字稿要看的是「我哪一句話讓事情動了」。
 */
export type MilestoneTurns = [number | null, number | null, number | null, number | null];

/** 累積的關卡狀態（跨回合累加）。 */
export interface GateState {
  lifeContext: boolean;
  /** 生活痛點建立後，有效探索排斥原因的次數；2 代表已到提示門檻。 */
  concernProbeCount: number;
  /** 陳先生是否已明確說出怕被看見、顯老或被貼標籤。 */
  identityConcernDisclosed: boolean;
  /** 學員是否好好回應了已說出口的外觀／身份標籤焦慮。 */
  identityConcernAddressed: boolean;
  /**
   * 學員在「揭露的那一則」就同時接住了顧慮 —— 當場不採計（防跳關），暫存到下一則兌現。
   * 沒有這一格，那句同理會被整個丟掉，學員得再講一次一樣的話才算數。
   * 存的是那一則的索引而不是布林：兌現時里程碑要記回**當初說那句話的那一則**。
   */
  pendingAddressed: number | null;
  /** 各里程碑達成於哪一則。 */
  milestoneTurns: MilestoneTurns;
  /** 陳先生已答應學員的邀約 —— 這一輪成功收尾。 */
  accepted: boolean;
  /** 時機未到就邀約、被婉拒的次數（回饋報告用）。 */
  earlyInvites: number;
  /** 最近一則是否不推銷（僅供即時教練提示，不影響開門）。 */
  lastNotPushy: boolean;
  /** 最近一則是否邀約被婉拒（供即時教練提示）。 */
  lastInviteDeclined: boolean;
  /** 最近一則是否離題（供即時教練提示）。 */
  lastOffTopic: boolean;
}

export const INITIAL_GATE_STATE: GateState = {
  lifeContext: false,
  concernProbeCount: 0,
  identityConcernDisclosed: false,
  identityConcernAddressed: false,
  pendingAddressed: null,
  milestoneTurns: [null, null, null, null],
  accepted: false,
  earlyInvites: 0,
  lastNotPushy: true,
  lastInviteDeclined: false,
  lastOffTopic: false,
};

/** 對話階段。 */
export type Stage = 'closed' | 'open' | 'ready' | 'accepted';

/** 鬆口條件：生活痛點已建立，而且核心的外觀／標籤焦慮已由陳先生說出口。 */
export function isOpen(state: GateState): boolean {
  return state.lifeContext && state.identityConcernDisclosed;
}

export function stageOf(state: GateState): Stage {
  if (state.accepted) return 'accepted';
  if (state.identityConcernAddressed) return 'ready';
  if (isOpen(state)) return 'open';
  return 'closed';
}

/**
 * 把單則判定併入累積狀態。
 * 關鍵順序：核心顧慮只能在「這一則以前已有生活情境」時揭露；
 * `identityConcernAddressed` 只在「這一則之前就已鬆口」時才採計 ——
 * 顧慮是在鬆口那一則才被說出口的，不可能在同一則就被回應，藉此擋掉跳關。
 * 邀約則允許同一則同時「回應顧慮 + 提出邀約」（真實銷售常見的自然說法）。
 *
 * 揭露的閘門只看「陳先生這一則有沒有真的說出口」，不看學員是用問句探索還是用同理帶出來的。
 * 曾經多押一個 `v.identityProbe`，結果陳先生已經在畫面上講破、狀態機卻還停在「尚未揭露」，
 * 之後 `statusOf` 一直送錯的階段指示，這一關就再也開不了。
 */
export function mergeVerdict(state: GateState, v: GateVerdict, turn: number): GateState {
  // 離題的訊息不推進任何關卡：亂打一通不該解鎖進度，也不該被當成推銷或邀約。
  // 注意 pendingAddressed 要原封不動帶過去 —— 亂打一通不該吃掉上一則的同理。
  if (v.offTopic) {
    return { ...state, lastNotPushy: true, lastInviteDeclined: false, lastOffTopic: true };
  }

  // 先建立生活情境，再探索核心排斥原因；同一句把兩者全猜完不算建立信任。
  const hadLifeContext = state.lifeContext;
  const wasOpen = isOpen(state);
  const concernProbeCount = Math.min(
    2,
    state.concernProbeCount + (hadLifeContext && v.concernProbe ? 1 : 0),
  );
  const lifeContext = state.lifeContext || v.lifeContext;
  const identityConcernDisclosed =
    state.identityConcernDisclosed || (hadLifeContext && v.identityConcernDisclosed);
  const redeeming = wasOpen && state.pendingAddressed !== null;
  const identityConcernAddressed =
    state.identityConcernAddressed || (wasOpen && (v.identityConcernAddressed || redeeming));
  // 揭露那一則的同理不當場採計，先寄放；下一則不論學員說什麼都會兌現成「已接住」。
  const pendingAddressed =
    !wasOpen && identityConcernDisclosed && v.identityConcernAddressed ? turn : null;
  const inviteWelcome = wasOpen && identityConcernAddressed;
  const accepted = state.accepted || (v.invited && inviteWelcome);
  const declined = v.invited && !inviteWelcome;

  // 里程碑只記第一次達成的那一則（`??` 不會被索引 0 誤判）。
  // 「回應他的擔心」若是兌現寄放的功勞，要記回當初說那句話的那一則，不是兌現的這一則。
  const milestoneTurns: MilestoneTurns = [
    state.milestoneTurns[0] ?? (lifeContext ? turn : null),
    state.milestoneTurns[1] ?? (identityConcernDisclosed ? turn : null),
    state.milestoneTurns[2] ??
      (identityConcernAddressed ? (redeeming ? state.pendingAddressed : turn) : null),
    state.milestoneTurns[3] ?? (accepted ? turn : null),
  ];

  return {
    lifeContext,
    concernProbeCount,
    identityConcernDisclosed,
    identityConcernAddressed,
    pendingAddressed,
    milestoneTurns,
    accepted,
    earlyInvites: state.earlyInvites + (declined ? 1 : 0),
    lastNotPushy: v.notPushy,
    lastInviteDeclined: declined,
    lastOffTopic: false,
  };
}

/**
 * Gemini responseSchema（OpenAPI 子集）：八個布林 + reply。
 * 型別用大寫字串，對應 @google/genai 的 Type 列舉值，以純物件從前端傳到代理函式。
 * 註：不放 propertyOrdering，避免部分模型對此欄位回 400。
 */
export const CONVERSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    lifeContext: { type: 'BOOLEAN' },
    concernProbe: { type: 'BOOLEAN' },
    identityProbe: { type: 'BOOLEAN' },
    identityConcernDisclosed: { type: 'BOOLEAN' },
    identityConcernAddressed: { type: 'BOOLEAN' },
    invited: { type: 'BOOLEAN' },
    notPushy: { type: 'BOOLEAN' },
    offTopic: { type: 'BOOLEAN' },
    reply: { type: 'STRING' },
  },
  required: [
    'lifeContext',
    'concernProbe',
    'identityProbe',
    'identityConcernDisclosed',
    'identityConcernAddressed',
    'invited',
    'notPushy',
    'offTopic',
    'reply',
  ],
} as const;

/** 課後回饋報告的結構。 */
export interface ReviewItem {
  /** 一句話講重點。 */
  point: string;
  /** 好的地方：引用學員原句；待加強：給一句可以照抄的替代問法。 */
  detail: string;
}

export interface ReviewResult {
  /** 兩三句總評。 */
  summary: string;
  didWell: ReviewItem[];
  toImprove: ReviewItem[];
  /** 陳先生哪一句話是關鍵訊號，以及為什麼。 */
  keyMoment: string;
}

const REVIEW_ITEM_SCHEMA = {
  type: 'OBJECT',
  properties: {
    point: { type: 'STRING' },
    detail: { type: 'STRING' },
  },
  required: ['point', 'detail'],
} as const;

export const REVIEW_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    didWell: { type: 'ARRAY', items: REVIEW_ITEM_SCHEMA },
    toImprove: { type: 'ARRAY', items: REVIEW_ITEM_SCHEMA },
    keyMoment: { type: 'STRING' },
  },
  required: ['summary', 'didWell', 'toImprove', 'keyMoment'],
} as const;

/** 從可能夾帶 ``` 圍欄或前後雜訊的文字中，抽出 JSON 物件字串。 */
function extractJson(raw: string): string {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1] : raw;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  return start !== -1 && end > start ? body.slice(start, end + 1) : body;
}

/** 寬鬆解析合併輸出：缺欄位保守處理（避免誤開門、避免空回覆當真）。 */
export function parseConverse(raw: string): { reply: string; verdict: GateVerdict } {
  try {
    const obj = JSON.parse(extractJson(raw)) as Partial<GateVerdict> & { reply?: unknown };
    return {
      reply: typeof obj.reply === 'string' ? obj.reply : '',
      verdict: {
        lifeContext: obj.lifeContext === true,
        concernProbe: obj.concernProbe === true,
        identityProbe: obj.identityProbe === true,
        identityConcernDisclosed: obj.identityConcernDisclosed === true,
        identityConcernAddressed: obj.identityConcernAddressed === true,
        invited: obj.invited === true,
        notPushy: obj.notPushy !== false,
        offTopic: obj.offTopic === true,
      },
    };
  } catch {
    return {
      reply: '',
      verdict: {
        lifeContext: false,
        concernProbe: false,
        identityProbe: false,
        identityConcernDisclosed: false,
        identityConcernAddressed: false,
        invited: false,
        notPushy: true,
        offTopic: false,
      },
    };
  }
}

/** 只留下形狀正確的項目，避免模型回半個物件時炸掉畫面。 */
function toItems(raw: unknown): ReviewItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
    .map((x) => ({
      point: typeof x.point === 'string' ? x.point : '',
      detail: typeof x.detail === 'string' ? x.detail : '',
    }))
    .filter((x) => x.point || x.detail)
    .slice(0, 4);
}

/** 寬鬆解析回饋報告；完全解析不出來時拋錯，讓 UI 顯示「再試一次」。 */
export function parseReview(raw: string): ReviewResult {
  const obj = JSON.parse(extractJson(raw)) as Record<string, unknown>;
  return {
    summary: typeof obj.summary === 'string' ? obj.summary : '',
    didWell: toItems(obj.didWell),
    toImprove: toItems(obj.toImprove),
    keyMoment: typeof obj.keyMoment === 'string' ? obj.keyMoment : '',
  };
}
