import { Strategy } from './Strategy.js';

/**
 * clarification戦略 — confidence 0.5〜0.8(question.config.jsonの
 * confidenceThresholds.clarification〜direct間)で使用。
 * DESIGN.md 5.4節・4.3節を参照。
 */
export class ClarificationStrategy extends Strategy {
  /** @param {object} templatesConfig - question.config.json の `templates.clarification` */
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

export default ClarificationStrategy;
