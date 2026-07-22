import { useCallback } from 'react';
import { gsap } from 'gsap';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

const CAPACITY_CLUES = [
  {
    title: '家庭照護',
    detail: '聘有外籍看護、固定照顧者，或已有長期自費照護安排',
  },
  {
    title: '過往職涯',
    detail: '退休前職務、專業背景、是否經營事業，以及退休後收入來源',
  },
  {
    title: '服裝與氣質',
    detail: '衣著材質、配件、儀容，以及對品質細節的在意程度',
  },
  {
    title: '兒女與家庭支持',
    detail: '兒女職業、居住地、陪同頻率，以及誰會參與付款決策',
  },
  {
    title: '生活方式',
    detail: '旅遊、社交、交通工具、聚會頻率與日常消費習慣',
  },
  {
    title: '特殊名字',
    detail: '預約時詢問完整姓名，接待前可以查看看客戶名字，了解一下客戶背景',
  },
] as const;

/** D18：把 D17 蒐集到的生活線索，轉成需要再確認的經濟能力假設。 */
export function EconomicCapacitySignalsPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-capacity-nav'), {
        y: -16,
        opacity: 0,
        duration: motion.duration.fast,
      })
      .from(scope.querySelector('.js-capacity-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.2')
      .from(scope.querySelector('.js-capacity-intro'), {
        y: 16,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.25')
      .from(scope.querySelector('.js-capacity-frame'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.2');
  }, []);

  return (
    <SlideShell fullBleed className="economic-capacity economic-capacity--signals" animate={animate}>
      <main className="economic-capacity__stage">
        <header className="economic-capacity__nav js-capacity-nav">
          <BrandLogo className="economic-capacity__logo" />
          <i aria-hidden="true" />
        </header>

        <div className="economic-capacity__heading">
          <h1 className="js-capacity-title">客戶的生活裡，藏著經濟能力的線索</h1>

        </div>

        <div className="capacity-clues js-capacity-frame" aria-label="六種經濟能力觀察線索">
          {CAPACITY_CLUES.map((clue, index) => (
            <article
              key={clue.title}
              className="capacity-clue fragment"
              data-fragment-index={index}
            >
              <span className="capacity-clue__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2>{clue.title}</h2>
              <p>{clue.detail}</p>
            </article>
          ))}
        </div>


      </main>
    </SlideShell>
  );
}
