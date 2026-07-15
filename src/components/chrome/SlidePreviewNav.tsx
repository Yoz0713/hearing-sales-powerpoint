import { useCallback, useEffect, useRef, useState } from 'react';
import { usePresentationView } from '../../context/PresentationViewContext';
import { useRevealControl } from '../../context/RevealControlContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { slides, previewShapeAt, previewTitleAt } from '../../presentation/slides.manifest';
import type { PreviewShape } from '../../types/presentation';

/** 收合延遲（ms）：滑鼠離開面板後稍候再收，防止抹門邊緣的閃爍。 */
const CLOSE_DELAY = 200;
/** 邊緣自動捲動的觸發比例（面板左右各 15%）。 */
const EDGE = 0.15;
/** 邊緣自動捲動的最大速度（px / frame）。 */
const MAX_SPEED = 18;

/** 依骨架形狀渲染預覽卡片的示意結構。 */
function renderSkeleton(shape: PreviewShape) {
  switch (shape) {
    case 'cover':
      return (
        <div className="preview-skeleton preview-skeleton--cover">
          <div className="preview-skeleton__line preview-skeleton__line--title-center" />
          <div className="preview-skeleton__line preview-skeleton__line--sub-center" />
        </div>
      );
    case 'split':
      return (
        <div className="preview-skeleton preview-skeleton--split">
          <div className="preview-skeleton__col" />
          <div className="preview-skeleton__col" />
        </div>
      );
    case 'content':
    default:
      return (
        <div className="preview-skeleton preview-skeleton--content">
          <div className="preview-skeleton__line preview-skeleton__line--short" />
          <div className="preview-skeleton__line preview-skeleton__line--long" />
          <div className="preview-skeleton__line preview-skeleton__line--medium" />
        </div>
      );
  }
}

/**
 * 桌面懸浮預覽導覽：底部 hover 熱區展開單頁骨架卡片列，點卡片跳頁。
 * 僅在具備 hover 能力的精準指標裝置渲染；其餘裝置交由 ProgressBar +
 * ChapterNavigation。元件位於 .slides 之外，re-render 安全。
 */
export function SlidePreviewNav() {
  const isDesktop = useMediaQuery('(hover: hover) and (pointer: fine)');
  const { currentIndex } = usePresentationView();
  const { gotoIndex } = useRevealControl();

  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false); // lazy：首次展開後才掛載卡片

  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);
  const autoScroll = useRef(0); // px / frame，0 表示停止

  const open = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY);
  }, []);

  // 展開時把當前頁卡片捲到可見中央。
  useEffect(() => {
    if (!isOpen) return;
    cardRefs.current[currentIndex]?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [isOpen, currentIndex]);

  // 收合 / 卸載時停止自動捲動。
  useEffect(() => {
    if (!isOpen) autoScroll.current = 0;
  }, [isOpen]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    },
    [],
  );

  const tickAutoScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (el && autoScroll.current !== 0) {
      el.scrollLeft += autoScroll.current;
      rafId.current = requestAnimationFrame(tickAutoScroll);
    } else {
      rafId.current = null;
    }
  }, []);

  const onScrollerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      let v = 0;
      if (pct < EDGE) v = -((EDGE - pct) / EDGE);
      else if (pct > 1 - EDGE) v = (pct - (1 - EDGE)) / EDGE;
      autoScroll.current = v * MAX_SPEED;
      if (autoScroll.current !== 0 && rafId.current == null) {
        rafId.current = requestAnimationFrame(tickAutoScroll);
      }
    },
    [tickAutoScroll],
  );

  const stopAutoScroll = useCallback(() => {
    autoScroll.current = 0;
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="slide-preview-nav" aria-hidden={!isOpen}>
      <div
        className={`slide-preview-nav__zone${isOpen ? ' is-open' : ''}`}
        onMouseEnter={open}
        onMouseLeave={scheduleClose}
      >
        <div
          className="slide-preview-nav__panel"
          ref={scrollerRef}
          onMouseMove={onScrollerMouseMove}
          onMouseLeave={stopAutoScroll}
          role="listbox"
          aria-label="投影片預覽導覽"
        >
          {hasOpened &&
            slides.map((entry, index) => {
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={entry.id}
                  type="button"
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`preview-card${isCurrent ? ' is-current' : ''}`}
                  role="option"
                  aria-selected={isCurrent}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => {
                    gotoIndex(index);
                  }}
                >
                  <span className="preview-card__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="preview-card__title">{previewTitleAt(entry)}</span>
                  {renderSkeleton(previewShapeAt(entry))}
                </button>
              );
            })}
        </div>
        <div className="slide-preview-nav__hotzone" aria-hidden="true" />
      </div>
    </div>
  );
}
