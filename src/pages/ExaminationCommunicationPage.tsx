import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface Prong {
  key: string;
  side: 'trust' | 'awareness';
  label: string;
  desc: string;
}

/** 檢查敲一下，同時響起兩種共鳴：信任感（上叉）、病識感（下叉）。 */
const PRONGS: Prong[] = [
  {
    key: 'trust',
    side: 'trust',
    label: '信任感',
    desc: '讓客戶相信檢查的專業，也感受到被照顧、被理解。',
  },
  {
    key: 'awareness',
    side: 'awareness',
    label: '病識感',
    desc: '讓客戶從檢查反應與生活連結，看見問題確實存在。',
  },
];

/**
 * D19.1：檢查的過程，也在建立信任與病識感。
 * 以聽力檢查的代表器械「音叉」為喻——「檢查」是柄（起點），敲一下同時響起
 * 信任感（上叉）與病識感（下叉）。進場先出標題與空的音叉，再逐步伸出兩支叉。
 */
export function ExaminationCommunicationPage() {
  // GSAP 只負責 eyebrow、標題、「檢查」起點與音叉柄／基座的進場；
  // 兩支叉與底部錨句交給 Reveal 原生 fragment，用 .visible 驅動 CSS 伸展。
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-examcomm-eyebrow'), { x: -24, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-examcomm-title'), { y: 22, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-examcomm-origin'), {
        scale: 0.8,
        opacity: 0,
        duration: motion.duration.base,
        ease: motion.ease.enter,
      }, '-=0.15')
      .from(scope.querySelector('.js-examcomm-stem'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.fast,
      }, '-=0.15')
      .from(scope.querySelector('.js-examcomm-base'), {
        scaleY: 0,
        transformOrigin: 'center',
        duration: motion.duration.base,
        ease: motion.ease.emphasis,
      }, '-=0.05');
  }, []);

  return (
    <SlideShell fullBleed backgroundTexture="none" className="examcomm" animate={animate}>
      <main className="examcomm__stage">
        <p className="examcomm__eyebrow js-examcomm-eyebrow">檢查過程中的溝通</p>

        <h1 className="examcomm__title js-examcomm-title">
          檢查的過程，也能夠加強
          <span className="examcomm__word examcomm__word--trust">信任感</span>
          與
          <span className="examcomm__word examcomm__word--awareness">病識感</span>
        </h1>

        <div className="examcomm__fork" aria-label="檢查像音叉，一次帶出信任感與病識感兩種共鳴">
          <div className="examcomm__origin js-examcomm-origin">
            <span className="examcomm__origin-word">檢查</span>
          </div>
          <span className="examcomm__stem js-examcomm-stem" aria-hidden="true" />
          <span className="examcomm__base js-examcomm-base" aria-hidden="true" />

          {PRONGS.map((prong, index) => (
            <div
              key={prong.key}
              className={`examcomm__prong examcomm__prong--${prong.side} fragment`}
              data-fragment-index={index}
            >
              <span className="examcomm__tine" aria-hidden="true" />
              <span className="examcomm__tip" aria-hidden="true" />
              <div className="examcomm__prong-text">
                <p className="examcomm__prong-label">{prong.label}</p>
                <p className="examcomm__prong-desc">{prong.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="examcomm__anchor fragment" data-fragment-index={PRONGS.length}>
          檢查結果很重要；<b>客戶怎麼經歷這段檢查，同樣重要。</b>
        </p>
      </main>
    </SlideShell>
  );
}
