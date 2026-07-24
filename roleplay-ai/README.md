# roleplay-ai — QR 掃碼 × AI 難搞客人角色扮演

課程 p43 用的線上角色扮演。學員掃 QR → 讀背景故事 → 和「AI 演員扮演的難搞客人（陳先生）」對話 → 對話結束後看講師回饋。

**這是獨立於簡報 deck 的小 App**，不影響 deck 的靜態建置。

## 四個階段

| 階段 | 條件 | 陳先生 |
| --- | --- | --- |
| 1 防備 | — | 短、冷、擋話（「太貴了」「我再考慮看看」） |
| 2 鬆口 `open` | 問到**生活情境** + **真正顧慮** | 漸進說出心裡真正的擔心 |
| 3 心防放下 `ready` | 學員**具體回應**他說出口的擔心 | 語氣放軟，但停在原地等對方開口 |
| 4 答應 `accepted` | 學員**主動邀約**（試戴／約時間／帶太太來） | 答應，這一輪收尾 |

**設計上的鐵則：下一步永遠由學員提出。** 陳先生任何階段都不會自己說「那我試戴看看」，也不能用
「那接下來呢？」之類的話暗示（`persona.ts` 的 `NEVER_INITIATE`）。時機未到就邀約 → 婉拒，
並記進 `earlyInvites` 供回饋報告點名。

階段三的判定刻意要求「這一則之前就已鬆口」（`gate.ts` 的 `mergeVerdict`），因為顧慮是在鬆口
那一則才說出口的，同一則不可能已經回應到它 —— 藉此擋掉跳關。

## 課後回饋

對話結束（答應邀約，或用完 `MAX_TURNS` 次發言）後按「看講師回饋」，會用整份逐字稿再打一次
Gemini，產出總評 / 你做對的地方（引用學員原句）/ 下次可以更好（給可照抄的替代說法）/ 關鍵訊號。
提示與 schema 分別在 `persona.ts` 的 `buildReviewPrompt` 與 `gate.ts` 的 `REVIEW_SCHEMA`。

## 架構

```
手機 → 前端(React/Vite) → /api/chat 代理函式 → Google Gemini API
                            └ 藏 GEMINI_API_KEY，只轉發，不含業務邏輯
```

- 人設在 `src/persona.ts`、關卡機制在 `src/gate.ts`（都在前端）。
- 任務簡報內容在 `persona.ts` 的 `MISSION`；`src/MissionBrief.tsx` 同時給進場的整頁簡報
  （`brief--page`）與對話中拉起的任務面板（`brief--sheet`）用，兩者只差字級與排列順序（CSS `order`）。
- 手機鍵盤：iOS Safari 叫出鍵盤時不縮 layout viewport，只把整頁往上捲，會把 header 推出畫面、
  對話區被蓋掉。`src/useViewportFit.ts` 改用 `visualViewport` 寫入 `--app-h` / `--app-top`，
  對話畫面用 `position: fixed` 貼齊真正可見的區域。改動對話畫面高度時要一起看這支。
- `api/chat.ts` 是唯一碰金鑰的地方；前端與 QR 都看不到金鑰。
- 每則使用者訊息一次呼叫，結構化 JSON 同時回傳五個布林判定 + 陳先生的回覆。
  判定由前端累加成階段狀態，再寫回下一次的 systemInstruction。

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
- 問到生活情境 + 真正顧慮（上方 chip 依序亮起）→ 陳先生明顯鬆口。
- 回應他的擔心後 → 語氣放軟，但**不會**自己提試戴或帶太太來；教練提示會叫你主動開口。
- 鬆口前就邀約 → 被婉拒，chip 不亮。
- 結束後按「看講師回饋」→ 出現總評與逐條點評。
- 開發者工具 Network / Source 看不到金鑰。
