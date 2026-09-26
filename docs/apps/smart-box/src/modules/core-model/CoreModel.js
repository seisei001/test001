/**
 * CoreModel — 「本体AI」。embedding抽出(RAG用)と文章生成(回答用)を、それぞれ
 * 専用の軽量モデルで行う。DESIGN.md 1.3節・5.1節・第9版/第10版revision noteを参照。
 *
 * **base weightsは永久にfreezeし、一切更新しない。** 会話ごとの学習は常に
 * 生成モデル側のLoRAアダプタ(数千パラメータ)のみに対して行う(DESIGN.md 1.3節)。
 *
 * 実装基盤(DESIGN.md 5.1節・8.1節、第8版で確定・第9版でモデル分離・第10版で
 * 生成モデル変更): 推論は `transformers.js` を使う。生成には
 * `config.model.coreModelUrl`(Gemma-3-270m-it、int4量子化・約322MB)、embedding
 * には `config.model.embeddingModelUrl`(multilingual-e5-small、日本語含む多言語
 * 対応・約118MB)という、それぞれ別のONNXモデルを読み込む(量子化方式は
 * `coreModelDtype`/`embeddingModelDtype`で指定)。当初は1モデルで両方を兼ねる設計
 * だったが第9版でembedding専用モデルに分離、さらに第10版でQwen2.5-0.5B-Instruct
 * (int8・約512MB)からGemma-3-270m-it(int4・約322MB)に変更した(iPhone Safariで
 * 旧構成が合計630MBのメモリ確保に失敗しタブがクラッシュすることを実機で確認したため)。
 * CDN経由の動的importで読み込む。
 *
 * 実際にアプリを利用するユーザーのブラウザが、Hugging Faceから直接モデルファイルを
 * 取得する(このリポジトリやその配布元は何も自前ホスティングしない)。初回アクセス時
 * のみダウンロードが発生し、以降はブラウザのCache Storage APIで永続キャッシュされる。
 *
 * **開発サンドボックスでの制約**: このリポジトリの開発環境からhuggingface.co/
 * cdn.jsdelivr.net へのアクセスが組織ポリシーで遮断されているため、開発セッション内
 * では実モデルでの動作確認ができない(DESIGN.md 8.1節・8.2節の研究ノート参照)。
 * これは開発サンドボックス固有の制約であり、一般ユーザーのブラウザには影響しない。
 * `config.model.mockMode` が true の場合は、ネットワーク接続不要な決定論的スタブ
 * (ハッシュベースのembedding・テンプレート応答)で動作し、CoreModel以外の
 * パイプライン全体(RAG/ProfileMemo/TurnController/UI)を検証できるようにしてある。
 */
export class CoreModel {
  /**
   * @param {object} config - system.config.json の内容全体(`model.coreModelUrl` が生成用、
   *   `model.embeddingModelUrl` がembedding用。`runtime` も使用)
   * @param {Float32Array[]|null} pcaMatrix - rag.config.json の pcaMatrixUrl から
   *   読み込んだ rawDim×64 のPCA射影行列(compress()で使用。rawDimはembeddingModelUrlの
   *   出力次元、multilingual-e5-smallなら384)。未取得ならnull(その場合
   *   compress()は単純な等間隔ダウンサンプリングにフォールバックする)。
   */
  constructor(config, pcaMatrix) {
    this.config = config;
    this.pcaMatrix = pcaMatrix;
    this.session = null;
    this.tokenizer = null;
    this.featureExtractor = null;
    this.generator = null;
    this.ready = false;
  }

  /**
   * 量子化モデル・トークナイザをロードする(WebGPU優先、wasmにフォールバック)。
   * 生成モデル(約512MB)とembeddingモデル(約118MB)、合計630MB程度の初回ダウンロードが
   * 発生するため、進捗をUIに伝えられるよう onProgress コールバックを受け付ける。
   * 2つのモデルは互いに独立しているため Promise.all で並行ロードする(直列だと
   * ダウンロード時間が単純合算されてしまうため)。
   * @param {(info: {modelKey: 'embedding'|'generation', file: string, progress: number}) => void}
   *   [onProgress] - ダウンロード進捗の通知(0〜100のパーセンテージ)。省略可。
   * @returns {Promise<void>}
   * @throws ロード失敗時(呼び出し側でユーザーにエラー表示する設計とする)
   */
  async initialize(onProgress) {
    if (this.config.model.mockMode) {
      this.ready = true;
      return;
    }

    // transformers.js を CDN から動的 import する(未確定のモデルURLを
    // system.config.json の model.coreModelUrl で切り替えられるようにするため)。
    const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js');

    env.backends.onnx.wasm.proxy = false;
    if (this.config.runtime.backend === 'webgpu' && !navigator.gpu) {
      console.warn('CoreModel: WebGPU not available, falling back to wasm');
    }
    const device = navigator.gpu ? this.config.runtime.backend : this.config.runtime.fallbackBackend;

    // 1モデルの読み込みには複数ファイル(tokenizer.json、モデル本体の重みファイルなど)の
    // ダウンロードが必要で、progress_callbackはファイルごとに0〜100%を個別に報告する。
    // そのためファイル単位のprogressだけを見ると、ファイルが切り替わるたびに0%に
    // 戻ったように見えてしまう。呼び出し側でファイル横断の合計進捗を計算できるよう、
    // loaded/total(バイト数)も一緒に渡す。
    const makeProgressCallback = (modelKey) => (data) => {
      if (onProgress && data.status === 'progress') {
        onProgress({
          modelKey,
          file: data.file,
          progress: data.progress ?? 0,
          loaded: data.loaded ?? 0,
          total: data.total ?? 0,
        });
      }
    };

    [this.featureExtractor, this.generator] = await Promise.all([
      pipeline('feature-extraction', this.config.model.embeddingModelUrl, {
        device,
        dtype: this.config.model.embeddingModelDtype || 'q8',
        progress_callback: makeProgressCallback('embedding'),
      }),
      pipeline('text-generation', this.config.model.coreModelUrl, {
        device,
        dtype: this.config.model.coreModelDtype || 'q8',
        progress_callback: makeProgressCallback('generation'),
      }),
    ]);
    this.ready = true;
  }

  /**
   * テキストを圧縮embeddingに変換する(RAGSearch用)。
   * @param {string} text
   * @returns {Promise<{ embedding: Float32Array, rawEmbedding: Float32Array, latencyMs: number }>}
   */
  async embed(text) {
    this._assertReady();
    const startTime = performance.now();

    if (this.config.model.mockMode) {
      const rawEmbedding = this._mockEmbedding(text, this.config.model.rawEmbeddingDim || 768);
      const embedding = this.compress(rawEmbedding);
      return { embedding, rawEmbedding, latencyMs: performance.now() - startTime };
    }

    const output = await this.featureExtractor(text, { pooling: 'mean', normalize: true });
    const rawEmbedding = Float32Array.from(output.data);
    const embedding = this.compress(rawEmbedding);

    return { embedding, rawEmbedding, latencyMs: performance.now() - startTime };
  }

  /**
   * プロンプト・RAGコンテキスト・ProfileMemoのコンテキストから、LoRA適用込みで
   * 本体AI自身の回答を生成する。
   *
   * **注記(Phase 1のスコープ)**: LoRAForwardによる実際の重み適用は、
   * onnxruntime-web training版のセッションに本体AIモデルを載せ替えてから
   * (DESIGN.md 8.1節のPhase 0検証の先)有効になる。transformers.jsパイプライン
   * 経由の生成では、現時点ではLoRAの学習済み補正はまだ反映されない
   * (Phase 2で本結線する。ここでは引数として受け取るのみ)。
   *
   * @param {string} prompt - ユーザーの入力
   * @param {object} ragContext - RAGSearch.search() の結果
   * @param {string} profileContext - ProfileMemo.getContext() の結果
   *   (DESIGN.md 1.5節。検索なしで常時注入される固定コンテキスト)
   * @param {import('../lora-training/LoRAForward.js').LoRAForward} loraForward -
   *   生成の各層(query/value射影)にLoRA補正を注入する(Phase 2で本結線)
   * @returns {Promise<{ text: string, latencyMs: number }>}
   */
  async generate(prompt, ragContext, profileContext, loraForward) {
    this._assertReady();
    const startTime = performance.now();

    const fullPrompt = this._buildPrompt(prompt, ragContext, profileContext);

    if (this.config.model.mockMode) {
      const text = this._mockGenerate(prompt, ragContext, profileContext);
      return { text, latencyMs: performance.now() - startTime };
    }

    const output = await this.generator(fullPrompt, {
      max_new_tokens: 256,
      temperature: 0.7,
      do_sample: true,
    });
    const generatedText = output[0].generated_text.slice(fullPrompt.length).trim();

    return { text: generatedText, latencyMs: performance.now() - startTime };
  }

  /**
   * 今回のターンの内容から、ProfileMemoに追記・修正すべき点を安価に要約する
   * (ProfileMemo.update() から呼ばれる、毎ターンの軽量な差分生成用)。
   * @param {object} turnData - DESIGN.md 6節のターンデータ
   * @returns {Promise<{ profileDelta: object }>}
   */
  async summarizeForProfile(turnData) {
    this._assertReady();

    // Phase 1では、本体AIによる高度な要約ではなく軽量なヒューリスティックで
    // profileDeltaを作る(本体AI自身に要約させる高度化はPhase 2)。
    const userPrompt = turnData.input?.user_prompt || '';
    const notes = [];

    if (userPrompt.includes('```') || /`[^`]+`/.test(userPrompt)) {
      notes.push('コードを含むやり取りをした');
    }
    if (userPrompt.length > 200) {
      notes.push('長い文章で質問する傾向がある');
    }

    return { profileDelta: { notes, questionIntentPatterns: [] } };
  }

  /**
   * 生embedding(embeddingModelUrlの出力次元。multilingual-e5-smallなら384次元)を
   * PCA固定射影で64次元に圧縮する(行列積で実装)。
   * pcaMatrixが未取得の場合は等間隔ダウンサンプリングにフォールバックする
   * (DESIGN.md 8.1節: PCA行列はまだ生成されていないため、実運用までの暫定措置)。
   * @param {Float32Array} rawEmbedding
   * @returns {Float32Array} 64次元
   */
  compress(rawEmbedding) {
    const targetDim = 64;

    if (this.pcaMatrix) {
      // pcaMatrix: [rawDim][targetDim] の行列。out[j] = sum_i rawEmbedding[i] * pcaMatrix[i][j]
      const out = new Float32Array(targetDim);
      for (let j = 0; j < targetDim; j++) {
        let sum = 0;
        for (let i = 0; i < rawEmbedding.length; i++) {
          sum += rawEmbedding[i] * this.pcaMatrix[i][j];
        }
        out[j] = sum;
      }
      return out;
    }

    // フォールバック: 等間隔ダウンサンプリング(PCA未生成の間の暫定実装)
    const out = new Float32Array(targetDim);
    const step = rawEmbedding.length / targetDim;
    for (let j = 0; j < targetDim; j++) {
      let sum = 0;
      const start = Math.floor(j * step);
      const end = Math.floor((j + 1) * step);
      for (let i = start; i < end; i++) {
        sum += rawEmbedding[i];
      }
      out[j] = sum / Math.max(1, end - start);
    }
    return out;
  }

  /**
   * @private
   */
  _assertReady() {
    if (!this.ready) {
      throw new Error('CoreModel: initialize() must be called before use');
    }
  }

  /**
   * RAG文脈・ProfileMemo文脈を組み込んだプロンプトを組み立てる。
   * @private
   */
  _buildPrompt(prompt, ragContext, profileContext) {
    const parts = [];
    if (profileContext) {
      parts.push(profileContext);
    }
    if (ragContext && ragContext.retrievedTurns && ragContext.retrievedTurns.length > 0) {
      const history = ragContext.retrievedTurns
        .map((t) => `過去: ${t.input?.user_prompt} → ${t.response?.own_answer}`)
        .join('\n');
      parts.push(history);
    }
    parts.push(`ユーザー: ${prompt}`);
    parts.push('本体AI:');
    return parts.join('\n\n');
  }

  /**
   * ネットワーク不要な決定論的embedding(テキストのハッシュから疑似ベクトルを生成)。
   * mockMode専用。実際の意味的な類似度は再現しないが、パイプライン全体の
   * 動作確認(同じテキストは同じembeddingになる・異なるテキストは異なる)には十分。
   * @private
   */
  _mockEmbedding(text, dim) {
    const out = new Float32Array(dim);
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
    }
    for (let i = 0; i < dim; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      out[i] = (seed / 0xffffffff) * 2 - 1;
    }
    return out;
  }

  /**
   * mockMode専用のテンプレート応答生成。
   * @private
   */
  _mockGenerate(prompt, ragContext, profileContext) {
    const hasHistory = ragContext && ragContext.retrievedTurns && ragContext.retrievedTurns.length > 0;
    if (hasHistory) {
      return `(mock応答) 「${prompt}」について、過去に似た話がありましたね。もう少し詳しく聞かせてください。`;
    }
    return `(mock応答) 「${prompt}」について、承知しました。`;
  }
}

export default CoreModel;
