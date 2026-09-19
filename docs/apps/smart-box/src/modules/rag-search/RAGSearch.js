/**
 * RAGSearch — クエリembeddingと過去の会話とのコサイン類似度検索。
 * DESIGN.md 5.2節を参照。embeddingは CoreModel.embed() から得る。
 * 1000ターン規模までは総当たりで十分高速(シミュレーション実測18ms)なため
 * ANNインデックスは使わない。
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
   * @param {Float32Array} queryEmbedding - 64次元(CoreModel.embed()の出力)
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
    const startTime = performance.now();
    const k = topK ?? this.config.topK;
    const threshold = minSimilarity ?? this.config.minSimilarityThreshold;

    const allTurns = await this.db.getAllTurns();
    const withEmbedding = allTurns.filter((turn) => turn.input && turn.input.embedding);

    if (withEmbedding.length === 0) {
      return {
        retrievedTurns: [],
        similarities: [],
        totalTurnsSearched: 0,
        latencyMs: performance.now() - startTime,
      };
    }

    const scored = withEmbedding.map((turn) => ({
      turn,
      similarity: this.cosineSimilarity(queryEmbedding, this._asFloat32(turn.input.embedding)),
    }));

    scored.sort((a, b) => b.similarity - a.similarity);

    const filtered = scored.filter((s) => s.similarity >= threshold).slice(0, k);

    return {
      retrievedTurns: filtered.map((s) => s.turn),
      similarities: filtered.map((s) => s.similarity),
      totalTurnsSearched: withEmbedding.length,
      latencyMs: performance.now() - startTime,
    };
  }

  /**
   * IndexedDBから読み出した配列(プレーンArrayの場合もある)をFloat32Arrayに揃える。
   * @param {Float32Array|number[]} embedding
   * @returns {Float32Array}
   * @private
   */
  _asFloat32(embedding) {
    return embedding instanceof Float32Array ? embedding : Float32Array.from(embedding);
  }

  /**
   * @param {Float32Array} a
   * @param {Float32Array} b
   * @returns {number} -1〜1のコサイン類似度
   * @throws a, b の次元が一致しない場合
   */
  cosineSimilarity(a, b) {
    if (a.length !== b.length) {
      throw new Error(`Embedding dimensions mismatch: ${a.length} !== ${b.length}`);
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }
}

export default RAGSearch;
