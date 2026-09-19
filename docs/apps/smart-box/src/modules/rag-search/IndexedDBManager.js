/**
 * IndexedDBManager — `conversation-rag-db` のCRUDと容量管理。
 * DESIGN.md 5.2節・7節(スキーマ)を参照。
 *
 * object store: turns(keyPath: id autoIncrement, index: turn_id unique, timestamp),
 *               metadata(keyPath: key),
 *               logs(keyPath: id autoIncrement, index: timestamp, level)
 */
export class IndexedDBManager {
  /**
   * @param {object} storageConfig - system.config.json の `storage` セクション
   */
  constructor(storageConfig) {
    this.config = storageConfig;
    this.db = null;
  }

  /**
   * DBを開き、初回は object store / index を作成する(onupgradeneeded)。
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error('not implemented');
  }

  /**
   * ターンデータを1件追加する。
   * @param {object} turnData - DESIGN.md 6節のスキーマに従うオブジェクト
   * @returns {Promise<number>} 追加されたレコードのid
   */
  async addTurn(turnData) {
    throw new Error('not implemented');
  }

  /**
   * 全ターンを取得する(RAGSearch.search() から呼ばれる)。
   * @returns {Promise<object[]>}
   */
  async getAllTurns() {
    throw new Error('not implemented');
  }

  /**
   * 保存済みターン数を返す。
   * @returns {Promise<number>}
   */
  async getTurnCount() {
    throw new Error('not implemented');
  }

  /**
   * config.compressAfterTurns に到達した古いターンを要約形式(embeddingのみ保持し
   * rawテキストは破棄)に圧縮する。
   * @returns {Promise<void>}
   */
  async compressOldTurns() {
    throw new Error('not implemented');
  }

  /**
   * navigator.storage.estimate() 等で使用量を調べ、config.quotaWarningMB /
   * quotaHardLimitMB と比較する。上限到達時はLRUで最古ターンから削除する。
   * @returns {Promise<{usedMB: number, warning: boolean, hardLimitExceeded: boolean}>}
   */
  async checkQuota() {
    throw new Error('not implemented');
  }
}

export default IndexedDBManager;
