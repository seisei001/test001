import { Strategy } from './Strategy.js';

/**
 * probing戦略 — confidence 0.5未満(question.config.jsonの
 * confidenceThresholds.probing以下)で使用。最も深掘りする質問。
 * DESIGN.md 5.4節・4.3節を参照。
 */
export class ProbingStrategy extends Strategy {
  /** @param {object} templatesConfig - question.config.json の `templates.probing` */
  constructor(templatesConfig) {
    super();
    this.templates = templatesConfig;
  }

  shouldTrigger(context) {
    throw new Error('not implemented');
  }

  generate(context) {
    throw new Error('not implemented');
  }
}

export default ProbingStrategy;
