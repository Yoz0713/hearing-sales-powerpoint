# CLAUDE.md

## Agent skills

### Issue tracker

Issues and PRDs are tracked as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

# UX/UI 原則 (Slideshow Specific)
1. **拒絕垂直捲動：** 
   - 所有的 Slide 容器必須是 `100vh`/`100vw` 且 `overflow: hidden`。
   - 絕對不允許出現任何瀏覽器預設的滾動條。

2. **等比例縮放（16:9 Viewport）：**
   - 不要使用常規網頁的彈性響應式排版（避免元件因視窗縮小而上下錯位、換行）。
   - 請採用等比例容器設計（如 1920x1080 比例），並透過 JS/CSS 偵測視窗大小，使用 `transform: scale()` 進行整頁等比例縮放。

3. **簡報級字體與留白：**
   - 標題字體不小於 48px，內文字體不小於 24px。
   - 大量保留空白，避免資訊堆疊。單頁內容若超過 4 行字或 2 張圖，應主動提示拆分為多張 Slide。

4. **逐步動畫機制（Incremental Steps）：**
   - 頁面內部的關鍵元素（如條列清單、圖表標籤）需支援「分步顯示」機制。
 


# Tech Stack & Architecture
- Frontend: React 18 + TypeScript + Vite。
- Deck 引擎: Reveal.js（1920×1080 固定畫布，`reveal.config.ts` 鎖定 controls/swipe/wheel，左右鍵跨頁、上下鍵頁內 fragment）。
- Styling: 純 CSS 自訂屬性（`src/styles/tokens.css`，由根目錄 `DESIGN.md` §11 產生）+ 手寫語意化 class（`src/styles/app.css`），未使用 Tailwind。
- Animation: GSAP（`gsap.context()` scope 進場動畫，見 `useSlideAnimation`）+ Reveal.js 原生 fragment 負責頁內逐步顯示，未使用 Framer Motion。
- Architecture: 單頁應用（SPA）、一頁一檔慣例（`src/pages/`），`src/presentation/slides.manifest.ts` 為 slide 順序與章節分組的唯一來源。


所有回覆皆使用繁體中文
思考過程皆使用英文