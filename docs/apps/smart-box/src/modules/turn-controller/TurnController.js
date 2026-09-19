/**
 * TurnController — BERTInference / RAGSearch / QuestionGenerator / LoRAForward /
 * FeedbackProcessor / StructuredLogger をDIで受け取り、1ターンのライフサイクル
 * 全体をオーケストレーションする。DESIGN.md 2.2節(シーケンス)・5.7節を参照。
 *
 * 設計パターン: Dependency Injection(テスト時にモック注入可) +
 * Observer/Event('turn_complete'等でLogger/MetricCollectorを疎結合に接続)
 */
export class TurnController {
  /**
   * @param {import('../bert-inference/BERTInference.js').BERTInference} bert
   * @param {import('../rag-search/RAGSearch.js').RAGSearch} rag
   * @param {import('../question-generator/QuestionGenerator.js').QuestionGenerator} questionGen
   * @param {import('../lora-training/LoRAForward.js').LoRAForward} lora
   * @param {import('../lora-training/FeedbackProcessor.js').FeedbackProcessor} feedbackProcessor
   * @param {object} config - system.config.json 全体
   */
  constructor(bert, rag, questionGen, lora, feedbackProcessor, config) {
    this.bert = bert;
    this.rag = rag;
    this.questionGen = questionGen;
    this.lora = lora;
    this.feedbackProcessor = feedbackProcessor;
    this.config = config;
    this.userModel = null;
    /** @type {Record<string, Function[]>} */
    this.listeners = { turn_complete: [], lora_update: [], question_asked: [] };
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
   * DESIGN.md 2.2節のシーケンスを実行する:
   * BERTInference.classify() → RAGSearch.search() →
   * confidence >= question.config.json の direct閾値 なら直接応答、
   * それ未満なら QuestionGenerator.generateQuestion()。
   * @param {string} userInput
   * @returns {Promise<{ response: string|null, question: string|null, turnData: object }>}
   */
  async processTurn(userInput) {
    throw new Error('not implemented');
  }

  /**
   * ユーザーの応答/フィードバックを受け取り、FeedbackProcessorで学習信号に変換し、
   * LoRAForwardの重み更新をトリガーする(Phase 2で本実装)。
   * @param {object} feedback
   * @param {object} turnData - processTurn() が返した turnData
   * @returns {Promise<void>}
   */
  async processFeedback(feedback, turnData) {
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
