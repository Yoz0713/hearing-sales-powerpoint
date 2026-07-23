# roleplay-ai — QR 掃碼 × AI 難搞客人角色扮演

課程 p43 用的線上角色扮演。學員掃 QR → 讀背景故事 → 和「AI 演員扮演的難搞客人（陳先生）」對話；
問到**生活情境**與**真正顧慮**兩個關卡後，客人才會鬆口。

**這是獨立於簡報 deck 的小 App**，不影響 deck 的靜態建置。

## 架構

```
手機 → 前端(React/Vite) → /api/chat 代理函式 → Google Gemini API
                            └ 藏 GEMINI_API_KEY，只轉發，不含業務邏輯
```

- 人設在 `src/persona.ts`、關卡機制在 `src/gate.ts`（都在前端）。
- `api/chat.ts` 是唯一碰金鑰的地方；前端與 QR 都看不到金鑰。
- 明確關卡判定：每則使用者訊息先做一次「判定呼叫」（結構化 JSON），再讓客戶回覆。

## 模型設定

`api/chat.ts` 的 `MODEL` 常數目前為 `gemini-3.6-flash`（依需求指定）。
**部署前請於 Google AI Studio / Gemini API 文件確認正式 model ID**，不對就改這一行。

## 本機開發

```bash
cd roleplay-ai
npm install
cp .env.example .env.local   # 填入 GEMINI_API_KEY
npx vercel dev               # 同時起前端與 /api 代理（需要 Vercel CLI）
```

只想跑前端 UI（不連 API）可用 `npm run dev`，但對話會失敗（因為沒有 /api）。

## 部署（Vercel）

1. 在 Vercel 新增專案，**Root Directory 設為 `roleplay-ai`**。
2. 環境變數加入 `GEMINI_API_KEY`（Google 金鑰）。
3. 部署後取得網址 → 拿去產生簡報 p43 的 QR code。

其他平台（Netlify / Cloudflare）亦可，需把 `api/chat.ts` 改成該平台的 function 慣例。

## 驗證

- 一開始亂問或急著推銷 → 陳先生維持防備、只回「再考慮看看」。
- 問到生活情境 + 真正顧慮（上方兩個 chip 亮起）→ 陳先生明顯鬆口。
- 開發者工具 Network / Source 看不到金鑰。
