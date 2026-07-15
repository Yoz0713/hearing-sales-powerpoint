# Reveal.js 完整功能手冊

Reveal.js 是一個功能強大、基於 HTML5 的開放原始碼簡報框架。它能讓開發者利用 Web 技術（HTML、CSS、JavaScript/TypeScript）來製作極具現代感、互動性與動態特效的簡報網頁。

本手冊將全面拆解 Reveal.js 的所有核心與進階功能，幫助你完整掌握這個工具。

---

## 目錄
1. [核心架構與版面配置](#1-核心架構與版面配置)
2. [轉場與動畫特效](#2-轉場與動畫特效)
3. [多媒體與豐富背景](#3-多媒體與豐富背景)
4. [程式碼展示與語法高亮](#4-程式碼展示與語法高亮)
5. [講者模式與輔助工具](#5-講者模式與輔助工具)
6. [學術與進階擴充插件](#6-學術與進階擴充插件)
7. [JavaScript API 與事件監聽](#7-javascript-api-與事件監聽)

---

## 1. 核心架構與版面配置

### 二維多維導航 (Nested Slides)
Reveal.js 支援水平與垂直雙向導航。
* **水平導航**：代表主要大章節，按左右鍵切換。
* **垂直導航**：代表章節內的細節子頁面，按上下鍵切換。
```html
<section>
  <section>第一章：簡介 (水平)</section>
  <section>簡介的子頁面 A (垂直下)</section>
  <section>簡介的子頁面 B (垂直下)</section>
</section>
<section>第二章：核心功能 (水平右)</section>
```

### Markdown 原生支援
不需寫繁瑣的 HTML，你可以直接在 HTML 中用 Markdown 撰寫投影片內容。
```html
<section data-markdown>
  <textarea data-template>
    ## 使用 Markdown 標題
    * 列表項目一
    * 列表項目二
  </textarea>
</section>
```

### 元素漸次呈現 (Fragments)
Fragments 用於控制投影片內部元素的出現順序（例如點擊下一步時，才顯示特定句子或圖片）。
它支援多種動態效果（只需在 HTML 標籤加入 `class="fragment <效果名稱>"`）：
* `fade-in`：漸顯（預設）
* `fade-out`：漸隱
* `fade-up` / `fade-down` / `fade-left` / `fade-right`：朝特定方向滑動並漸顯
* `zoom-in` / `zoom-out`：放大/縮小顯現
* `highlight-red` / `highlight-green` / `highlight-blue`：點擊時，文字顏色變色
* `semi-fade-out`：點擊下一步後，該元素半透明化（常用於引導觀眾注意力至新元素）

---

## 2. 轉場與動畫特效

### 全域與單頁轉場 (Transitions)
控制投影片切換時的動畫，有 6 種內建風格：
* `none`：直接切換。
* `fade`：淡入淡出。
* `slide`：水平滑動（預設）。
* `convex`：3D 凸面旋轉。
* `concave`：3D 凹面旋轉。
* `zoom`：從中心放大縮小。

### 自動動畫 (Auto-Animate)
透過加上 `data-auto-animate` 屬性，Reveal.js 會自動比對相鄰投影片的相同元素（或使用相同 `data-id`），在切換時為位置、大小、顏色及 CSS 樣式自動套用補間動畫。

---

## 3. 多媒體與豐富背景

Reveal.js 允許你為每張投影片設定獨特的背景，且背景切換會自動與內容切換同步。

* **單純背景色**：`data-background-color="#ff0000"` (支援 CSS 漸層色)。
* **背景圖片**：`data-background-image="url.jpg"` (可設定 `data-background-size`、`data-background-repeat` 等)。
* **背景影片**：`data-background-video="video.mp4"` (支援自動循環播放、靜音等)。
* **網頁背景 (Iframe)**：`data-background-iframe="https://example.com"` (甚至可以加上 `data-background-interactive` 讓講者能在簡報中直接操作該網頁)。
* **視差滾動 (Parallax Background)**：在初始化設定背景圖與寬度，能在切換投影片時產生精美的視差滾動效果。

---

## 4. 程式碼展示與語法高亮

針對技術簡報，Reveal.js 內建了優異的程式碼展示系統：

* **語法高亮**：基於 Highlight.js，自動辨識多種程式語言並渲染顏色。
* **特定行數聚焦高亮 (Line Numbers)**：
  透過 `data-line-numbers` 可以指定只亮起特定行數，其餘變暗；甚至能分步引導：
  ```html
  <!-- 第一步顯示全部，第二步聚焦第 1-2 行，第三步聚焦第 4 行 -->
  <pre><code data-line-numbers="1-5|1-2|4">
    function test() {
      let x = 10;
      let y = 20;
      return x + y;
    }
  </code></pre>
```

---

## 5. 講者模式與輔助工具

### 講者檢視視窗 (Speaker Notes)
在簡報頁面按下鍵盤 **`S`** 鍵，會彈出一個講者專用視窗：
* **講者備忘錄**：顯示寫在 `<aside class="notes">備忘錄內容</aside>` 中的文字。
* **下一張預覽**：讓講者知道下一張要講什麼。
* **計時器與當前時間**：協助講者精準掌控時間。

### PDF 匯出 (PDF Export)
在 URL 後方加上 `?print-pdf`（例如 `http://localhost:5173/?print-pdf`），Reveal.js 會將整個網頁重新排列為適合列印的格式。此時在瀏覽器中按下 `Ctrl + P` (或 `Cmd + P`) 並選擇「另存為 PDF」，即可完美匯出為簡報投影片 PDF。

### 鍵盤快捷鍵
* `Space` / `Right Arrow`：下一步。
* `Left Arrow`：上一步。
* `Up` / `Down`：在垂直投影片中切換。
* `Esc` / `O`：開啟/關閉**投影片全局概覽 (Overview)** 模式。
* `F`：進入全螢幕模式。
* `B` / `.`：暫停簡報（螢幕全黑，讓觀眾重新聚焦於講者身上）。

---

## 6. 學術與進階擴充插件

Reveal.js 的架構為插件式設計，預設自帶了幾款強大的插件：

* **RevealMath (LaTeX 數學公式)**：支援使用 MathJax 或 KaTeX 渲染高品質的數學公式。
* **RevealZoom (雙擊縮放)**：按下 `Alt` 鍵並點擊投影片上的任何元素，該元素會被放大填滿螢幕，再次點擊還原。
* **RevealSearch (尋找功能)**：按下 `Ctrl + Shift + F`，可以在簡報中進行全文關鍵字搜尋。

---

## 7. JavaScript API 與事件監聽

你可以透過 JavaScript 完全控制簡報的運行，這非常適合用來製作互動式簡報、遠端控制或自訂控制面板。

### 常用 API 方法
```javascript
// 導航控制
Reveal.next();          // 下一頁
Reveal.prev();          // 上一頁
Reveal.slide(h, v, f);  // 切換到指定投影片 (水平index, 垂直index, fragmentIndex)

// 狀態查詢
Reveal.getIndices();    // 獲取目前投影片的座標 {h: 0, v: 0, f: undefined}
Reveal.isFirstSlide();  // 是否為第一張
Reveal.isLastSlide();   // 是否為最後一張
Reveal.getScale();      // 獲取目前的縮放比例
```

### 常用事件監聽 (Event Listeners)
當投影片狀態改變時，會觸發對應的事件，這能讓你執行自訂的 JS 動畫：
```javascript
// 監聽投影片切換事件
Reveal.on('slidechanged', event => {
  // event.previousSlide, event.currentSlide, event.indexh, event.indexv
  console.log('切換到了第 ' + event.indexh + ' 頁');
});

// 監聽 Fragment 顯示與隱藏
Reveal.on('fragmentshown', event => {
  // 當某個 fragment 出現時觸發
});
Reveal.on('fragmenthidden', event => {
  // 當某個 fragment 隱藏時觸發
});
```
