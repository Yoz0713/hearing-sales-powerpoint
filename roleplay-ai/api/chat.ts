/**
 * 極小代理函式（Vercel 風格 serverless）。
 * 唯一職責：藏住 GEMINI_API_KEY、把前端請求轉發給 Google Gemini、加上防呆上限。
 * 不含任何人設或關卡邏輯 —— 那些全在前端（persona.ts / gate.ts）。
 */
import { GoogleGenAI } from '@google/genai';

// 使用者指定的模型字串。
const MODEL = 'gemini-3.6-flash';

// 防呆上限
const MAX_MESSAGES = 60;
// 單則上限放寬到 12000，是因為課後回饋會把整份逐字稿當成一則訊息送出。
const MAX_TEXT_LEN = 12000;
const MAX_SYSTEM_LEN = 8000;
/**
 * 輸出額度由呼叫端指定（對話短、課後點評長），這裡只夾限。
 * 這一格是**思考 + 回覆**共用的：gemini-3.6-flash 光思考就用掉 800～1400 tokens，
 * 舊的固定 1400 會讓點評只吐出 40 個 token 就 MAX_TOKENS 截斷，JSON 解析必然失敗。
 */
const DEFAULT_OUT_TOKENS = 1400;
const MAX_OUT_TOKENS = 8000;

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

  const systemInstruction = body?.systemInstruction;
  const messages = body?.messages;
  const responseSchema = body?.responseSchema;

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
    // Gemini 要求 contents 以 user 開頭；濾掉開頭的 model 訊息（例如客人的開場白）。
    if (contents.length === 0 && m.role !== 'user') continue;
    contents.push({ role: m.role, parts: [{ text: m.text }] });
  }
  if (contents.length === 0) {
    json(res, 400, { error: '沒有可送出的使用者訊息' });
    return;
  }

  const requested = Number(body?.maxOutputTokens);
  const maxOutputTokens = Number.isFinite(requested)
    ? Math.min(MAX_OUT_TOKENS, Math.max(256, Math.floor(requested)))
    : DEFAULT_OUT_TOKENS;

  const baseConfig: Record<string, unknown> = {
    systemInstruction,
    maxOutputTokens,
    temperature: 0.7,
  };

  // 依序嘗試：JSON schema → 只要 JSON → 純文字（靠提示產生 JSON，前端寬鬆解析）。
  // 不同模型對結構化輸出的支援不一；遇 400（參數不合法）就自動退到更相容的設定，避免整個掛掉。
  const jsonModes: Record<string, unknown>[] = [];
  if (responseSchema && typeof responseSchema === 'object') {
    jsonModes.push({ responseMimeType: 'application/json', responseSchema });
  }
  jsonModes.push({ responseMimeType: 'application/json' });
  jsonModes.push({});

  const ai = new GoogleGenAI({ apiKey });
  let lastErr: unknown;
  for (const mode of jsonModes) {
    try {
      const response = await withRetry(() =>
        ai.models.generateContent({ model: MODEL, contents, config: { ...baseConfig, ...mode } }),
      );
      // finishReason 一起回去：被 maxOutputTokens 截斷時 JSON 一定是壞的，
      // 前端要能說出「被截斷」，而不是丟一個沒頭沒尾的解析錯誤。
      json(res, 200, {
        text: response.text ?? '',
        finishReason: response.candidates?.[0]?.finishReason ?? null,
      });
      return;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      // 只有「參數不合法（400）」才退到更簡設定重試；其餘（金鑰、429…）直接回報。
      if (!/\b400\b|invalid[_ ]argument/i.test(msg)) break;
    }
  }

  const detail = lastErr instanceof Error ? lastErr.message : '未知錯誤';
  const code = /\b429\b|resource_exhausted|quota/i.test(detail) ? 429 : 502;
  json(res, code, { error: `Gemini 呼叫失敗：${detail}` });
}
