import type { ReactNode } from 'react';

interface BigNumberLayoutProps {
  /** 小標（眉題）。 */
  eyebrow?: ReactNode;
  /** 主數字本體（可放 <span> 供 GSAP count-up 操作 textContent）。 */
  value: ReactNode;
  /** 數字單位/後綴。 */
  unit?: ReactNode;
  /** 數字下方標題。 */
  title?: ReactNode;
  /** 補充內容區。 */
  children?: ReactNode;
}

/** 空白佈局模板：大數字高亮（決策範圍：layouts）。無實際內容。 */
export function BigNumberLayout({
  eyebrow,
  value,
  unit,
  title,
  children,
}: BigNumberLayoutProps) {
  return (
    <div className="layout-bignumber">
      {eyebrow && <p className="layout-bignumber__eyebrow">{eyebrow}</p>}
      <div className="layout-bignumber__figure">
        <span className="layout-bignumber__value">{value}</span>
        {unit && <span className="layout-bignumber__unit">{unit}</span>}
      </div>
      {title && <h2 className="layout-bignumber__title">{title}</h2>}
      {children && <div className="layout-bignumber__body">{children}</div>}
    </div>
  );
}
