/**
 * RAGSearch — クエリembeddingと過去エントリとのコサイン類似度検索。
 * DESIGN.md 5.3節を参照。1000エントリ規模までは総当たりで十分高速
 * (シミュレーション実測18ms)なためANNインデックスは使わない。
 *
 * 2026-09-19改訂: search()が返す最上位類似度が、そのままTurnControllerの
 * confidence判定(DESIGN.md 1.4節)に使われる。
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
   *   retrievedEntries: object[],
   *   similarities: number[],
   *   confidence: number,       // = similarities[0]。ヒット無しの場合は0
   *   totalEntriesSearched: number,
   *   latencyMs: number
   * }>}
   */
  async search(queryEmbedding, topK, minSimilarity) {
    throw new Error('not implemented');
  }

  /**
   * LoRAForward.rerankScore() を使って検索結果を並べ替える(Phase 2)。
   * Phase 1ではLoRAForwardが常に0を返すため、実質的に元の類似度順を維持する。
   * @param {object[]} candidates - search() の retrievedEntries
   * @param {import('../lora-training/LoRAForward.js').LoRAForward} loraForward
   * @returns {object[]} 並べ替え後のcandidates
   */
  rerank(candidates, loraForward) {
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
