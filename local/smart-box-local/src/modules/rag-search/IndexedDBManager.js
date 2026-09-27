/**
 * IndexedDBManager — `smart-box-db` のCRUDと容量管理。
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
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.indexedDBName, this.config.indexedDBVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('turns')) {
          const turnsStore = db.createObjectStore('turns', { keyPath: 'id', autoIncrement: true });
          turnsStore.createIndex('turn_id', 'turn_id', { unique: true });
          turnsStore.createIndex('timestamp', 'timestamp');
        }

        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('logs')) {
          const logsStore = db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
          logsStore.createIndex('timestamp', 'timestamp');
          logsStore.createIndex('level', 'level');
        }
      };
    });
  }

  /**
   * ターンデータを1件追加する。
   * @param {object} turnData - DESIGN.md 6節のスキーマに従うオブジェクト
   * @returns {Promise<number>} 追加されたレコードのid
   */
  async addTurn(turnData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['turns'], 'readwrite');
      const store = transaction.objectStore('turns');
      const request = store.add(turnData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * 全ターンを取得する(RAGSearch.search() から呼ばれる)。
   * @returns {Promise<object[]>}
   */
  async getAllTurns() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['turns'], 'readonly');
      const store = transaction.objectStore('turns');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * 保存済みターン数を返す。
   * @returns {Promise<number>}
   */
  async getTurnCount() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['turns'], 'readonly');
      const store = transaction.objectStore('turns');
      const request = store.count();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * IndexedDBの `metadata` ストアに任意のドキュメント(ProfileMemo・LoRA重み・
   * LLM設定等)を保存する。DESIGN.md 7節。
   * @param {string} key
   * @param {*} value
   * @returns {Promise<void>}
   */
  async setMetadata(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');
      const request = store.put({ key, value });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * @param {string} key
   * @returns {Promise<*|undefined>}
   */
  async getMetadata(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result ? request.result.value : undefined);
    });
  }

  /**
   * ログを1件追加する(StructuredLoggerから呼ばれる)。
   * @param {object} logEntry - { timestamp, level, event, data }
   * @returns {Promise<void>}
   */
  async addLog(logEntry) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['logs'], 'readwrite');
      const store = transaction.objectStore('logs');
      const request = store.add(logEntry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * @returns {Promise<object[]>}
   */
  async getAllLogs() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['logs'], 'readonly');
      const store = transaction.objectStore('logs');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * config.compressAfterTurns に到達した古いターンを要約形式(embeddingのみ保持し
   * rawテキストは破棄)に圧縮する。
   * @returns {Promise<void>}
   */
  async compressOldTurns() {
    const count = await this.getTurnCount();
    const threshold = this.config.compressAfterTurns;
    if (count <= threshold) return;

    const allTurns = await this.getAllTurns();
    const sorted = allTurns.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const toCompress = sorted.slice(0, count - threshold);

    const transaction = this.db.transaction(['turns'], 'readwrite');
    const store = transaction.objectStore('turns');
    for (const turn of toCompress) {
      if (turn.compressed) continue;
      const compressed = {
        ...turn,
        input: { embedding: turn.input?.embedding },
        response: undefined,
        compressed: true,
      };
      store.put(compressed);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * navigator.storage.estimate() 等で使用量を調べ、config.quotaWarningMB /
   * quotaHardLimitMB と比較する。上限到達時はLRUで最古ターンから削除する。
   * @returns {Promise<{usedMB: number, warning: boolean, hardLimitExceeded: boolean}>}
   */
  async checkQuota() {
    let usedMB = 0;
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      usedMB = (estimate.usage || 0) / (1024 * 1024);
    }

    const warning = usedMB >= this.config.quotaWarningMB;
    const hardLimitExceeded = usedMB >= this.config.quotaHardLimitMB;

    if (hardLimitExceeded) {
      await this._evictOldestTurns();
    }

    return { usedMB, warning, hardLimitExceeded };
  }

  /**
   * quotaHardLimitMB超過時、最古のターンから削除する(LRU)。
   * @returns {Promise<void>}
   * @private
   */
  async _evictOldestTurns() {
    const allTurns = await this.getAllTurns();
    if (allTurns.length === 0) return;

    const sorted = allTurns.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const evictCount = Math.max(1, Math.floor(sorted.length * 0.1));
    const toEvict = sorted.slice(0, evictCount);

    const transaction = this.db.transaction(['turns'], 'readwrite');
    const store = transaction.objectStore('turns');
    for (const turn of toEvict) {
      store.delete(turn.id);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export default IndexedDBManager;
