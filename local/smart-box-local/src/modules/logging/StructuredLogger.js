/**
 * StructuredLogger — 構造化ログの記録・永続化・エクスポート。
 * DESIGN.md 5.8節・7節(logs object store)を参照。
 */
export class StructuredLogger {
  /**
   * @param {object} loggingConfig - system.config.json の `logging` セクション
   * @param {import('../rag-search/IndexedDBManager.js').IndexedDBManager} db
   */
  constructor(loggingConfig, db) {
    this.config = loggingConfig;
    this.db = db;
  }

  /** @param {string} event @param {object} data */
  debug(event, data) { throw new Error('not implemented'); }

  /** @param {string} event @param {object} data */
  info(event, data) { throw new Error('not implemented'); }

  /** @param {string} event @param {object} data */
  warn(event, data) { throw new Error('not implemented'); }

  /** @param {string} event @param {object} data */
  error(event, data) { throw new Error('not implemented'); }

  /**
   * @param {'json'|'csv'} format
   * @returns {Promise<Blob>}
   */
  async export(format) {
    throw new Error('not implemented');
  }
}

export default StructuredLogger;
