# DESIGN.md — 簡報設計系統（Design Tokens）

## 0. 文件資訊與合規說明
- **來源**：`assets/培訓教材模板.pptx` → `ppt/theme/theme1.xml`，直接由 OOXML `<a:clrScheme>` / `<a:fontScheme>` 萃取（非 OCR；先前貼上的報告已證實有資料損毀，本檔以解壓後原始 XML 為準）。
- **Canonical 品牌主題**：`theme1`「大樹母片範本」。theme2–5 為 PowerPoint 內建 Office 樣板繼承，僅列於附錄（§10），新元件不得引用。
- **Token 架構**：3 層 + 遵循 W3C Design Tokens Community Group（DTCG）命名慣例
  1. **Primitive**（原始萃取值，§2）
  2. **Semantic**（語意別名 / role-based，§3）
  3. **Derived**（衍生：data-viz / 字級 / spacing / radius / shadow / motion，§4–9；pptx 未定義，為框架需要而新增，逐一標注）
- **單一事實來源（SSOT）**：§12 的 DTCG JSON；§11 的 CSS Custom Properties 為其產物。
- **命名**：kebab-case；別名以 `{group.name}` 參照。

## 1. 畫布 Canvas
| token | 值 | 說明 |
|---|---|---|
| `canvas-ratio` | `16 / 9` | 版面比例 |
| `canvas-emu` | `12192000 × 6858000` | OOXML `sldSz`（原始） |
| `canvas-size-physical` | `33.87cm × 19.05cm`（13.333in × 7.5in） | 實尺寸 |
| `canvas-width` / `canvas-height` | `1920` / `1080`（px @96dpi） | Reveal.js 基準解析度 |

## 2. Primitive Color Tokens（theme1 原始值）
| token | 值 | OOXML 來源 | 說明 |
|---|---|---|---|
| `color-base-black` | `#000000` | dk1 / sysWindowText | |
| `color-base-white` | `#FFFFFF` | lt1 / sysWindow | |
| `color-forest-900` | `#455F51` | dk2 | 深森林綠 |
| `color-parchment-100` | `#E2DFCC` | lt2 | 暖米色 |
| `color-green-lime` | `#99CB38` | accent1 | （貼上報告漏失值） |
| `color-green-grass` | `#63A537` | accent2 | |
| `color-green-emerald` | `#37A76F` | accent3 | |
| `color-teal` | `#44C1A3` | accent4 | |
| `color-cyan` | `#4EB3CF` | accent5 | |
| `color-sky` | `#51C3F9` | accent6 | |
| `color-orange` | `#EE7B08` | hlink | |
| `color-gold` | `#977B2D` | folHlink | |

## 3. Semantic Color Tokens（語意別名）
| token | 參照 → 值 | 角色 |
|---|---|---|
| `color-brand-primary` | `{color-green-grass}` `#63A537` | 主品牌綠 / 主要 CTA / 重點 |
| `color-brand-primary-bright` | `{color-green-lime}` `#99CB38` | hover / 大數字高亮 |
| `color-brand-secondary` | `{color-green-emerald}` `#37A76F` | 次要強調 |
| `color-brand-accent` | `{color-cyan}` `#4EB3CF` | 點綴 / 連結態 |
| `color-text-heading` | `{color-forest-900}` `#455F51` | 標題 |
| `color-text-body` | `{color-base-black}` `#000000` | 內文 |
| `color-text-on-brand` | `{color-base-white}` `#FFFFFF` | 品牌底色上文字 |
| `color-surface-base` | `{color-base-white}` | 主背景 |
| `color-surface-muted` | `{color-parchment-100}` `#E2DFCC` | 次背景 / 卡片 |
| `color-surface-inverse` | `{color-forest-900}` `#455F51` | 深底區塊 |
| `color-link` / `color-link-visited` | `{color-orange}` / `{color-gold}` | 連結 / 已點閱 |
| `color-focus-ring` | `{color-cyan}` `#4EB3CF` | 焦點環 |
| `color-feedback-success` | `{color-green-emerald}` `#37A76F` | **衍生**（pptx 無語意色） |
| `color-feedback-warning` | `{color-orange}` `#EE7B08` | **衍生** |
| `color-feedback-danger` | `#D64545` | **衍生**（pptx 無，新增） |

## 4. Data-Viz 序列色（衍生，給銷售數據圖表）
theme1 accent1→6 是一條刻意的綠→青漸層，適合 categorical / sequential：
`chart-seq`: `#99CB38` · `#63A537` · `#37A76F` · `#44C1A3` · `#4EB3CF` · `#51C3F9`

### 4.1 白底紙質格線（衍生背景配方）
- **適用面**：所有白色或淺色投影片，作為全簡報一致的筆記紙質感；由 `SlideShell` 預設套用。
- **格線**：水平與垂直各一層 `linear-gradient`，線寬 `1px`、間距 `72px × 72px`、線色 `rgba(69, 95, 81, 0.04)`。
- **例外**：沉浸式非白底／純色底頁不疊加格線，使用 `backgroundTexture="none"`；局部深色卡片、圖片與品牌色塊維持原底色，不把格線覆蓋到內容表面。
- **實作責任**：共用配方定義於 `.slide-shell--paper` 的 `--slide-paper-grid` 與 `--slide-paper-grid-size`。滿版白底容器保持透明；局部淺色區塊若會遮住共用層，沿用同一配方疊加，禁止逐頁另訂線色或尺寸。

## 5. Typography

### 5.1 字型家族（三角色系統，衍生）
專案自架 webfont（`@fontsource-variable/*`，離線可靠、不依賴 CDN），依「角色」而非「頁面」指定。**新元件一律用下列 CSS 變數，不得寫死字型名稱**（歷史殘留的 `Cabinet Grotesk` / `Outfit` / `Geist` 皆未載入，已全數移除）。

| 角色 | Token | 字型 | 用途 |
|---|---|---|---|
| 標題 Display | `--font-family-display` | 思源宋 **Noto Serif TC** | 所有頁面大標題、問句、章節主字（襯線編輯感） |
| 內文 Base | `--font-family-base` | 思源黑 **Noto Sans TC** | 內文、UI、標籤、眉標；元素預設繼承即為此角色 |
| 數字 Latin | `--font-family-latin` | **Outfit** | 純數字、序號、代碼、英文跑馬燈；中文自動回退 base |

**套用規則（重要）：**
- **頁面標題 = `var(--font-family-display)`**。凡是「一頁最大的那句中文標題／問句」都必須顯式指定 display，不能只靠繼承（繼承會落到 base 黑體，就不是襯線）。
- 嚴禁大範圍純色區塊。
- 內文、眉標、說明文字不必指定 font-family，繼承 base 即可。
- 只有「內容為數字或英文」的小元素才用 latin（Outfit 無中文字符，中文會回退 base）。
- 匯入位置：`src/main.tsx` 最上方，`reveal.css` 之後、`tokens.css` 之前，依序 `noto-serif-tc` → `noto-sans-tc` → `outfit`。

字型堆疊定義：
- `font-family-base`: `'Noto Sans TC Variable', "Microsoft JhengHei", "微軟正黑體", "PingFang TC", -apple-system, sans-serif`
- `font-family-display`: `'Noto Serif TC Variable', "Noto Serif CJK TC", "Songti TC", "PingFang TC", serif`
- `font-family-latin`: `'Outfit Variable', var(--font-family-base)`
  - theme1 母片原始 major+minor 皆 **Microsoft YaHei**（简体導向），繁中現場改以 Noto Sans TC 為主、`Microsoft JhengHei` 為系統回退（衍生）。

### 5.2 字重與字級
- `font-weight`: light `300` / regular `400` / semibold `600` / bold `700`
- **字級階層**（衍生；簡報需大字，base 24px @1080p，比例 ~1.333 Perfect Fourth）：

| token | px |
|---|---|
| `font-size-display` | 96 |
| `font-size-h1` | 72 |
| `font-size-h2` | 48 |
| `font-size-h3` | 36 |
| `font-size-body-lg` | 28 |
| `font-size-body` | 24 |
| `font-size-caption` | 18 |
| `font-size-fine` | 14 |

- `line-height`: tight `1.1`（標題）/ snug `1.3` / normal `1.5`（內文）
- `letter-spacing`: heading `-0.01em` / body `0` / caps `0.08em`

## 6. Spacing（衍生，8pt 基準 @1080p，單位 px）
`0·4·8·12·16·24·32·48·64·96·128` → `space-0 … space-16`
- `slide-safe-padding` `80`（現場投影安全邊界）
- `grid-columns` `12`，`grid-gutter` `{space-5}` `24`

## 7. Radius / Border（衍生）
`radius-sm 4` / `radius-md 8` / `radius-lg 16` / `radius-xl 24` / `radius-pill 999`
`border-width`: hairline `1` / thin `2` / thick `4`；`border-color-subtle` `rgba(69,95,81,.16)`

## 8. Shadow / Elevation（衍生，森林綠陰影）
- `elevation-1` `0 2px 8px rgba(69,95,81,.12)`
- `elevation-2` `0 8px 24px rgba(69,95,81,.16)`
- `elevation-3` `0 16px 48px rgba(69,95,81,.20)`
- `glow-brand` `0 0 32px rgba(153,203,56,.45)`（大數字高亮）

## 9. Motion（GSAP，對接框架決策）
- `duration`（s）：instant `.15` / fast `.3` / base `.5` / slow `.8` / count-up `1.2`
- `easing`：`ease-standard "power2.out"` · `ease-emphasis "power3.out"` · `ease-enter "back.out(1.4)"` · `ease-count "power1.inOut"`
- `fragment-stagger` `.08`
- 註：所有 within-slide 動畫由 `gsap.context()` 建立，`ctx.revert()` 同時負責離頁清除與 R 鍵重置（見 Phase 1 決策 3／4）。GSAP easing 非 CSS 值，僅以 JS 常數匯出（`tokens.motion.ts`）。

## 10. 附錄：Legacy Office 主題（theme2–5，不使用）
| | dk2 | lt2 | accent1–6 | hlink | folHlink | 字型 |
|---|---|---|---|---|---|---|
| theme2/3/4 | `#44546A` | `#E7E6E6` | `#5B9BD5 #ED7D31 #A5A5A5 #FFC000 #4472C4 #70AD47` | `#0563C1` | `#954F72` | Calibri Light / Calibri |
| theme5 | 同上 | 同上 | accent1/5 對調（`#4472C4` 領頭） | 同上 | 同上 | 同上 |

標記為 **legacy**；新元件一律使用 §2–9 的品牌 token。

## 11. CSS Custom Properties（產物，完整）
```css
:root {
  /* canvas */
  --canvas-width: 1920px;
  --canvas-height: 1080px;
  --canvas-ratio: 16 / 9;

  /* primitive color */
  --color-base-black: #000000;
  --color-base-white: #FFFFFF;
  --color-forest-900: #455F51;
  --color-parchment-100: #E2DFCC;
  --color-green-lime: #99CB38;
  --color-green-grass: #63A537;
  --color-green-emerald: #37A76F;
  --color-teal: #44C1A3;
  --color-cyan: #4EB3CF;
  --color-sky: #51C3F9;
  --color-orange: #EE7B08;
  --color-gold: #977B2D;

  /* semantic color */
  --color-brand-primary: var(--color-green-grass);
  --color-brand-primary-bright: var(--color-green-lime);
  --color-brand-secondary: var(--color-green-emerald);
  --color-brand-accent: var(--color-cyan);
  --color-text-heading: var(--color-forest-900);
  --color-text-body: var(--color-base-black);
  --color-text-on-brand: var(--color-base-white);
  --color-surface-base: var(--color-base-white);
  --color-surface-muted: var(--color-parchment-100);
  --color-surface-inverse: var(--color-forest-900);
  --color-link: var(--color-orange);
  --color-link-visited: var(--color-gold);
  --color-focus-ring: var(--color-cyan);
  --color-feedback-success: var(--color-green-emerald);
  --color-feedback-warning: var(--color-orange);
  --color-feedback-danger: #D64545;

  /* data-viz sequence */
  --chart-seq-1: #99CB38;
  --chart-seq-2: #63A537;
  --chart-seq-3: #37A76F;
  --chart-seq-4: #44C1A3;
  --chart-seq-5: #4EB3CF;
  --chart-seq-6: #51C3F9;

  /* typography */
  --font-family-base: 'Noto Sans TC Variable', "Microsoft JhengHei", "微軟正黑體", "PingFang TC", -apple-system, sans-serif;
  --font-family-display: 'Noto Serif TC Variable', "Noto Serif CJK TC", "Songti TC", "PingFang TC", serif;
  --font-family-latin: 'Outfit Variable', var(--font-family-base);
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-size-display: 96px;
  --font-size-h1: 72px;
  --font-size-h2: 48px;
  --font-size-h3: 36px;
  --font-size-body-lg: 28px;
  --font-size-body: 24px;
  --font-size-caption: 18px;
  --font-size-fine: 14px;
  --line-height-tight: 1.1;
  --line-height-snug: 1.3;
  --line-height-normal: 1.5;
  --letter-spacing-heading: -0.01em;
  --letter-spacing-body: 0;
  --letter-spacing-caps: 0.08em;

  /* spacing */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-8: 48px;
  --space-10: 64px;
  --space-12: 96px;
  --space-16: 128px;
  --slide-safe-padding: 80px;
  --grid-columns: 12;
  --grid-gutter: var(--space-5);

  /* radius / border */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;
  --border-width-hairline: 1px;
  --border-width-thin: 2px;
  --border-width-thick: 4px;
  --border-color-subtle: rgba(69, 95, 81, 0.16);

  /* shadow / elevation */
  --elevation-1: 0 2px 8px rgba(69, 95, 81, 0.12);
  --elevation-2: 0 8px 24px rgba(69, 95, 81, 0.16);
  --elevation-3: 0 16px 48px rgba(69, 95, 81, 0.20);
  --glow-brand: 0 0 32px rgba(153, 203, 56, 0.45);

  /* motion (CSS-expressible durations only; GSAP easing 見 tokens.motion.ts) */
  --duration-instant: 0.15s;
  --duration-fast: 0.3s;
  --duration-base: 0.5s;
  --duration-slow: 0.8s;
  --duration-count-up: 1.2s;
  --fragment-stagger: 0.08s;
}
```

```ts
// tokens.motion.ts — GSAP easing 非 CSS 值，於 JS 端匯出
export const motion = {
  duration: { instant: 0.15, fast: 0.3, base: 0.5, slow: 0.8, countUp: 1.2 },
  ease: {
    standard: 'power2.out',
    emphasis: 'power3.out',
    enter: 'back.out(1.4)',
    count: 'power1.inOut',
  },
  fragmentStagger: 0.08,
} as const;
```

## 12. DTCG JSON（機器可讀 SSOT，完整）
```json
{
  "$description": "簡報設計系統 — canonical 來源 theme1（大樹母片範本）；節點標注 derived 者為 pptx 未定義之框架衍生。",
  "color": {
    "$type": "color",
    "base":    { "black": { "$value": "#000000" }, "white": { "$value": "#FFFFFF" } },
    "forest":  { "900": { "$value": "#455F51" } },
    "parchment": { "100": { "$value": "#E2DFCC" } },
    "green":   { "lime": { "$value": "#99CB38" }, "grass": { "$value": "#63A537" }, "emerald": { "$value": "#37A76F" } },
    "teal":    { "$value": "#44C1A3" },
    "cyan":    { "$value": "#4EB3CF" },
    "sky":     { "$value": "#51C3F9" },
    "orange":  { "$value": "#EE7B08" },
    "gold":    { "$value": "#977B2D" },
    "brand": {
      "primary":        { "$value": "{color.green.grass}" },
      "primary-bright": { "$value": "{color.green.lime}" },
      "secondary":      { "$value": "{color.green.emerald}" },
      "accent":         { "$value": "{color.cyan}" }
    },
    "text": {
      "heading":  { "$value": "{color.forest.900}" },
      "body":     { "$value": "{color.base.black}" },
      "on-brand": { "$value": "{color.base.white}" }
    },
    "surface": {
      "base":    { "$value": "{color.base.white}" },
      "muted":   { "$value": "{color.parchment.100}" },
      "inverse": { "$value": "{color.forest.900}" }
    },
    "link":         { "default": { "$value": "{color.orange}" }, "visited": { "$value": "{color.gold}" } },
    "focus-ring":   { "$value": "{color.cyan}" },
    "feedback": {
      "success": { "$value": "{color.green.emerald}", "$extensions": { "origin": "derived" } },
      "warning": { "$value": "{color.orange}", "$extensions": { "origin": "derived" } },
      "danger":  { "$value": "#D64545", "$extensions": { "origin": "derived" } }
    },
    "chart-seq": {
      "$extensions": { "origin": "derived" },
      "1": { "$value": "{color.green.lime}" },
      "2": { "$value": "{color.green.grass}" },
      "3": { "$value": "{color.green.emerald}" },
      "4": { "$value": "{color.teal}" },
      "5": { "$value": "{color.cyan}" },
      "6": { "$value": "{color.sky}" }
    }
  },
  "font": {
    "family-base": { "$type": "fontFamily", "$value": ["Microsoft YaHei", "Microsoft JhengHei", "微軟正黑體", "-apple-system", "PingFang TC", "sans-serif"] },
    "weight": {
      "$type": "fontWeight",
      "light": { "$value": 300 }, "regular": { "$value": 400 }, "semibold": { "$value": 600 }, "bold": { "$value": 700 }
    },
    "size": {
      "$type": "dimension", "$extensions": { "origin": "derived" },
      "display":  { "$value": "96px" },
      "h1":       { "$value": "72px" },
      "h2":       { "$value": "48px" },
      "h3":       { "$value": "36px" },
      "body-lg":  { "$value": "28px" },
      "body":     { "$value": "24px" },
      "caption":  { "$value": "18px" },
      "fine":     { "$value": "14px" }
    },
    "line-height": { "$type": "number", "tight": { "$value": 1.1 }, "snug": { "$value": 1.3 }, "normal": { "$value": 1.5 } }
  },
  "space": {
    "$type": "dimension", "$extensions": { "origin": "derived" },
    "0": { "$value": "0" }, "1": { "$value": "4px" }, "2": { "$value": "8px" }, "3": { "$value": "12px" },
    "4": { "$value": "16px" }, "5": { "$value": "24px" }, "6": { "$value": "32px" }, "8": { "$value": "48px" },
    "10": { "$value": "64px" }, "12": { "$value": "96px" }, "16": { "$value": "128px" },
    "slide-safe-padding": { "$value": "80px" }
  },
  "radius": {
    "$type": "dimension", "$extensions": { "origin": "derived" },
    "sm": { "$value": "4px" }, "md": { "$value": "8px" }, "lg": { "$value": "16px" }, "xl": { "$value": "24px" }, "pill": { "$value": "999px" }
  },
  "shadow": {
    "$type": "shadow", "$extensions": { "origin": "derived" },
    "elevation-1": { "$value": { "offsetX": "0", "offsetY": "2px", "blur": "8px", "spread": "0", "color": "rgba(69,95,81,0.12)" } },
    "elevation-2": { "$value": { "offsetX": "0", "offsetY": "8px", "blur": "24px", "spread": "0", "color": "rgba(69,95,81,0.16)" } },
    "elevation-3": { "$value": { "offsetX": "0", "offsetY": "16px", "blur": "48px", "spread": "0", "color": "rgba(69,95,81,0.20)" } },
    "glow-brand":  { "$value": { "offsetX": "0", "offsetY": "0", "blur": "32px", "spread": "0", "color": "rgba(153,203,56,0.45)" } }
  },
  "motion": {
    "$extensions": { "origin": "derived" },
    "duration": {
      "$type": "duration",
      "instant": { "$value": "150ms" }, "fast": { "$value": "300ms" }, "base": { "$value": "500ms" },
      "slow": { "$value": "800ms" }, "count-up": { "$value": "1200ms" }, "fragment-stagger": { "$value": "80ms" }
    },
    "ease": {
      "$type": "cubicBezier",
      "$description": "值為 GSAP ease 名稱字串，非標準 cubic-bezier 陣列；由 tokens.motion.ts 消費。",
      "standard": { "$value": "power2.out" }, "emphasis": { "$value": "power3.out" },
      "enter": { "$value": "back.out(1.4)" }, "count": { "$value": "power1.inOut" }
    }
  }
}
```
