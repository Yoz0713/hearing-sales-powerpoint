// design-sync 匯出進入點：只暴露同步範圍內的 5 個純版面/品牌元件。
// 刻意不匯出頁面/SlideShell/chrome（相依 reveal context），讓 bundle 精簡。
export { BrandLogo } from '../src/components/brand/BrandLogo';
export { StockBars } from '../src/components/brand/StockBars';
export { CoverLayout } from '../src/components/layouts/CoverLayout';
export { TwoColumnLayout } from '../src/components/layouts/TwoColumnLayout';
export { BigNumberLayout } from '../src/components/layouts/BigNumberLayout';
