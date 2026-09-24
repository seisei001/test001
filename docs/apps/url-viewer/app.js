(() => {
  const STORAGE_KEY = 'urlLinkViewerState.v2';

  const urlTextarea = document.getElementById('url-textarea');
  const fileInput = document.getElementById('file-input');
  const startBtn = document.getElementById('start-btn');
  const loadStatus = document.getElementById('load-status');

  const viewPanel = document.getElementById('view-panel');
  const progressEl = document.getElementById('progress');
  const currentUrlEl = document.getElementById('current-url');
  const fetchStatus = document.getElementById('fetch-status');
  const currentTitleEl = document.getElementById('current-title');
  const contentEditor = document.getElementById('content-editor');
  const navStatus = document.getElementById('nav-status');
  const filenameInput = document.getElementById('filename-input');

  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const storeBtn = document.getElementById('store-btn');
  const finishBtn = document.getElementById('finish-btn');

  /** @type {{urls: string[], index: number}} */
  let state = { urls: [], index: 0 };

  const fetchCache = new Map();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorageが使えない環境では無視する
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.urls) && parsed.urls.length > 0) {
        state = {
          urls: parsed.urls,
          index: Number.isInteger(parsed.index) ? parsed.index : 0
        };
      }
    } catch {
      // 壊れた保存データは無視する
    }
  }

  function extractUrls(text) {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => /^https?:\/\//i.test(line));
  }

  function setLoadStatus(message) {
    loadStatus.textContent = message;
  }

  function setFetchStatus(message) {
    fetchStatus.textContent = message;
  }

  function setNavStatus(message) {
    navStatus.textContent = message;
  }

  // ローカルでNode.jsサーバー(server.js)を起動している場合は /api/fetch を使う。
  // GitHub Pagesなどサーバーが無い環境では公開のCORSプロキシ経由で取得する。
  async function fetchViaBackend(url) {
    const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('バックエンドAPIが見つかりません');
    }
    return res.json();
  }

  function stripHtml(html, url) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script, style, noscript, iframe, svg, template').forEach((el) => el.remove());
    const title = (doc.querySelector('title')?.textContent || '').trim() || url;

    const blockTags = new Set([
      'P', 'DIV', 'BR', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
      'TR', 'BLOCKQUOTE', 'SECTION', 'ARTICLE', 'PRE', 'UL', 'OL', 'TABLE'
    ]);
    const parts = [];
    function walk(node) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const t = child.textContent.replace(/\s+/g, ' ').trim();
          if (t) parts.push(t);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
          if (blockTags.has(child.tagName)) parts.push('\n');
        }
      });
    }
    if (doc.body) walk(doc.body);

    const text = parts
      .join(' ')
      .replace(/ ?\n ?/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return { url, title, text };
  }

  const CORS_PROXIES = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`
  ];

  async function fetchViaProxy(url) {
    for (const buildProxyUrl of CORS_PROXIES) {
      try {
        const res = await fetch(buildProxyUrl(url), { signal: AbortSignal.timeout(15000) });
        if (!res.ok) continue;
        const html = await res.text();
        return stripHtml(html, url);
      } catch {
        // このプロキシが失敗したら次を試す
      }
    }
    return { url, error: '取得に失敗しました(外部プロキシ経由でも取得できませんでした)' };
  }

  async function fetchUrlContent(url) {
    if (fetchCache.has(url)) return fetchCache.get(url);
    let data;
    try {
      data = await fetchViaBackend(url);
    } catch {
      data = await fetchViaProxy(url);
    }
    fetchCache.set(url, data);
    return data;
  }

  async function showCurrent() {
    if (state.urls.length === 0) return;

    const url = state.urls[state.index];
    progressEl.textContent = `${state.index + 1} / ${state.urls.length}`;
    currentUrlEl.textContent = url;
    currentUrlEl.href = url;
    currentTitleEl.textContent = '';
    contentEditor.value = '';
    setNavStatus('');
    refreshFileName();
    setFetchStatus('取得中...');

    const data = await fetchUrlContent(url);

    if (data.error) {
      setFetchStatus(`⚠ ${data.error}`);
    } else {
      setFetchStatus('取得完了。必要な部分だけ残して編集してください。');
      currentTitleEl.textContent = data.title || '';
      contentEditor.value = data.text || '';
      if (!filenameInput.value.trim()) refreshFileName();
    }

    saveState();
  }

  function sanitizeFileNamePart(text) {
    return (text || '')
      .replace(/[\\/:*?"<>|]/g, '_')
      .trim()
      .slice(0, 60);
  }

  // エピソード番号を3桁にそろえる(1 → 001)
  function padEpisode(n) {
    return String(parseInt(n, 10)).padStart(3, '0');
  }

  // ファイル名の候補: URL末尾の番号を優先し、無ければ本文1行目の「第N話」を使う
  function guessFileName() {
    const url = state.urls[state.index] || '';
    const m = url.match(/\/(\d+)\/?(?:[?#].*)?$/);
    if (m) return padEpisode(m[1]);
    const firstLine = (contentEditor.value || '').trim().split(/\r?\n/)[0] || '';
    const zen = firstLine.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
    const m2 = zen.match(/第\s*(\d+)\s*話/);
    if (m2) return padEpisode(m2[1]);
    return '';
  }

  function refreshFileName() {
    filenameInput.value = guessFileName();
  }

  function currentFileName() {
    let name = sanitizeFileNamePart(filenameInput.value.replace(/\.txt$/i, ''));
    if (!name) name = guessFileName() || `page-${state.index + 1}`;
    if (/^\d+$/.test(name)) name = padEpisode(name);
    return `${name}.txt`;
  }

  function fallbackDownload(file) {
    const blobUrl = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    setNavStatus(`${file.name} をダウンロードしました。`);
  }

  async function storeCurrentContent() {
    const content = contentEditor.value.trim();
    if (!content) {
      setNavStatus('保管する内容がありません。本文を貼り付けてください。');
      return;
    }
    const fileName = currentFileName();
    const file = new File([`${content}\n`], fileName, { type: 'text/plain' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        setNavStatus(`${fileName} を共有しました。`);
      } catch (err) {
        if (err && err.name === 'AbortError') {
          setNavStatus('保存をキャンセルしました。');
        } else {
          fallbackDownload(file);
        }
      }
      return;
    }
    fallbackDownload(file);
  }

  function startFromUrls(urls) {
    if (urls.length === 0) {
      setLoadStatus('有効なURL(http:// または https:// で始まる行)が見つかりませんでした。');
      return;
    }
    state.urls = urls;
    state.index = 0;
    fetchCache.clear();
    setLoadStatus(`${urls.length} 件のURLを読み込みました。`);
    viewPanel.hidden = false;
    saveState();
    showCurrent();
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      urlTextarea.value = String(reader.result || '');
      setLoadStatus(`ファイル「${file.name}」を読み込みました。「読み込み開始」を押してください。`);
    };
    reader.onerror = () => setLoadStatus('ファイルの読み込みに失敗しました。');
    reader.readAsText(file, 'utf-8');
  });

  startBtn.addEventListener('click', () => {
    const urls = extractUrls(urlTextarea.value);
    startFromUrls(urls);
  });

  nextBtn.addEventListener('click', () => {
    if (state.index < state.urls.length - 1) {
      state.index += 1;
      showCurrent();
    } else {
      setNavStatus('次のURLはありません。');
    }
  });

  prevBtn.addEventListener('click', () => {
    if (state.index > 0) {
      state.index -= 1;
      showCurrent();
    } else {
      setNavStatus('前のURLはありません。');
    }
  });

  storeBtn.addEventListener('click', storeCurrentContent);

  // 本文を貼り付けたときにファイル名が空なら「第N話」から補う
  contentEditor.addEventListener('input', () => {
    if (!filenameInput.value.trim()) refreshFileName();
  });

  finishBtn.addEventListener('click', () => {
    window.history.back();
  });

  // 初期化: 前回の続きがあれば復元する
  loadState();
  if (state.urls.length > 0) {
    urlTextarea.value = state.urls.join('\n');
    viewPanel.hidden = false;
    setLoadStatus(`前回の続き: ${state.urls.length} 件のURLを読み込み済みです。`);
    showCurrent();
  }
})();
