/**
 * FeedbackProcessor — ユーザーのengagement(質問後に続けて書いた文字数・経過時間)を
 * 学習信号に変換する。DESIGN.md 5.6節・8.1節・8.2節を参照。Phase 2で実装対象。
 *
 * 2026-09-19改訂: 日記アプリには明示的な訂正/評価が基本無いため、旧版のexplicit
 * feedback前提をやめ、implicitのengagementScoreのみを信号源とする(DESIGN.md 4.4節)。
 *
 * ここで生成された信号を使い、LoRAForward の A/B 行列のみを対象に手動で
 * 勾配を計算・更新する(BERT本体はfreezeし逆伝播しない)。
 */
export class FeedbackProcessor {
  /**
   * @param {object} loraConfig - lora.config.json (feedback, lossWeights, training を使用)
   */
  constructor(loraConfig) {
    this.config = loraConfig;
    /** experience replay buffer (lora.config.json training.experienceReplayBufferSize) */
    this.replayBuffer = [];
  }

  /**
   * 質問を出した次のエントリとの時間差・文字数からengagementを推定する。
   * @param {{ nextEntryDelaySec: number, nextEntryLength: number }} timingAndLength
   * @param {object} turnData - DESIGN.md 6節のターンデータ(response.type === 'question' の場合のみ意味を持つ)
   * @returns {{
   *   engagementScore: number,   // 0〜1。高いほど質問が効果的だった
   *   trainingLabel: object
   * }}
   */
  process(timingAndLength, turnData) {
    throw new Error('not implemented');
  }

  /**
   * Three-Way Fan-In Loss を計算する(DESIGN.md 8.2節)。
   * loss = feedback*Lf + trajectory*Lt + question*Lq(engagementScoreから算出) + proximalReg*Lp
   * @param {object} trainingLabel
   * @param {object} loraWeights - LoRAForward.weights
   * @returns {number} loss
   */
  computeLoss(trainingLabel, loraWeights) {
    throw new Error('not implemented');
  }

  /**
   * computeLoss() の勾配を手動で導出し、Adam的な更新(lora.config.jsonの
   * optimization相当)でLoRAForwardのA/B行列を書き換える。
   * @param {import('./LoRAForward.js').LoRAForward} loraForward
   * @param {object} trainingLabel
   * @returns {{ lossBefore: number, lossAfter: number }}
   */
  updateWeights(loraForward, trainingLabel) {
    throw new Error('not implemented');
  }
}

export default FeedbackProcessor;
