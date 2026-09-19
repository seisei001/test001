/**
 * LoRAForward — 3階層LoRAアダプタ(global/topic/style)の順伝播。
 * h' = h + (alpha/rank) * B * A * x
 * DESIGN.md 5.4節・1.3節・8.1節を参照。
 *
 * CoreModel.generate() の生成過程(query/value射影)に適用する、本来のLoRAの使い方。
 * (前バージョンで「検索結果の再ランキングのみ」に限定したのは誤りだったため撤回した)
 *
 * **base modelの重みは一切更新しない。更新対象は常にこのLoRA A/B行列のみ**
 * (DESIGN.md 1.3節の核心原則)。
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
   * (学習開始時点でbase modelの出力を変えないため)。
   * @returns {void}
   */
  initializeWeights() {
    throw new Error('not implemented');
  }

  /**
   * 指定した階層のLoRAアダプタを hiddenState(CoreModelのquery/value射影の出力)に適用する。
   * @param {Float32Array} hiddenState
   * @param {'global'|'topic'|'style'} layerName
   * @returns {Float32Array} 適応後の出力
   */
  forward(hiddenState, layerName) {
    throw new Error('not implemented');
  }

  /**
   * IndexedDBに保存されているLoRA重みを読み込む。
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
