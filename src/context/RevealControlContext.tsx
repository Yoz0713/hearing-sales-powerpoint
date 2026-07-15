import { createContext, useContext } from 'react';
import type {
  AnimationController,
  ResetHandler,
  SlideChangedListener,
} from '../types/presentation';

/**
 * 「控制」context（決策 2）：value 身分恆定，slides 與 hooks 消費它**不會**
 * 因換頁而 re-render。所有換頁資訊以事件訂閱方式取得，維持 .slides 的 hands-off。
 */
export interface RevealControl {
  /** 讀取當前水平索引 h（imperative，不觸發 re-render）。 */
  getIndex: () => number;
  /** 訂閱換頁；回傳取消訂閱函式。 */
  onSlideChanged: (cb: SlideChangedListener) => () => void;
  /** 註冊某頁的資料層重置；回傳取消註冊函式（決策 4）。 */
  registerReset: (index: number, fn: ResetHandler) => () => void;
  /** 註冊某頁的動畫控制器；回傳取消註冊函式（決策 3）。 */
  registerAnimation: (index: number, ctrl: AnimationController) => () => void;
  /** R 鍵：重置當前頁的資料層 + 重播動畫層。 */
  resetCurrent: () => void;
  /** 跳轉到指定索引（章節導覽用）。 */
  gotoIndex: (index: number) => void;
}

export const RevealControlContext = createContext<RevealControl | null>(null);

export function useRevealControl(): RevealControl {
  const ctx = useContext(RevealControlContext);
  if (!ctx) {
    throw new Error('useRevealControl 必須在 <Presentation> 內使用');
  }
  return ctx;
}
