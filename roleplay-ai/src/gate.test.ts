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
  acceptedInvite: false,
  notPushy: true,
  offTopic: false,
};

/** turn 預設用 1、2、3… 遞增，測試裡只在要驗證里程碑落點時才明寫。 */
function advance(state: GateState, verdict: Partial<GateVerdict>, turn = 1): GateState {
  return mergeVerdict(state, { ...EMPTY_VERDICT, ...verdict }, turn);
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

  it('陳先生明說核心顧慮就鬆口', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, {
      concernProbe: true,
      identityProbe: true,
      identityConcernDisclosed: true,
    });

    expect(state.identityConcernDisclosed).toBe(true);
    expect(stageOf(state)).toBe('open');
  });

  // 這是實測逐字稿卡住的那一則：學員說「這就像戴眼鏡一樣」，陳先生當場回「怕人家看到會覺得
  // 我老了」。那一則不是探索問句，identityProbe=false，舊版因此不認帳，狀態機從此與劇情脫節。
  it('學員用同理帶出來的明說，一樣要鬆口', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, { identityProbe: false, identityConcernDisclosed: true });

    expect(state.identityConcernDisclosed).toBe(true);
    expect(stageOf(state)).toBe('open');
  });

  it('揭露那一則的同理寄放一回合，下一則自動兌現成已接住', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true }, 1);
    state = advance(state, {
      identityConcernDisclosed: true,
      identityConcernAddressed: true,
    }, 3);

    // 揭露的同一則不當場採計，維持防跳關。
    expect(stageOf(state)).toBe('open');
    expect(state.identityConcernAddressed).toBe(false);
    expect(state.pendingAddressed).toBe(3);

    state = advance(state, {}, 5);

    expect(state.identityConcernAddressed).toBe(true);
    expect(state.pendingAddressed).toBe(null);
    expect(stageOf(state)).toBe('ready');
    // 功勞記回當初說那句同理的第 3 則，不是兌現的第 5 則。
    expect(state.milestoneTurns[2]).toBe(3);
  });

  it('離題回合不兌現寄放的同理，也不會把它清掉', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true }, 1);
    state = advance(state, {
      identityConcernDisclosed: true,
      identityConcernAddressed: true,
    }, 3);
    state = advance(state, { offTopic: true }, 5);

    expect(state.identityConcernAddressed).toBe(false);
    expect(state.pendingAddressed).toBe(3);
    expect(stageOf(state)).toBe('open');

    state = advance(state, {}, 7);

    expect(stageOf(state)).toBe('ready');
    expect(state.milestoneTurns[2]).toBe(3);
  });

  it('里程碑記住達成於哪一則，且只記第一次', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true }, 1);
    state = advance(state, { lifeContext: true }, 3); // 又問了一次生活情境
    state = advance(state, { identityConcernDisclosed: true }, 5);
    state = advance(state, { identityConcernAddressed: true, invited: true, acceptedInvite: true }, 7);

    expect(state.milestoneTurns).toEqual([1, 5, 7, 7]);
    expect(stageOf(state)).toBe('accepted');
  });

  it('沒達成的里程碑留在 null，離題也不會佔掉落點', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true }, 1);
    state = advance(state, { lifeContext: true, identityConcernDisclosed: true, offTopic: true }, 3);

    expect(state.milestoneTurns).toEqual([1, null, null, null]);
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
    state = advance(state, { identityConcernAddressed: true, invited: true, acceptedInvite: true });

    expect(stageOf(state)).toBe('accepted');
    expect(state.identityConcernAddressed).toBe(true);
    expect(state.accepted).toBe(true);
  });

  // 實測逐字稿：學員一邊講規格（小台、可挑顏色）一邊約試聽。閘門其實已經開了，
  // 但陳先生照 INVITE_RULES 演婉拒「不用啦，今天先這樣就好」——
  // 舊版只看 invited 就開門，畫面於是說「他答應你了」，跟對話框裡的婉拒直接打架。
  it('陳先生婉拒時，就算閘門已開也不算過關', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, { identityProbe: true, identityConcernDisclosed: true });
    state = advance(state, { identityConcernAddressed: true });
    state = advance(state, { invited: true, acceptedInvite: false, notPushy: false });

    expect(state.accepted).toBe(false);
    expect(stageOf(state)).toBe('ready');
    expect(state.lastInviteRefused).toBe(true);
    // 條件都到了才被婉拒，不是「時機未到就邀約」，不該算進報告的 earlyInvites。
    expect(state.lastInviteDeclined).toBe(false);
    expect(state.earlyInvites).toBe(0);

    // 重新好好邀一次就過關。
    state = advance(state, { invited: true, acceptedInvite: true });

    expect(state.accepted).toBe(true);
    expect(state.lastInviteRefused).toBe(false);
  });

  it('時機未到的邀約算 earlyInvite，不算被婉拒', () => {
    let state = advance(INITIAL_GATE_STATE, { lifeContext: true });
    state = advance(state, { invited: true });

    expect(state.lastInviteDeclined).toBe(true);
    expect(state.lastInviteRefused).toBe(false);
    expect(state.earlyInvites).toBe(1);
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
    expect(verdict.acceptedInvite).toBe(false);
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
    state = advance(state, { identityConcernAddressed: true, invited: true, acceptedInvite: true });

    const rating = calculateRating(state, createMetrics(0), 3);

    expect(rating.axes[0].evidence).toBe('4 / 4 個');
    expect(buildReviewPrompt(state, 3)).toContain('明說外觀／身份標籤焦慮');
  });
});
