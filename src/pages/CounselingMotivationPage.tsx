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

  const motives = [
    '醫生叫我來',
    '沒做過覺得新奇',
    '藥局同仁轉介',
    '想買助聽器',
    '耳鳴不舒服',
    '聽不清楚',
  ];

  return (
    <SlideShell className="counseling counseling-motivation counseling-motivation--redesign" animate={animate}>
      <p className="counseling-kicker js-motivation-kicker">衛教與諮商</p>
      <h1 className="counseling-title js-motivation-title">好不好奇，客戶為什麼來？</h1>
      <p className="counseling-intro js-motivation-intro">
        聽力師常遇到各種檢查動機，但這些往往只是「表面動機」。
      </p>

      <div className="motivation-container">
        <div className="motivation-side motivation-side--left">
          <h2 className="motivation-subtitle">常見的來訪動機</h2>
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
            <h3 className="motivation-question-title">真的只是這樣嗎？</h3>
          </div>

          <div className="motivation-truth-box fragment" data-fragment-index="4">
            <h2 className="motivation-truth-title">懷疑表面動機，尋找真實場景</h2>
            <p className="motivation-truth-desc">
              「只是藥局同仁轉介來檢查就來了……」
            </p>
            <p className="motivation-truth-insight">
              其實，客戶可能早已在日常生活中（例如家人抱怨電視開太大聲、溝通時常漏聽），感受到聽力困難，我們要做的就是盡可能挖掘這些客戶較深的需求。
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
