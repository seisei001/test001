import { Strategy } from './Strategy.js';

/**
 * contrastive戦略 — RAGSearchで類似する過去ターン(前回の選択)が見つかった時に、
 * 「前回は〜でしたが今回も?」という形で問う。question.config.json の
 * templates.contrastive を参照。DESIGN.md 5.4節を参照。
 */
export class ContrastiveStrategy extends Strategy {
  /** @param {object} templatesConfig - question.config.json の `templates.contrastive` */
  constructor(templatesConfig) {
    super();
    this.templates = templatesConfig;
  }

  /**
   * ragContext.retrievedTurns に十分類似する過去の選択があるかどうかで判定する。
   * @param {object} context
   */
  shouldTrigger(context) {
    throw new Error('not implemented');
  }

  generate(context) {
    throw new Error('not implemented');
  }
}

export default ContrastiveStrategy;
