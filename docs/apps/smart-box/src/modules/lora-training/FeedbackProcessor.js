/**
 * FeedbackProcessor — 本体AIを賢くするための損失を計算する。DESIGN.md 1.4節・5.5節・
 * 8.1節・8.4節を参照。
 *
 * 2つのモードを持つ:
 *   1. distillation(LLM連携時): 本体AIの回答をLLMの回答に近づける教師あり損失
 *      (LLMの回答文をターゲットとしたteacher-forcing)
 *   2. implicit(単体時): 質問への反応等のimplicit signalから損失を計算(旧設計を流用)
 *
 * どちらの場合も、勾配の更新対象は **LoRAForward の A/B 行列のみ**
 * (DESIGN.md 1.3節。base modelは常にfreeze)。
 */
export class FeedbackProcessor {
  /**
   * @param {object} loraConfig - lora.config.json (training, lossWeights を使用)
   */
  constructor(loraConfig) {
    this.config = loraConfig;
    /** experience replay buffer (lora.config.json training.experienceReplayBufferSize) */
    this.replayBuffer = [];
  }

  /**
   * 本体AIの回答とLLMの回答から蒸留損失を計算する(LLM連携時)。
   * @param {string} ownAnswer - CoreModel.generate() の出力
   * @param {string} llmAnswer - LLMTeacher.ask() の出力
   * @returns {{ loss: number, trainingLabel: object }}
   */
  computeDistillationLoss(ownAnswer, llmAnswer) {
    throw new Error('not implemented');
  }

  /**
   * ユーザーの反応(implicit signal)から損失を計算する(単体時のフォールバック)。
   * @param {object} feedback - 例: { type: 'implicit', signals: {...} }
   * @param {object} turnData - DESIGN.md 6節のターンデータ
   * @returns {{ loss: number, trainingLabel: object }}
   */
  computeImplicitLoss(feedback, turnData) {
    throw new Error('not implemented');
  }

  /**
   * computeDistillationLoss() / computeImplicitLoss() の勾配を、LoRAForwardの
   * A/B行列のみを対象に逆伝播で計算し、Adam的な更新(lora.config.jsonの
   * optimization相当)で書き換える。base modelは一切触らない(DESIGN.md 1.3節)。
   * @param {import('./LoRAForward.js').LoRAForward} loraForward
   * @param {object} trainingLabel
   * @returns {{ lossBefore: number, lossAfter: number }}
   */
  updateWeights(loraForward, trainingLabel) {
    throw new Error('not implemented');
  }
}

export default FeedbackProcessor;
