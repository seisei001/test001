/**
 * RAGSearch — クエリembeddingと過去ターンとのコサイン類似度検索。
 * DESIGN.md 5.3節を参照。1000ターン規模までは総当たりで十分高速
 * (シミュレーション実測18ms)なためANNインデックスは使わない。
 */
export class RAGSearch {
  /**
   * @param {import('./IndexedDBManager.js').IndexedDBManager} db
   * @param {object} ragConfig - rag.config.json の `search` セクション
   */
  constructor(db, ragConfig) {
    this.db = db;
    this.config = ragConfig;
  }

  /**
   * @param {Float32Array} queryEmbedding - 64次元
   * @param {number} [topK] - 省略時は config.topK (デフォルト5)
   * @param {number} [minSimilarity] - 省略時は config.minSimilarityThreshold (デフォルト0.3)
   * @returns {Promise<{
   *   retrievedTurns: object[],
   *   similarities: number[],
   *   totalTurnsSearched: number,
   *   latencyMs: number
   * }>}
   */
  async search(queryEmbedding, topK, minSimilarity) {
    throw new Error('not implemented');
  }

  /**
   * @param {Float32Array} a
   * @param {Float32Array} b
   * @returns {number} -1〜1のコサイン類似度
   * @throws a, b の次元が一致しない場合
   */
  cosineSimilarity(a, b) {
    throw new Error('not implemented');
  }
}

export default RAGSearch;
