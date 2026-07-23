/**
 * 極小代理函式（Vercel 風格 serverless）。
 * 唯一職責：藏住 GEMINI_API_KEY、把前端請求轉發給 Google Gemini、加上防呆上限。
 * 不含任何人設或關卡邏輯 —— 那些全在前端（persona.ts / gate.ts）。
 */
import { GoogleGenAI } from '@google/genai';

// ⚠️ 使用者指定的模型字串。正式 model ID 請於 Google AI Studio / Gemini API 文件確認後再改這一行。
const MODEL = 'gemini-3.6-flash';

// 防呆上限
const MAX_MESSAGES = 60;
const MAX_TEXT_LEN = 2000;
const MAX_SYSTEM_LEN = 8000;
const OUT_TOKENS = { gate: 256, reply: 512 } as const;

// best-effort per-IP 速率限制（serverless 實例為短命，故僅為盡力而為；正式可換平台 KV）。
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, number[]>();

interface ChatMsg {
  role: 'user' | 'model';
  text: string;
}

interface ReqLike {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
}
interface ResLike {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(chunk?: string): void;
}

function json(res: ResLike, code: number, obj: unknown): void {
  res.statusCode = code;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

function clientIp(req: ReqLike): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return (raw?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown');
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const transient = /429|503|500|overload|rate|unavailable|timeout/i.test(msg);
      if (!transient || i === tries - 1) break;
      await new Promise((r) => setTimeout(r, 400 * 2 ** i));
    }
  }
  throw lastErr;
}

export default async function handler(req: ReqLike, res: ResLike): Promise<void> {
  if (req.method !== 'POST') {
    json(res, 405, { error: '只接受 POST' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    json(res, 500, { error: '伺服器未設定 GEMINI_API_KEY' });
    return;
  }

  if (rateLimited(clientIp(req))) {
    json(res, 429, { error: '請求太頻繁，請稍候再試' });
    return;
  }

  // 解析與驗證
  let body: Record<string, unknown>;
  try {
    body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as Record<string, unknown>;
  } catch {
    json(res, 400, { error: '無法解析請求內容' });
    return;
  }

  const task = body?.task;
  const systemInstruction = body?.systemInstruction;
  const messages = body?.messages;
  const responseSchema = body?.responseSchema;

  if (task !== 'gate' && task !== 'reply') {
    json(res, 400, { error: 'task 必須是 gate 或 reply' });
    return;
  }
  if (typeof systemInstruction !== 'string' || systemInstruction.length > MAX_SYSTEM_LEN) {
    json(res, 400, { error: 'systemInstruction 不合法' });
    return;
  }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    json(res, 400, { error: 'messages 數量不合法' });
    return;
  }

  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const m of messages as ChatMsg[]) {
    if (
      !m ||
      (m.role !== 'user' && m.role !== 'model') ||
      typeof m.text !== 'string' ||
      m.text.length > MAX_TEXT_LEN
    ) {
      json(res, 400, { error: 'messages 內容不合法' });
      return;
    }
    contents.push({ role: m.role, parts: [{ text: m.text }] });
  }

  const config: Record<string, unknown> = {
    systemInstruction,
    maxOutputTokens: task === 'gate' ? OUT_TOKENS.gate : OUT_TOKENS.reply,
    temperature: task === 'gate' ? 0 : 0.85,
  };
  if (task === 'gate' && responseSchema && typeof responseSchema === 'object') {
    config.responseMimeType = 'application/json';
    config.responseSchema = responseSchema;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await withRetry(() =>
      ai.models.generateContent({ model: MODEL, contents, config }),
    );
    json(res, 200, { text: response.text ?? '' });
  } catch (err) {
    const detail = err instanceof Error ? err.message : '未知錯誤';
    json(res, 502, { error: `Gemini 呼叫失敗：${detail}` });
  }
}
