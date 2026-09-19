/**
 * LoRAForward — 3階層LoRAアダプタ(global/topic/style)の順伝播。
 * DESIGN.md 5.5節・8.1節を参照。
 *
 * 2026-09-19改訂(重要): 旧版は「応答生成のトーンを変える」ことを想定していたが、
 * BERT-base-japaneseは生成モデルではないため、その適用対象は技術的に存在しなかった
 * (DESIGN.md 付録B参照)。パーソナル対話日記というドメインに合わせ、適用対象を
 * 以下の2つの具体的なスカラー出力に限定して再設計した:
 *   1. rerankScore — RAGSearchの検索結果を並べ替えるためのユーザー適応スコア
 *   2. thresholdBias — confidence(RAG類似度)の判定閾値に対するユーザー補正値
 *
 * Phase 1では常に0(補正なし)を返すスタブとして動かし、学習(勾配計算)は
 * Phase 2でFeedbackProcessor経由で実装する。
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
   * (学習開始時点で rerankScore/thresholdBias が0を返すようにするため)。
   * @returns {void}
   */
  initializeWeights() {
    throw new Error('not implemented');
  }

  /**
   * クエリembeddingと候補(過去エントリ)embeddingの適合度をユーザー適応込みで
   * スコアリングする。RAGSearch.rerank() から呼ばれる。
   * @param {Float32Array} queryEmbedding
   * @param {Float32Array} candidateEmbedding
   * @param {'global'|'topic'|'style'} layerName
   * @returns {number} 素のコサイン類似度への加算補正値(Phase 1では常に0)
   */
  rerankScore(queryEmbedding, candidateEmbedding, layerName) {
    throw new Error('not implemented');
  }

  /**
   * rag.config.json の minSimilarityThreshold に対するユーザーごとの補正値。
   * 正の値 = 質問されるのを好む(閾値を上げてquestionが出やすくなる)、
   * 負の値 = 質問を好まない(閾値を下げてsurface_related/acknowledgeが出やすくなる)。
   * @param {'global'|'topic'|'style'} layerName
   * @returns {number} Phase 1では常に0
   */
  thresholdBias(layerName) {
    throw new Error('not implemented');
  }

  /**
   * IndexedDBに保存されているLoRA重みを読み込む(lora.config.jsonの
   * persistence相当の永続化)。
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
