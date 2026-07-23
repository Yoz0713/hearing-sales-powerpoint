/** 呼叫代理函式（/api/chat）。金鑰在代理端，這裡永遠碰不到金鑰。 */

export interface ChatMsg {
  role: 'user' | 'model';
  text: string;
}

interface ChatRequest {
  task: 'gate' | 'reply';
  systemInstruction: string;
  messages: ChatMsg[];
  /** 僅 gate 任務使用：Gemini responseSchema。 */
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
    throw new Error(`代理回應 ${res.status}${detail ? `：${detail}` : ''}`);
  }
  const data = (await res.json()) as { text?: string };
  return data.text ?? '';
}

/** 讓客戶（演員）回覆。systemInstruction 依關卡狀態選 closed/open。 */
export function askActor(systemInstruction: string, messages: ChatMsg[]): Promise<string> {
  return postChat({ task: 'reply', systemInstruction, messages });
}

/** 判定最後一則學員訊息命中的關卡準則，回傳 JSON 字串。 */
export function judgeGate(
  systemInstruction: string,
  responseSchema: unknown,
  messages: ChatMsg[],
): Promise<string> {
  return postChat({ task: 'gate', systemInstruction, messages, responseSchema });
}
