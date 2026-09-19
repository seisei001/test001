/**
 * LoRAForward — 3階層LoRAアダプタ(global/topic/style)の順伝播。
 * h' = h + (alpha/rank) * B * A * x
 * DESIGN.md 5.5節・8.1節を参照。
 *
 * Phase 1では重みは固定値(A=ランダム初期化, B=ゼロ初期化のまま更新しない)の
 * スタブとして動かし、学習(勾配計算)はPhase 2でFeedbackProcessor経由で実装する。
 */
export class LoRAForward {
  /**
   * @param {object} loraConfig - lora.config.json の `layers` セクション
   */
  constructor(loraConfig) {
    this.config = loraConfig;
    /** @type {Record<'global'|'topic'|'style', {A: Float32Array, B: Float32Array}>} */
    this.weights = { global: null, topic: null, style: null };
  }

  /**
   * A行列はランダム初期化、B行列はゼロ初期化する
   * (学習開始時点でベースモデルの出力を変えないため)。
   * @returns {void}
   */
  initializeWeights() {
    throw new Error('not implemented');
  }

  /**
   * 指定した階層のLoRAアダプタを hiddenState に適用する。
   * @param {Float32Array} hiddenState - BERTのquery/value射影の出力
   * @param {'global'|'topic'|'style'} layerName
   * @returns {Float32Array} 適応後の出力
   */
  forward(hiddenState, layerName) {
    throw new Error('not implemented');
  }

  /**
   * IndexedDBに保存されているLoRA重みを読み込む(lora.config.jsonの
   * persistence.autoSave に対応)。
   * @returns {Promise<void>}
   */
  async loadWeights() {
    throw new Error('not implemented');
  }

  /**
   * @returns {Promise<void>}
   */
  async saveWeights() {
    throw new Error('not implemented');
  }
}

export default LoRAForward;
