/** 呼叫代理函式（/api/chat）。金鑰在代理端，這裡永遠碰不到金鑰。 */

export interface ChatMsg {
  role: 'user' | 'model';
  text: string;
}

interface ChatRequest {
  systemInstruction: string;
  messages: ChatMsg[];
  /** Gemini responseSchema（結構化輸出）。 */
  responseSchema?: unknown;
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
  const data = (await res.json()) as { text?: string };
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
  return postChat({ systemInstruction, messages, responseSchema });
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
  return postChat({ systemInstruction, messages: [{ role: 'user', text: transcript }], responseSchema });
}
