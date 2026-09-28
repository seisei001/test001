/**
 * FeedbackProcessor — 本体AIを賢くするための損失を計算する。DESIGN.md 1.4節・5.5節・
 * 8.1節・8.4節を参照。
 *
 * 2つのモードを持つ:
 *   1. distillation(LLM連携時): 本体AIの回答embeddingをLLMの回答embeddingに
 *      近づける教師あり損失(MSE)
 *   2. implicit(単体時): 質問への反応等のimplicit signalから損失を計算(旧設計を流用)
 *
 * どちらの場合も、勾配の更新対象は **LoRAForward の A/B 行列のみ**
 * (DESIGN.md 1.3節。base modelは常にfreeze)。
 *
 * **Phase 1のスコープに関する注記**: `updateWeights()` は
 * `LoRAForward.forward(x, layerName) = x + scale*(x@A)@B` という、
 * LoRAForward.js に実装した独立した計算そのものに対する解析的勾配を用いて
 * Adamで更新する。実モデル(transformers.js)の内部query/value射影への結線は
 * Phase 2(`docs/apps/smart-box/research/`で検証したonnxruntime-web training経由)
 * で行う。distillationモードでの実際の勾配計算には
 * `trainingLabel.inputVector`/`targetVector`(CoreModel.embed()の出力)が必要で、
 * これらはTurnController側が用意して渡す想定。
 */
export class FeedbackProcessor {
  /**
   * @param {object} loraConfig - lora.config.json (layers, training, lossWeights を使用)
   */
  constructor(loraConfig) {
    this.config = loraConfig;
    /** experience replay buffer (lora.config.json training.experienceReplayBufferSize) */
    this.replayBuffer = [];
    /** @type {Record<string, {A: {m: Float32Array[], v: Float32Array[]}, B: {m: Float32Array[], v: Float32Array[]}, t: number}>} */
    this._adamState = {};
  }

  /**
   * 本体AIの回答とLLMの回答から蒸留損失を計算する(LLM連携時)。
   * @param {string} ownAnswer - CoreModel.generate() の出力
   * @param {string} llmAnswer - LLMTeacher.ask() の出力
   * @param {Float32Array} [ownEmbedding] - CoreModel.embed(ownAnswer) の結果(あれば実勾配計算に使う)
   * @param {Float32Array} [llmEmbedding] - CoreModel.embed(llmAnswer) の結果
   * @returns {{ loss: number, trainingLabel: object }}
   */
  computeDistillationLoss(ownAnswer, llmAnswer, ownEmbedding, llmEmbedding) {
    if (ownEmbedding && llmEmbedding) {
      const loss = this._mse(ownEmbedding, llmEmbedding);
      return {
        loss,
        trainingLabel: { mode: 'distillation', inputVector: ownEmbedding, targetVector: llmEmbedding },
      };
    }

    // embeddingが無い場合のフォールバック(ログ・監視用の粗い損失。勾配更新はできない)
    const loss = this._textDissimilarity(ownAnswer, llmAnswer);
    return { loss, trainingLabel: { mode: 'distillation', ownAnswer, llmAnswer } };
  }

  /**
   * ユーザーの反応(implicit signal)から損失を計算する(単体時のフォールバック)。
   * @param {object} feedback - 例: { type: 'implicit', signals: { engagementScore } }
   * @param {object} turnData - DESIGN.md 6節のターンデータ
   * @returns {{ loss: number, trainingLabel: object }}
   */
  computeImplicitLoss(feedback, turnData) {
    const engagementScore = feedback?.signals?.engagementScore ?? 0.5;
    const loss = 1 - engagementScore;
    return { loss, trainingLabel: { mode: 'implicit', engagementScore, turnId: turnData?.turn_id } };
  }

  /**
   * computeDistillationLoss() / computeImplicitLoss() の結果から、LoRAForwardの
   * A/B行列のみを対象に逆伝播で勾配を計算し、Adamで更新する。base modelは一切
   * 触らない(DESIGN.md 1.3節)。distillationモードでinputVector/targetVectorが
   * 無い場合、または implicitモードの場合は勾配計算ができないため何もしない
   * (Phase 1の既知の制約。第8.1節の技術検証が実モデルに適用され、Phase 2で
   * onnxruntime-web training経由の学習に置き換わるまでの暫定挙動)。
   * @param {import('./LoRAForward.js').LoRAForward} loraForward
   * @param {object} trainingLabel
   * @returns {{ lossBefore: number|null, lossAfter: number|null }}
   */
  updateWeights(loraForward, trainingLabel) {
    if (trainingLabel.mode !== 'distillation' || !trainingLabel.inputVector || !trainingLabel.targetVector) {
      return { lossBefore: null, lossAfter: null };
    }

    const x = trainingLabel.inputVector;
    const target = trainingLabel.targetVector;

    let lossBefore = 0;
    let lossAfter = 0;

    for (const layerName of ['global', 'topic', 'style']) {
      const outputBefore = loraForward.forward(x, layerName);
      lossBefore += this._mse(outputBefore, target);

      const { gradA, gradB } = this._computeGradients(loraForward, layerName, x, outputBefore, target);
      this._applyAdamStep(loraForward, layerName, gradA, gradB);

      const outputAfter = loraForward.forward(x, layerName);
      lossAfter += this._mse(outputAfter, target);
    }

    this.replayBuffer.push(trainingLabel);
    const bufferSize = this.config.training.experienceReplayBufferSize;
    if (this.replayBuffer.length > bufferSize) {
      this.replayBuffer.shift();
    }

    return { lossBefore: lossBefore / 3, lossAfter: lossAfter / 3 };
  }

  /**
   * dL/dA, dL/dB を解析的に計算する(LoRAForward.forward()の式に対する勾配)。
   * L = MSE(output, target), output = x + scale*(x@A)@B
   * @private
   */
  _computeGradients(loraForward, layerName, x, output, target) {
    const { A, B } = loraForward.weights[layerName];
    const rank = loraForward.config.layers[layerName].rank;
    const alpha = loraForward.config.layers[layerName].alpha ?? rank;
    const scale = alpha / rank;
    const dim = x.length;

    // dL/doutput[j] = 2/dim * (output[j] - target[j])
    const dOutput = new Float32Array(dim);
    for (let j = 0; j < dim; j++) {
      dOutput[j] = (2 / dim) * (output[j] - target[j]);
    }

    // mid[k] = sum_i x[i]*A[i][k] (forward()と同じ計算をここでも再現する)
    const mid = new Float32Array(rank);
    for (let k = 0; k < rank; k++) {
      let sum = 0;
      for (let i = 0; i < dim; i++) sum += x[i] * A[i][k];
      mid[k] = sum;
    }

    // dL/dB[k][j] = dOutput[j] * scale * mid[k]
    const gradB = [];
    for (let k = 0; k < rank; k++) {
      const row = new Float32Array(dim);
      for (let j = 0; j < dim; j++) {
        row[j] = dOutput[j] * scale * mid[k];
      }
      gradB.push(row);
    }

    // dL/dmid[k] = sum_j dOutput[j] * scale * B[k][j]
    const dMid = new Float32Array(rank);
    for (let k = 0; k < rank; k++) {
      let sum = 0;
      for (let j = 0; j < dim; j++) sum += dOutput[j] * scale * B[k][j];
      dMid[k] = sum;
    }

    // dL/dA[i][k] = dMid[k] * x[i]
    const gradA = [];
    for (let i = 0; i < dim; i++) {
      const row = new Float32Array(rank);
      for (let k = 0; k < rank; k++) {
        row[k] = dMid[k] * x[i];
      }
      gradA.push(row);
    }

    return { gradA, gradB };
  }

  /**
   * Adamオプティマイザで A/B 行列を1ステップ更新する。
   * proximalLambda(lora.config.json training.proximalLambda)による正則化
   * (現在値からの乖離にペナルティを課し、破滅的忘却を防ぐ。DESIGN.md 1.3節)も加える。
   * @private
   */
  _applyAdamStep(loraForward, layerName, gradA, gradB) {
    const lr = loraForward.config.layers[layerName].learningRate;
    const lambda = this.config.training.proximalLambda;
    const beta1 = 0.9;
    const beta2 = 0.999;
    const eps = 1e-8;

    if (!this._adamState[layerName]) {
      this._adamState[layerName] = {
        A: { m: gradA.map((r) => new Float32Array(r.length)), v: gradA.map((r) => new Float32Array(r.length)) },
        B: { m: gradB.map((r) => new Float32Array(r.length)), v: gradB.map((r) => new Float32Array(r.length)) },
        t: 0,
      };
    }
    const state = this._adamState[layerName];
    state.t += 1;

    const { A, B } = loraForward.weights[layerName];

    this._adamUpdateMatrix(A, gradA, state.A, lr, beta1, beta2, eps, lambda, state.t);
    this._adamUpdateMatrix(B, gradB, state.B, lr, beta1, beta2, eps, lambda, state.t);
  }

  /** @private */
  _adamUpdateMatrix(weight, grad, moments, lr, beta1, beta2, eps, lambda, t) {
    const biasCorr1 = 1 - beta1 ** t;
    const biasCorr2 = 1 - beta2 ** t;

    for (let i = 0; i < weight.length; i++) {
      for (let j = 0; j < weight[i].length; j++) {
        // proximal正則化: 勾配に (現在値 * lambda) を加算し、初期値からの乖離を抑える
        const g = grad[i][j] + lambda * weight[i][j];

        moments.m[i][j] = beta1 * moments.m[i][j] + (1 - beta1) * g;
        moments.v[i][j] = beta2 * moments.v[i][j] + (1 - beta2) * g * g;

        const mHat = moments.m[i][j] / biasCorr1;
        const vHat = moments.v[i][j] / biasCorr2;

        weight[i][j] -= (lr * mHat) / (Math.sqrt(vHat) + eps);
      }
    }
  }

  /** @private */
  _mse(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    return sum / a.length;
  }

  /**
   * embeddingが無い場合の粗い文字列差異(0〜1、大きいほど不一致)。
   * @private
   */
  _textDissimilarity(a, b) {
    if (!a && !b) return 0;
    if (!a || !b) return 1;
    const setA = new Set(a);
    const setB = new Set(b);
    let intersection = 0;
    for (const ch of setA) {
      if (setB.has(ch)) intersection++;
    }
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : 1 - intersection / union;
  }
}

export default FeedbackProcessor;
