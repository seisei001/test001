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

  async function fetchUrlContent(url) {
    if (fetchCache.has(url)) return fetchCache.get(url);
    const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
    const data = await res.json();
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
    setFetchStatus('取得中...');

    const data = await fetchUrlContent(url);

    if (data.error) {
      setFetchStatus(`⚠ ${data.error}`);
    } else {
      setFetchStatus('取得完了。必要な部分だけ残して編集してください。');
      currentTitleEl.textContent = data.title || '';
      contentEditor.value = data.text || '';
    }

    saveState();
  }

  function sanitizeFileNamePart(text) {
    return (text || '')
      .replace(/[\\/:*?"<>|]/g, '_')
      .trim()
      .slice(0, 60);
  }

  function downloadCurrentContent() {
    const content = contentEditor.value.trim();
    if (!content) {
      setNavStatus('保管する内容がありません。');
      return;
    }
    const url = state.urls[state.index];
    const title = currentTitleEl.textContent || url;
    const text = `# ${title}\nURL: ${url}\n\n${content}\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const namePart = sanitizeFileNamePart(title) || `page-${state.index + 1}`;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${namePart}-${stamp}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
    setNavStatus('ダウンロードしました。');
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

  storeBtn.addEventListener('click', downloadCurrentContent);

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
