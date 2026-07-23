/**
 * 關卡機制（寫在前端）。本版把「判定」與「回覆」合併成單次結構化輸出：
 * 模型一次回傳三個布林判斷 + 陳先生的回覆。判斷排在 reply 之前（先判定、再一致地寫回覆）。
 */

/** 三個判定準則（針對學員最新一則訊息）。 */
export interface GateVerdict {
  /** 是否問了關於「生活情境」的開放式問題（作息、社交、什麼場合／跟誰聽不清）。 */
  lifeContext: boolean;
  /** 是否問了價格以外「真正在意／擔心的事」。 */
  realConcern: boolean;
  /** 這一則是否「沒有」急著介紹產品／報價／說服（true = 沒有推銷）。 */
  notPushy: boolean;
}

/** 累積的關卡狀態（跨回合累加）。 */
export interface GateState {
  lifeContext: boolean;
  realConcern: boolean;
  /** 最近一則是否不推銷（僅供即時教練提示，不影響開門）。 */
  lastNotPushy: boolean;
}

export const INITIAL_GATE_STATE: GateState = {
  lifeContext: false,
  realConcern: false,
  lastNotPushy: true,
};

/** 把單則判定併入累積狀態（布林做 OR 累加；notPushy 反映最新一則）。 */
export function mergeVerdict(state: GateState, v: GateVerdict): GateState {
  return {
    lifeContext: state.lifeContext || v.lifeContext,
    realConcern: state.realConcern || v.realConcern,
    lastNotPushy: v.notPushy,
  };
}

/** 開門條件：同時問到「生活情境」與「真正顧慮」。 */
export function isOpen(state: GateState): boolean {
  return state.lifeContext && state.realConcern;
}

/**
 * Gemini responseSchema（OpenAPI 子集）：三個布林 + reply。
 * propertyOrdering 讓模型先產生判斷、再依判斷寫回覆，較一致。
 * 型別用大寫字串，對應 @google/genai 的 Type 列舉值，以純物件從前端傳到代理函式。
 */
export const CONVERSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    lifeContext: { type: 'BOOLEAN' },
    realConcern: { type: 'BOOLEAN' },
    notPushy: { type: 'BOOLEAN' },
    reply: { type: 'STRING' },
  },
  required: ['lifeContext', 'realConcern', 'notPushy', 'reply'],
  propertyOrdering: ['lifeContext', 'realConcern', 'notPushy', 'reply'],
} as const;

/** 寬鬆解析合併輸出：缺欄位保守處理（避免誤開門、避免空回覆當真）。 */
export function parseConverse(raw: string): { reply: string; verdict: GateVerdict } {
  try {
    const obj = JSON.parse(raw) as Partial<GateVerdict> & { reply?: unknown };
    return {
      reply: typeof obj.reply === 'string' ? obj.reply : '',
      verdict: {
        lifeContext: obj.lifeContext === true,
        realConcern: obj.realConcern === true,
        notPushy: obj.notPushy !== false,
      },
    };
  } catch {
    return { reply: '', verdict: { lifeContext: false, realConcern: false, notPushy: true } };
  }
}
