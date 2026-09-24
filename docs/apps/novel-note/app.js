(() => {
  const CURRENT_KEY = 'novelNote.currentWork.v1';
  const EDITS_PREFIX = 'novelNote.edits.v1.';

  const CATEGORIES = [
    { id: 'person', label: '人物・神・天使' },
    { id: 'place', label: '地名・国・世界' },
    { id: 'magic', label: '魔法・スキル・職業' },
    { id: 'thing', label: 'アイテム・組織・種族・魔物' },
  ];
  const STATUSES = [
    { id: 'open', label: '未回収' },
    { id: 'partial', label: '一部回収' },
    { id: 'resolved', label: '回収済' },
    { id: 'contradiction', label: '矛盾あり' },
    { id: 'check', label: '要確認' },
    { id: 'ok', label: '問題なし' },
  ];
  const KINDS = [
    { id: 'mystery', label: '伏線・謎' },
    { id: 'promise', label: '約束・予告・目標' },
    { id: 'inconsistency', label: '食い違い候補' },
  ];
  const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || { label: id }).label;
  const statusLabel = (id) => (STATUSES.find((s) => s.id === id) || { label: id }).label;
  const kindLabel = (id) => (KINDS.find((k) => k.id === id) || { label: id }).label;

  const workSelect = document.getElementById('work-select');
  const workInfo = document.getElementById('work-info');
  const fileInput = document.getElementById('file-input');
  const exportBtn = document.getElementById('export-btn');
  const appStatus = document.getElementById('app-status');
  const emptyPanel = document.getElementById('empty-panel');
  const tabs = document.getElementById('tabs');
  const view = document.getElementById('view');

  /** @type {Map<string, any>} */
  const works = new Map();
  let work = null;       // 表示中の作品データ
  let edits = { threads: {} };
  const ui = { termQuery: '', termCat: 'all', threadQuery: '', threadStatus: 'all', threadKind: 'all' };

  // ---------- 保存(IndexedDB。使えない環境ではメモリだけ) ----------
  const idb = (() => {
    let dbp = null;
    function open() {
      if (dbp) return dbp;
      dbp = new Promise((resolve) => {
        try {
          const req = indexedDB.open('novel-note', 2);
          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains('works')) db.createObjectStore('works', { keyPath: 'work.id' });
            if (!db.objectStoreNames.contains('keys')) db.createObjectStore('keys', { keyPath: 'id' });
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
      return dbp;
    }
    async function tx(store, mode, fn) {
      const db = await open();
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const t = db.transaction(store, mode);
          const r = fn(t.objectStore(store));
          t.oncomplete = () => resolve(r && 'result' in r ? r.result : true);
          t.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    }
    return {
      all: () => tx('works', 'readonly', (s) => s.getAll()),
      put: (data) => tx('works', 'readwrite', (s) => s.put(data)),
      getKey: (id) => tx('keys', 'readonly', (s) => s.get(id)),
      putKey: (rec) => tx('keys', 'readwrite', (s) => s.put(rec)),
      delKey: (id) => tx('keys', 'readwrite', (s) => s.delete(id)),
    };
  })();

  // ---------- 暗号(公開鍵方式。パスワードはこの端末から出ない) ----------
  // ハブには「公開鍵」と「パスワードで暗号化した秘密鍵」だけを置く。
  // 小説データは公開鍵で暗号化されていて、秘密鍵を持つ端末だけが開ける。
  const DATA_DIR = 'data/';
  const KEY_ID = 'main';
  const PENDING_KEYS = 'novelNote.pendingKeys.v1';
  const PBKDF2_ITER = 600000;
  const RSA = { name: 'RSA-OAEP', hash: 'SHA-256' };

  function toB64(buf) {
    const bytes = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function fromB64(b64) {
    const s = atob(b64);
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  async function fingerprint(publicKeyB64) {
    const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(publicKeyB64));
    return Array.from(new Uint8Array(h).slice(0, 8), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  async function passwordKey(password, salt, iterations) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function storePrivateKey(pkcs8, publicKey) {
    const key = await crypto.subtle.importKey('pkcs8', pkcs8, RSA, false, ['decrypt']);
    await idb.putKey({ id: KEY_ID, fp: await fingerprint(publicKey), key });
    return key;
  }
  async function createKeys(password) {
    const pair = await crypto.subtle.generateKey({ ...RSA, modulusLength: 3072, publicExponent: new Uint8Array([1, 0, 1]) }, true, ['encrypt', 'decrypt']);
    const pkcs8 = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
    const spki = await crypto.subtle.exportKey('spki', pair.publicKey);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await passwordKey(password, salt, PBKDF2_ITER), pkcs8);
    const keys = {
      format: 'novel-note-keys', version: 1, createdAt: new Date().toISOString(),
      publicKey: toB64(spki), encPrivateKey: toB64(enc), salt: toB64(salt), iv: toB64(iv), iterations: PBKDF2_ITER,
    };
    await storePrivateKey(pkcs8, keys.publicKey);
    return keys;
  }
  async function unlockKeys(password, keys) {
    const pk = await passwordKey(password, fromB64(keys.salt), keys.iterations);
    const pkcs8 = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(keys.iv) }, pk, fromB64(keys.encPrivateKey));
    return storePrivateKey(pkcs8, keys.publicKey);
  }
  async function gunzip(bytes) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }
  async function decryptWork(enc, privateKey) {
    const raw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, fromB64(enc.wrappedKey));
    const aes = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(enc.iv) }, aes, fromB64(enc.ciphertext));
    return JSON.parse(await gunzip(plain));
  }
  async function fetchJson(path) {
    try {
      const res = await fetch(DATA_DIR + path, { cache: 'no-store' });
      if (!res.ok) return { missing: res.status === 404 };
      return { json: await res.json() };
    } catch {
      return { offline: true };
    }
  }

  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 保存できない環境では何もしない
    }
  }

  function setStatus(msg, isError = false) {
    appStatus.textContent = msg;
    appStatus.classList.toggle('error', isError);
  }

  // ---------- 文字列ユーティリティ ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // 検索用に表記をそろえる(全角半角・大文字小文字・カタカナ→ひらがな)
  function norm(s) {
    return String(s ?? '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
      .replace(/[\s・･]/g, '');
  }
  const words = (q) => String(q).normalize('NFKC').trim().split(/\s+/).filter(Boolean).map(norm);
  function bigrams(s) {
    const t = norm(s);
    const set = new Set();
    for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2));
    return set;
  }
  function jaccard(a, b) {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    return inter / (a.size + b.size - inter);
  }
  function highlight(text, q) {
    let html = esc(text);
    for (const w of String(q).normalize('NFKC').trim().split(/\s+/).filter(Boolean)) {
      const re = new RegExp(esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      html = html.replace(re, (m) => `<mark>${m}</mark>`);
    }
    return html;
  }

  // ---------- データ ----------
  const epMap = () => new Map(work.episodes.map((e) => [e.no, e]));
  const termMap = () => new Map(work.terms.map((t) => [t.id, t]));
  const threadMap = () => new Map(work.threads.map((t) => [t.id, t]));
  const epLabel = (n) => `第${n}話`;
  const epLink = (n) => `<a class="chip" href="#ep/${n}">${epLabel(n)}</a>`;

  function effective(thread) {
    const e = edits.threads[thread.id];
    return { status: (e && e.status) || thread.status, note: (e && e.note) || '', edited: !!e };
  }

  function loadEdits() {
    edits = lsGet(EDITS_PREFIX + work.work.id, { threads: {} });
    if (!edits.threads) edits.threads = {};
  }
  function saveEdits() {
    lsSet(EDITS_PREFIX + work.work.id, edits);
  }

  function validWork(d) {
    return d && d.format === 'novel-note' && d.work && d.work.id && Array.isArray(d.episodes) && Array.isArray(d.terms) && Array.isArray(d.threads);
  }

  function selectWork(id) {
    work = works.get(id) || null;
    if (!work) return;
    lsSet(CURRENT_KEY, id);
    loadEdits();
    const c = work.coverage || {};
    workInfo.textContent = `収録: 第${c.from}〜${c.to}話 / 全${work.work.episodeCount}話 ・ データ作成日 ${work.generatedAt || '-'}`;
    render();
  }

  function refreshWorkSelect() {
    workSelect.innerHTML = '';
    for (const d of works.values()) {
      const opt = document.createElement('option');
      opt.value = d.work.id;
      opt.textContent = d.work.title;
      workSelect.appendChild(opt);
    }
    workSelect.hidden = works.size === 0;
    if (work) workSelect.value = work.work.id;
  }

  function showWorks() {
    refreshWorkSelect();
    const cur = lsGet(CURRENT_KEY, null);
    const id = work && works.has(work.work.id) ? work.work.id : works.has(cur) ? cur : works.keys().next().value;
    if (id) {
      selectWork(id);
      refreshWorkSelect();
    } else {
      render();
    }
  }

  async function init() {
    const all = (await idb.all()) || [];
    for (const d of all) if (validWork(d)) works.set(d.work.id, d);
    showWorks();
    if (!(window.crypto && crypto.subtle && window.DecompressionStream)) {
      setStatus('このブラウザは暗号化データに対応していません。iOS 16.4 以降の Safari で開いてください。', true);
      return;
    }
    const k = await fetchJson('keys.json');
    if (k.offline) {
      if (works.size) setStatus('オフラインのため、この端末に保存したデータを表示しています。');
      return;
    }
    if (k.missing) {
      showSetup();
      return;
    }
    const keys = k.json;
    const stored = await idb.getKey(KEY_ID);
    if (!stored || stored.fp !== (await fingerprint(keys.publicKey))) {
      showUnlock(keys);
      return;
    }
    await sync(stored.key);
  }

  // ハブの暗号化データを確認し、新しければ取り込む
  async function sync(privateKey) {
    const idx = await fetchJson('index.json');
    if (!idx.json) {
      if (!works.size) showLocked('まだデータが登録されていません。Claude がデータを置くまでお待ちください。');
      return;
    }
    const updated = [];
    for (const entry of idx.json.works || []) {
      const have = works.get(entry.id);
      if (have && have._syncedAt === entry.updatedAt) continue;
      const enc = await fetchJson(entry.file);
      if (!enc.json) continue;
      try {
        const data = await decryptWork(enc.json, privateKey);
        if (!validWork(data)) continue;
        data._syncedAt = entry.updatedAt;
        works.set(data.work.id, data);
        await idb.put(data);
        updated.push(data);
      } catch {
        setStatus('データを開けませんでした。鍵が新しくなっている場合は、Claude にデータの暗号化し直しを頼んでください。', true);
        return;
      }
    }
    lockedMode = false;
    showWorks();
    if (updated.length) {
      setStatus(updated.map((d) => `「${d.work.title}」を最新(第${d.coverage.from}〜${d.coverage.to}話)に更新しました。`).join(' '));
    }
  }

  // ---------- 初回設定・ロック解除の画面 ----------
  let lockedMode = false;
  function showLocked(html) {
    lockedMode = true;
    emptyPanel.hidden = true;
    tabs.hidden = true;
    view.innerHTML = `<section class="panel">${html}</section>`;
  }

  function keysText(keys) {
    return JSON.stringify(keys);
  }

  function showPending(keys) {
    showLocked(`<h2>鍵ができました。Claude に送ってください</h2>
      <p>下の文字をすべてコピーして、Claude とのチャットに貼り付けて送ってください。Claude がこの鍵でデータを暗号化してハブに置くと、このアプリに自動で表示されます。</p>
      <p class="hint">この文字には公開してよい鍵と、パスワードで暗号化した秘密鍵だけが入っています。<strong>パスワードそのものは送らないでください。</strong></p>
      <textarea id="keys-text" readonly rows="6">${esc(keysText(keys))}</textarea>
      <div class="row wrap"><button type="button" class="btn" id="copy-keys">コピー</button><button type="button" class="btn secondary" id="share-keys">ファイルで共有</button></div>
      <p id="keys-status" class="status"></p>`);
    const out = document.getElementById('keys-status');
    document.getElementById('copy-keys').addEventListener('click', async () => {
      const ta = document.getElementById('keys-text');
      try {
        await navigator.clipboard.writeText(ta.value);
        out.textContent = 'コピーしました。チャットに貼り付けて送ってください。';
      } catch {
        ta.focus();
        ta.select();
        out.textContent = '文字を選択しました。長押しして「コピー」を押してください。';
      }
    });
    document.getElementById('share-keys').addEventListener('click', async () => {
      const file = new File([keysText(keys)], 'novel-note-keys.json', { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          out.textContent = '共有しました。Google Drive の shousrtsu に保存した場合は、Claude にそう伝えてください。';
        } catch (err) {
          if (!(err && err.name === 'AbortError')) download(file);
        }
      } else {
        download(file);
      }
    });
  }

  function showSetup() {
    const pending = lsGet(PENDING_KEYS, null);
    if (pending) {
      showPending(pending);
      return;
    }
    showLocked(`<h2>最初の設定: パスワードを決める</h2>
      <p>小説データは暗号化してハブに置きます。開くためのパスワードを決めてください。パスワードはこの端末の外には出ません。Claude にも教えないでください。</p>
      <form id="setup-form" class="edit-box">
        <input type="password" id="pw1" autocomplete="new-password" placeholder="パスワード(12文字以上)" aria-label="パスワード">
        <input type="password" id="pw2" autocomplete="new-password" placeholder="もう一度入力" aria-label="パスワード(確認)">
        <button type="submit" class="btn" id="setup-btn">鍵を作る</button>
        <p class="hint">忘れると開けなくなります(その場合は鍵を作り直し、Claude に暗号化し直してもらいます)。パスワード管理アプリなどに保存しておくと安心です。</p>
        <p id="setup-status" class="status error"></p>
      </form>`);
    document.getElementById('setup-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const p1 = document.getElementById('pw1').value;
      const p2 = document.getElementById('pw2').value;
      const out = document.getElementById('setup-status');
      if (p1.length < 12) { out.textContent = 'パスワードは12文字以上にしてください。'; return; }
      if (p1 !== p2) { out.textContent = '2回の入力が一致しません。'; return; }
      const btn = document.getElementById('setup-btn');
      btn.disabled = true;
      btn.textContent = '鍵を作っています…';
      try {
        const keys = await createKeys(p1);
        lsSet(PENDING_KEYS, keys);
        showPending(keys);
      } catch {
        out.textContent = '鍵を作れませんでした。Safari を最新にしてからもう一度試してください。';
        btn.disabled = false;
        btn.textContent = '鍵を作る';
      }
    });
  }

  function showUnlock(keys) {
    showLocked(`<h2>パスワードを入力</h2>
      <p>この端末で初めて開くときだけ、パスワードが必要です。</p>
      <form id="unlock-form" class="edit-box">
        <input type="password" id="unlock-pw" autocomplete="current-password" placeholder="パスワード" aria-label="パスワード">
        <button type="submit" class="btn" id="unlock-btn">開く</button>
        <p id="unlock-status" class="status error"></p>
      </form>
      <details class="hint"><summary>パスワードを忘れた場合</summary>
        <p>鍵を作り直して Claude に送り、データを暗号化し直してもらいます。作り直すと古いパスワードでは開けなくなります。</p>
        <button type="button" class="btn secondary" id="reset-keys">鍵を作り直す</button>
      </details>`);
    document.getElementById('unlock-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('unlock-btn');
      const out = document.getElementById('unlock-status');
      btn.disabled = true;
      btn.textContent = '確認しています…';
      try {
        const key = await unlockKeys(document.getElementById('unlock-pw').value, keys);
        lsSet(PENDING_KEYS, null);
        setStatus('ロックを解除しました。');
        await sync(key);
      } catch {
        out.textContent = 'パスワードが違います。';
        btn.disabled = false;
        btn.textContent = '開く';
      }
    });
    document.getElementById('reset-keys').addEventListener('click', async () => {
      await idb.delKey(KEY_ID);
      lsSet(PENDING_KEYS, null);
      showSetup();
    });
  }

  // ---------- ファイルの読み込み・書き出し ----------
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch {
      setStatus('このファイルは読み込めません。n6924df.novelnote.json のようなデータファイルを選んでください。', true);
      return;
    }
    if (validWork(data)) {
      lockedMode = false;
      works.set(data.work.id, data);
      const saved = await idb.put(data);
      selectWork(data.work.id);
      refreshWorkSelect();
      setStatus(`「${data.work.title}」を読み込みました(第${data.coverage.from}〜${data.coverage.to}話)。${saved ? '' : 'この端末には保存できないため、次回は読み込み直しが必要です。'}`);
      return;
    }
    if (data && data.format === 'novel-note-edits' && data.workId) {
      if (!work || work.work.id !== data.workId) {
        setStatus('先に、この修正ファイルと同じ作品のデータを読み込んでください。', true);
        return;
      }
      let merged = 0;
      for (const [id, e] of Object.entries(data.threads || {})) {
        const cur = edits.threads[id];
        if (!cur || (e.updatedAt || '') > (cur.updatedAt || '')) {
          edits.threads[id] = e;
          merged++;
        }
      }
      saveEdits();
      render();
      setStatus(`修正を${merged}件取り込みました。`);
      return;
    }
    setStatus('小説設定ノートのファイルではないようです。', true);
  });

  workSelect.addEventListener('change', () => selectWork(workSelect.value));

  exportBtn.addEventListener('click', async () => {
    if (!work) return;
    const count = Object.keys(edits.threads).length;
    if (!count) {
      setStatus('書き出す修正がまだありません。伏線の画面で状態やメモを保存すると書き出せます。');
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const name = `novel-note-edits-${work.work.id}-${stamp}.json`;
    const body = JSON.stringify({ format: 'novel-note-edits', version: 1, workId: work.work.id, exportedAt: new Date().toISOString(), threads: edits.threads }, null, 1);
    const file = new File([body], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        setStatus(`${name} を共有しました。「"ファイル"に保存」で Google Drive の shousrtsu に置いてください。`);
      } catch (err) {
        if (err && err.name === 'AbortError') setStatus('書き出しをキャンセルしました。');
        else download(file);
      }
      return;
    }
    download(file);
  });

  function download(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(`${file.name} をダウンロードしました。`);
  }

  // ---------- 画面の切り替え(URLの#で管理) ----------
  window.addEventListener('hashchange', render);

  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    const [kind, arg] = h.split('/');
    if (kind === 'ep' && arg) return { tab: 'episodes', ep: parseInt(arg, 10) };
    if (kind === 'term' && arg) return { tab: 'terms', term: arg };
    if (kind === 'thread' && arg) return { tab: 'threads', thread: arg };
    if (['episodes', 'terms', 'threads'].includes(kind)) return { tab: kind };
    return { tab: 'episodes' };
  }

  function render() {
    if (lockedMode) return;
    exportBtn.disabled = !work;
    if (!work) {
      emptyPanel.hidden = false;
      tabs.hidden = true;
      view.innerHTML = '';
      return;
    }
    emptyPanel.hidden = true;
    tabs.hidden = false;
    const r = route();
    const counts = { episodes: work.episodes.length, terms: work.terms.length, threads: work.threads.length };
    for (const a of tabs.querySelectorAll('a')) {
      a.classList.toggle('active', a.dataset.tab === r.tab);
      const label = { episodes: 'あらすじ', terms: '辞書', threads: '伏線' }[a.dataset.tab];
      a.innerHTML = `${label}<span class="count">${counts[a.dataset.tab]}</span>`;
    }
    if (r.ep) renderEpisode(r.ep);
    else if (r.term) renderTerm(r.term);
    else if (r.thread) renderThread(r.thread);
    else if (r.tab === 'terms') renderTermList();
    else if (r.tab === 'threads') renderThreadList();
    else renderEpisodeList();
  }

  function scrollTopIfDetail() {
    if (/^#(ep|term|thread)\//.test(location.hash)) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', scrollTopIfDetail);

  // ---------- あらすじ ----------
  function jumpForm(value = '') {
    const c = work.coverage;
    return `<form class="row" id="jump-form">
      <input type="number" id="jump-input" inputmode="numeric" min="${c.from}" max="${c.to}" placeholder="話数(${c.from}〜${c.to})" value="${esc(value)}" aria-label="話数">
      <button class="btn" type="submit">表示</button>
    </form>`;
  }
  function bindJump() {
    const form = document.getElementById('jump-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = parseInt(document.getElementById('jump-input').value, 10);
      if (epMap().has(n)) location.hash = `#ep/${n}`;
      else setStatus(`第${n || '?'}話のデータはまだありません(収録は第${work.coverage.from}〜${work.coverage.to}話)。`, true);
    });
  }

  function renderEpisodeList() {
    let html = jumpForm();
    html += '<ul class="list">';
    let chapter = null;
    for (const e of work.episodes) {
      if (e.chapter !== chapter) {
        chapter = e.chapter;
        html += `<li class="chapter-head">${esc(chapter)}</li>`;
      }
      html += `<li><a class="item" href="#ep/${e.no}">
        <div class="item-head"><span class="ep-no">${epLabel(e.no)}</span><span class="item-title">${esc(e.title)}</span></div>
        <div class="item-sub clamp2">${esc(e.summary)}</div></a></li>`;
    }
    html += '</ul>';
    view.innerHTML = html;
    bindJump();
  }

  function renderEpisode(n) {
    const map = epMap();
    const e = map.get(n);
    if (!e) {
      view.innerHTML = `${jumpForm(n)}<p class="empty">第${n}話のデータはまだありません(収録は第${work.coverage.from}〜${work.coverage.to}話)。</p>`;
      bindJump();
      return;
    }
    const terms = work.terms.filter((t) => t.episodes.includes(n));
    const setups = work.threads.filter((t) => t.setup.includes(n));
    const payoffs = work.threads.filter((t) => t.payoff.includes(n));
    let html = jumpForm(n);
    html += `<article class="panel detail">
      <div class="muted small">${esc(e.chapter)}</div>
      <h2><span class="ep-no">${epLabel(n)}</span> ${esc(e.title)}</h2>
      <p class="lead">${esc(e.summary)}</p>
      <p class="muted small">本文 約${(e.chars || 0).toLocaleString()}字 ・ <a href="${esc(work.work.url)}${n}/" target="_blank" rel="noopener">なろうで読む</a></p>`;
    for (const c of CATEGORIES) {
      const list = terms.filter((t) => t.category === c.id);
      if (!list.length) continue;
      html += `<h3>${c.label}</h3><div class="chips">${list.map((t) => `<a class="chip" href="#term/${t.id}">${esc(t.name)}</a>`).join('')}</div>`;
    }
    if (setups.length) html += `<h3>この話で張られた伏線</h3>${threadItems(setups)}`;
    if (payoffs.length) html += `<h3>この話で回収・関係する伏線</h3>${threadItems(payoffs)}`;
    html += '</article>';
    html += `<div class="pager">
      ${map.has(n - 1) ? `<a class="btn secondary" href="#ep/${n - 1}">← 第${n - 1}話</a>` : '<span></span>'}
      ${map.has(n + 1) ? `<a class="btn secondary" href="#ep/${n + 1}">第${n + 1}話 →</a>` : '<span></span>'}
    </div>
    <a class="btn secondary back" href="#episodes">一覧に戻る</a>`;
    view.innerHTML = html;
    bindJump();
  }

  // ---------- 固有名詞辞書 ----------
  function termText(t) {
    return [t.name, t.reading, ...(t.aliases || []), t.description, ...(t.history || []).map((h) => h.note)].join(' ');
  }

  function renderTermList() {
    const catCounts = Object.fromEntries(CATEGORIES.map((c) => [c.id, work.terms.filter((t) => t.category === c.id).length]));
    let html = `<input type="search" id="term-q" placeholder="名前・説明の言葉で検索" value="${esc(ui.termQuery)}" aria-label="辞書を検索">
      <div class="chips" id="term-cats">
        <button type="button" class="chip ${ui.termCat === 'all' ? 'on' : ''}" data-cat="all">すべて <span class="n">${work.terms.length}</span></button>
        ${CATEGORIES.map((c) => `<button type="button" class="chip ${ui.termCat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.label} <span class="n">${catCounts[c.id]}</span></button>`).join('')}
      </div>
      <div id="term-results"></div>`;
    view.innerHTML = html;
    const q = document.getElementById('term-q');
    q.addEventListener('input', () => {
      ui.termQuery = q.value;
      drawTermResults();
    });
    document.getElementById('term-cats').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      ui.termCat = b.dataset.cat;
      for (const x of document.querySelectorAll('#term-cats .chip')) x.classList.toggle('on', x === b);
      drawTermResults();
    });
    drawTermResults();
  }

  function drawTermResults() {
    const ws = words(ui.termQuery);
    const list = work.terms
      .filter((t) => ui.termCat === 'all' || t.category === ui.termCat)
      .filter((t) => {
        const hay = norm(termText(t));
        return ws.every((w) => hay.includes(w));
      })
      .sort((a, b) => {
        if (ws.length) {
          const an = ws.some((w) => norm([a.name, a.reading, ...a.aliases].join(' ')).includes(w)) ? 0 : 1;
          const bn = ws.some((w) => norm([b.name, b.reading, ...b.aliases].join(' ')).includes(w)) ? 0 : 1;
          if (an !== bn) return an - bn;
        }
        return b.episodes.length - a.episodes.length;
      });
    const box = document.getElementById('term-results');
    if (!list.length) {
      box.innerHTML = '<p class="empty">見つかりませんでした。別の言葉で探してみてください。</p>';
      return;
    }
    box.innerHTML = `<p class="hint">${list.length}件</p><ul class="list">${list.map((t) => `<li><a class="item" href="#term/${t.id}">
      <div class="item-head"><span class="item-title">${highlight(t.name, ui.termQuery)}</span>${t.reading ? `<span class="muted small">${esc(t.reading)}</span>` : ''}<span class="cat">${catLabel(t.category)}</span></div>
      <div class="item-sub clamp2">${highlight(t.description, ui.termQuery)}</div>
      <div class="item-sub">登場 ${t.episodes.length}話${t.episodes.length ? `(初出 第${t.episodes[0]}話)` : ''}</div></a></li>`).join('')}</ul>`;
  }

  function renderTerm(id) {
    const t = termMap().get(id);
    if (!t) {
      view.innerHTML = '<p class="empty">この固有名詞は見つかりません。</p><a class="btn secondary back" href="#terms">辞書に戻る</a>';
      return;
    }
    const names = [t.name, ...(t.aliases || [])].map(norm);
    const related = work.threads.filter((th) => {
      const hay = norm([th.title, th.summary, ...(th.tags || [])].join(' '));
      return names.some((n) => n.length >= 2 && hay.includes(n));
    });
    let html = `<article class="panel detail">
      <span class="cat">${catLabel(t.category)}</span>
      <h2>${esc(t.name)}</h2>
      ${t.reading ? `<div class="muted small">よみ: ${esc(t.reading)}</div>` : ''}
      ${t.aliases && t.aliases.length ? `<div class="muted small">別名・表記: ${t.aliases.map(esc).join('、')}</div>` : ''}
      <p class="lead">${esc(t.description)}</p>`;
    if (t.history && t.history.length) {
      html += `<h3>話ごとの変化</h3><ul class="timeline">${t.history.map((h) => `<li><a href="#ep/${h.ep}">${epLabel(h.ep)}</a><span>${esc(h.note)}</span></li>`).join('')}</ul>`;
    }
    html += `<h3>登場した話(${t.episodes.length})</h3>`;
    html += t.episodes.length ? `<div class="chips">${t.episodes.map(epLink).join('')}</div>` : '<p class="empty">収録範囲では登場していません。</p>';
    if (related.length) html += `<h3>関係する伏線</h3>${threadItems(related)}`;
    html += '</article><a class="btn secondary back" href="#terms">辞書に戻る</a>';
    view.innerHTML = html;
  }

  // ---------- 伏線 ----------
  function threadText(t) {
    return [t.title, t.summary, t.resolution, ...(t.tags || []), effective(t).note].join(' ');
  }

  function flowText(t) {
    const s = t.setup.length ? t.setup.map(epLabel).join('・') : '—';
    const p = t.payoff.length ? t.payoff.map(epLabel).join('・') : '未';
    return `${s} → ${p}`;
  }

  function threadItems(list, q = '') {
    return `<ul class="list">${list.map((t) => {
      const ef = effective(t);
      return `<li><a class="item" href="#thread/${t.id}">
        <div class="item-head"><span class="pill st-${ef.status}">${statusLabel(ef.status)}</span><span class="item-title">${highlight(t.title, q)}</span>${ef.edited ? '<span class="edited">修正済み</span>' : ''}</div>
        <div class="item-sub clamp2">${highlight(t.summary, q)}</div>
        <div class="item-sub">${kindLabel(t.kind)} ・ ${flowText(t)}</div></a></li>`;
    }).join('')}</ul>`;
  }

  function renderThreadList() {
    const stCounts = Object.fromEntries(STATUSES.map((s) => [s.id, work.threads.filter((t) => effective(t).status === s.id).length]));
    const html = `<input type="search" id="thread-q" placeholder="伏線の概要から検索(似た伏線も表示)" value="${esc(ui.threadQuery)}" aria-label="伏線を検索">
      <div class="chips" id="thread-st">
        <button type="button" class="chip ${ui.threadStatus === 'all' ? 'on' : ''}" data-st="all">すべて <span class="n">${work.threads.length}</span></button>
        ${STATUSES.filter((s) => stCounts[s.id] || s.id !== 'ok').map((s) => `<button type="button" class="chip ${ui.threadStatus === s.id ? 'on' : ''}" data-st="${s.id}">${s.label} <span class="n">${stCounts[s.id]}</span></button>`).join('')}
      </div>
      <div class="chips" id="thread-kind">
        <button type="button" class="chip ${ui.threadKind === 'all' ? 'on' : ''}" data-kind="all">種類: すべて</button>
        ${KINDS.map((k) => `<button type="button" class="chip ${ui.threadKind === k.id ? 'on' : ''}" data-kind="${k.id}">${k.label}</button>`).join('')}
      </div>
      <div id="thread-results"></div>`;
    view.innerHTML = html;
    const q = document.getElementById('thread-q');
    q.addEventListener('input', () => {
      ui.threadQuery = q.value;
      drawThreadResults();
    });
    document.getElementById('thread-st').addEventListener('click', (e) => {
      const b = e.target.closest('[data-st]');
      if (!b) return;
      ui.threadStatus = b.dataset.st;
      for (const x of document.querySelectorAll('#thread-st .chip')) x.classList.toggle('on', x === b);
      drawThreadResults();
    });
    document.getElementById('thread-kind').addEventListener('click', (e) => {
      const b = e.target.closest('[data-kind]');
      if (!b) return;
      ui.threadKind = b.dataset.kind;
      for (const x of document.querySelectorAll('#thread-kind .chip')) x.classList.toggle('on', x === b);
      drawThreadResults();
    });
    drawThreadResults();
  }

  function drawThreadResults() {
    const ws = words(ui.threadQuery);
    const pool = work.threads
      .filter((t) => ui.threadStatus === 'all' || effective(t).status === ui.threadStatus)
      .filter((t) => ui.threadKind === 'all' || t.kind === ui.threadKind);
    const hits = pool.filter((t) => {
      const hay = norm(threadText(t));
      return ws.every((w) => hay.includes(w));
    });
    const box = document.getElementById('thread-results');
    let html = hits.length
      ? `<p class="hint">${hits.length}件</p>${threadItems(hits, ui.threadQuery)}`
      : '<p class="empty">言葉が一致する伏線はありません。</p>';
    if (ws.length) {
      const qb = bigrams(ui.threadQuery);
      const hitIds = new Set(hits.map((t) => t.id));
      const similar = pool
        .filter((t) => !hitIds.has(t.id))
        .map((t) => ({ t, s: jaccard(qb, bigrams(threadText(t))) }))
        .filter((x) => x.s > 0.02)
        .sort((a, b) => b.s - a.s)
        .slice(0, 5)
        .map((x) => x.t);
      if (similar.length) html += `<h3>似ている伏線</h3>${threadItems(similar)}`;
    }
    box.innerHTML = html;
  }

  function similarThreads(t, n = 5) {
    const base = bigrams([t.title, t.summary].join(' '));
    const tags = new Set(t.tags || []);
    return work.threads
      .filter((x) => x.id !== t.id && !(t.related || []).includes(x.id))
      .map((x) => {
        const tagOverlap = (x.tags || []).filter((g) => tags.has(g)).length;
        return { x, s: jaccard(base, bigrams([x.title, x.summary].join(' '))) + 0.08 * tagOverlap };
      })
      .filter((o) => o.s > 0.05)
      .sort((a, b) => b.s - a.s)
      .slice(0, n)
      .map((o) => o.x);
  }

  function renderThread(id) {
    const map = threadMap();
    const t = map.get(id);
    if (!t) {
      view.innerHTML = '<p class="empty">この伏線は見つかりません。</p><a class="btn secondary back" href="#threads">伏線一覧に戻る</a>';
      return;
    }
    const ef = effective(t);
    const related = (t.related || []).map((r) => map.get(r)).filter(Boolean);
    const similar = similarThreads(t);
    let html = `<article class="panel detail">
      <div class="item-head"><span class="pill st-${ef.status}">${statusLabel(ef.status)}</span><span class="cat">${kindLabel(t.kind)}</span>${ef.edited ? '<span class="edited">修正済み</span>' : ''}</div>
      <h2>${esc(t.title)}</h2>
      <p class="lead">${esc(t.summary)}</p>
      <h3>話の流れ</h3>
      <dl class="flow">
        <dt>張られた話</dt><dd>${t.setup.length ? `<div class="chips">${t.setup.map(epLink).join('')}</div>` : '—'}</dd>
        <dt>回収・関係する話</dt><dd>${t.payoff.length ? `<div class="chips">${t.payoff.map(epLink).join('')}</div>` : 'まだありません'}</dd>
      </dl>`;
    if (t.resolution) html += `<h3>回収のされ方・メモ</h3><p class="lead">${esc(t.resolution)}</p>`;
    if (t.tags && t.tags.length) html += `<h3>タグ</h3><div class="chips">${t.tags.map((g) => `<button type="button" class="chip" data-tag="${esc(g)}">${esc(g)}</button>`).join('')}</div>`;
    html += `<h3>作者の確認</h3>
      <div class="edit-box">
        <label for="st-select" class="hint">AIの判定: ${statusLabel(t.status)}</label>
        <select id="st-select">${STATUSES.map((s) => `<option value="${s.id}" ${s.id === ef.status ? 'selected' : ''}>${s.label}</option>`).join('')}</select>
        <textarea id="note-input" placeholder="メモ(回収予定の話、直す方針など)">${esc(ef.note)}</textarea>
        <div class="row"><button type="button" class="btn" id="save-edit">保存</button>${ef.edited ? '<button type="button" class="btn secondary" id="reset-edit">AIの判定に戻す</button>' : ''}</div>
        <p class="hint">修正はこの端末に保存されます。「修正を書き出す」で Drive に置くと、次のデータ更新に反映されます。</p>
      </div>
    </article>`;
    if (related.length) html += `<h3>関連する伏線</h3>${threadItems(related)}`;
    if (similar.length) html += `<h3>似ている伏線</h3>${threadItems(similar)}`;
    html += '<a class="btn secondary back" href="#threads">伏線一覧に戻る</a>';
    view.innerHTML = html;

    document.getElementById('save-edit').addEventListener('click', () => {
      const status = document.getElementById('st-select').value;
      const note = document.getElementById('note-input').value.trim();
      if (status === t.status && !note) {
        delete edits.threads[t.id];
      } else {
        edits.threads[t.id] = { status, note, updatedAt: new Date().toISOString() };
      }
      saveEdits();
      setStatus(`「${t.title}」を保存しました。`);
      renderThread(id);
    });
    const reset = document.getElementById('reset-edit');
    if (reset) {
      reset.addEventListener('click', () => {
        delete edits.threads[t.id];
        saveEdits();
        setStatus(`「${t.title}」をAIの判定に戻しました。`);
        renderThread(id);
      });
    }
    for (const b of view.querySelectorAll('[data-tag]')) {
      b.addEventListener('click', () => {
        ui.threadQuery = b.dataset.tag;
        ui.threadStatus = 'all';
        ui.threadKind = 'all';
        location.hash = '#threads';
      });
    }
  }

  init();
})();
