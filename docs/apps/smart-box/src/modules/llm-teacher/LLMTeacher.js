/**
 * LLMTeacher — ユーザーが任意で設定した外部LLM API(例: Claude API)を呼び出し、
 * 本体AI(CoreModel)を賢くするための「先生役」の回答を取得する。
 * DESIGN.md 1.4節・5.3節を参照。
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
}

export default LLMTeacher;
