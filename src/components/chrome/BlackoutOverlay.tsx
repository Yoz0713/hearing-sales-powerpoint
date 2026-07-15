import { usePresentationView } from '../../context/PresentationViewContext';

/** B 鍵黑屏專注（決策 6）：覆蓋整個畫面，鍵盤仍可操作（window 監聽）。 */
export function BlackoutOverlay() {
  const { isBlackout } = usePresentationView();
  return (
    <div
      className={`blackout-overlay${isBlackout ? ' is-active' : ''}`}
      aria-hidden={!isBlackout}
    />
  );
}
