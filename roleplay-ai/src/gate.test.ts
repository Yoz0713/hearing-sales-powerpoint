import { describe, expect, it } from 'vitest';
import {
  INITIAL_GATE_STATE,
  mergeVerdict,
  parseConverse,
  stageOf,
  type GateState,
  type GateVerdict,
} from './gate';
import { createMetrics } from './metrics';
import { buildReviewPrompt } from './persona';
import { calculateRating } from './rating';

const EMPTY_VERDICT: GateVerdict = {
  lifeContext: false,
  concernProbe: false,
  identityProbe: false,
  identityConcernDisclosed: false,
  identityConcernAddressed: false,
  invited: false,
  notPushy: true,
  offTopic: false,
};

function advance(state: GateState, verdict: Partial<GateVerdict>): GateState {
  return mergeVerdict(state, { ...EMPTY_VERDICT, ...verdict });
}

describe('陳先生核心顧慮關卡', () => {
  it('只處理效果疑慮時，即使邀請試聽也不接受', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, { concernProbe: true });
    state = advance(state, { identityConcernAddressed: true, invited: true });

    expect(stageOf(state)).toBe('closed');
    expect(state.identityConcernDisclosed).toBe(false);
    expect(state.identityConcernAddressed).toBe(false);
    expect(state.accepted).toBe(false);
    expect(state.earlyInvites).toBe(1);
  });

  it('第二次一般探索只到提示門檻，不會自動揭露核心顧慮', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, { concernProbe: true });
    state = advance(state, { concernProbe: true });

    expect(state.concernProbeCount).toBe(2);
    expect(state.identityConcernDisclosed).toBe(false);
    expect(stageOf(state)).toBe('closed');
  });

  it('必須由學員探索身份焦慮，陳先生明說後才鬆口', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, {
      concernProbe: true,
      identityProbe: true,
      identityConcernDisclosed: true,
    });

    expect(state.identityConcernDisclosed).toBe(true);
    expect(stageOf(state)).toBe('open');
  });

  it('揭露同一回合不能同時算接住與成功邀約', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, {
      concernProbe: true,
      identityProbe: true,
      identityConcernDisclosed: true,
      identityConcernAddressed: true,
      invited: true,
    });

    expect(stageOf(state)).toBe('open');
    expect(state.identityConcernAddressed).toBe(false);
    expect(state.accepted).toBe(false);
    expect(state.earlyInvites).toBe(1);
  });

  it('核心顧慮已揭露並在後續回合被接住後，邀約才成功', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, {
      concernProbe: true,
      identityProbe: true,
      identityConcernDisclosed: true,
    });
    state = advance(state, { identityConcernAddressed: true, invited: true });

    expect(stageOf(state)).toBe('accepted');
    expect(state.identityConcernAddressed).toBe(true);
    expect(state.accepted).toBe(true);
  });

  it('生活情境建立前直接猜外觀，不會跳過建立信任的步驟', () => {
    const state = advance(INITIAL_GATE_STATE, {
      concernProbe: true,
      identityProbe: true,
      identityConcernDisclosed: true,
    });

    expect(state.identityConcernDisclosed).toBe(false);
    expect(state.concernProbeCount).toBe(0);
    expect(stageOf(state)).toBe('closed');
  });

  it('離題回合不累積任何探索或揭露進度', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, {
      concernProbe: true,
      identityProbe: true,
      identityConcernDisclosed: true,
      offTopic: true,
    });

    expect(state.concernProbeCount).toBe(0);
    expect(state.identityConcernDisclosed).toBe(false);
    expect(state.lastOffTopic).toBe(true);
  });
});

describe('結構化輸出解析', () => {
  it('缺少新的核心顧慮欄位時採保守判定', () => {
    const { verdict } = parseConverse(JSON.stringify({ reply: '我再想想。' }));

    expect(verdict.identityProbe).toBe(false);
    expect(verdict.identityConcernDisclosed).toBe(false);
    expect(verdict.identityConcernAddressed).toBe(false);
  });
});

describe('評分與講師回饋', () => {
  it('效果支線不會被算成真正顧慮里程碑', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, { concernProbe: true });

    const rating = calculateRating(state, createMetrics(0), 2);

    expect(rating.axes[0].evidence).toBe('1 / 4 個');
    expect(buildReviewPrompt(state, 2)).toContain('尚未說出核心外觀／身份標籤焦慮');
  });

  it('完整身份焦慮路徑會取得四個里程碑', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, {
      concernProbe: true,
      identityProbe: true,
      identityConcernDisclosed: true,
    });
    state = advance(state, { identityConcernAddressed: true, invited: true });

    const rating = calculateRating(state, createMetrics(0), 3);

    expect(rating.axes[0].evidence).toBe('4 / 4 個');
    expect(buildReviewPrompt(state, 3)).toContain('明說外觀／身份標籤焦慮');
  });
});
