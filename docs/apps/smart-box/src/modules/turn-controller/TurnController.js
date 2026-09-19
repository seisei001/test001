/**
 * TurnController — CoreModel / RAGSearch / LLMTeacher(任意) / LoRAForward /
 * FeedbackProcessor をDIで受け取り、1ターンのライフサイクル全体を
 * オーケストレーションする。DESIGN.md 2.2節(シーケンス)・5.6節を参照。
 *
 * フロー: CoreModel.embed() → RAGSearch.search() → CoreModel.generate()
 * (本体AI自身の回答) → [llm.config.jsonが有効なら] LLMTeacher.ask() →
 * FeedbackProcessor で蒸留損失(LLM連携時)またはimplicit損失(単体時)を計算 →
 * LoRAForward を更新(base modelは不変)。
 *
 * 設計パターン: Dependency Injection(テスト時にモック注入可) +
 * Observer/Event('turn_complete'等でLogger/MetricCollectorを疎結合に接続)
 */
export class TurnController {
  /**
   * @param {import('../core-model/CoreModel.js').CoreModel} coreModel
   * @param {import('../rag-search/RAGSearch.js').RAGSearch} rag
   * @param {import('../llm-teacher/LLMTeacher.js').LLMTeacher | null} llmTeacher -
   *   llm.config.json の enabled が false の場合は null を渡す
   * @param {import('../lora-training/LoRAForward.js').LoRAForward} lora
   * @param {import('../lora-training/FeedbackProcessor.js').FeedbackProcessor} feedbackProcessor
   * @param {object} config - system.config.json 全体
   */
  constructor(coreModel, rag, llmTeacher, lora, feedbackProcessor, config) {
    this.coreModel = coreModel;
    this.rag = rag;
    this.llmTeacher = llmTeacher;
    this.lora = lora;
    this.feedbackProcessor = feedbackProcessor;
    this.config = config;
    /** @type {Record<string, Function[]>} */
    this.listeners = { turn_complete: [], lora_update: [] };
  }

  /** @param {string} event @param {Function} callback */
  on(event, callback) {
    throw new Error('not implemented');
  }

  /** @param {string} event @param {object} data */
  emit(event, data) {
    throw new Error('not implemented');
  }

  /**
   * DESIGN.md 2.2節のシーケンスを実行する。
   * @param {string} userPrompt
   * @returns {Promise<{
   *   ownAnswer: string,
   *   llmAnswer: string | null,
   *   turnData: object   // DESIGN.md 6節のスキーマ
   * }>}
   */
  async processTurn(userPrompt) {
    throw new Error('not implemented');
  }

  /**
   * turnData(と、LLM連携時はllmAnswer)を使い、FeedbackProcessorで損失を計算し、
   * LoRAForwardの重みを更新する。単体時はユーザーの反応(implicit signal)を渡す。
   * @param {object} turnData - processTurn() が返した turnData
   * @param {object} [implicitSignal] - LLM未使用時にユーザーの反応から得た信号
   * @returns {Promise<void>}
   */
  async learnFromTurn(turnData, implicitSignal) {
    throw new Error('not implemented');
  }

  /**
   * @returns {string} `turn_<timestamp>_<random>` 形式
   */
  generateTurnId() {
    throw new Error('not implemented');
  }
}

export default TurnController;
