import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { useRevealControl } from '../context/RevealControlContext';
import { useSlideIndex } from '../context/SlideIndexContext';

/**
 * 在 scope 內建立 GSAP timeline 的工廠函式。
 * 以「選擇器」操作元素（gsap.context 已 scope 到本頁 root），無需 element ref。
 */
export type BuildTimeline = (scope: HTMLElement) => void;

const NOOP: BuildTimeline = () => {};

/**
 * 決策 3：每頁一個 gsap.context()，scope 到本頁 root ref。
 *  - 本頁成為 active → 建立 context（自動播放進場）
 *  - 離頁 / 卸載 → ctx.revert()（清除所有 GSAP 變更與 inline style）
 *  - 對 Context 註冊 replay()，供 R 鍵呼叫（revert 後重建）
 *
 * 不訂閱 React state：靠 RevealControl.onSlideChanged 事件 imperative 驅動，
 * 因此 slide 不會因換頁 re-render（決策 2 hands-off）。
 */
export function useSlideAnimation(build: BuildTimeline = NOOP): RefObject<HTMLDivElement> {
  const index = useSlideIndex();
  const control = useRevealControl();
  const scopeRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const buildRef = useRef(build);
  buildRef.current = build;

  useEffect(() => {
    const buildCtx = () => {
      if (!scopeRef.current) return;
      ctxRef.current = gsap.context(() => {
        buildRef.current(scopeRef.current as HTMLElement);
      }, scopeRef);
    };

    const revert = () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };

    const handleSlideChanged = (active: number) => {
      revert();
      if (active === index) buildCtx();
    };

    // 若掛載時本頁已是 active（例如位置還原後），立即建立。
    if (control.getIndex() === index) buildCtx();

    const unsubscribe = control.onSlideChanged(handleSlideChanged);
    const unregister = control.registerAnimation(index, {
      replay: () => {
        revert();
        buildCtx();
      },
    });

    return () => {
      unsubscribe();
      unregister();
      revert();
    };
  }, [index, control]);

  return scopeRef;
}
