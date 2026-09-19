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
    this.clarifyingQuestionsAskedThisSession = 0;
    this.lastTurnData = null;
    /** @type {Record<string, Function[]>} */
    this.listeners = { turn_complete: [], lora_update: [], profile_updated: [] };
  }

  /** @param {string} event @param {Function} callback */
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  /** @param {string} event @param {object} data */
  emit(event, data) {
    for (const callback of this.listeners[event] || []) {
      callback(data);
    }
  }

  /**
   * (a) セッション開始時に固定質問2問(profile.config.json の sessionOpeningQuestions)を
   * 返す。UI側はこれを表示し、ユーザーの回答を startSession() に渡す。
   * @returns {{ topic: string, approach: string }} 質問文言(テンプレート固定)
   */
  getSessionOpeningQuestions() {
    return this.profileConfig.sessionOpeningQuestions;
  }

  /**
   * (a) 固定質問2問への回答を受け取り、ProfileMemo.recordSessionOpening() に渡して
   * セッションを開始する。DESIGN.md 1.6節a。
   * @param {string} sessionTopicAnswer
   * @param {string} sessionApproachAnswer
   * @returns {Promise<void>}
   */
  async startSession(sessionTopicAnswer, sessionApproachAnswer) {
    this.sessionTopic = sessionTopicAnswer;
    this.sessionApproach = sessionApproachAnswer;
    this.sessionId = `session_${Date.now()}`;
    this.clarifyingQuestionsAskedThisSession = 0;

    await this.profileMemo.recordSessionOpening(sessionTopicAnswer, sessionApproachAnswer);
    this.sessionStarted = true;
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
    if (!this.sessionStarted) {
      throw new Error('TurnController: startSession() must be called before processTurn()');
    }

    const turnId = this.generateTurnId();

    // Step 1: embedding抽出
    const { embedding } = await this.coreModel.embed(userPrompt);

    // Step 2 / 2': RAG検索とProfileMemoコンテキストを並行取得
    const [ragContext, profileContext] = await Promise.all([
      this.rag.search(embedding),
      this.profileMemo.getContext(),
    ]);

    // Step 3: 本体AI自身の回答を生成
    const { text: ownAnswer } = await this.coreModel.generate(userPrompt, ragContext, profileContext, this.lora);

    // 確信度が低い次元があれば、確認質問を組み立てる((b)または(c))
    const clarifyingQuestion = await this._maybeBuildClarifyingQuestion(profileContext, ragContext);

    // Step 4: LLM連携時は同じプロンプトをLLMにも送る
    let llmAnswer = null;
    if (this.llmTeacher) {
      try {
        const result = await this.llmTeacher.ask(userPrompt, ragContext);
        llmAnswer = result.text;
      } catch (error) {
        console.warn('TurnController: LLMTeacher.ask() failed, falling back to own answer only', error);
      }
    }

    const turnData = {
      turn_id: turnId,
      session_id: this.sessionId,
      is_session_opening: false,
      timestamp: new Date().toISOString(),
      input: { user_prompt: userPrompt, embedding: Array.from(embedding) },
      rag: {
        retrieved_turns: ragContext.retrievedTurns.length,
        top_similarities: ragContext.similarities,
      },
      profile_memo: {
        context_used: profileContext,
        updated_this_turn: false,
        llm_consolidated_this_turn: false,
        clarifying_question: clarifyingQuestion,
      },
      response: {
        own_answer: ownAnswer,
        llm_answer: llmAnswer,
        llm_used: llmAnswer !== null,
      },
      learning: { mode: llmAnswer !== null ? 'distillation' : 'implicit', loss_before: null, loss_after: null },
    };

    await this.rag.db.addTurn(turnData);

    this.lastTurnData = turnData;
    this.emit('turn_complete', turnData);

    return { ownAnswer, llmAnswer, clarifyingQuestion, turnData };
  }

  /**
   * @param {string} profileContext
   * @param {object} ragContext
   * @returns {Promise<{ dimension: string, text: string, source: 'template'|'llm' } | null>}
   * @private
   */
  async _maybeBuildClarifyingQuestion(profileContext, ragContext) {
    if (this.clarifyingQuestionsAskedThisSession >= this.profileConfig.maxClarifyingQuestionsPerSession) {
      return null;
    }

    const lowConfidenceDimensions = this.profileMemo.getLowConfidenceDimensions();
    if (lowConfidenceDimensions.length === 0) {
      return null;
    }

    const dimension = lowConfidenceDimensions[0];

    if (this.llmTeacher) {
      try {
        const { text } = await this.llmTeacher.generateQuestion(dimension, profileContext, ragContext);
        this.clarifyingQuestionsAskedThisSession += 1;
        return { dimension, text, source: 'llm' };
      } catch (error) {
        console.warn('TurnController: LLMTeacher.generateQuestion() failed, falling back to template', error);
      }
    }

    // (b) 固定テンプレートへのフォールバック(DESIGN.md 1.6節b)
    const template = this._templateForDimension(dimension);
    this.clarifyingQuestionsAskedThisSession += 1;
    return { dimension, text: template, source: 'template' };
  }

  /**
   * @param {string} dimension
   * @returns {string}
   * @private
   */
  _templateForDimension(dimension) {
    const templates = {
      formality: 'かしこまった話し方と、くだけた話し方、どちらが好みですか?',
      depth: '説明は、要点だけの方がいいですか、それとも詳しく知りたいですか?',
      exampleUsage: '説明には具体例をどのくらい入れてほしいですか?',
      codeInclusion: 'コード例は必要ですか?',
    };
    return templates[dimension] || `${dimension}について、もう少し教えてください`;
  }

  /**
   * (b)(c)いずれの確認質問への回答を受け取り、
   * ProfileMemo.recordConfidenceAnswer() に渡す。
   * @param {string} dimension
   * @param {string} answer
   * @returns {Promise<void>}
   */
  async answerClarifyingQuestion(dimension, answer) {
    await this.profileMemo.recordConfidenceAnswer(dimension, answer);
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
    let lossResult;

    if (turnData.response.llm_used) {
      const [{ embedding: ownEmbedding }, { embedding: llmEmbedding }] = await Promise.all([
        this.coreModel.embed(turnData.response.own_answer),
        this.coreModel.embed(turnData.response.llm_answer),
      ]);
      const { trainingLabel } = this.feedbackProcessor.computeDistillationLoss(
        turnData.response.own_answer,
        turnData.response.llm_answer,
        ownEmbedding,
        llmEmbedding
      );
      lossResult = this.feedbackProcessor.updateWeights(this.lora, trainingLabel);
    } else {
      const { trainingLabel } = this.feedbackProcessor.computeImplicitLoss(
        { type: 'implicit', signals: implicitSignal || {} },
        turnData
      );
      lossResult = this.feedbackProcessor.updateWeights(this.lora, trainingLabel);
    }

    turnData.learning.loss_before = lossResult.lossBefore;
    turnData.learning.loss_after = lossResult.lossAfter;

    await this.lora.saveWeights();
    this.emit('lora_update', { turnId: turnData.turn_id, ...lossResult });

    await this.profileMemo.update(turnData, this.coreModel);
    turnData.profile_memo.updated_this_turn = true;

    if (this.llmTeacher && this.profileMemo.shouldConsolidate()) {
      await this.profileMemo.consolidateWithLLM(this.llmTeacher);
      turnData.profile_memo.llm_consolidated_this_turn = true;
    }

    this.emit('profile_updated', { turnId: turnData.turn_id });
  }

  /**
   * @returns {string} `turn_<timestamp>_<random>` 形式
   */
  generateTurnId() {
    return `turn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

export default TurnController;
