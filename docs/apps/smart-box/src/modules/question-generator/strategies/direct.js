import { Strategy } from './Strategy.js';

/**
 * direct戦略 — 確信度が最も低い(probing〜clarification未満)帯で使用。
 * question.config.json の templates.direct を参照。
 * DESIGN.md 5.4節・4.3節を参照。
 */
export class DirectStrategy extends Strategy {
  /** @param {object} templatesConfig - question.config.json の `templates.direct` */
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

export default DirectStrategy;
