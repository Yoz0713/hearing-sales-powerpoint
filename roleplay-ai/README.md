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

## 綜合評等

報告頁的評等由 `src/rating.ts` 純函式算出，**不經過 API** —— 講師點評抓不到時評等照樣看得到。
三軸加權：里程碑 50%、對話精準度 30%、推銷控制力 20%；90/75/60 分切 S/A/B/C。

兩個容易寫錯的地方：

- **對話精準度要先看有沒有走完全程。** 直接用回合數分級的話，第 3 回合就放棄的學員會因為
  「≤ 8 回合」拿到滿分，等於獎勵放棄。沒讓陳先生點頭一律 40 分。
- **推銷率的分母要扣掉離題回合**，否則亂打一通會稀釋掉真實表現。

平均思考時間只呈現、不計分（想久不是錯）。單回合超過 2 分鐘視為離開畫面，整筆不列入平均 ——
一次 20 分鐘的樣本會毀掉平均，夾到上限一樣失真。

時間與次數統計放在 `src/metrics.ts`，**刻意不放進 `GateState`**：`INITIAL_GATE_STATE` 是模組層級
常數，把 `Date.now()` 寫進去會被凍結在載入當下，`restart()` 之後計時全錯；而且 `mergeVerdict`
是不看時間的純函式，混入時間戳就測不動了。

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
- 每則使用者訊息一次呼叫，結構化 JSON 同時回傳六個布林判定 + 陳先生的回覆。
  判定由前端累加成階段狀態，再寫回下一次的 systemInstruction。
- 判定分兩類：`lifeContext` / `realConcern` / `addressedConcern` / `invited` 會累加成關卡進度；
  `notPushy` / `offTopic` 只反映最新一則，供教練提示用。`offTopic` 為真時 `mergeVerdict`
  直接擋掉所有正向判定 —— 亂打一通不該解鎖進度。

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
- 輸入無厘頭的話（「我愛你」）→ 陳先生困惑地拉回正題，教練提示顯示「陳先生聽不懂這句話…」，
  進度 chip 不會亮，也不會跳出推銷提示。
- 開發者工具 Network / Source 看不到金鑰。
