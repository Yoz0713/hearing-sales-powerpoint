import { useEffect, useState } from 'react';

/**
 * 反應式訂閱一個 media query，回傳目前是否符合。
 * 監聽 change 事件，使用者插拔滑鼠 / 旋轉平板時即時更新。
 * SSR / 不支援 matchMedia 時回退為 false。
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(query).matches
      : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // 與當前狀態對齊（query 變動時）
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
