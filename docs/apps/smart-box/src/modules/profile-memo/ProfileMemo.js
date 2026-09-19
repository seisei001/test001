/**
 * ProfileMemo — ユーザーの人物像(好み・専門性など)と、繰り返し尋ねる質問の
 * 意図・傾向を要約した、RAGとは独立した軽量メモ。DESIGN.md 1.5節・1.6節・5.3節を参照。
 *
 * RAGに含めない理由(DESIGN.md 1.5節): 「コード例を好む」等の情報は特定の過去
 * ターン1件を検索して思い出す類のものではなく、どのターンでも常に参照すべき
 * 静的な人物像である。RAGの検索対象に混ぜると検索ノイズ・重複保存による肥大化を
 * 招くため、常に一定サイズの固定コンテキストとして直接注入する。
 *
 * メモの構造(例):
 * {
 *   profile: { notes: string[] },
 *   questionIntentPatterns: string[],
 *   sessionHistory: { topic: string, approach: string, date: string }[],
 *   lastUpdated: string,
 *   lastLlmConsolidation: string | null
 * }
 *
 * 第5版での変更: 次元ごとの確信度を追跡し閾値未満で質問を発火する仕組み
 * (getLowConfidenceDimensions())は削除した。セッション開始時の固定質問2問
 * (DESIGN.md 1.6節)に置き換えたため不要になった — 実装が複雑な割に収束が遅く、
 * コールドスタート(会話1回目)にも弱いという弱点があったため。
 */
export class ProfileMemo {
  /**
   * @param {object} profileConfig - profile.config.json の内容
   * @param {import('../rag-search/IndexedDBManager.js').IndexedDBManager} db
   */
  constructor(profileConfig, db) {
    this.config = profileConfig;
    this.db = db;
    /** @type {object} 上記の構造。初回はinitialize()でIndexedDBから読み込むか初期値を作る */
    this.memo = null;
  }

  /**
   * IndexedDBの metadata ストアから既存メモを読み込む(無ければ空のメモを作成する)。
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('not implemented');
  }

  /**
   * CoreModel.generate() に渡す、現在のメモのテキスト表現を返す。
   * 固定サイズに収まるよう要約済みであること(生成のたびに検索は行わない)。
   * @returns {Promise<string>}
   */
  async getContext() {
    throw new Error('not implemented');
  }

  /**
   * セッション開始時の固定質問2問(`profile.config.json`の
   * `sessionOpeningQuestions`)への回答を `sessionHistory` に記録する。
   * DESIGN.md 1.6節: 最も強く・最も安価な情報源であり、コールドスタート
   * (会話1回目)でも同じ強さの手がかりが得られる。
   * @param {string} sessionTopic - 「今日はどんな話題ですか?」への回答
   * @param {string} sessionApproach - 「その話題をどのように詰めたいですか?」への回答
   * @returns {Promise<void>}
   */
  async recordSessionOpening(sessionTopic, sessionApproach) {
    throw new Error('not implemented');
  }

  /**
   * 毎ターン、CoreModel自身の軽量な要約(summarizeForProfile()の結果)を使って
   * メモに差分反映する。config.updateEveryTurn が true の場合に呼ばれる。
   * @param {object} turnData - DESIGN.md 6節のターンデータ
   * @param {import('../core-model/CoreModel.js').CoreModel} coreModel
   * @returns {Promise<void>}
   */
  async update(turnData, coreModel) {
    throw new Error('not implemented');
  }

  /**
   * config.llmConsolidationIntervalTurns ごとに呼ばれ、外部LLMでメモ全体を
   * 整理・圧縮する(冗長化・矛盾を防ぐ。DESIGN.md 8.5節)。LLM連携時のみ有効。
   * @param {import('../llm-teacher/LLMTeacher.js').LLMTeacher} llmTeacher
   * @returns {Promise<void>}
   */
  async consolidateWithLLM(llmTeacher) {
    throw new Error('not implemented');
  }

  /**
   * @returns {Promise<void>}
   */
  async save() {
    throw new Error('not implemented');
  }
}

export default ProfileMemo;
