/**
 * Strategy — 質問生成の4戦略(direct/contrastive/clarification/probing)が
 * 実装する共通インターフェース。DESIGN.md 5.4節を参照。
 *
 * 各戦略ファイル(direct.js等)はこのクラスを継承するか、同じ形の
 * plainオブジェクトをexportすること。
 */
export class Strategy {
  /**
   * この戦略を今回のターンで使うべきかを判定する
   * (QuestionGenerator側で confidenceThresholds により大枠は決まるが、
   * frequency制御などここでも最終判定してよい)。
   * @param {object} context - { confidence, intent, ragContext, userModel, sessionState }
   * @returns {boolean}
   */
  shouldTrigger(context) {
    throw new Error('not implemented');
  }

  /**
   * question.config.json の該当戦略の templates からランダムに1件選び、
   * プレースホルダーを context の値で埋めて質問文を生成する。
   * @param {object} context
   * @returns {string} 質問文
   */
  generate(context) {
    throw new Error('not implemented');
  }
}

export default Strategy;
