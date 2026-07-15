import { usePresentationView } from '../../context/PresentationViewContext';

/** 全簡報進度條（決策 5）：純從 view context 衍生，不爬 DOM。 */
export function ProgressBar() {
  const { currentIndex, totalSlides, currentChapterTitle } = usePresentationView();
  const pct = totalSlides > 1 ? (currentIndex / (totalSlides - 1)) * 100 : 100;

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSlides}
      aria-valuenow={currentIndex + 1}
    >
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-bar__meta">

        <span className="progress-bar__count">
          {currentIndex + 1} / {totalSlides}
        </span>
      </div>
    </div>
  );
}
