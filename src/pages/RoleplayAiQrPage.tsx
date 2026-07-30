import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SlideShell } from '../components/layouts/SlideShell';

/**
 * p44：隨堂測驗。
 * 投影片刻意只呈現一般線上測驗入口；掃碼後的互動內容保留給現場揭曉。
 */
const ROLEPLAY_URL = 'https://hearing-sales-powerpoint-4uei.vercel.app/';

const PREPARE_ITEMS = [
  '請在安靜、不受打擾的地方進行',
  '請依照你平常接待客人的方式回答',
  "禁止跟他人討論"
] as const;

export function RoleplayAiQrPage() {
  const [qrSvg, setQrSvg] = useState('');

  useEffect(() => {
    let alive = true;
    QRCode.toString(ROLEPLAY_URL, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#455f51ff', light: '#ffffffff' },
    })
      .then((svg) => {
        if (alive) setQrSvg(svg);
      })
      .catch(() => {
        if (alive) setQrSvg('');
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <SlideShell className="counseling roleplay-ai-qr">
      <header className="roleplay-ai-qr__heading">
        <h1 className="counseling-title">隨堂測驗</h1>
        <p className="roleplay-ai-qr__lead">
          請拿起手機掃描 QR Code，進入本次線上測驗。
        </p>
        <span className="roleplay-ai-qr__rule" aria-hidden="true" />
      </header>

      <main className="roleplay-ai-qr__body">
        <article className="roleplay-ai-qr__form" aria-label="線上測驗說明">
          <div className="roleplay-ai-qr__form-strip" aria-hidden="true" />
          <div className="roleplay-ai-qr__form-content">
            <p className="roleplay-ai-qr__form-title">銷售情境練習</p>
            <p className="roleplay-ai-qr__form-note">預計作答時間：約 8 分鐘</p>
            <div className="roleplay-ai-qr__divider" aria-hidden="true" />
            <p className="roleplay-ai-qr__prompt">開始前，請先確認：</p>
            <ul className="roleplay-ai-qr__checklist">
              {PREPARE_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="roleplay-ai-qr__card" aria-label="掃碼進入測驗">
          <div className="roleplay-ai-qr__card-header">
            <span className="roleplay-ai-qr__quiz-tag">線上測驗</span>
            <span className="roleplay-ai-qr__status">準備開始</span>
          </div>
          <div
            className="roleplay-ai-qr__code"
            role="img"
            aria-label="線上測驗 QR code"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="roleplay-ai-qr__scan">掃碼開始作答</p>
        </article>
      </main>
    </SlideShell>
  );
}
