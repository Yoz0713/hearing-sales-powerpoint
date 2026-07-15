import { useEffect, useRef } from 'react';
import { useRevealControl } from '../context/RevealControlContext';
import { useSlideIndex } from '../context/SlideIndexContext';
import type { ResetHandler } from '../types/presentation';

/**
 * 決策 4 第 2 層：有互動 React 資料的頁面可選註冊一個 reset()，
 * R 鍵時與動畫 revert 一併執行，避免「半重置」。
 * 無互動的頁面不呼叫此 hook，R 只跑動畫層。
 */
export function useSlideReset(reset: ResetHandler): void {
  const index = useSlideIndex();
  const control = useRevealControl();
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(
    () => control.registerReset(index, () => resetRef.current()),
    [index, control],
  );
}
