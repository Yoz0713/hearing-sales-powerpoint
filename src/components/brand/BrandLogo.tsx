import brandLogoUrl from '../../../assets/公司去背logo.png';

interface BrandLogoProps {
  className?: string;
}

/**
 * 左上企業 lockup：官方去背 logo（樹標誌 +「大樹藥局」）。
 * 共用零件（決策 4：可重用元件放 components/brand）。
 */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={`brand-logo${className ? ` ${className}` : ''}`}>
      <img className="brand-logo__img" src={brandLogoUrl} alt="大樹藥局" />
    </div>
  );
}
