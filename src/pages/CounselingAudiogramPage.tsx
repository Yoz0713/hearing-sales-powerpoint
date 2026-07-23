import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/** 這位客戶的範例讀數；正式簡報由聽力師依實際報告替換。 */
const CASE = {
  left: 52,
  right: 58,
  average: 55,
  normalCeiling: 25,
  speechLow: 45,
  speechHigh: 65,
  realAge: 62,
  hearingAge: 78,
};

/** dB 標尺：0（上）→ 90（下），與聽力圖同向。座標一律由 dB 換算，方便替換數值。 */
const SCALE_MAX = 90;
const TRACK = 360;
const y = (db: number) => (db / SCALE_MAX) * TRACK;

const gapDb = CASE.average - CASE.normalCeiling;
const ageGap = CASE.hearingAge - CASE.realAge;

/**
 * 講解聽力報告：把「一個 55 分貝」翻成客戶聽得懂的三個對照——
 * 音量（標尺）、年齡（聽力年齡）、以及最重要的 COSI 生活連結（底部強調條）。
 * 色彩集中：淺色標尺面板 + 深綠 COSI 條，其餘留白。
 */
export function CounselingAudiogramPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap
      .timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-aud-kicker'), { x: -24, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-aud-title'), { y: 22, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-aud-intro'), { opacity: 0, duration: motion.duration.base }, '-=0.15')
      .from(
        scope.querySelector('.js-aud-scale'),
        { y: 26, opacity: 0, duration: motion.duration.slow, ease: motion.ease.emphasis },
        '-=0.2',
      );
  }, []);

  return (
    <SlideShell className="audiogram-slide" animate={animate}>
      <header className="audiogram-heading">
        <p className="counseling-kicker js-aud-kicker">解釋聽力圖</p>
        <h1 className="audiogram-title js-aud-title">
          <span className="audiogram-title__num">{CASE.average}</span> 分貝，對他代表什麼？
        </h1>
        <p className="audiogram-intro js-aud-intro">
          一個數字沒有溫度。放進年齡、音量，和他自己的生活，他才真的聽懂。
        </p>
      </header>

      <div className="audiogram-body">
        {/* 對照一 · 音量標尺（主視覺） */}
        <figure className="audiogram-scale js-aud-scale" aria-label="分貝標尺：正常、說話音量與客戶聽閾的相對位置">
          <figcaption className="audiogram-scale__eyebrow">對照一 · 聽得到 vs 聽得清</figcaption>
          <div className="audiogram-track" style={{ height: TRACK }}>
            <span className="audiogram-track__cap audiogram-track__cap--top">0 dB</span>
            <span className="audiogram-track__cap audiogram-track__cap--bottom">{SCALE_MAX}</span>

            {/* 一般說話音量帶（標籤置於帶子上緣左側，避免與客戶讀數同側相撞） */}
            <div
              className="audiogram-band"
              style={{ top: y(CASE.speechLow), height: y(CASE.speechHigh) - y(CASE.speechLow) }}
            >
              <span className="audiogram-band__label">
                一般說話 <b>{CASE.speechLow}–{CASE.speechHigh}</b> dB
              </span>
            </div>

            {/* 正常聽力上限 */}
            <div className="audiogram-mark audiogram-mark--normal" style={{ top: y(CASE.normalCeiling) }}>
              <span className="audiogram-mark__label">正常 ≤{CASE.normalCeiling}</span>
            </div>

            {/* 落差量規：正常 → 您，左側橘色 caliper（純視覺） */}
            <span
              className="audiogram-gap fragment"
              data-fragment-index={0}
              style={{ top: y(CASE.normalCeiling), height: y(CASE.average) - y(CASE.normalCeiling) }}
              aria-hidden="true"
            />

            {/* 客戶平均聽閾（逐步顯示的第一步） */}
            <div
              className="audiogram-mark audiogram-mark--you fragment"
              data-fragment-index={0}
              style={{ top: y(CASE.average) }}
            >
              <span className="audiogram-mark__dot" aria-hidden="true" />
              <span className="audiogram-mark__you">
                <span className="audiogram-mark__you-head">
                  您 <b>{CASE.average}</b> dB
                </span>
                <span className="audiogram-mark__you-ears">左 {CASE.left} · 右 {CASE.right}</span>
                <span className="audiogram-mark__you-gap">比正常高 {gapDb} 分貝</span>
              </span>
            </div>
          </div>
          <p className="audiogram-scale__note fragment" data-fragment-index={1}>
            聽得到聲音，卻抓不到字——子音就落在這條線上。
          </p>
        </figure>

        {/* 對照二 · 聽力年齡 */}
        <section className="audiogram-age fragment" data-fragment-index={2} aria-label="聽力年齡對照">
          <p className="audiogram-age__eyebrow">對照二 · 聽力年齡</p>
          <div className="audiogram-age__pair">
            <span className="audiogram-age__real">
              <b>{CASE.realAge}</b>
              <em>實際年齡</em>
            </span>
            <span className="audiogram-age__arrow" aria-hidden="true">→</span>
            <span className="audiogram-age__hearing">
              <b>{CASE.hearingAge}</b>
              <em>聽力年齡</em>
            </span>
          </div>
          <p className="audiogram-age__line">
            他的聽力，已經走在實際年齡前面 <b>{ageGap} 年</b>。
          </p>
        </section>
      </div>

      {/* 對照三 · COSI 連結（全頁最重要，強調條） */}
      <footer className="audiogram-cosi fragment" data-fragment-index={3}>
        <p className="audiogram-cosi__eyebrow">
          <span className="audiogram-cosi__eyebrow-num">對照三</span>
          連回他說過的話
          <span className="audiogram-cosi__eyebrow-tag">COSI</span>
        </p>
        <blockquote className="audiogram-cosi__quote">「在餐廳、家族聚餐，聽不清楚大家在講什麼。」</blockquote>
        <p className="audiogram-cosi__payoff">
          這不是他不專心——是這 <b>{gapDb} 分貝</b>，正在解釋他的困擾。
        </p>
      </footer>
    </SlideShell>
  );
}
