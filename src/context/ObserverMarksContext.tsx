import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/** 'keep' = 這一段最有幫助；'adjust' = 下一輪想調整這裡。 */
export type ObserverMark = 'keep' | 'adjust';

export interface ObserverMarksValue {
  /** 被標成「最有幫助」的段落 id；未標記為 null。 */
  keep: string | null;
  /** 被標成「下一輪想調整」的段落 id；未標記為 null。 */
  adjust: string | null;
  /** 依序切換：未標記 → keep → adjust → 取消。 */
  toggle: (stageId: string) => void;
  clear: () => void;
}

const ObserverMarksContext = createContext<ObserverMarksValue | null>(null);

/**
 * P40（AI 練習後復盤）與最後一頁（行動承諾）之間唯一的跨頁狀態：
 * P40 選出「下一輪要重寫」的那一段，最後一頁把它回指出來，讓學員寫成具體的一句話。
 *
 * 刻意只包住 <SlidesDeck />，不包 chrome：本 provider 的 state 變動只會
 * re-render 真正消費 context 的那兩頁，memo 過的 SlidesDeck 與兄弟節點的
 * ProgressBar / SlidePreviewNav 都不受影響（決策 2：.slides 樹 hands-off）。
 */
export function ObserverMarksProvider({ children }: { children: ReactNode }) {
  const [marks, setMarks] = useState<{ keep: string | null; adjust: string | null }>({
    keep: null,
    adjust: null,
  });

  const toggle = useCallback((stageId: string) => {
    setMarks((prev) => {
      const current: ObserverMark | null =
        prev.keep === stageId ? 'keep' : prev.adjust === stageId ? 'adjust' : null;
      const next: ObserverMark | null =
        current === null ? 'keep' : current === 'keep' ? 'adjust' : null;
      // 先把這一段從兩個標記中拿掉，再指派下一個狀態，
      // 讓同一種標記自動從舊的段落移轉過來。
      const cleared = {
        keep: prev.keep === stageId ? null : prev.keep,
        adjust: prev.adjust === stageId ? null : prev.adjust,
      };
      return next === null ? cleared : { ...cleared, [next]: stageId };
    });
  }, []);

  const clear = useCallback(() => setMarks({ keep: null, adjust: null }), []);

  const value = useMemo<ObserverMarksValue>(
    () => ({ keep: marks.keep, adjust: marks.adjust, toggle, clear }),
    [marks, toggle, clear],
  );

  return <ObserverMarksContext.Provider value={value}>{children}</ObserverMarksContext.Provider>;
}

export function useObserverMarks(): ObserverMarksValue {
  const ctx = useContext(ObserverMarksContext);
  if (!ctx) {
    throw new Error('useObserverMarks 必須在 <ObserverMarksProvider> 內使用');
  }
  return ctx;
}
