import { useEffect } from 'react';

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}
interface WakeLockNavigator {
  wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> };
}

/**
 * 決策 6：螢幕喚醒鎖，避免簡報停頓時顯示器休眠。
 * 分頁回到前景時重新取得（系統會在隱藏時自動釋放）。
 */
export function useWakeLock(): void {
  useEffect(() => {
    let sentinel: WakeLockSentinelLike | null = null;
    let cancelled = false;
    const nav = navigator as Navigator & WakeLockNavigator;

    const request = async () => {
      if (!nav.wakeLock) return;
      try {
        const s = await nav.wakeLock.request('screen');
        if (cancelled) {
          void s.release();
        } else {
          sentinel = s;
        }
      } catch {
        /* 使用者拒絕或不支援，靜默略過 */
      }
    };

    void request();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void request();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void sentinel?.release();
    };
  }, []);
}
