import type { ReactNode } from 'react';

interface TwoColumnLayoutProps {
  left: ReactNode;
  right: ReactNode;
  /** 中間是否顯示對比分隔（如 VS）。 */
  divider?: ReactNode;
  title?: ReactNode;
}

/** 空白佈局模板：兩欄對比（決策範圍：layouts）。無實際內容。 */
export function TwoColumnLayout({ left, right, divider, title }: TwoColumnLayoutProps) {
  return (
    <div className="layout-twocolumn">
      {title && <h2 className="layout-twocolumn__title">{title}</h2>}
      <div className="layout-twocolumn__cols">
        <div className="layout-twocolumn__col">{left}</div>
        {divider !== undefined && (
          <div className="layout-twocolumn__divider">{divider}</div>
        )}
        <div className="layout-twocolumn__col">{right}</div>
      </div>
    </div>
  );
}
