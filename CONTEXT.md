# 簡報網頁

一份以 reveal.js + React 打造的單一簡報應用。本文件是領域詞彙表（glossary），
只記詞彙、不放實作細節。

## Language

**投影片 (Slide)**：
manifest（`slides.manifest.ts`）中的一筆 `SlideEntry`，對應畫面上的一頁。
_Avoid_: page、頁面（指 React 元件檔時可用「頁面元件」）。

**章節 (Chapter)**：
由 manifest 中相鄰且 `chapter` 相同的投影片聚合而成的區段，供導覽分組。

**懸浮預覽 (Slide Preview)**：
桌面裝置在畫面底部 hover 時向上展開的單頁骨架卡片列，可點卡片跳頁。
對應元件 `SlidePreviewNav`。

**骨架卡片 (Preview Card)**：
懸浮預覽中代表一頁投影片的縮圖卡，內含頁碼、標題與骨架示意。

**previewShape**：
骨架卡片的視覺骨架原型（`cover` / `split` / `content`）。**刻意**與真實
**Layout 元件**解耦——它只是粗略形狀暗示，不代表真正版面。
_Avoid_: 用「layout」稱呼它。

**Layout 元件**：
決定投影片真正排版的元件（`CoverLayout`、`TwoColumnLayout`、`BigNumberLayout`、
`SlideShell`）。與 previewShape 是兩套不同的概念。

**當前頁 (Active Slide)**：
`currentIndex` 指向的那一頁；在懸浮預覽中以呼吸燈綠框標示。

**遙控器模式 (Remote Mode)**：
觸控／無 hover 裝置上預計提供的簡化導覽介面。**目前尚未實作**；該類裝置暫由
`ProgressBar` 與 `ChapterNavigation` 承擔導覽。
