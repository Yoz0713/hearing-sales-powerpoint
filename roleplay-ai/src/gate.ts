/**
 * 關卡機制（寫在前端）。本版把「判定」與「回覆」合併成單次結構化輸出：
 * 模型一次回傳五個布林判斷 + 陳先生的回覆。判斷排在 reply 之前（先判定、再一致地寫回覆）。
 *
 * 四個階段：防備 → 鬆口(open) → 心防放下(ready) → 答應邀約(accepted)。
 * 最後一步一定要由學員主動邀請；陳先生不會自己提（見 persona.ts 的 NEVER_INITIATE）。
 */

/** 五個判定準則（針對學員最新一則訊息）。 */
export interface GateVerdict {
  /** 是否問了關於「生活情境」的開放式問題（作息、社交、什麼場合／跟誰聽不清）。 */
  lifeContext: boolean;
  /** 是否問了價格以外「真正在意／擔心的事」。 */
  realConcern: boolean;
  /** 是否具體回應／同理陳先生「已經說出口」的顧慮（而非跳回規格與價格）。 */
  addressedConcern: boolean;
  /** 這一則是否明確提出下一步邀約（試戴、約時間、請他帶太太一起來）。 */
  invited: boolean;
  /** 這一則是否「沒有」急著介紹產品／報價／說服（true = 沒有推銷）。 */
  notPushy: boolean;
}

/** 累積的關卡狀態（跨回合累加）。 */
export interface GateState {
  lifeContext: boolean;
  realConcern: boolean;
  /** 鬆口之後，學員是否好好回應了他的顧慮。 */
  addressedConcern: boolean;
  /** 陳先生已答應學員的邀約 —— 這一輪成功收尾。 */
  accepted: boolean;
  /** 時機未到就邀約、被婉拒的次數（回饋報告用）。 */
  earlyInvites: number;
  /** 最近一則是否不推銷（僅供即時教練提示，不影響開門）。 */
  lastNotPushy: boolean;
  /** 最近一則是否邀約被婉拒（供即時教練提示）。 */
  lastInviteDeclined: boolean;
}

export const INITIAL_GATE_STATE: GateState = {
  lifeContext: false,
  realConcern: false,
  addressedConcern: false,
  accepted: false,
  earlyInvites: 0,
  lastNotPushy: true,
  lastInviteDeclined: false,
};

/** 對話階段。 */
export type Stage = 'closed' | 'open' | 'ready' | 'accepted';

/** 鬆口條件：同時問到「生活情境」與「真正顧慮」。 */
export function isOpen(state: GateState): boolean {
  return state.lifeContext && state.realConcern;
}

export function stageOf(state: GateState): Stage {
  if (state.accepted) return 'accepted';
  if (state.addressedConcern) return 'ready';
  if (isOpen(state)) return 'open';
  return 'closed';
}

/**
 * 把單則判定併入累積狀態。
 * 關鍵順序：`addressedConcern` 只在「這一則之前就已鬆口」時才採計 ——
 * 顧慮是在鬆口那一則才被說出口的，不可能在同一則就被回應，藉此擋掉跳關。
 * 邀約則允許同一則同時「回應顧慮 + 提出邀約」（真實銷售常見的自然說法）。
 */
export function mergeVerdict(state: GateState, v: GateVerdict): GateState {
  const wasOpen = isOpen(state);
  const addressedConcern = state.addressedConcern || (wasOpen && v.addressedConcern);
  const inviteWelcome = wasOpen && addressedConcern;
  const accepted = state.accepted || (v.invited && inviteWelcome);
  const declined = v.invited && !inviteWelcome;

  return {
    lifeContext: state.lifeContext || v.lifeContext,
    realConcern: state.realConcern || v.realConcern,
    addressedConcern,
    accepted,
    earlyInvites: state.earlyInvites + (declined ? 1 : 0),
    lastNotPushy: v.notPushy,
    lastInviteDeclined: declined,
  };
}

/**
 * Gemini responseSchema（OpenAPI 子集）：五個布林 + reply。
 * 型別用大寫字串，對應 @google/genai 的 Type 列舉值，以純物件從前端傳到代理函式。
 * 註：不放 propertyOrdering，避免部分模型對此欄位回 400。
 */
export const CONVERSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    lifeContext: { type: 'BOOLEAN' },
    realConcern: { type: 'BOOLEAN' },
    addressedConcern: { type: 'BOOLEAN' },
    invited: { type: 'BOOLEAN' },
    notPushy: { type: 'BOOLEAN' },
    reply: { type: 'STRING' },
  },
  required: ['lifeContext', 'realConcern', 'addressedConcern', 'invited', 'notPushy', 'reply'],
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
        realConcern: obj.realConcern === true,
        addressedConcern: obj.addressedConcern === true,
        invited: obj.invited === true,
        notPushy: obj.notPushy !== false,
      },
    };
  } catch {
    return {
      reply: '',
      verdict: {
        lifeContext: false,
        realConcern: false,
        addressedConcern: false,
        invited: false,
        notPushy: true,
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
