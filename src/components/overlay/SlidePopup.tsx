import type { ReactNode } from 'react';

interface SlidePopupProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * 頁內 popup 外殼。定位相對於 `.slide-shell`（position: relative，見 app.css），
 * 不用 position: fixed——Reveal 用 CSS transform 縮放整個 .slides，fixed 元素不會跟著縮放。
 */
export function SlidePopup({ open, onClose, children, className }: SlidePopupProps) {
  if (!open) return null;
  const classes = ['slide-popup'];
  if (className) classes.push(className);
  return (
    <div className="slide-popup__backdrop" onClick={onClose}>
      <div className={classes.join(' ')} role="dialog" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="slide-popup__close" onClick={onClose} aria-label="關閉">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
