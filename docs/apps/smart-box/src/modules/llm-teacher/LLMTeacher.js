/**
 * LLMTeacher — ユーザーが任意で設定した外部LLM API(例: Claude API)を呼び出し、
 * 本体AI(CoreModel)を賢くするための「先生役」の回答・質問を取得する。
 * DESIGN.md 1.4節・1.8節・5.4節を参照。
 *
 * `llm.config.json` の `enabled` が false の場合、TurnControllerはこのモジュールを
 * 呼び出さない(本体AI単体で動作する。DESIGN.md 1.3節)。
 *
 * セキュリティ: APIキーはブラウザのIndexedDB/localStorageにのみ保存し、賢い箱側の
 * サーバー(存在しない)や第三者には一切送信しない。LLM APIへはブラウザから直接
 * リクエストする。
 */
export class LLMTeacher {
  /**
   * @param {object} llmConfig - llm.config.json の内容(enabled, provider, model等)
   * @param {string} apiKey - ユーザーがUIから入力し、IndexedDB等から読み出したキー
   */
  constructor(llmConfig, apiKey) {
    this.config = llmConfig;
    this.apiKey = apiKey;
  }

  /**
   * @param {string} prompt - ユーザーの入力(本体AIに送ったものと同一)
   * @param {object} [ragContext] - 必要であれば文脈として付加する
   * @returns {Promise<{ text: string, latencyMs: number }>}
   * @throws llmConfig.enabled が false、またはAPIキー未設定の場合
   * @throws API呼び出し失敗時(TurnController側でLLM無しのフローにフォールバックする設計とする)
   */
  async ask(prompt, ragContext) {
    throw new Error('not implemented');
  }

  /**
   * ProfileMemoのまとめ直し(DESIGN.md 1.5節)。差分更新で冗長化したメモを整理・圧縮する。
   * @param {object} currentMemo - ProfileMemo.memo の現在値
   * @param {object[]} recentTurns - 直近のターンデータ
   * @returns {Promise<{ consolidatedMemo: object }>}
   */
  async consolidateProfile(currentMemo, recentTurns) {
    throw new Error('not implemented');
  }

  /**
   * (c) DESIGN.md 1.8節: 確信度が低い次元(dimension)を埋めるための、ProfileMemo/RAGに
   * 価値の高い情報をもたらす質問を生成する。固定テンプレート(b)より踏み込んだ、
   * 文脈に応じた質問を作る。
   *
   * プロンプト設計は DESIGN.md 1.7節の質問設計原則(profile.config.jsonの
   * questionDesignPrinciples)を満たすこと:
   *   - 1問1次元(dimension以外の不確実性を混ぜない)
   *   - 高情報利得(回答の幅で後続の判断が変わる質問にする)
   *   - 純度(前置き無しで本質だけを聞く、短い質問文にする)
   *
   * @param {string} dimension - profile.config.json の trackedDimensions のいずれか
   * @param {string} profileContext - ProfileMemo.getContext() の結果
   * @param {object} [ragContext] - RAGSearch.search() の結果(会話の文脈)
   * @returns {Promise<{ text: string, latencyMs: number }>}
   * @throws llmConfig.enabled が false の場合(呼び出し側は(b)の固定テンプレートに
   *   フォールバックする設計とする)
   */
  async generateQuestion(dimension, profileContext, ragContext) {
    throw new Error('not implemented');
  }
}

export default LLMTeacher;
