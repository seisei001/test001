/**
 * TurnController — CoreModel / RAGSearch / ProfileMemo / LLMTeacher(任意) /
 * LoRAForward / FeedbackProcessor をDIで受け取り、1セッション・1ターンの
 * ライフサイクル全体をオーケストレーションする。DESIGN.md 2.2節(シーケンス)・
 * 5.6節を参照。
 *
 * 質問機構は3つある(DESIGN.md 1.6節・1.8節):
 *   (a) セッション開始時の固定質問2問 — startSession() で発火
 *   (b) 確信度ベースの補助質問(固定テンプレート) — LLM未接続時、processTurn()の
 *       応答生成後に発火
 *   (c) LLM生成の高度な質問 — LLM接続時、(b)の代わりに発火(LLMTeacher.generateQuestion()。
 *       DESIGN.md 1.7節の質問設計原則に従う)
 *
 * 通常フロー: CoreModel.embed() → RAGSearch.search() と ProfileMemo.getContext() を
 * 並行取得 → CoreModel.generate()(本体AI自身の回答) → (b)/(c)の確認 →
 * [llm.config.jsonが有効なら] LLMTeacher.ask() →
 * FeedbackProcessor で蒸留損失(LLM連携時)またはimplicit損失(単体時)を計算 →
 * LoRAForward を更新(base modelは不変) → ProfileMemo.update() で差分更新。
 *
 * 設計パターン: Dependency Injection(テスト時にモック注入可) +
 * Observer/Event('turn_complete'等でLogger/MetricCollectorを疎結合に接続)
 */
export class TurnController {
  /**
   * @param {import('../core-model/CoreModel.js').CoreModel} coreModel
   * @param {import('../rag-search/RAGSearch.js').RAGSearch} rag
   * @param {import('../profile-memo/ProfileMemo.js').ProfileMemo} profileMemo
   * @param {import('../llm-teacher/LLMTeacher.js').LLMTeacher | null} llmTeacher -
   *   llm.config.json の enabled が false の場合は null を渡す
   * @param {import('../lora-training/LoRAForward.js').LoRAForward} lora
   * @param {import('../lora-training/FeedbackProcessor.js').FeedbackProcessor} feedbackProcessor
   * @param {object} config - system.config.json 全体
   * @param {object} profileConfig - profile.config.json
   *   (sessionOpeningQuestions, confidenceThresholdForClarifyingQuestion,
   *   questionDesignPrinciples等を使用)
   */
  constructor(coreModel, rag, profileMemo, llmTeacher, lora, feedbackProcessor, config, profileConfig) {
    this.coreModel = coreModel;
    this.rag = rag;
    this.profileMemo = profileMemo;
    this.llmTeacher = llmTeacher;
    this.lora = lora;
    this.feedbackProcessor = feedbackProcessor;
    this.config = config;
    this.profileConfig = profileConfig;
    this.sessionStarted = false;
    /** @type {Record<string, Function[]>} */
    this.listeners = { turn_complete: [], lora_update: [], profile_updated: [] };
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
   * (a) セッション開始時に固定質問2問(profile.config.json の sessionOpeningQuestions)を
   * 返す。UI側はこれを表示し、ユーザーの回答を startSession() に渡す。
   * @returns {{ topic: string, approach: string }} 質問文言(テンプレート固定)
   */
  getSessionOpeningQuestions() {
    throw new Error('not implemented');
  }

  /**
   * (a) 固定質問2問への回答を受け取り、ProfileMemo.recordSessionOpening() に渡して
   * セッションを開始する。DESIGN.md 1.6節a。
   * @param {string} sessionTopicAnswer
   * @param {string} sessionApproachAnswer
   * @returns {Promise<void>}
   */
  async startSession(sessionTopicAnswer, sessionApproachAnswer) {
    throw new Error('not implemented');
  }

  /**
   * DESIGN.md 2.2節の通常ターンのシーケンスを実行する(startSession()呼び出し後)。
   * 応答生成後、ProfileMemo.getLowConfidenceDimensions() を確認し、対象があれば
   * `clarifyingQuestion` を組み立てる:
   *   - LLMTeacherが利用可能(llm.config.json enabled)なら
   *     (c) `this.llmTeacher.generateQuestion(dimension, ...)` を呼ぶ
   *   - 利用不可なら (b) `profile.config.json` の固定テンプレートを使う
   * (profile.config.json の maxClarifyingQuestionsPerSession で頻度制御)。
   * @param {string} userPrompt
   * @returns {Promise<{
   *   ownAnswer: string,
   *   llmAnswer: string | null,
   *   clarifyingQuestion: { dimension: string, text: string, source: 'template'|'llm' } | null,
   *   turnData: object   // DESIGN.md 6節のスキーマ
   * }>}
   */
  async processTurn(userPrompt) {
    throw new Error('not implemented');
  }

  /**
   * (b)(c)いずれの確認質問への回答を受け取り、
   * ProfileMemo.recordConfidenceAnswer() に渡す。
   * @param {string} dimension
   * @param {string} answer
   * @returns {Promise<void>}
   */
  async answerClarifyingQuestion(dimension, answer) {
    throw new Error('not implemented');
  }

  /**
   * turnData(と、LLM連携時はllmAnswer)を使い、FeedbackProcessorで損失を計算し、
   * LoRAForwardの重みを更新する。単体時はユーザーの反応(implicit signal)を渡す。
   * 更新後、ProfileMemo.update() を呼んで差分反映する。
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
