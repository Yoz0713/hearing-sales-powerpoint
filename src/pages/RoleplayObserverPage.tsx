import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * 與 role-play AI 的四個任務一一對應。
 * 每一列都是能成功觸發該目標的示範對話，不是固定話術。
 * `name` 保留給最後一頁既有的回指契約使用。
 */
export const OBSERVER_STAGES = [
  {
    id: 'listen',
    task: '問到生活情境',
    name: '打開生活',
    audiologist: '「陳先生，平常哪些場合最容易讓您覺得聽不清楚？」',
    customer: '「每週跟老朋友聚餐時，常常跟不上大家在聊什麼。」',
    success: '說出具體生活場景',
  },
  {
    id: 'explore',
    task: '讓他說出真正顧慮',
    name: '找到顧慮',
    audiologist: '「除了價格，還有什麼原因，讓您不太想戴助聽器？」',
    customer: '「我怕別人一看就知道，好像在告訴大家我老了。」',
    success: '說出外觀與身份焦慮',
  },
  {
    id: 'timing',
    task: '回應他的擔心',
    name: '接住擔心',
    audiologist: '「我懂，您在意的不只是聽不聽得到，也是不想被別人看老。我們先以低調、自在為前提。」',
    customer: '「對，我就是不想被看老。低調一點，我可以試。」',
    success: '顧慮被具體接住',
  },
  {
    id: 'advance',
    task: '成功開口邀約',
    name: '開口邀請',
    audiologist: '「那我們先試戴十分鐘，模擬聚餐環境；合適再談，不合適就先停，可以嗎？」',
    customer: '「好，那就先試看看。」',
    success: '客戶答應下一步',
  },
] as const;

/**
 * P40：role-play AI 練習後的四任務示範對話。
 *
 * UI 沿用「詢問病史」頁的問答泡泡，但改成四條橫向對話列，
 * 讓任務、聽力師說法、客戶反應與成功訊號可以直接逐列對照。
 * 對話列只交給 Reveal fragment；GSAP 僅負責頁首，避免所有權衝突。
 */
export function RoleplayObserverPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-dialogue-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-dialogue-title'), {
        y: 20,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.24')
      .from(scope.querySelector('.js-dialogue-lead'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.28')
      .from(scope.querySelector('.js-dialogue-case'), {
        x: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.42');
  }, []);

  return (
    <SlideShell className="counseling roleplay-observer" animate={animate}>
      <header className="roleplay-observer__head">
        <div className="roleplay-observer__intro">
          <p className="counseling-kicker js-dialogue-kicker">練習後示範</p>
          <h1 className="counseling-title js-dialogue-title">四個任務，對話要怎麼走？</h1>
          <p className="roleplay-observer__lead js-dialogue-lead">
            以下是一段能依序觸發四個目標的模擬對話。重點不是背句子，而是看每一句讓客戶多說了什麼。
          </p>
        </div>

        <aside className="roleplay-observer__case js-dialogue-case" aria-label="模擬對話情境">
          <p>模擬對象</p>
          <strong>陳先生｜65 歲</strong>
          <span>嫌貴，也怕戴了顯老</span>
        </aside>
      </header>

      <main className="mission-dialogue" aria-label="成功觸發四個任務的模擬對話表">
        <div className="mission-dialogue__columns" aria-hidden="true">
          <span>這一列的任務</span>
          <span>聽力師怎麼問／怎麼說</span>
          <span>陳先生的反應</span>
          <span>成功訊號</span>
        </div>

        {OBSERVER_STAGES.map((stage, index) => (
          <article
            key={stage.id}
            className="mission-dialogue__row fragment"
            data-fragment-index={index}
          >
            <div className="mission-dialogue__task">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{stage.task}</strong>
            </div>

            <div className="mission-dialogue__bubble mission-dialogue__bubble--ask">
              <span>聽力師</span>
              <p>{stage.audiologist}</p>
            </div>

            <div className="mission-dialogue__bubble mission-dialogue__bubble--reply">
              <span>陳先生</span>
              <p>{stage.customer}</p>
            </div>

            <div className="mission-dialogue__success">
              <i aria-hidden="true" />
              <span>目標達成</span>
              <strong>{stage.success}</strong>
            </div>
          </article>
        ))}
      </main>

      <footer className="roleplay-observer__rule fragment" data-fragment-index={OBSERVER_STAGES.length}>
        <span>帶領重點</span>
        <strong>四個任務有順序：先讓他說生活，再說顧慮；接住之後，才開口邀請。</strong>
      </footer>
    </SlideShell>
  );
}
