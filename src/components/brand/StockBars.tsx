interface StockBarsProps {
  code?: string;
  className?: string;
}

/**
 * 右下股票代號「6469」+ 品牌色條段（綠 / 萊姆 / 橘 / 紅，取自 token）。
 * 共用零件。
 */
export function StockBars({ code = '6469', className }: StockBarsProps) {
  return (
    <div className={`stock-bars${className ? ` ${className}` : ''}`}>
      <span className="stock-bars__segments" aria-hidden="true">
        <i style={{ background: 'var(--color-brand-secondary)' }} />
        <i style={{ background: 'var(--color-brand-primary-bright)' }} />
        <i style={{ background: 'var(--color-orange)' }} />
        <i style={{ background: 'var(--color-feedback-danger)' }} />
      </span>
      <span className="stock-bars__code">{code}</span>
    </div>
  );
}
