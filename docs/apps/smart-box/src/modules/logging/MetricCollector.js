/**
 * MetricCollector — ログからパフォーマンス・品質メトリクスを集計し、
 * system.config.json の `targets` と比較してアラートを出す。
 * DESIGN.md 5.9節を参照。
 */
export class MetricCollector {
  /**
   * @param {object} targetsConfig - system.config.json の `targets` セクション
   * @param {import('./StructuredLogger.js').StructuredLogger} logger
   */
  constructor(targetsConfig, logger) {
    this.targets = targetsConfig;
    this.logger = logger;
  }

  /**
   * @param {{ turnId: string, variant?: string }} [filter]
   * @returns {Promise<{
   *   avgInferenceLatencyMs: number,
   *   avgTotalTurnLatencyMs: number,
   *   intentAccuracy: number,
   *   entityF1: number,
   *   contextUnderstanding: number,
   *   alerts: string[]
   * }>}
   */
  async collect(filter) {
    throw new Error('not implemented');
  }

  /**
   * 集計結果を targets と比較し、下回っている項目をアラートとして返す。
   * @param {object} metrics
   * @returns {string[]}
   */
  checkAgainstTargets(metrics) {
    throw new Error('not implemented');
  }
}

export default MetricCollector;
