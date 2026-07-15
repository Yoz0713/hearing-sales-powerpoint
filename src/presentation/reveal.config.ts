import type { RevealOptions } from 'reveal.js';

/**
 * 決策 6「鎖定誤觸導覽」+ 決策 8（1920×1080 / 16:9）。
 * 自行渲染進度條/控制項，故關閉 Reveal 內建 UI 與 swipe/scroll/overview。
 */
export const revealConfig: RevealOptions = {
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 2.0,
  center: true,

  // 自繪 chrome
  controls: false,
  progress: false,
  slideNumber: false,

  // 防誤觸
  touch: false, // 關 swipe
  mouseWheel: false, // 關滾輪翻頁
  overview: false, // 關總覽（O / Esc）
  hash: false,
  history: false,
  loop: false,
  fragments: true,
  transition: 'slide',
  backgroundTransition: 'fade',

  // 停用內建 B(66)/'.'(190) 黑屏、O(79) 總覽、Esc(27)；改由 useGlobalHotkeys 統一處理。
  // 方向鍵(37/38/39/40)在 useReveal.ts 建構 deck 時被覆寫為「左右直接換頁、上下操作
  // 頁內 fragment」；Space / PageUp(33) / PageDown(34) 維持預設（fragment 跑完才換頁），
  // 當作多數 clicker 的安全網。
  keyboard: {
    66: null,
    190: null,
    79: null,
    27: null,
  },
};
