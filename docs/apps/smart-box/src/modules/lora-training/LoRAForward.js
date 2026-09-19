/**
 * LoRAForward — 3階層LoRAアダプタ(global/topic/style)の順伝播。
 * h' = h + (alpha/rank) * (h @ A) @ B
 * DESIGN.md 5.4節・1.3節・8.1節を参照。
 *
 * **base modelの重みは一切更新しない。更新対象は常にこのLoRA A/B行列のみ**
 * (DESIGN.md 1.3節の核心原則)。
 *
 * **Phase 1のスコープに関する注記**: ここでの実装は、hiddenStateベクトルに対する
 * 低ランク残差更新の標準的な数式をJavaScriptの行列演算として素直に実装したもので、
 * CoreModelの実モデル(transformers.js)の内部query/value射影に直接フックする
 * ものではない(そちらはPhase 2で `docs/apps/smart-box/research/` で検証した
 * onnxruntime-web training経由の学習用グラフに載せ替えてから結線する)。
 * このモジュール単体は、A/B行列の初期化・順伝播・永続化・(FeedbackProcessorからの)
 * 更新という「LoRAの計算そのもの」を先に実装・テストできるようにするためのもの。
 */

const METADATA_KEY = 'loraWeights';

function randomMatrix(rows, cols, scale, rng) {
  const m = [];
  for (let i = 0; i < rows; i++) {
    const row = new Float32Array(cols);
    for (let j = 0; j < cols; j++) {
      row[j] = (rng() * 2 - 1) * scale;
    }
    m.push(row);
  }
  return m;
}

function zeroMatrix(rows, cols) {
  const m = [];
  for (let i = 0; i < rows; i++) {
    m.push(new Float32Array(cols));
  }
  return m;
}

// 決定論的PRNG(mulberry32)。初期化のたびに毎回異なる乱数だと再現性が無いため、
// シードは呼び出し側(initializeWeights)で都度生成する。
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class LoRAForward {
  /**
   * @param {object} loraConfig - lora.config.json の `layers` セクション
   * @param {import('../rag-search/IndexedDBManager.js').IndexedDBManager} [db] -
   *   loadWeights()/saveWeights() で使う永続化先(省略時はメモリ内のみ)
   */
  constructor(loraConfig, db) {
    this.config = loraConfig;
    this.db = db || null;
    /** @type {Record<'global'|'topic'|'style', {A: Float32Array[], B: Float32Array[], dim: number}|null>} */
    this.weights = { global: null, topic: null, style: null };
  }

  /**
   * A行列はランダム初期化、B行列はゼロ初期化する
   * (学習開始時点でbase modelの出力を変えないため)。
   * @param {number} dim - hiddenStateの次元数(実モデルのhidden dim相当)
   * @returns {void}
   */
  initializeWeights(dim) {
    let seedCounter = Date.now();
    for (const layerName of ['global', 'topic', 'style']) {
      const rank = this.config.layers[layerName].rank;
      const rng = mulberry32(seedCounter++);
      this.weights[layerName] = {
        A: randomMatrix(dim, rank, 0.01, rng),
        B: zeroMatrix(rank, dim),
        dim,
      };
    }
  }

  /**
   * 指定した階層のLoRAアダプタを hiddenState に適用する。
   * @param {Float32Array} hiddenState
   * @param {'global'|'topic'|'style'} layerName
   * @returns {Float32Array} 適応後の出力(hiddenState + LoRA補正)
   */
  forward(hiddenState, layerName) {
    if (!this.weights[layerName] || this.weights[layerName].dim !== hiddenState.length) {
      this.initializeWeights(hiddenState.length);
    }

    const { A, B } = this.weights[layerName];
    const rank = this.config.layers[layerName].rank;
    const alpha = this.config.layers[layerName].alpha ?? rank;
    const scale = alpha / rank;

    // down-project: mid[k] = sum_i hiddenState[i] * A[i][k]
    const mid = new Float32Array(rank);
    for (let k = 0; k < rank; k++) {
      let sum = 0;
      for (let i = 0; i < hiddenState.length; i++) {
        sum += hiddenState[i] * A[i][k];
      }
      mid[k] = sum;
    }

    // up-project: delta[j] = sum_k mid[k] * B[k][j]
    const output = Float32Array.from(hiddenState);
    for (let j = 0; j < hiddenState.length; j++) {
      let sum = 0;
      for (let k = 0; k < rank; k++) {
        sum += mid[k] * B[k][j];
      }
      output[j] += scale * sum;
    }

    return output;
  }

  /**
   * IndexedDBに保存されているLoRA重みを読み込む。無ければ何もしない
   * (forward()呼び出し時に遅延初期化される)。
   * @returns {Promise<void>}
   */
  async loadWeights() {
    if (!this.db) return;
    const stored = await this.db.getMetadata(METADATA_KEY);
    if (!stored) return;

    const restored = {};
    for (const layerName of ['global', 'topic', 'style']) {
      const layer = stored[layerName];
      if (!layer) {
        restored[layerName] = null;
        continue;
      }
      restored[layerName] = {
        dim: layer.dim,
        A: layer.A.map((row) => Float32Array.from(row)),
        B: layer.B.map((row) => Float32Array.from(row)),
      };
    }
    this.weights = restored;
  }

  /**
   * @returns {Promise<void>}
   */
  async saveWeights() {
    if (!this.db) return;

    const serializable = {};
    for (const layerName of ['global', 'topic', 'style']) {
      const layer = this.weights[layerName];
      if (!layer) {
        serializable[layerName] = null;
        continue;
      }
      serializable[layerName] = {
        dim: layer.dim,
        A: layer.A.map((row) => Array.from(row)),
        B: layer.B.map((row) => Array.from(row)),
      };
    }
    await this.db.setMetadata(METADATA_KEY, serializable);
  }
}

export default LoRAForward;
