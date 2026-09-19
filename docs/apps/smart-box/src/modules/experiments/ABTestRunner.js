/**
 * ABTestRunner — ユーザーごとのバリアントsticky assignmentと、
 * バリアント別のメトリクス集計。DESIGN.md 5.10節を参照。
 *
 * 主にLoRA学習率・質問戦略の閾値など、確信を持って決め切れないパラメータを
 * 実運用データで検証するために使う(DESIGN.md 8節)。
 */
export class ABTestRunner {
  /**
   * @param {object} experimentsConfig - system.config.json の `experiments` セクション
   *   (abTestingEnabled, stickyAssignment)
   * @param {import('../rag-search/IndexedDBManager.js').IndexedDBManager} db
   * @param {import('../logging/MetricCollector.js').MetricCollector} metricCollector
   */
  constructor(experimentsConfig, db, metricCollector) {
    this.config = experimentsConfig;
    this.db = db;
    this.metricCollector = metricCollector;
  }

  /**
   * ユーザーにバリアントを割り当てる。stickyAssignmentがtrueなら、IndexedDBの
   * metadata storeに保存し、以降は同じ値を返す。
   * @param {string} userId
   * @param {{id: string, weight: number}[]} variants
   * @returns {Promise<string>} 割り当てられたvariant id
   */
  async assignVariant(userId, variants) {
    throw new Error('not implemented');
  }

  /**
   * @param {string} variantId
   * @returns {Promise<object>} MetricCollector.collect() をvariantでフィルタした結果
   */
  async reportByVariant(variantId) {
    throw new Error('not implemented');
  }
}

export default ABTestRunner;
