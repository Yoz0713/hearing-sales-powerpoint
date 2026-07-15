import { createContext, useContext } from 'react';

/**
 * 每張 slide 的全域索引，由 SlidesDeck 在 map 時提供（常數，不變）。
 * 讓 slide 元件與其 hooks 取得自己的索引，而無需 props 逐層傳遞。
 */
export const SlideIndexContext = createContext<number>(0);

export function useSlideIndex(): number {
  return useContext(SlideIndexContext);
}
