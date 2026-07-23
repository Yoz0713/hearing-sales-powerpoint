import { useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import QRCode from 'qrcode';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * p43：角色扮演線上版。掃 QR → 和「AI 演員扮演的難搞客人陳先生」對話，
 * 問到生活情境與真正顧慮才能讓他開口。與 RoleplayBriefPage（真人版）成對。
 *
 * ⚠️ 部署 roleplay-ai App 後，把下面的 ROLEPLAY_URL 換成正式網址，QR 會自動更新。
 */
const ROLEPLAY_URL = 'https://hearing-sales-powerpoint-4uei.vercel.app/';

const TASKS = [
  '用開放式問題，問他的生活與感受',
  '不要急著介紹產品或報價',
  '問到「生活情境」和「真正顧慮」，他才會開口',
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
      .from(scope.querySelectorAll('.js-qr-task'), {
        y: 22,
        opacity: 0,
        duration: motion.duration.base,
        stagger: 0.1,
      }, '-=0.2')
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
        <p className="counseling-kicker js-qr-kicker">角色扮演 · 線上版</p>
        <h1 className="counseling-title js-qr-title">掃碼，讓這位難搞的客人開口</h1>
        <p className="roleplay-ai-qr__lead js-qr-lead">
          這次換 AI 來當那位「一直說再考慮看看」的陳先生。
        </p>
        <span className="roleplay-ai-qr__rule js-qr-rule" aria-hidden="true" />
      </header>

      <main className="roleplay-ai-qr__body">
        <section className="roleplay-ai-qr__brief" aria-label="你的任務">
          <p className="roleplay-ai-qr__role">你是聽力師</p>
          <ul className="roleplay-ai-qr__tasks">
            {TASKS.map((task) => (
              <li key={task} className="roleplay-ai-qr__task js-qr-task">{task}</li>
            ))}
          </ul>
        </section>

        <section className="roleplay-ai-qr__card js-qr-card" aria-label="掃碼開始">
          <div
            className="roleplay-ai-qr__code"
            role="img"
            aria-label="角色扮演練習 QR code"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="roleplay-ai-qr__scan">用手機相機掃我開始</p>
        </section>
      </main>
    </SlideShell>
  );
}
