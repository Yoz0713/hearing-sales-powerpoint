/**
 * 綜合能力評等。純函式，不碰 API 也不碰時間 —— 所以報告頁就算講師點評抓不到，
 * 評等照樣算得出來、看得到。
 *
 * 三軸加權：里程碑 50%、對話精準度 30%、推銷控制力 20%。
 * 平均思考時間只呈現、不計分：想久不是錯，把它算進分數只會逼學員亂猜。
 */
import type { GateState } from './gate';
import { avgThoughtSec, type Metrics } from './metrics';

export type Tier = 'S' | 'A' | 'B' | 'C';

/** 一條計分軸。`evidence` 是給學員看的依據，讓分數不是黑箱。 */
export interface RatingAxis {
  key: 'milestones' | 'pace' | 'restraint';
  label: string;
  evidence: string;
  score: number;
}

export interface Rating {
  tier: Tier;
  title: string;
  /** 綜合得分 0–100。 */
  score: number;
  axes: RatingAxis[];
  /** 平均思考秒數；沒有有效樣本時為 null。 */
  avgThoughtSec: number | null;
}

const MILESTONE_TOTAL = 4;

const TIERS: { min: number; tier: Tier; title: string }[] = [
  { min: 90, tier: 'S', title: '專家級聽力顧問' },
  { min: 75, tier: 'A', title: '資深聽力顧問' },
  { min: 60, tier: 'B', title: '進階銷售員' },
  { min: 0, tier: 'C', title: '實習 sales' },
];

/**
 * 對話精準度。
 * 關鍵：**先看有沒有走完全程**。不先擋這一層的話，第 3 回合就放棄的學員會因為
 * 「回合數 ≤ 8」拿到滿分 —— 等於獎勵放棄。沒讓陳先生點頭就一律 40。
 */
function paceScore(accepted: boolean, turns: number): number {
  if (!accepted) return 40;
  if (turns <= 8) return 100;
  if (turns <= 12) return 80;
  if (turns <= 18) return 60;
  return 40;
}

export function calculateRating(gate: GateState, metrics: Metrics, userTurns: number): Rating {
  const hits = [gate.lifeContext, gate.realConcern, gate.addressedConcern, gate.accepted].filter(
    Boolean,
  ).length;

  const milestones = (hits / MILESTONE_TOTAL) * 100;
  const pace = paceScore(gate.accepted, userTurns);

  // 分母扣掉離題回合：亂打一通不該稀釋推銷率。一句正題都沒講就沒有「不推銷」可言，給 0。
  const onTopicTurns = Math.max(0, userTurns - metrics.offTopicTurns);
  const restraint =
    onTopicTurns === 0
      ? 0
      : (Math.max(0, onTopicTurns - metrics.pushyTurns) / onTopicTurns) * 100;

  const score = Math.round(milestones * 0.5 + pace * 0.3 + restraint * 0.2);
  const { tier, title } = TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];

  return {
    tier,
    title,
    score,
    axes: [
      {
        key: 'milestones',
        label: '里程碑達成',
        evidence: `${hits} / ${MILESTONE_TOTAL} 個`,
        score: Math.round(milestones),
      },
      {
        key: 'pace',
        label: '對話精準度',
        evidence: gate.accepted ? `${userTurns} 回合完成` : '沒有走完全程',
        score: pace,
      },
      {
        key: 'restraint',
        label: '推銷控制力',
        evidence: metrics.pushyTurns === 0 ? '全程沒推銷' : `${metrics.pushyTurns} 次推銷`,
        score: Math.round(restraint),
      },
    ],
    avgThoughtSec: avgThoughtSec(metrics),
  };
}
