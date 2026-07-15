import { useEffect, type RefObject } from 'react';
import Reveal from 'reveal.js';

const STORAGE_KEY = 'presentation:lastIndex';

/**
 * 決策 6：把當前索引寫入 localStorage，載入時還原。
 * 碰撞/刷新/GPU context 死掉後不會回到第 1 頁。
 */
export function usePositionPersistence(
  deckRef: RefObject<Reveal | null>,
  isReady: boolean,
): void {
  useEffect(() => {
    if (!isReady) return;
    const deck = deckRef.current;
    if (!deck) return;

    // 還原（無動畫直接跳）
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const h = Number.parseInt(saved, 10);
      if (!Number.isNaN(h)) deck.slide(h, 0);
    }

    const save = () => {
      localStorage.setItem(STORAGE_KEY, String(deck.getIndices().h));
    };
    deck.on('slidechanged', save);
    return () => deck.off('slidechanged', save);
  }, [deckRef, isReady]);
}
