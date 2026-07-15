import { usePresentationView } from '../../context/PresentationViewContext';
import type { Chapter } from '../../types/presentation';

interface ChapterNavigationProps {
  chapters: Chapter[];
  onJump: (index: number) => void;
}

/** 章節導覽（決策 5）：依 chapter 分組，點擊跳轉到該章節首頁。 */
export function ChapterNavigation({ chapters, onJump }: ChapterNavigationProps) {
  const { currentIndex } = usePresentationView();

  return (
    <nav className="chapter-nav" aria-label="章節導覽">
      {chapters.map((chapter) => {
        const isCurrent =
          currentIndex >= chapter.startIndex &&
          currentIndex < chapter.startIndex + chapter.slideCount;
        return (
          <button
            key={chapter.id}
            type="button"
            className={`chapter-nav__item${isCurrent ? ' is-current' : ''}`}
            aria-current={isCurrent ? 'true' : undefined}
            onClick={() => onJump(chapter.startIndex)}
          >
            {chapter.title}
          </button>
        );
      })}
    </nav>
  );
}
