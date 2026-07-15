import { createContext, useContext } from 'react';

/**
 * 「檢視」context：隨換頁/黑屏改變，僅供畫面邊緣 chrome（ProgressBar /
 * ChapterNavigation / BlackoutOverlay）消費；這些元件在 .slides 之外，re-render 安全。
 */
export interface PresentationView {
  currentIndex: number;
  totalSlides: number;
  currentChapterTitle: string;
  isBlackout: boolean;
  toggleBlackout: () => void;
}

export const PresentationViewContext = createContext<PresentationView | null>(null);

export function usePresentationView(): PresentationView {
  const ctx = useContext(PresentationViewContext);
  if (!ctx) {
    throw new Error('usePresentationView 必須在 <Presentation> 內使用');
  }
  return ctx;
}
