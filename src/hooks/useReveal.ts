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

    let lastH = 0;

    const broadcast = () => {
      const indices = deck.getIndices();
      const h = indices.h;
      if (h !== lastH && indices.f !== undefined && indices.f !== -1) {
        // 進入的這一頁殘留著上次造訪時「已顯示」的 fragment（SlidesDeck 只掛載
        // 一次，fragment 的 .visible class 不會因為離開投影片而自動清除）。
        // deck.slide(h, 0, -1) 用來把它收回成未顯示，但 h/v 本身沒有變化，
        // Reveal 不會再派發 slidechanged 事件（見 reveal.js 的 slide()：
        // dispatchSlideChanged 只在 slideChanged 為真時才呼叫）。
        // 用 setTimeout 是為了避開在目前這次 slidechanged 事件處理常式裡
        // 遞迴呼叫 Reveal API；但先前這裡在等待重試前直接 return，導致
        // lastH／currentIndex／監聽者永遠沒被更新——進度條與頁碼因此卡住，
        // 且往後每次換頁的比對基準都是錯的。現在無論是否需要收回 fragment，
        // 都要在本次呼叫就完成廣播，收回動作只是附帶的清理，不能擋住它。
        setTimeout(() => {
          deck.slide(h, 0, -1);
        }, 0);
      }
      lastH = h;
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
