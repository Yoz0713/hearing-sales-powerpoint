import { useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';

const TOTAL_SECONDS = 180;

function format(seconds: number): { mm: string; ss: string } {
  return {
    mm: String(Math.floor(seconds / 60)).padStart(2, '0'),
    ss: String(seconds % 60).padStart(2, '0'),
  };
}

/**
 * D29：三分鐘顧問式對話的角色卡與任務。
 * 左客戶（深色）／右聽力師（淺色）以明暗與欄線分界，不用裝飾性人物卡；
 * 中上方一個由講師啟動的三分鐘倒數，R 鍵重置時間並重播進場。
 * 內容一次顯示（GSAP 進場），不使用 Reveal fragments。
 */
export function RoleplayBriefPage() {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);

  // R 鍵或換頁：暫停並把時間歸回 03:00。
  useSlideReset(
    useCallback(() => {
      setRunning(false);
      setRemaining(TOTAL_SECONDS);
    }, []),
  );

  // 只有在計時中才建立 interval；歸零或暫停即清除。
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-roleplay-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-roleplay-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-roleplay-timer'), {
        scale: 0.9,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.enter,
      }, '-=0.2')
      .from(scope.querySelectorAll('.js-roleplay-side'), {
        y: 30,
        opacity: 0,
        duration: motion.duration.base,
        stagger: 0.12,
      }, '-=0.25');
  }, []);

  const { mm, ss } = format(remaining);
  const progress = remaining / TOTAL_SECONDS;
  const isWarning = remaining > 0 && remaining <= 30;
  const isDone = remaining === 0;

  const toggleRun = () => {
    if (remaining > 0) setRunning((r) => !r);
  };
  const resetTimer = () => {
    setRunning(false);
    setRemaining(TOTAL_SECONDS);
  };

  return (
    <SlideShell className="counseling roleplay-brief" animate={animate}>
      <header className="roleplay-brief__head">
        <div className="roleplay-brief__intro">
          <p className="counseling-kicker js-roleplay-kicker">角色扮演</p>
          <h1 className="counseling-title js-roleplay-title">三分鐘顧問式對話</h1>
          <p className="roleplay-brief__lead">
            兩人一組輪流扮演，每輪三分鐘，結束後留一分鐘回饋。
          </p>
        </div>

        <div
          className={`roleplay-timer js-roleplay-timer${isWarning ? ' is-warning' : ''}${isDone ? ' is-done' : ''}`}
        >
          <p className="roleplay-timer__caption">{isDone ? '時間到，換手回饋' : '一輪對話'}</p>
          <p className="roleplay-timer__clock" aria-live="off">
            <span>{mm}</span><span className="roleplay-timer__colon">:</span><span>{ss}</span>
          </p>
          <div className="roleplay-timer__track" aria-hidden="true">
            <span className="roleplay-timer__fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="roleplay-timer__controls">
            <button type="button" className="roleplay-timer__btn roleplay-timer__btn--primary" onClick={toggleRun} disabled={isDone}>
              {running ? '暫停' : remaining === TOTAL_SECONDS ? '開始' : '繼續'}
            </button>
            <button type="button" className="roleplay-timer__btn" onClick={resetTimer}>
              重置
            </button>
          </div>
        </div>
      </header>

      <main className="roleplay-stage">
        <article className="roleplay-side roleplay-side--customer js-roleplay-side">
          <p className="roleplay-side__role">你是客戶</p>
          <ul className="roleplay-side__facts">
            <li>65 歲，退休後每週和朋友聚餐。</li>
            <li>覺得助聽器太貴，也怕戴上去顯老。</li>
          </ul>
          <div className="roleplay-side__line">
            <p className="roleplay-side__line-label">不直接拒絕，只是一再重複——</p>
            <p className="roleplay-side__line-quote">「我再考慮看看。」</p>
          </div>
        </article>

        <article className="roleplay-side roleplay-side--audiologist js-roleplay-side">
          <p className="roleplay-side__role">你是聽力師</p>
          <p className="roleplay-side__task">
            找出他的生活情境與真正顧慮，<br />提出一個合適的下一步。
          </p>
          <div className="roleplay-side__limits">
            <p className="roleplay-side__limits-label">這一輪的限制</p>
            <ul>
              <li>不急著介紹產品。</li>
              <li>至少問三個開放式問題。</li>
            </ul>
          </div>
        </article>
      </main>
    </SlideShell>
  );
}
