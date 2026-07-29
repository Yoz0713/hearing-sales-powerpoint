/** 呼叫代理函式（/api/chat）。金鑰在代理端，這裡永遠碰不到金鑰。 */

export interface ChatMsg {
  role: 'user' | 'model';
  text: string;
}

/**
 * 輸出額度（思考 + 回覆共用，見 api/chat.ts 的說明）。
 * 對話只要一句話 + 八個布林，但模型光思考就要 800～1400；點評是四段結構化文字，
 * 實測思考 1400 + 內文 640，抓 6000 才有安全邊際。
 */
const CONVERSE_OUT_TOKENS = 3000;
const REVIEW_OUT_TOKENS = 6000;

interface ChatRequest {
  systemInstruction: string;
  messages: ChatMsg[];
  /** Gemini responseSchema（結構化輸出）。 */
  responseSchema?: unknown;
  maxOutputTokens: number;
}

async function postChat(body: ChatRequest): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('chat 代理錯誤', res.status, detail);
    const friendly =
      res.status === 429
        ? '陳先生一時忙不過來（系統額度用量已達上限），請稍等一下再試。'
        : '連線出了點問題，請再試一次。';
    throw new Error(friendly);
  }
  const data = (await res.json()) as { text?: string; finishReason?: string | null };
  // 截斷的 JSON 一定解析不出來。與其讓下游拿到半截字串再丟一個看不懂的解析錯誤，
  // 不如在這裡就講清楚是額度不夠 —— 這正是課後點評整個空白的原因。
  if (data.finishReason === 'MAX_TOKENS') {
    console.error('回覆被 maxOutputTokens 截斷', data.text?.slice(0, 200));
    throw new Error('這次的回覆太長被截斷了，請再試一次。');
  }
  return data.text ?? '';
}

/**
 * 單次呼叫：同時產生陳先生的回覆與關卡判定。
 * 回傳結構化輸出的 JSON 字串，交由 gate.parseConverse 解析。
 */
export function converse(
  systemInstruction: string,
  responseSchema: unknown,
  messages: ChatMsg[],
): Promise<string> {
  return postChat({ systemInstruction, messages, responseSchema, maxOutputTokens: CONVERSE_OUT_TOKENS });
}

/**
 * 課後回饋：把整份逐字稿當成單一則使用者訊息送出（不沿用對話歷史，
 * 避免模型把角色扮演的往返當成自己講過的話）。
 */
export function requestReview(
  systemInstruction: string,
  responseSchema: unknown,
  transcript: string,
): Promise<string> {
  return postChat({
    systemInstruction,
    messages: [{ role: 'user', text: transcript }],
    responseSchema,
    maxOutputTokens: REVIEW_OUT_TOKENS,
  });
}
