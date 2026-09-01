(() => {
  const STORAGE_KEY = 'urlLinkViewerState.v1';

  const fileInput = document.getElementById('file-input');
  const pasteToggle = document.getElementById('paste-toggle');
  const urlTextarea = document.getElementById('url-textarea');
  const startBtn = document.getElementById('start-btn');
  const loadStatus = document.getElementById('load-status');

  const viewPanel = document.getElementById('view-panel');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const refetchBtn = document.getElementById('refetch-btn');
  const progressEl = document.getElementById('progress');
  const currentUrlEl = document.getElementById('current-url');
  const fetchStatus = document.getElementById('fetch-status');
  const currentTitleEl = document.getElementById('current-title');
  const contentEditor = document.getElementById('content-editor');
  const addBtn = document.getElementById('add-btn');
  const copyBtn = document.getElementById('copy-btn');
  const skipBtn = document.getElementById('skip-btn');

  const collectedPanel = document.getElementById('collected-panel');
  const collectedListEl = document.getElementById('collected-list');
  const downloadBtn = document.getElementById('download-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const collectedCountEl = document.getElementById('collected-count');

  /** @type {{urls: string[], index: number, collected: {url:string, title:string, content:string}[]}} */
  let state = { urls: [], index: 0, collected: [] };

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
      if (parsed && Array.isArray(parsed.urls)) {
        state = {
          urls: parsed.urls,
          index: Number.isInteger(parsed.index) ? parsed.index : 0,
          collected: Array.isArray(parsed.collected) ? parsed.collected : []
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

  async function fetchUrlContent(url) {
    if (fetchCache.has(url)) return fetchCache.get(url);
    const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    fetchCache.set(url, data);
    return data;
  }

  async function showCurrent() {
    if (state.urls.length === 0) return;
    if (state.index < 0) state.index = 0;
    if (state.index >= state.urls.length) state.index = state.urls.length - 1;

    const url = state.urls[state.index];
    progressEl.textContent = `${state.index + 1} / ${state.urls.length}`;
    currentUrlEl.textContent = url;
    currentUrlEl.href = url;
    currentTitleEl.textContent = '';
    contentEditor.value = '';
    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === state.urls.length - 1;
    setFetchStatus('取得中...');
    addBtn.disabled = true;

    const data = await fetchUrlContent(url);

    if (data.error) {
      setFetchStatus(`⚠ ${data.error}`);
      currentTitleEl.textContent = '';
      contentEditor.value = '';
      addBtn.disabled = true;
    } else {
      setFetchStatus('取得完了。必要な部分だけ残して編集してください。');
      currentTitleEl.textContent = data.title || '';
      contentEditor.value = data.text || '';
      addBtn.disabled = false;
    }

    saveState();
  }

  function renderCollected() {
    collectedCountEl.textContent = `保存件数: ${state.collected.length}`;
    downloadBtn.disabled = state.collected.length === 0;

    if (state.collected.length === 0) {
      collectedListEl.innerHTML = '<p class="empty-note">まだ何も保存されていません。</p>';
      return;
    }

    collectedListEl.innerHTML = '';
    state.collected.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'collected-item';
      div.innerHTML = `
        <div class="collected-item-header">
          <p class="collected-item-title"></p>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer"></a>
        </div>
        <p class="collected-item-preview"></p>
        <div class="collected-item-actions">
          <button type="button" class="secondary remove-btn">削除</button>
        </div>
      `;
      div.querySelector('.collected-item-title').textContent = item.title || item.url;
      div.querySelector('.collected-item-header a').textContent = item.url;
      div.querySelector('.collected-item-preview').textContent = item.content;
      div.querySelector('.remove-btn').addEventListener('click', () => {
        state.collected.splice(i, 1);
        saveState();
        renderCollected();
      });
      collectedListEl.appendChild(div);
    });
  }

  function buildDownloadText() {
    const lines = [];
    state.collected.forEach((item, i) => {
      lines.push(`# ${item.title || item.url}`);
      lines.push(`URL: ${item.url}`);
      lines.push('');
      lines.push(item.content);
      if (i < state.collected.length - 1) {
        lines.push('');
        lines.push('----------------------------------------');
        lines.push('');
      }
    });
    return lines.join('\n');
  }

  function downloadCollected() {
    const text = buildDownloadText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.href = url;
    a.download = `collected-content-${stamp}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
    collectedPanel.hidden = false;
    saveState();
    showCurrent();
    renderCollected();
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      urlTextarea.value = text;
      urlTextarea.hidden = false;
      pasteToggle.textContent = '直接貼り付けを隠す';
      setLoadStatus(`ファイル「${file.name}」を読み込みました。内容を確認して「読み込み開始」を押してください。`);
    };
    reader.onerror = () => setLoadStatus('ファイルの読み込みに失敗しました。');
    reader.readAsText(file, 'utf-8');
  });

  pasteToggle.addEventListener('click', () => {
    urlTextarea.hidden = !urlTextarea.hidden;
    pasteToggle.textContent = urlTextarea.hidden ? '直接貼り付け' : '直接貼り付けを隠す';
  });

  startBtn.addEventListener('click', () => {
    const urls = extractUrls(urlTextarea.value);
    startFromUrls(urls);
  });

  prevBtn.addEventListener('click', () => {
    if (state.index > 0) {
      state.index -= 1;
      showCurrent();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (state.index < state.urls.length - 1) {
      state.index += 1;
      showCurrent();
    }
  });

  refetchBtn.addEventListener('click', () => {
    const url = state.urls[state.index];
    if (url) fetchCache.delete(url);
    showCurrent();
  });

  addBtn.addEventListener('click', () => {
    const url = state.urls[state.index];
    const content = contentEditor.value.trim();
    if (!content) {
      setFetchStatus('追加する内容が空です。');
      return;
    }
    state.collected.push({ url, title: currentTitleEl.textContent, content });
    saveState();
    renderCollected();
    setFetchStatus('リストに追加しました。');
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contentEditor.value);
      setFetchStatus('クリップボードにコピーしました。');
    } catch {
      contentEditor.select();
      document.execCommand('copy');
      setFetchStatus('クリップボードにコピーしました。');
    }
  });

  skipBtn.addEventListener('click', () => {
    if (state.index < state.urls.length - 1) {
      state.index += 1;
      showCurrent();
    }
  });

  downloadBtn.addEventListener('click', downloadCollected);

  clearAllBtn.addEventListener('click', () => {
    if (!confirm('保存済みの内容をすべて削除します。よろしいですか?')) return;
    state.collected = [];
    saveState();
    renderCollected();
  });

  // 初期化: 前回の続きがあれば復元する
  loadState();
  if (state.urls.length > 0) {
    urlTextarea.value = state.urls.join('\n');
    urlTextarea.hidden = false;
    pasteToggle.textContent = '直接貼り付けを隠す';
    viewPanel.hidden = false;
    collectedPanel.hidden = false;
    setLoadStatus(`前回の続き: ${state.urls.length} 件のURLを読み込み済みです。`);
    showCurrent();
    renderCollected();
  } else {
    renderCollected();
  }
})();
