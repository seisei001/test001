/**
 * CoreModel — 「本体AI」。量子化された小型生成モデル1つで、embedding抽出(RAG用)と
 * 文章生成(回答用)の両方を兼ねる。DESIGN.md 1.3節・5.1節を参照。
 *
 * **base weightsは永久にfreezeし、一切更新しない。** 会話ごとの学習は常に
 * LoRAアダプタ(数千パラメータ)のみに対して行う(DESIGN.md 1.3節)。
 * 理由: 極小モデルをフルファインチューニングするとデータ量的にもモデルが破綻し
 * 実用に耐えない。LoRAという小さな可逆的な変更に限定することで実用レベルを保つ。
 *
 * モデル候補(未確定・Phase 0で実機検証要。DESIGN.md 5.1節・8.2節):
 * Qwen2.5-0.5B-Instruct級の小型多言語モデルをint4量子化し、WebGPU(transformers.js等)
 * で実行、非対応環境はwasm CPUにフォールバックする案を第一候補とする。
 */
export class CoreModel {
  /**
   * @param {object} config - system.config.json の `model` / `runtime` セクション
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
   * 量子化モデル・トークナイザをロードする(WebGPU優先、wasmにフォールバック)。
   * @returns {Promise<void>}
   * @throws ロード失敗時(呼び出し側でユーザーにエラー表示する設計とする)
   */
  async initialize() {
    throw new Error('not implemented');
  }

  /**
   * テキストを圧縮embeddingに変換する(RAGSearch用)。
   * @param {string} text
   * @returns {Promise<{ embedding: Float32Array, rawEmbedding: Float32Array, latencyMs: number }>}
   */
  async embed(text) {
    throw new Error('not implemented');
  }

  /**
   * プロンプト・RAGコンテキスト・ProfileMemoのコンテキストから、LoRA適用込みで
   * 本体AI自身の回答を生成する。
   * @param {string} prompt - ユーザーの入力
   * @param {object} ragContext - RAGSearch.search() の結果
   * @param {string} profileContext - ProfileMemo.getContext() の結果
   *   (DESIGN.md 1.5節。検索なしで常時注入される固定コンテキスト)
   * @param {import('../lora-training/LoRAForward.js').LoRAForward} loraForward -
   *   生成の各層(query/value射影)にLoRA補正を注入する
   * @returns {Promise<{ text: string, latencyMs: number }>}
   */
  async generate(prompt, ragContext, profileContext, loraForward) {
    throw new Error('not implemented');
  }

  /**
   * 今回のターンの内容から、ProfileMemoに追記・修正すべき点を安価に要約する
   * (ProfileMemo.update() から呼ばれる、毎ターンの軽量な差分生成用)。
   * @param {object} turnData - DESIGN.md 6節のターンデータ
   * @returns {Promise<{ profileDelta: object }>}
   */
  async summarizeForProfile(turnData) {
    throw new Error('not implemented');
  }

  /**
   * 768次元embeddingをPCA固定射影で64次元に圧縮する(行列積で実装すること)。
   * @param {Float32Array} embedding768
   * @returns {Float32Array} 64次元
   */
  compress(embedding768) {
    throw new Error('not implemented');
  }
}

export default CoreModel;
