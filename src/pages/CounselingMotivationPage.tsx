import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

export function CounselingMotivationPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-motivation-kicker'), { x: -28, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-motivation-title'), { y: 20, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-motivation-intro'), { opacity: 0, duration: motion.duration.base }, '-=0.15');
  }, []);

  /**
   * 一律是客戶自己的主訴，不放「醫生叫我來／藥局轉介」這類轉介型說法——
   * 那是冰山頁（接待現場的防備話）的守備範圍。這一頁講的是另一種失敗：
   * 客戶講的是真話，但每一句都還不夠具體到可以選配。維持 6 筆，版面才不會破。
   */
  const motives = [
    '聽不清楚',
    '耳鳴不舒服',
    '想試看看助聽器',
    '電視要開很大聲',
    '講電話很吃力',
    '想知道有沒有退化',
  ];

  return (
    <SlideShell className="counseling counseling-motivation counseling-motivation--redesign" animate={animate}>
      <p className="counseling-kicker js-motivation-kicker">衛教與諮商</p>
      <h1 className="counseling-title js-motivation-title">好不好奇，客戶為什麼來？</h1>
      <p className="counseling-intro js-motivation-intro">
        這些都是客戶的真話——但沒有一句，足夠你做選配。
      </p>

      <div className="motivation-container">
        <div className="motivation-side motivation-side--left">
          <h2 className="motivation-subtitle">客戶最常講的困擾</h2>
          <div className="motive-grid">
            <div className="motive-group fragment" data-fragment-index="1">
              {motives.slice(0, 3).map((m, idx) => (
                <div key={idx} className="motive-card">
                  <span className="motive-card__index">0{idx + 1}</span>
                  <span className="motive-card__text">{m}</span>
                </div>
              ))}
            </div>
            <div className="motive-group fragment" data-fragment-index="2">
              {motives.slice(3).map((m, idx) => (
                <div key={idx} className="motive-card">
                  <span className="motive-card__index">0{idx + 4}</span>
                  <span className="motive-card__text">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="motivation-side motivation-side--right">
          <div className="motivation-question-box fragment" data-fragment-index="3">
            <h3 className="motivation-question-title">這樣夠你選配嗎？</h3>
          </div>

          <div className="motivation-truth-box fragment" data-fragment-index="4">
            <h2 className="motivation-truth-title">問到人事時地物，才叫需求</h2>
            <p className="motivation-truth-desc">
              他說：「我就是聽不清楚。」
            </p>
            <p className="motivation-truth-insight">
              「聽不清楚」是症狀，不是需求。要再追下去：跟誰講話？在什麼場合？多久發生一次？聽不到的當下會發生什麼事？——追到這一層，才有東西可以選配。
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
