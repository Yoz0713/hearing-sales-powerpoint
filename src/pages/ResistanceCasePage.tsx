import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface CaseEvidence {
  label: string;
  headline: string;
  detail: string;
  emphasis?: boolean;
}

const EVIDENCE: CaseEvidence[] = [
  {
    label: '聽力資料',
    headline: '雙耳中度聽損',
    detail: '檢查結果已經明確，但他仍覺得影響不大。',
  },
  {
    label: '生活回饋',
    headline: '電視聲太大',
    detail: '太太最先發現改變；本人認為平常少社交，還能應付。',
  },
  {
    label: '決策拉扯',
    headline: '女兒急，他抗拒',
    detail: '客戶連試聽都不願，就把焦點放在「太貴」，家人則希望趕快處理。',
    emphasis: true,
  },
];

/**
 * 四題刻意不問「他的顧慮是什麼」——三行案例資訊撐不起那個答案，
 * 講師在台上也證明不了。改成盤點手上有什麼、缺什麼，每題都有資料
 * 站得住腳的答案，結論收在「資訊不足」，再由下一頁的三個提問接手。
 */
const DISCUSSION_PROMPTS = [
  '哪些事實？哪些推測？',
  '客戶與家屬的態度如何？',
  '還沒報價，為何喊貴？',
  '優先問他哪三個問題？',
] as const;

const VOICE_STRIP = [
  '太太：電視聲愈開愈大',
  '王先生：只是偶爾聽不到',
  '女兒：希望趕快處理',
  '王先生：助聽器太貴了',
] as const;

/** D11：把拒絕拆成可觀察的案例證據，答案留給小組與下一頁。 */
export function ResistanceCasePage() {
  const animate = useCallback((scope: HTMLElement) => {
    const timeline = gsap.timeline({ defaults: { ease: motion.ease.standard } });

    timeline
      .from(scope.querySelector('.js-resistance-case-nav'), {
        y: -14,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-resistance-case-profile'), {
        x: -48,
        opacity: 0,
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.08')
      .from(scope.querySelectorAll('.js-resistance-case-title-word'), {
        yPercent: 72,
        opacity: 0.08,
        duration: motion.duration.base,
        stagger: 0.07,
        ease: motion.ease.emphasis,
      }, '-=0.48')
      .from(scope.querySelector('.js-resistance-case-lead'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.22')
      .from(scope.querySelectorAll('.js-resistance-case-evidence'), {
        x: -44,
        y: 22,
        scale: 0.96,
        opacity: 0,
        duration: motion.duration.base,
        stagger: 0.11,
        ease: motion.ease.emphasis,
      }, '-=0.12');

    gsap.to(scope.querySelector('.js-resistance-case-voice-track'), {
      xPercent: -50,
      duration: 26,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  const renderVoiceStrip = (keyPrefix: string) => (
    <div className="resistance-case__voice-group" aria-hidden="true">
      {VOICE_STRIP.map((voice, index) => (
        <span key={`${keyPrefix}-${index}`} className="resistance-case__voice-item">
          {voice}
        </span>
      ))}
    </div>
  );

  return (
    <SlideShell fullBleed className="resistance-case" animate={animate}>
      <main className="resistance-case__stage">
        <header className="resistance-case__nav js-resistance-case-nav">
          <BrandLogo className="resistance-case__logo" />
        </header>

        <div className="resistance-case__body">
          <article className="resistance-case__profile js-resistance-case-profile" aria-label="王先生案例資料">
            <div className="resistance-case__identity">
              <h2>王先生</h2>
              <p>68 歲・退休教師</p>
            </div>

            <blockquote className="resistance-case__quote">
              「我只是<br />偶爾聽不到。」
            </blockquote>

            <div className="resistance-case__profile-foot">
              <span>本人說法</span>
              <p>平常沒有太多社交，生活沒有受到太大影響。</p>
            </div>
          </article>

          <div className="resistance-case__analysis">
            <div className="resistance-case__heading">
              <h1 className="resistance-case__title" aria-label="王先生不是不需要，而是還沒準備好">
                <span className="resistance-case__title-line">
                  <span className="js-resistance-case-title-word">王先生</span>
                  <span className="js-resistance-case-title-word">不是不需要，</span>
                </span>
                <span className="resistance-case__title-line resistance-case__title-line--accent">
                  <span className="js-resistance-case-title-word">而是還沒準備好</span>
                </span>
              </h1>
              <p className="resistance-case__lead js-resistance-case-lead">
                不要急著替他下結論。先把他說的，和生活正在發生的事放在一起看。
              </p>
            </div>

            <div className="resistance-case__evidence" aria-label="案例中的三組證據">
              {EVIDENCE.map((item) => (
                <article
                  key={item.label}
                  className={`resistance-case__evidence-item js-resistance-case-evidence${item.emphasis ? ' resistance-case__evidence-item--emphasis' : ''}`}
                >
                  <span className="resistance-case__evidence-label">{item.label}</span>
                  <h2>{item.headline}</h2>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>

            <div className="resistance-case__discussion fragment" data-fragment-index={0}>
              <div className="resistance-case__discussion-heading">
                <span>先盤點，再判斷</span>
                <h2>我們手上<br />有什麼？</h2>
              </div>
              <ol className="resistance-case__prompts">
                {DISCUSSION_PROMPTS.map((prompt, index) => (
                  <li key={prompt}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{prompt}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="resistance-case__voice" aria-label={VOICE_STRIP.join('；')}>
          <div className="resistance-case__voice-track js-resistance-case-voice-track">
            {renderVoiceStrip('voice-a')}
            {renderVoiceStrip('voice-b')}
          </div>
        </div>
      </main>
    </SlideShell>
  );
}
