import { useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { useRevealControl } from '../context/RevealControlContext';
import { useSlideReset } from '../hooks/useSlideReset';
import { motion } from '../tokens/motion';

// DEMO 佔位資料 — 內容大綱尚未發想，Phase 2 後續替換為真實主題並接上各章節起始索引。
const TOPICS = [
  { id: 't1', title: '顧客建檔與日常營運作業' },
  { id: 't2', title: '聽力評估與個案照護紀錄' },
  { id: 't3', title: '銷售交易與設備庫存管理' },
];

/** 大綱頁：內容主題大綱（demo）。串接 stagger 進場、導覽跳轉、R 雙層重置。 */
export function OutlinePage() {
  const control = useRevealControl();
  // 資料層：記錄已點過的主題（R 會清空，示範 useSlideReset）。
  const [visited, setVisited] = useState<ReadonlySet<string>>(() => new Set());
  useSlideReset(() => setVisited(new Set()));

  const handleSelect = useCallback(
    (id: string) => {
      setVisited((prev) => new Set(prev).add(id));
      // DEMO：暫跳下一頁示範導覽串接；Phase 2 換成該主題章節的起始索引。
      control.gotoIndex(control.getIndex() + 1);
    },
    [control],
  );

  const animate = useCallback((scope: HTMLElement) => {
    void scope;
    const tl = gsap.timeline({ defaults: { ease: motion.ease.standard } });
    tl.from('.js-outline-title', { x: -40, opacity: 0, duration: motion.duration.base }).from(
      '.js-outline-item',
      {
        y: 28,
        opacity: 0,
        stagger: motion.fragmentStagger * 1.5,
        duration: motion.duration.base,
        ease: motion.ease.enter,
      },
      '-=0.2',
    );
  }, []);

  return (
    <SlideShell animate={animate}>
      <div className="outline">
        <h2 className="outline__title js-outline-title">內容主題大綱</h2>
        <ol className="outline__list">
          {TOPICS.map((topic, i) => (
            <li key={topic.id} className="js-outline-item">
              <button
                type="button"
                className={`outline__item${visited.has(topic.id) ? ' is-visited' : ''}`}
                onClick={() => handleSelect(topic.id)}
              >
                <span className="outline__num">{i + 1}</span>
                <span className="outline__label">{topic.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="outline__hint">DEMO 佔位內容 · 點主題示範導覽跳轉 · 按 <kbd>R</kbd> 清除已讀</p>
      </div>
    </SlideShell>
  );
}
