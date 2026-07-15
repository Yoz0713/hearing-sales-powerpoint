import type { ReactNode } from 'react';
import { StockBars } from '../brand/StockBars';
import brandLogoUrl from '../../../assets/公司去背logo.png';

interface CoverLayoutProps {
  /** 左上角（通常放 BrandLogo）。 */
  logo: ReactNode;
  /** 左側主內容（標題 / 撰寫者）。 */
  children: ReactNode;
  /** 頁尾價值標語，預設「真誠 / 專業 / 共享」。 */
  values?: string[];
  url?: string;
  stockCode?: string;
}

/**
 * 封面全幅版面（綠在右）：左白內容區 + 右綠漸層面板（含白樹剖影 + 樹 badge），
 * 底部頁尾（價值標語 + url 置中、StockBars 靠右）與頁尾上方細色條。
 * 各動畫目標掛 .js-cover-* class，供頁面的 GSAP timeline 以選擇器操作。
 */
export function CoverLayout({
  logo,
  children,
  values = ['真誠', '專業', '共享'],
  url = 'www.greattree.com.tw',
  stockCode = '6469',
}: CoverLayoutProps) {
  return (
    <div className="cover">
      {/* 右側綠漸層面板 */}
      <div className="cover__panel js-cover-panel" aria-hidden="true">
        <img className="cover__badge js-cover-badge" src={brandLogoUrl} alt="" />
      </div>

      {/* 左側內容 */}
      <header className="cover__logo js-cover-logo">{logo}</header>
      <div className="cover__content">{children}</div>

      {/* 頁尾 */}
      <div className="cover__colorbar js-cover-colorbar" aria-hidden="true">
        <i style={{ background: 'var(--color-brand-secondary)' }} />
        <i style={{ background: 'var(--color-brand-primary-bright)' }} />
        <i style={{ background: 'var(--color-orange)' }} />
        <i style={{ background: 'var(--color-feedback-danger)' }} />
      </div>
      <footer className="cover__footer">
        <div className="cover__values">
          <span>{values.join('　|　')}</span>
          <span className="cover__url">{url}</span>
        </div>
        <StockBars code={stockCode} className="cover__stock" />
      </footer>
    </div>
  );
}
