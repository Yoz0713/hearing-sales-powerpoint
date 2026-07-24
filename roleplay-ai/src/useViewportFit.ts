import { useEffect, useRef } from 'react';

/**
 * 讓畫面貼齊「真正看得到的那一塊」。
 *
 * iOS Safari 叫出鍵盤時不會縮小 layout viewport，`100dvh` 量到的還是整個螢幕；
 * Safari 只是把整頁往上捲，好讓輸入框露出來。結果就是 header 被推出畫面上緣、
 * 對話區被鍵盤蓋掉一半，前後文捲不到。
 *
 * 這裡改用 visualViewport（真正可見區域）把高度與位移寫成 CSS 變數：
 * - `--app-h`：可見高度，畫面用它取代 100dvh。
 * - `--app-top`：可見區相對 layout viewport 的位移，補給 `position: fixed` 的 top，
 *   抵銷 Safari 那一段自動捲動。
 * 另外在 <html> 掛 `data-keyboard="open"`，讓鍵盤開著時不用再留 home indicator 的安全區。
 *
 * 桌機與不支援 visualViewport 的瀏覽器不會掛任何變數，CSS 自動退回 `100dvh`。
 *
 * @param active 只在需要的畫面（對話畫面）開啟；離開時會把變數清掉。
 * @param onResize 可見高度變動後呼叫，用來把對話捲回底部。
 */
export function useViewportFit(active: boolean, onResize?: () => void): void {
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  useEffect(() => {
    const vv = window.visualViewport;
    const root = document.documentElement;
    if (!active || !vv) return;

    let raf = 0;
    const apply = () => {
      cancelAnimationFrame(raf);
      // resize / scroll 在鍵盤動畫期間會連續觸發，合併到下一幀再寫。
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--app-h', `${vv.height}px`);
        root.style.setProperty('--app-top', `${vv.offsetTop}px`);
        // 高度少掉一大截才算鍵盤，避免把網址列收合誤判成鍵盤。
        const keyboard = window.innerHeight - vv.height > 120;
        root.dataset.keyboard = keyboard ? 'open' : 'closed';
        onResizeRef.current?.();
      });
    };

    apply();
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
      root.style.removeProperty('--app-h');
      root.style.removeProperty('--app-top');
      delete root.dataset.keyboard;
    };
  }, [active]);
}
