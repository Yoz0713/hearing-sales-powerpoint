import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { RevealControlContext, type RevealControl } from '../context/RevealControlContext';
import {
  PresentationViewContext,
  type PresentationView,
} from '../context/PresentationViewContext';
import { SlideIndexContext } from '../context/SlideIndexContext';
import { ObserverMarksProvider } from '../context/ObserverMarksContext';
import { useReveal } from '../hooks/useReveal';
import { useGlobalHotkeys } from '../hooks/useGlobalHotkeys';
import { usePositionPersistence } from '../hooks/usePositionPersistence';
import { useWakeLock } from '../hooks/useWakeLock';
import { ProgressBar } from '../components/chrome/ProgressBar';
import { SlidePreviewNav } from '../components/chrome/SlidePreviewNav';
import { BlackoutOverlay } from '../components/chrome/BlackoutOverlay';
import { ShortcutGuide } from '../components/chrome/ShortcutGuide';
import { slides, deriveChapters, chapterTitleAt } from './slides.manifest';
import type { AnimationController, ResetHandler } from '../types/presentation';

/**
 * .slides 樹：memo 後（無 props）只渲染一次，之後完全 hands-off，
 * 不因換頁/黑屏 re-render，避免與 Reveal 的 DOM 變動打架（決策 2）。
 */
const SlidesDeck = memo(function SlidesDeck() {
  return (
    <div className="slides">
      {slides.map((entry, index) => {
        const Slide = entry.component;
        return (
          <section key={entry.id}>
            <SlideIndexContext.Provider value={index}>
              <Slide />
            </SlideIndexContext.Provider>
          </section>
        );
      })}
    </div>
  );
});

export function Presentation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { deckRef, currentIndex, isReady, onSlideChanged, getIndex, gotoIndex } =
    useReveal(rootRef);

  // 穩定的註冊表（決策 3/4）
  const resetHandlers = useRef(new Map<number, ResetHandler>());
  const animationControllers = useRef(new Map<number, AnimationController>());

  const [isBlackout, setIsBlackout] = useState(false);

  const chapters = useMemo(() => deriveChapters(slides), []);

  // 控制 context：身分恆定，slides 消費不 re-render。
  const control = useMemo<RevealControl>(
    () => ({
      getIndex,
      onSlideChanged,
      gotoIndex,
      registerReset: (index, fn) => {
        resetHandlers.current.set(index, fn);
        return () => {
          if (resetHandlers.current.get(index) === fn) resetHandlers.current.delete(index);
        };
      },
      registerAnimation: (index, ctrl) => {
        animationControllers.current.set(index, ctrl);
        return () => {
          if (animationControllers.current.get(index) === ctrl) {
            animationControllers.current.delete(index);
          }
        };
      },
      resetCurrent: () => {
        const i = getIndex();
        resetHandlers.current.get(i)?.(); // 1) 資料層
        animationControllers.current.get(i)?.replay(); // 2) 動畫層
        deckRef.current?.navigateFragment(-1); // 3) 收回本頁已顯示的 fragment
      },
    }),
    [getIndex, onSlideChanged, gotoIndex],
  );

  // 檢視 context：隨換頁/黑屏改變，僅 chrome 消費。
  const view = useMemo<PresentationView>(
    () => ({
      currentIndex,
      totalSlides: slides.length,
      currentChapterTitle: chapterTitleAt(chapters, currentIndex),
      isBlackout,
      toggleBlackout: () => setIsBlackout((b) => !b),
    }),
    [currentIndex, chapters, isBlackout],
  );

  // 決策 4：跨頁切換時，把「進入」的那一頁重置回初始狀態 —— 資料層歸零、
  // fragment 收回未播放。onSlideChanged 只在 h/v 索引真的變動時觸發（Reveal 的
  // 'slidechanged' 事件），同頁內上下鍵切 fragment 不會經過這裡，維持其正常的
  // 逐步播放/倒退。動畫層的進場重播已由 useSlideAnimation 自己訂閱同一事件處理，
  // 這裡不重複呼叫 replay()。
  useEffect(
    () =>
      onSlideChanged((active) => {
        resetHandlers.current.get(active)?.();
      }),
    [onSlideChanged],
  );

  // 全域防呆
  useGlobalHotkeys({ toggleBlackout: view.toggleBlackout, resetCurrent: control.resetCurrent });
  usePositionPersistence(deckRef, isReady);
  useWakeLock();

  return (
    <RevealControlContext.Provider value={control}>
      <PresentationViewContext.Provider value={view}>
        <div className="reveal" ref={rootRef}>
          {/* 只包 .slides：標記變動不得波及 chrome（見 ObserverMarksProvider 註解）。 */}
          <ObserverMarksProvider>
            <SlidesDeck />
          </ObserverMarksProvider>
        </div>
        <ProgressBar />
        <SlidePreviewNav />
        <ShortcutGuide />
        <BlackoutOverlay />
      </PresentationViewContext.Provider>
    </RevealControlContext.Provider>
  );
}
