import { useCallback } from 'react';
import { gsap } from 'gsap';
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
      .from(scope.querySelector('.js-capacity-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-capacity-title'), {
        y: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.22')
      .from(scope.querySelector('.js-capacity-lead'), {
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15');
  }, []);

  return (
    <SlideShell className="counseling economic-capacity economic-capacity--signals" animate={animate}>
      <header className="economic-capacity__heading-std">
        <p className="counseling-kicker js-capacity-kicker">選配流程 · 經濟能力</p>
        <h1 className="counseling-title js-capacity-title">客戶的生活裡，藏著經濟能力的線索</h1>
        <p className="economic-capacity__lead js-capacity-lead">
          從病史與生活軌跡中收集六項線索，形成試聽前的經濟能力假設。
        </p>
      </header>

      <main className="capacity-clues-grid" aria-label="六種經濟能力觀察線索">
        {CAPACITY_CLUES.map((clue, index) => (
          <article
            key={clue.title}
            className="capacity-clue-card fragment"
            data-fragment-index={index}
          >
            <div className="capacity-clue-card__head">
              <span className="capacity-clue-card__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2>{clue.title}</h2>
            </div>
            <p>{clue.detail}</p>
          </article>
        ))}
      </main>


    </SlideShell>
  );
}
