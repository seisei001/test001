/**
 * TurnController — CoreModel / RAGSearch / ProfileMemo / LLMTeacher(任意) /
 * LoRAForward / FeedbackProcessor をDIで受け取り、1セッション・1ターンの
 * ライフサイクル全体をオーケストレーションする。DESIGN.md 2.2節(シーケンス)・
 * 5.6節を参照。
 *
 * セッションの最初のユーザー操作時、固定質問2問(DESIGN.md 1.6節: 「今日はどんな
 * 話題ですか?」「その話題をどのように詰めたいですか?」)を発火し、回答を
 * ProfileMemo.recordSessionOpening() に渡してから、通常のターン処理フローに入る。
 *
 * 通常フロー: CoreModel.embed() → RAGSearch.search() と ProfileMemo.getContext() を
 * 並行取得 → CoreModel.generate()(本体AI自身の回答) →
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
   * @param {object} profileConfig - profile.config.json (sessionOpeningQuestionsを使用)
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
   * セッション開始時に固定質問2問(profile.config.json の sessionOpeningQuestions)を
   * 返す。UI側はこれを表示し、ユーザーの回答を startSession() に渡す。
   * @returns {{ topic: string, approach: string }} 質問文言(テンプレート固定)
   */
  getSessionOpeningQuestions() {
    throw new Error('not implemented');
  }

  /**
   * 固定質問2問への回答を受け取り、ProfileMemo.recordSessionOpening() に渡して
   * セッションを開始する。DESIGN.md 1.6節。
   * @param {string} sessionTopicAnswer
   * @param {string} sessionApproachAnswer
   * @returns {Promise<void>}
   */
  async startSession(sessionTopicAnswer, sessionApproachAnswer) {
    throw new Error('not implemented');
  }

  /**
   * DESIGN.md 2.2節の通常ターンのシーケンスを実行する(startSession()呼び出し後)。
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
