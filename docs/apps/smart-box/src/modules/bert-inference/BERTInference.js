/**
 * BERTInference — 軽量BERT(bert-base-japanese, ONNX int8量子化)による
 * 意図分類とembedding抽出。DESIGN.md 5.1節を参照。
 *
 * 推論のみを行う(学習・逆伝播はしない。BERT本体は常にfreeze)。
 * configは configs/system.config.json の `model` / `runtime` を渡すこと。
 */
export class BERTInference {
  /**
   * @param {object} config - system.config.json の内容
   * @param {object} config.model - bertModelUrl, tokenizerUrl, quantization,
   *   rawEmbeddingDim, maxSequenceLength を含む
   * @param {object} config.runtime - backend, executionProviders, numThreads,
   *   warmupOnLoad を含む
   * @param {Float32Array[]} pcaMatrix - rag.config.json の pcaMatrixUrl から
   *   読み込んだ 768×64 のPCA射影行列(compress()で使用)
   */
  constructor(config, pcaMatrix) {
    this.config = config;
    this.pcaMatrix = pcaMatrix;
    this.session = null;
    this.tokenizer = null;
  }

  /**
   * ONNXモデル・トークナイザをロードし、config.runtime.warmupOnLoad が true なら
   * ダミー入力で1回推論してウォームアップする。
   * @returns {Promise<void>}
   * @throws モデル・トークナイザのロードに失敗した場合(呼び出し側でフォールバック処理をすること)
   */
  async initialize() {
    throw new Error('not implemented');
  }

  /**
   * テキストを意図分類し、圧縮embeddingを返す。
   * @param {string} text - ユーザー入力
   * @returns {Promise<{
   *   intent: string,
   *   confidence: number,
   *   embedding: Float32Array,   // 64次元(rag.config.jsonのcompressedDim)
   *   rawEmbedding: Float32Array, // 768次元
   *   latencyMs: number
   * }>}
   * @throws initialize() 未実行、または推論失敗時
   */
  async classify(text) {
    throw new Error('not implemented');
  }

  /**
   * 768次元embeddingをPCA固定射影で64次元に圧縮する(単純な等間隔平均ではなく
   * 行列積で実装すること。DESIGN.md 5.1節を参照)。
   * @param {Float32Array} embedding768
   * @returns {Float32Array} 64次元
   */
  compress(embedding768) {
    throw new Error('not implemented');
  }
}

export default BERTInference;
