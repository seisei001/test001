/**
 * ProfileMemo — ユーザーの人物像(好み・専門性など)と、繰り返し尋ねる質問の
 * 意図・傾向を要約した、RAGとは独立した軽量メモ。DESIGN.md 1.5節・1.6節・5.3節を参照。
 *
 * RAGに含めない理由(DESIGN.md 1.5節): 「コード例を好む」等の情報は特定の過去
 * ターン1件を検索して思い出す類のものではなく、どのターンでも常に参照すべき
 * 静的な人物像である。RAGの検索対象に混ぜると検索ノイズ・重複保存による肥大化を
 * 招くため、常に一定サイズの固定コンテキストとして直接注入する。
 *
 * 質問機構は2つ併用する(DESIGN.md 1.6節、第6版で確定):
 *   (a) セッション開始の固定質問2問 — 安価・即効性・コールドスタートに強い
 *   (b) 確信度ベースの補助質問 — 固定質問では拾えない細かい傾向を継続的に拾う
 *
 * メモの構造(例):
 * {
 *   profile: { notes: string[], confidence: Record<string, number> },
 *   questionIntentPatterns: string[],
 *   sessionHistory: { topic: string, approach: string, date: string }[],
 *   lastUpdated: string,
 *   lastLlmConsolidation: string | null,
 *   turnsSinceLastConsolidation: number
 * }
 */

const METADATA_KEY = 'profileMemo';

function emptyMemo(trackedDimensions) {
  const confidence = {};
  for (const dim of trackedDimensions) {
    confidence[dim] = 0;
  }
  return {
    profile: { notes: [], confidence },
    questionIntentPatterns: [],
    sessionHistory: [],
    lastUpdated: null,
    lastLlmConsolidation: null,
    turnsSinceLastConsolidation: 0,
  };
}

export class ProfileMemo {
  /**
   * @param {object} profileConfig - profile.config.json の内容
   * @param {import('../rag-search/IndexedDBManager.js').IndexedDBManager} db
   */
  constructor(profileConfig, db) {
    this.config = profileConfig;
    this.db = db;
    /** @type {object} */
    this.memo = null;
  }

  /**
   * IndexedDBの metadata ストアから既存メモを読み込む(無ければ空のメモを作成する)。
   * @returns {Promise<void>}
   */
  async initialize() {
    const stored = await this.db.getMetadata(METADATA_KEY);
    this.memo = stored || emptyMemo(this.config.trackedDimensions);
  }

  /**
   * CoreModel.generate() に渡す、現在のメモのテキスト表現を返す。
   * 固定サイズに収まるよう要約済みであること(生成のたびに検索は行わない)。
   * @returns {Promise<string>}
   */
  async getContext() {
    const lines = [];

    if (this.memo.profile.notes.length > 0) {
      lines.push('ユーザーについて分かっていること:');
      for (const note of this.memo.profile.notes) {
        lines.push(`- ${note}`);
      }
    }

    if (this.memo.questionIntentPatterns.length > 0) {
      lines.push('よくある質問の傾向:');
      for (const pattern of this.memo.questionIntentPatterns) {
        lines.push(`- ${pattern}`);
      }
    }

    const recentSessions = this.memo.sessionHistory.slice(-3);
    if (recentSessions.length > 0) {
      lines.push('直近のセッション:');
      for (const session of recentSessions) {
        lines.push(`- ${session.date}: ${session.topic}(${session.approach})`);
      }
    }

    return lines.join('\n');
  }

  /**
   * (a) セッション開始時の固定質問2問(`profile.config.json`の
   * `sessionOpeningQuestions`)への回答を `sessionHistory` に記録する。
   * DESIGN.md 1.6節a。
   * @param {string} sessionTopic - 「今日はどんな話題ですか?」への回答
   * @param {string} sessionApproach - 「その話題をどのように詰めたいですか?」への回答
   * @returns {Promise<void>}
   */
  async recordSessionOpening(sessionTopic, sessionApproach) {
    this.memo.sessionHistory.push({
      topic: sessionTopic,
      approach: sessionApproach,
      date: new Date().toISOString(),
    });
    this._touch();
    await this.save();
  }

  /**
   * (b) 確信度が `confidenceThresholdForClarifyingQuestion` 未満の次元
   * (`profile.config.json`の`trackedDimensions`)を返す。DESIGN.md 1.6節b。
   * @returns {string[]}
   */
  getLowConfidenceDimensions() {
    const threshold = this.config.confidenceThresholdForClarifyingQuestion;
    return this.config.trackedDimensions.filter(
      (dim) => (this.memo.profile.confidence[dim] ?? 0) < threshold
    );
  }

  /**
   * (b) 確信度ベースの補助質問への回答を `profile.confidence` の該当次元に
   * 反映する。
   * @param {string} dimension - trackedDimensionsのいずれか
   * @param {string} answer - ユーザーの回答
   * @returns {Promise<void>}
   */
  async recordConfidenceAnswer(dimension, answer) {
    if (!this.config.trackedDimensions.includes(dimension)) {
      throw new Error(`Unknown dimension: ${dimension}`);
    }
    this.memo.profile.confidence[dimension] = 1.0;
    this.memo.profile.notes.push(`${dimension}: ${answer}`);
    this._touch();
    await this.save();
  }

  /**
   * 毎ターン、CoreModel自身の軽量な要約(summarizeForProfile()の結果)を使って
   * メモに差分反映する。config.updateEveryTurn が true の場合に呼ばれる。
   * @param {object} turnData - DESIGN.md 6節のターンデータ
   * @param {import('../core-model/CoreModel.js').CoreModel} coreModel
   * @returns {Promise<void>}
   */
  async update(turnData, coreModel) {
    if (!this.config.updateEveryTurn) return;

    const { profileDelta } = await coreModel.summarizeForProfile(turnData);
    if (profileDelta) {
      if (Array.isArray(profileDelta.notes)) {
        this.memo.profile.notes.push(...profileDelta.notes);
      }
      if (Array.isArray(profileDelta.questionIntentPatterns)) {
        this.memo.questionIntentPatterns.push(...profileDelta.questionIntentPatterns);
      }
    }

    this.memo.turnsSinceLastConsolidation += 1;
    this._touch();
    await this.save();
  }

  /**
   * `llmConsolidationIntervalTurns` に達したかどうかを返す(TurnController側で
   * consolidateWithLLM() を呼ぶかどうかの判定に使う)。
   * @returns {boolean}
   */
  shouldConsolidate() {
    return this.memo.turnsSinceLastConsolidation >= this.config.llmConsolidationIntervalTurns;
  }

  /**
   * config.llmConsolidationIntervalTurns ごとに呼ばれ、外部LLMでメモ全体を
   * 整理・圧縮する(冗長化・矛盾を防ぐ。DESIGN.md 8.5節)。LLM連携時のみ有効。
   * @param {import('../llm-teacher/LLMTeacher.js').LLMTeacher} llmTeacher
   * @returns {Promise<void>}
   */
  async consolidateWithLLM(llmTeacher) {
    const recentTurns = await this.db.getAllTurns();
    const { consolidatedMemo } = await llmTeacher.consolidateProfile(this.memo, recentTurns.slice(-20));

    this.memo = {
      ...consolidatedMemo,
      turnsSinceLastConsolidation: 0,
      lastLlmConsolidation: new Date().toISOString(),
    };
    this._touch();
    await this.save();
  }

  /**
   * @returns {Promise<void>}
   */
  async save() {
    await this.db.setMetadata(METADATA_KEY, this.memo);
  }

  /**
   * @private
   */
  _touch() {
    this.memo.lastUpdated = new Date().toISOString();
  }
}

export default ProfileMemo;
