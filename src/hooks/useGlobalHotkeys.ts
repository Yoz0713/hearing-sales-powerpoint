import { useEffect } from 'react';

export interface GlobalHotkeyHandlers {
  /** B（與部分 clicker 的 '.'）：切換黑屏專注。 */
  toggleBlackout: () => void;
  /** R：重置當前頁動畫 + 資料。 */
  resetCurrent: () => void;
}

/**
 * 決策 6：全域鍵位。Reveal 已處理 arrows/space/PageUp/PageDown（含多數 clicker），
 * 並在 reveal.config 停用了 B/'.'/O/Esc 的內建行為，改由此處集中控制。
 */
export function useGlobalHotkeys({ toggleBlackout, resetCurrent }: GlobalHotkeyHandlers): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 在輸入元素中打字時不攔截
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === 'b' || key === '.') {
        e.preventDefault();
        toggleBlackout();
      } else if (key === 'r') {
        e.preventDefault();
        resetCurrent();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleBlackout, resetCurrent]);
}
