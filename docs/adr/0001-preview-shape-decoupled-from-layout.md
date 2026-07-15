# previewShape 刻意與真實 Layout 元件解耦

懸浮預覽（`SlidePreviewNav`）的骨架卡片需要知道每頁的「大致形狀」來畫示意圖。
我們在 `SlideEntry` 上新增獨立的 `previewShape` 列舉（`cover | split | content`），
**刻意不**綁定該頁實際使用的 Layout 元件（`CoverLayout` / `TwoColumnLayout` /
`BigNumberLayout` / `SlideShell`）。

## 為什麼

- 預覽只需「粗略形狀暗示」，不需要也不該複製真實版面的細節。
- 從 Layout 元件反推骨架會讓預覽耦合到版面內部結構，未來改版面就被迫連動預覽。
- 解耦後加頁只要在 manifest 標一個 `previewShape`（或省略走 `content` 回退）即可。

## Trade-off / 後果

代價是專案出現「兩套版面詞彙」——真實的 **Layout 元件** 與預覽用的 **previewShape**。
這在 `CONTEXT.md` 詞彙表與 `presentation.ts` 的型別註解中已明確區分，以避免未來讀者
誤以為兩者該統一、進而「修正」掉這個刻意的分界。
