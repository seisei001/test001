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
 * リクエストする(Anthropic APIをブラウザから直接呼ぶため
 * `anthropic-dangerous-direct-browser-access` ヘッダを付与する。この方式は
 * ユーザー自身のAPIキーがそのユーザーのブラウザ内でのみ使われる、という前提で
 * 許容している。DESIGN.md 8.3節)。
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_TOKENS = 1024;

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
    const contextText = this._formatRagContext(ragContext);
    const userMessage = contextText ? `${contextText}\n\n${prompt}` : prompt;
    return this._callAnthropic({
      system: 'あなたはユーザーの会話相手です。簡潔に、要点を押さえて答えてください。',
      userMessage,
    });
  }

  /**
   * ProfileMemoのまとめ直し(DESIGN.md 1.5節)。差分更新で冗長化したメモを整理・圧縮する。
   * @param {object} currentMemo - ProfileMemo.memo の現在値
   * @param {object[]} recentTurns - 直近のターンデータ
   * @returns {Promise<{ consolidatedMemo: object }>}
   */
  async consolidateProfile(currentMemo, recentTurns) {
    const recentSummaries = recentTurns
      .map((t) => t.input?.user_prompt)
      .filter(Boolean)
      .join('\n- ');

    const systemPrompt = [
      'あなたはユーザーのプロフィールメモを整理する担当です。',
      '現在のメモ(JSON)と直近の会話を見て、冗長な記述をまとめ、矛盾を解消し、',
      '簡潔化したメモを同じJSON構造(profile.notes, profile.confidence,',
      'questionIntentPatterns, sessionHistory)で返してください。',
      'JSON以外の文字列は一切含めないこと。',
    ].join('\n');

    const userMessage = [
      '現在のメモ:',
      JSON.stringify(currentMemo, null, 2),
      '',
      '直近の会話:',
      `- ${recentSummaries}`,
    ].join('\n');

    const { text } = await this._callAnthropic({ system: systemPrompt, userMessage });

    let consolidatedMemo;
    try {
      consolidatedMemo = JSON.parse(text);
    } catch (error) {
      throw new Error(`consolidateProfile: failed to parse LLM response as JSON: ${error.message}`);
    }

    return { consolidatedMemo };
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
    const contextText = this._formatRagContext(ragContext);

    const systemPrompt = [
      `あなたはユーザーに"${dimension}"という観点について尋ねる、短い質問を1つだけ作ります。`,
      '以下の基準を必ず満たすこと(DESIGN.md 1.7節の質問設計原則):',
      `- 1問1次元: ${dimension}についての不確実性だけを埋める質問にする。他の話題を混ぜない`,
      '- 高情報利得: 「はい/いいえ」で終わらず、回答の幅によって後続の対応が変わる質問にする',
      '- 純度: 前置きなしで本質だけを聞く。1文、短く',
      '質問文のみを出力し、それ以外の文字列(引用符・説明・前置き)は一切含めないこと。',
    ].join('\n');

    const userMessage = [
      'ユーザーについて分かっていること:',
      profileContext || '(まだ情報なし)',
      contextText ? `\n直近の会話の文脈:\n${contextText}` : '',
    ].join('\n');

    return this._callAnthropic({ system: systemPrompt, userMessage });
  }

  /**
   * Anthropic Messages APIを直接呼び出す共通処理。
   * @param {{ system: string, userMessage: string }} params
   * @returns {Promise<{ text: string, latencyMs: number }>}
   * @private
   */
  async _callAnthropic({ system, userMessage }) {
    if (!this.config.enabled) {
      throw new Error('LLMTeacher: llm.config.json is disabled');
    }
    if (!this.apiKey) {
      throw new Error('LLMTeacher: API key is not set');
    }

    const startTime = performance.now();

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: MAX_TOKENS,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`LLMTeacher: Anthropic API request failed (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    return { text, latencyMs: performance.now() - startTime };
  }

  /**
   * @param {object} [ragContext]
   * @returns {string}
   * @private
   */
  _formatRagContext(ragContext) {
    if (!ragContext || !ragContext.retrievedTurns || ragContext.retrievedTurns.length === 0) {
      return '';
    }
    const lines = ragContext.retrievedTurns
      .map((turn) => turn.input?.user_prompt)
      .filter(Boolean)
      .map((text) => `- ${text}`);
    return lines.length > 0 ? `関連する過去のやり取り:\n${lines.join('\n')}` : '';
  }
}

export default LLMTeacher;
