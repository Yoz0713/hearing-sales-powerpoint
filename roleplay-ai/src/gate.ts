/**
 * 關卡機制（寫在前端）。判定「學員這一則有沒有問對問題」，
 * 用獨立的判定呼叫（判官≠演員）以求可靠。schema 與判定 prompt 都在這裡。
 */

/** 三個判定準則。 */
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

/** 判定用的 systemInstruction（送給判官模型）。 */
export const GATE_SYSTEM = `你是一位聽力師培訓的評分助理。對話中，一位「學員（聽力師）」正在和一位難搞的長輩客戶陳先生對話。

請只針對【對話中最後一則「學員」訊息】做判斷，並依 schema 回傳 JSON（不要多餘文字）：

- lifeContext：這則訊息是否用開放式問題，試圖了解客戶的「生活情境」？（例如：什麼場合／跟誰在一起時聽不清、平常的作息與社交、看電視講電話的情形。單純問「有沒有比較聽不到」這種封閉、表面的問句不算。）
- realConcern：這則訊息是否試圖了解客戶「價格以外、真正在意或擔心的事」？（例如：對戴助聽器的顧慮、面子、對效果的不確定、過去經驗。只談價格或規格不算。）
- notPushy：這則訊息是否「沒有」急著介紹產品、報價、比規格或說服客戶？（沒有推銷 = true；有推銷或催促 = false。）

只評最後一則學員訊息本身，不要因為前面幾則就給分。`;

/**
 * Gemini responseSchema（OpenAPI 子集）。型別用大寫字串，對應 @google/genai 的 Type 列舉值，
 * 以純物件形式從前端傳到代理函式再交給 SDK。
 */
export const GATE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    lifeContext: { type: 'BOOLEAN' },
    realConcern: { type: 'BOOLEAN' },
    notPushy: { type: 'BOOLEAN' },
  },
  required: ['lifeContext', 'realConcern', 'notPushy'],
} as const;

/** 寬鬆解析判官回傳的 JSON，缺欄位一律當 false（保守：避免誤開門）。 */
export function parseVerdict(raw: string): GateVerdict {
  try {
    const obj = JSON.parse(raw) as Partial<GateVerdict>;
    return {
      lifeContext: obj.lifeContext === true,
      realConcern: obj.realConcern === true,
      notPushy: obj.notPushy !== false,
    };
  } catch {
    return { lifeContext: false, realConcern: false, notPushy: true };
  }
}
