import type { ReactNode } from 'react';
import { useSlideAnimation, type BuildTimeline } from '../../hooks/useSlideAnimation';

interface SlideShellProps {
  children: ReactNode;
  /** 可選的 GSAP 進場 timeline 工廠；省略則本頁無進場動畫。 */
  animate?: BuildTimeline;
  /** 額外 class，疊在 slide-shell 上。 */
  className?: string;
  /** 滿版：移除 padding / 置中，讓內部 layout 自行填滿 1920×1080（封面 / 隔頁用）。 */
  fullBleed?: boolean;
  /** 背景紋理；白／淺色頁預設使用紙質格線，沉浸式非白底頁可明確停用。 */
  backgroundTexture?: 'paper' | 'none';
}

/**
 * 所有 slide 的共用外殼（決策 3）：統一掛 useSlideAnimation、提供 GSAP scope root
 * 與現場安全邊界。Phase 2 每頁只需把內容放進來、（需要時）給一個 animate。
 */
export function SlideShell({
  children,
  animate,
  className,
  fullBleed,
  backgroundTexture = 'paper',
}: SlideShellProps) {
  const scopeRef = useSlideAnimation(animate);
  const classes = ['slide-shell'];
  if (fullBleed) classes.push('slide-shell--bleed');
  if (backgroundTexture === 'paper') classes.push('slide-shell--paper');
  if (className) classes.push(className);
  return (
    <div ref={scopeRef} className={classes.join(' ')}>
      {backgroundTexture === 'paper' && <div className="slide-shell__paper" aria-hidden="true" />}
      {children}
    </div>
  );
}
