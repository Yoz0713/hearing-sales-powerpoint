import { useCallback } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

/**
 * P40：隨堂測驗後復盤（Debrief Dashboard）。
 *
 * 專為講者設計的演練復盤看板：
 * 將焦點從「唸寫死的對話課文」轉轉移至「4 關卡順序心法」與「演練常見盲點」。
 * 講者可對照全班剛才在 P39 隨堂測驗中的表現進行互動講評。
 */
export const DEBRIEF_STAGES = [
  {
    id: 'listen',
    step: '01',
    task: '問到生活情境',
    actionName: '打開生活',
    name: '打開生活',
    pitfall: '一開口就談規格價格，沒問平常哪些場合聽不清楚',
    unlockSignal: '客戶說出具體生活場合（例：聚餐跟不上）',
    coreLine: '「陳先生，平常哪些場合最容易讓您覺得聽不清楚？」',
  },
  {
    id: 'explore',
    step: '02',
    task: '讓他說出真正顧慮',
    actionName: '找到顧慮',
    name: '找到顧慮',
    pitfall: '聽到「太貴」就急著折價，沒挖出背後「怕顯老」的焦慮',
    unlockSignal: '客戶坦承內心擔心（例：怕被看老）',
    coreLine: '「除了價格，還有什麼原因，讓您不太想戴助聽器？」',
  },
  {
    id: 'timing',
    step: '03',
    task: '回應他的擔心',
    actionName: '接住擔心',
    name: '接住擔心',
    pitfall: '急著辯解「產品很隱密」，沒有先同理接住客戶的感受',
    unlockSignal: '客戶感覺被聽懂（例：對，我就是不想顯老）',
    coreLine: '「我懂，您在意的不只是聽得到，也是不想被別人看老。」',
  },
  {
    id: 'advance',
    step: '04',
    task: '成功開口邀約',
    actionName: '開口邀請',
    name: '開口邀請',
    pitfall: '前三關未鋪墊就直接要成交，導致客戶築起防備反彈',
    unlockSignal: '客戶答應做小步嘗試（例：好，先試十分鐘）',
    coreLine: '「那我們先試戴十分鐘，合適再談，不合適就先停。」',
  },
] as const;

export const OBSERVER_STAGES = DEBRIEF_STAGES;

export function RoleplayObserverPage() {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-debrief-kicker'), {
        x: -28,
        opacity: 0,
        duration: motion.duration.base,
      })
      .from(scope.querySelector('.js-debrief-title'), {
        y: 20,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.24')
      .from(scope.querySelector('.js-debrief-lead'), {
        y: 14,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.28')
      .from(scope.querySelector('.js-debrief-case'), {
        x: 24,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.42');
  }, []);

  return (
    <SlideShell className="counseling roleplay-observer" animate={animate}>
      <header className="roleplay-observer__head">
        <div className="roleplay-observer__intro">
          <p className="counseling-kicker js-debrief-kicker">演練後復盤</p>
          <h1 className="counseling-title js-debrief-title">四個任務，你剛才解鎖了幾關？</h1>
          <p className="roleplay-observer__lead js-debrief-lead">
            對話順序對了，信任自然產生。對照剛才在手機上的實戰演練，檢視是否落入了常見盲點：
          </p>
        </div>

        <aside className="roleplay-observer__case js-debrief-case" aria-label="演練模擬情境">
          <p>模擬對象背景</p>
          <strong>陳先生｜65 歲</strong>
          <span>嫌貴，更怕戴了顯老</span>
        </aside>
      </header>

      <main className="debrief-board" aria-label="四關卡演練復盤與解鎖對照">
        {DEBRIEF_STAGES.map((stage, index) => (
          <article
            key={stage.id}
            className="debrief-card fragment"
            data-fragment-index={index}
          >
            <div className="debrief-card__header">
              <span className="debrief-card__step">{stage.step}</span>
              <div className="debrief-card__title-group">
                <span className="debrief-card__action">{stage.actionName}</span>
                <h2 className="debrief-card__task">{stage.task}</h2>
              </div>
            </div>

            <div className="debrief-card__body">
              <div className="debrief-card__section debrief-card__section--pitfall">
                <span className="debrief-card__label">演練常見盲點</span>
                <p className="debrief-card__text">{stage.pitfall}</p>
              </div>

              <div className="debrief-card__section debrief-card__section--unlock">
                <span className="debrief-card__label">解鎖關鍵訊號</span>
                <p className="debrief-card__text">{stage.unlockSignal}</p>
              </div>
            </div>

            <div className="debrief-card__footer">
              <span className="debrief-card__core-tag">示範關鍵句</span>
              <p className="debrief-card__core-line">{stage.coreLine}</p>
            </div>
          </article>
        ))}
      </main>

      <footer className="roleplay-observer__rule fragment" data-fragment-index={DEBRIEF_STAGES.length}>
        <span>講授心法</span>
        <strong>四個任務不可跳關：先問生活 ➔ 再挖顧慮 ➔ 徹底接住 ➔ 順勢邀約。順序對了，推進毫不費力。</strong>
      </footer>
    </SlideShell>
  );
}

