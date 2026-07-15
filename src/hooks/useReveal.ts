import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Reveal from 'reveal.js';
import { revealConfig } from '../presentation/reveal.config';
import type { SlideChangedListener } from '../types/presentation';

export interface UseRevealResult {
  deckRef: RefObject<Reveal | null>;
  currentIndex: number;
  isReady: boolean;
  /** 事件式訂閱換頁（給 slide hooks，避免 re-render）。 */
  onSlideChanged: (cb: SlideChangedListener) => () => void;
  getIndex: () => number;
  gotoIndex: (index: number) => void;
}

/**
 * 初始化 Reveal.js 並把換頁事件同時：
 *  (a) 推進 React state（currentIndex，給 chrome 重繪）
 *  (b) 廣播給事件訂閱者（給 slide 動畫 hooks，imperative，不 re-render）。
 */
export function useReveal(rootRef: RefObject<HTMLDivElement | null>): UseRevealResult {
  const deckRef = useRef<Reveal | null>(null);
  const listeners = useRef(new Set<SlideChangedListener>());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const deck = new Reveal(rootRef.current, {
      ...revealConfig,
      keyboard: {
        ...(revealConfig.keyboard as Record<string, unknown>),
        37: () => deckRef.current?.left({ skipFragments: true }), // Left：直接換上一頁
        39: () => deckRef.current?.right({ skipFragments: true }), // Right：直接換下一頁
        38: () => deckRef.current?.prevFragment(), // Up：上一步 fragment（不換頁）
        40: () => deckRef.current?.nextFragment(), // Down：下一步 fragment（不換頁）
      },
    });
    deckRef.current = deck;

    const broadcast = () => {
      const h = deck.getIndices().h;
      setCurrentIndex(h);
      listeners.current.forEach((cb) => cb(h));
    };

    deck.on('ready', broadcast);
    deck.on('slidechanged', broadcast);

    void deck.initialize().then(() => {
      setIsReady(true);
      broadcast();
    });

    return () => {
      try {
        deck.destroy();
      } catch {
        /* Reveal 在 HMR/卸載時偶有 race，安全忽略 */
      }
      deckRef.current = null;
    };
    // 僅初始化一次：rootRef 為穩定 ref。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSlideChanged = useCallback((cb: SlideChangedListener) => {
    listeners.current.add(cb);
    return () => {
      listeners.current.delete(cb);
    };
  }, []);

  const getIndex = useCallback(() => deckRef.current?.getIndices().h ?? 0, []);

  const gotoIndex = useCallback((index: number) => {
    deckRef.current?.slide(index, 0);
  }, []);

  return { deckRef, currentIndex, isReady, onSlideChanged, getIndex, gotoIndex };
}
