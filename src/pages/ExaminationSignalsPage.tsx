import { useCallback, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';

interface ExamMove {
  /** 具體動作（做什麼，無襯線）。 */
  act: string;
  /** 一句把動作講清楚的補充（無襯線、弱化）。 */
  detail: string;
}

interface ExamTheme {
  /** 這一組帶給客戶的感受主題（襯線）。 */
  name: string;
  /** 客戶心裡沒說出口的一句話（襯線、主色）。 */
  feel: string;
  /** 兩個支撐這份感受的具體動作。 */
  moves: [ExamMove, ExamMove];
}

interface ExamSignalsSpec {
  /** trust＝信任感（綠）、awareness＝病識感（橘）。決定整頁單一強調色。 */
  variant: 'trust' | 'awareness';
  /** 承接 D19.1 音叉分出的支線名。 */
  branch: string;
  title: ReactNode;
  intro: string;
  themes: ExamTheme[];
  closer: string;
  ariaThemes: string;
}

const TRUST: ExamSignalsSpec = {
  variant: 'trust',
  branch: '這一支：信任感',
  title: (
    <>
      如何在檢查過程中，增加客戶的<em>信任感</em>？
    </>
  ),
  intro: '客戶記不住每一個數字，卻會記得整段檢查被怎麼對待——信任，就是在這些小動作裡一點一點長出來的。',
  ariaThemes: '四組建立信任感的檢查動作',
  themes: [
    {
      name: '呵護她',
      feel: '「他把我當一個人，不是一對耳朵。」',
      moves: [
        { act: '先問要不要上廁所、時間夠不夠', detail: '從坐下的第一刻就顧到人' },
        { act: '請家人一起進檢查室', detail: '隨時說明受測者當下的反應' },
      ],
    },
    {
      name: '環境',
      feel: '「這裡很專業，我可以放心交給他。」',
      moves: [
        { act: '準備專業又舒適的檢查空間', detail: '安靜、整潔、不讓人緊張' },
        { act: '當著客戶面清潔、消毒器具', detail: '看得見的乾淨，最讓人安心' },
      ],
    },
    {
      name: '互動',
      feel: '「我大概知道在做什麼，不緊張。」',
      moves: [
        { act: '指導語說得清楚又順暢', detail: '一邊測、一邊留意客戶反應' },
        { act: '每換一個步驟，先說一句', detail: '讓客戶知道現在正在做什麼' },
      ],
    },
    {
      name: '專業',
      feel: '「他很熟練，我相信這個結果。」',
      moves: [
        { act: '照病史加做該做的檢查', detail: '像耳鳴，就安排對應項目' },
        { act: '儀器與流程都很熟', detail: '不手忙腳亂，客戶就更信任' },
      ],
    },
  ],
  closer: '這些動作，客戶未必說得出來，卻真的感覺得到。',
};

const AWARENESS: ExamSignalsSpec = {
  variant: 'awareness',
  branch: '這一支：病識感',
  title: (
    <>
      如何在檢查過程中，喚起客戶的<em>病識感</em>？
    </>
  ),
  intro: '病識感不是用嚇的，而是讓客戶從檢查裡，一步一步自己看見——問題確實存在。',
  ariaThemes: '三組喚起病識感的檢查做法',
  themes: [
    {
      name: '據實對質',
      feel: '「原來我的狀況，比自己以為的明顯。」',
      moves: [
        { act: '把檢查結果和主述擺在一起', detail: '「數據和您剛才說的，其實有落差」' },
        { act: '先說檢查可能比預期多', detail: '因為聽損已經到了一個程度' },
      ],
    },
    {
      name: '傳達認真',
      feel: '「連專業的人都認真了，這好像不是小事。」',
      moves: [
        { act: '用表情傳達：皺眉、遲疑', detail: '肢體語言比話更快被讀到' },
        { act: '把輕鬆的氣氛慢慢轉正', detail: '該嚴肅的時候，就讓它嚴肅' },
      ],
    },
    {
      name: '回到生活',
      feel: '「這些場合，我真的常常聽不清楚。」',
      moves: [
        { act: '請家人一起聽刺激音量', detail: '讓家人親耳感受要多大聲' },
        { act: '再問一次日常有沒有困擾', detail: '像看電視、講電話的時候' },
      ],
    },
  ],
  closer: '不是嚇客戶，而是陪他自己看見。',
};

/**
 * D19.2／D19.3：檢查過程中的兩條溝通支線（承接 D19.1 音叉）。
 * 同一套版面、同一種手法——每份「感受」由兩個具體動作撐起；
 * 只有單一強調色不同：信任感走綠（正向行動）、病識感走橘（疑慮與轉折），
 * 與 D19.1 標題預告的兩支叉同色。襯線寫客戶感受到什麼，無襯線寫聽力師做什麼。
 */
function ExamSignalsPage({ spec }: { spec: ExamSignalsSpec }) {
  // GSAP 只推頁首三行；主題列與收尾句交給 Reveal 原生 fragment。
  const animate = useCallback((scope: HTMLElement) => {
    gsap
      .timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-exam-eyebrow'), { x: -24, opacity: 0, duration: motion.duration.base })
      .from(scope.querySelector('.js-exam-title'), { y: 22, opacity: 0, duration: motion.duration.base }, '-=0.25')
      .from(scope.querySelector('.js-exam-intro'), { opacity: 0, duration: motion.duration.base }, '-=0.15');
  }, []);

  return (
    <SlideShell
      fullBleed
      backgroundTexture="none"
      className={`exam-signals exam-signals--${spec.variant}`}
      animate={animate}
    >
      <main className="exam-signals__stage">
        <header className="exam-signals__head">
          <p className="exam-signals__eyebrow js-exam-eyebrow">
            衛教與諮商 · 檢查中的溝通
            <span className="exam-signals__branch">{spec.branch}</span>
          </p>
          <h1 className="exam-signals__title js-exam-title">{spec.title}</h1>
          <p className="exam-signals__intro js-exam-intro">{spec.intro}</p>
        </header>

        <ol className="exam-signals__themes" aria-label={spec.ariaThemes}>
          {spec.themes.map((theme, index) => (
            <li key={theme.name} className="exam-theme fragment" data-fragment-index={index}>
              <div className="exam-theme__label">
                <p className="exam-theme__name">{theme.name}</p>
                <p className="exam-theme__feel">{theme.feel}</p>
              </div>
              <ul className="exam-theme__moves">
                {theme.moves.map((move) => (
                  <li key={move.act} className="exam-move">
                    <p className="exam-move__act">{move.act}</p>
                    <p className="exam-move__detail">{move.detail}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="exam-signals__closer fragment" data-fragment-index={spec.themes.length}>
          {spec.closer}
        </p>
      </main>
    </SlideShell>
  );
}

/** D19.2：如何在檢查過程中增加信任感？ */
export function ExaminationTrustPage() {
  return <ExamSignalsPage spec={TRUST} />;
}

/** D19.3：如何在檢查過程中增加病識感？ */
export function ExaminationAwarenessPage() {
  return <ExamSignalsPage spec={AWARENESS} />;
}
