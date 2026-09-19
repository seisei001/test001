/**
 * TurnController — BERTInference / RAGSearch / QuestionGenerator / LoRAForward /
 * FeedbackProcessor をDIで受け取り、1エントリのライフサイクル全体を
 * オーケストレーションする。DESIGN.md 2.2節(シーケンス)・5.7節を参照。
 *
 * 2026-09-19改訂: 旧版にあった「confidence高ならgenerateResponse()で直接応答を
 * 生成する」という分岐は、生成モデルが存在しないため成立しなかった(DESIGN.md 付録B)。
 * 応答を以下の3類型のいずれかに限定し、自由文生成を一切行わない設計に変更した:
 *   - surface_related: confidence(=RAG最上位類似度)が高い → 過去エントリをそのまま提示
 *   - question: confidenceが低く、頻度制御もOK → QuestionGeneratorのテンプレート質問
 *   - acknowledge: それ以外 → 固定文言のみ
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
   * BERTInference.embed() → RAGSearch.search()(+ LoRAForward.rerankScore()で再ランキング) →
   * confidence(= search()が返す最上位類似度 + LoRAForward.thresholdBias()) を
   * question.config.json の direct閾値と比較し、3類型のいずれかを返す。
   * @param {string} userEntry - 日記エントリの本文
   * @returns {Promise<{
   *   responseType: 'surface_related'|'question'|'acknowledge',
   *   payload: object,   // surface_relatedなら過去エントリ、questionなら質問文
   *   turnData: object   // DESIGN.md 6節のスキーマ
   * }>}
   */
  async processTurn(userEntry) {
    throw new Error('not implemented');
  }

  /**
   * 次のエントリが来た時点で、前回 response.type === 'question' だった場合に
   * engagementを算出しFeedbackProcessorに渡す(Phase 2で本実装)。
   * @param {{ nextEntryDelaySec: number, nextEntryLength: number }} timingAndLength
   * @param {object} turnData - processTurn() が返した turnData
   * @returns {Promise<void>}
   */
  async processFeedback(timingAndLength, turnData) {
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
