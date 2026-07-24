import { useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import QRCode from 'qrcode';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * p44：隨堂測驗（AI 演員驚喜版）。
 * 偽裝成常規 Google 表單測驗卷，掃碼進入後面對真正的 AI 演員「陳先生」。
 */
const ROLEPLAY_URL = 'https://hearing-sales-powerpoint-4uei.vercel.app/';

const QUIZ_INFO = [
  { label: '測驗題型', value: '1 對 1 門市實戰模擬（非選擇題）' },
  { label: '測驗對象', value: '陳先生（75 歲・退休老師・愛面子）' },
  { label: '過關條件', value: '問出生活情境與真正顧慮，讓他願意點頭' },
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

  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-qr-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-qr-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-qr-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-qr-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.25')
      .from(scope.querySelector('.js-qr-surprise'), {
        y: 18,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.2')
      .from(scope.querySelectorAll('.js-qr-info-item'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
        stagger: 0.1,
      }, '-=0.15')
      .from(scope.querySelector('.js-qr-card'), {
        scale: 0.9,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.enter,
      }, '-=0.35');
  }, []);

  return (
    <SlideShell className="counseling roleplay-ai-qr" animate={animate}>
      <header className="roleplay-ai-qr__heading">
        <p className="counseling-kicker js-qr-kicker">課後隨堂測驗</p>
        <h1 className="counseling-title js-qr-title">隨堂測驗</h1>
        <p className="roleplay-ai-qr__lead js-qr-lead">
          請拿起手機掃描 QR Code，進入線上測驗系統。
        </p>
        <span className="roleplay-ai-qr__rule js-qr-rule" aria-hidden="true" />
      </header>

      <main className="roleplay-ai-qr__body">
        <div className="roleplay-ai-qr__brief">
          <div className="roleplay-ai-qr__surprise js-qr-surprise">
            <div className="roleplay-ai-qr__badge">Surprise!</div>
            <p className="roleplay-ai-qr__surprise-text">
              點開連結後，你面對的不是單選題——<br />
              而是由 <strong>AI 演員</strong> 扮演的難搞客人「陳先生」。
            </p>
          </div>

          <dl className="roleplay-ai-qr__info-list">
            {QUIZ_INFO.map((item) => (
              <div key={item.label} className="roleplay-ai-qr__info-item js-qr-info-item">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <section className="roleplay-ai-qr__card js-qr-card" aria-label="掃碼進入測驗">
          <div className="roleplay-ai-qr__card-header">
            <span className="roleplay-ai-qr__quiz-tag">線上隨堂測驗卷</span>
            <span className="roleplay-ai-qr__live-dot" title="系統連線中" />
          </div>
          <div
            className="roleplay-ai-qr__code"
            role="img"
            aria-label="角色扮演練習 QR code"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="roleplay-ai-qr__scan">掃碼開始作答</p>
        </section>
      </main>
    </SlideShell>
  );
}
