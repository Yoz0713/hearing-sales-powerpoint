# design-sync NOTES — 大樹藥局簡報設計系統

## 專案性質與意圖
- 本 repo 是 `sales-presentation`：reveal.js + React 的簡報 app，**不是已發佈的元件庫**。無 library build／`exports`／元件 `.d.ts` → 走 **synth-entry（從 src 合成進入點）** 模式。
- 使用者目標：在 claude.ai/design **生成 + 調整**新投影片頁面，沿用品牌元件與 design token。
- **只有封面（Cover）是正式頁**；OutlinePage / StressTestPage 是 dev 階段暫時產物，內容不具權威性，勿當正式內容忠實重現。

## 同步範圍（使用者選定：5 個純版面/品牌元件）
- `BrandLogo`、`StockBars`、`CoverLayout`、`TwoColumnLayout`、`BigNumberLayout`
- 排除：所有頁面元件（`CoverPage`/`OutlinePage`/`StressTestPage`）、`SlideShell`、chrome（`ProgressBar`/`ChapterNavigation`/`SlidePreviewNav`/`BlackoutOverlay`）、`Presentation`——皆相依 `RevealControlContext` 與 GSAP 動畫，無法乾淨靜態渲染。

## 授權預覽方針
- `CoverLayout` → 忠實重現正式封面（標題「銷售經驗分享」+ BrandLogo + StockBars）。
- `TwoColumnLayout` / `BigNumberLayout` → **通用示範 story 當生成模板**（非 dev 頁內容）。
- `BrandLogo` / `StockBars` → 簡單品牌卡。

## 已知技術點 / 風險
- `CoverLayout` 會 `import` 去背 PNG（`assets/公司去背logo.png`，repo 根目錄）。bundler 需能處理 .png（dataurl/file loader）；若 bundle 失敗從這裡查。
- token 來源：`src/styles/tokens.css`（變數）+ `src/styles/app.css`（版面 class）。
- 元件以 1920×1080 絕對座標與大字級設計，預覽卡需要 viewport/cardMode 縮放。

## 環境阻斷（2026-06-28 首次同步遇到，未完成）
- 本機（受管控 Windows 10）**無可用的正式建置 Node**：
  - 系統 Node **v25.2.1**：轉換器 `package-build.mjs` 在印出 header 後、out-dir `rmSync`/`mkdirSync` 階段**無聲 exit 127**（無 JS 例外、無 stderr）。與既有備忘「Node 25 vite build silent crash」一致。
  - 下載的**可攜式 Node 22.11.0**：連 `require('ts-morph')`、`require('esbuild')` 都 **SIGSEGV(139)**，但 `node -v` 正常 → 疑似 EDR/防毒終止「解壓未簽章」的 node.exe 及子程序。
  - esbuild / ts-morph 在 Node 25 下**單獨**可跑，但完整 build 必崩。
- **解法**：以官方簽章安裝檔安裝 **Node 20 或 22 LTS**（非解壓可攜版，避免被資安軟體攔），再重跑：
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/ds-entry.tsx --out ./ds-bundle`
- claude.ai/design 專案 `f1fbe9f9-c33e-4993-99e3-8713141aebc1` 已建立但**仍為空**（un-anchored 安全狀態，下次同步會重驗）。
- 暫存腳本 `.ds-sync/package-build.mjs` 我加了臨時 `PROBE:` 探針除錯；重新 `cp -r` 暫存腳本即可還原。

## Re-sync risks
- synth-entry 模式 `.d.ts` 契約較弱；元件路徑靠 `componentSrcMap` 指定，新增元件需手動補。
- 版面元件無對應 dev 內容當正式 story；預覽內容為人工撰寫，與未來真實頁面可能脫節。
