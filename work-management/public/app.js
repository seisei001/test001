const WM = (() => {
  const AVATAR_CLASSES = ['c1', 'c2', 'c3', 'c4', 'c5'];

  function getToken() {
    return localStorage.getItem('wm_token');
  }
  function getName() {
    return localStorage.getItem('wm_name') || '';
  }
  function setSession(token, name) {
    localStorage.setItem('wm_token', token);
    localStorage.setItem('wm_name', name);
  }
  function clearSession() {
    localStorage.removeItem('wm_token');
    localStorage.removeItem('wm_name');
  }
  function goLogin() {
    window.location.href = 'login.html';
  }
  function requireAuth() {
    if (!getToken()) goLogin();
  }

  async function api(path, opts = {}) {
    const res = await fetch(path, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
        ...(opts.headers || {})
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    if (res.status === 401) {
      clearSession();
      goLogin();
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      throw new Error(detail.error || `request_failed_${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }
  function avatarClass(name) {
    if (!name) return 'c5';
    return AVATAR_CLASSES[hashCode(name) % AVATAR_CLASSES.length];
  }
  function initial(name) {
    return (name || '?').trim().slice(0, 1);
  }

  function statusMeta(status) {
    if (status === 'done') return { label: '完了', pillClass: 'pill-done' };
    if (status === 'in_progress') return { label: '進行中', pillClass: 'pill-progress' };
    return { label: '未着手', pillClass: 'pill-todo' };
  }

  const icons = {
    logo: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><path d="M12 7.4V12M12 12L6.4 17M12 12l5.6 5"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    bell: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    chevronDown: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevronRight: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
    check: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    lock: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    calendar: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>',
    arrowLeft: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    arrowRight: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    trash: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
    edit: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    addSub: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
  };

  async function renderShell({ activeTab }) {
    requireAuth();
    const params = new URLSearchParams(window.location.search);
    let projectId = params.get('project');

    const projects = await api('/api/projects');
    if (!projectId && projects.length) projectId = projects[0].id;
    if (projectId && !projects.some((p) => p.id === projectId)) projectId = projects[0]?.id || null;

    const sidebar = document.getElementById('sidebar-root');
    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">${icons.logo}</div>
        <div class="brand-name">WorkMap</div>
      </div>
      <button class="btn btn-primary" id="new-project-btn">${icons.plus}新規プロジェクト</button>
      <div class="side-section">
        <div class="side-label">プロジェクト</div>
        ${projects.map((p) => `
          <div class="nav-item ${p.id === projectId ? 'active' : ''}" data-project="${p.id}">
            <span class="dot" style="background:${p.color};"></span>
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(p.name)}</span>
          </div>`).join('') || '<div class="nav-item" style="color:var(--faint);">プロジェクトがありません</div>'}
      </div>
      <div class="side-footer">
        <div class="who">
          <div class="avatar ${avatarClass(getName())}">${escapeHtml(initial(getName()))}</div>
          <div>
            <div class="name">${escapeHtml(getName())}</div>
            <div class="role">メンバー</div>
          </div>
        </div>
        <button class="icon-btn" id="logout-btn" title="ログアウト">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    `;
    sidebar.querySelectorAll('[data-project]').forEach((el) => {
      el.addEventListener('click', () => {
        window.location.href = `${activeTab === 'timeline' ? 'timeline.html' : 'index.html'}?project=${el.dataset.project}`;
      });
    });
    document.getElementById('logout-btn').addEventListener('click', () => {
      clearSession();
      goLogin();
    });
    document.getElementById('new-project-btn').addEventListener('click', async () => {
      const name = prompt('新規プロジェクト名を入力してください');
      if (!name || !name.trim()) return;
      const project = await api('/api/projects', { method: 'POST', body: { name } });
      window.location.href = `${activeTab === 'timeline' ? 'timeline.html' : 'index.html'}?project=${project.id}`;
    });

    const topActions = document.getElementById('top-actions');
    if (topActions) {
      const tabs = document.getElementById('tabs-root');
      if (tabs) {
        tabs.innerHTML = `
          <div class="tab ${activeTab === 'tree' ? 'active' : ''}" id="tab-tree">タスク分解</div>
          <div class="tab ${activeTab === 'timeline' ? 'active' : ''}" id="tab-timeline">タイムライン</div>
        `;
        document.getElementById('tab-tree').addEventListener('click', () => {
          window.location.href = `index.html?project=${projectId}`;
        });
        document.getElementById('tab-timeline').addEventListener('click', () => {
          window.location.href = `timeline.html?project=${projectId}`;
        });
      }
      await renderNotifications(topActions, projectId);
    }

    return { projectId, projects };
  }

  async function renderNotifications(container, projectId) {
    const bellWrap = document.createElement('div');
    bellWrap.style.position = 'relative';
    bellWrap.innerHTML = `<div class="icon-btn" id="bell-btn">${icons.bell}</div>`;
    container.prepend(bellWrap);

    let data = { dueSoon: [], blocked: [] };
    if (projectId) {
      try {
        data = await api(`/api/projects/${projectId}/notifications`);
      } catch (e) { /* ignore */ }
    }
    const total = data.dueSoon.length + data.blocked.length;
    const bellBtn = bellWrap.querySelector('#bell-btn');
    if (total > 0) {
      const dot = document.createElement('span');
      dot.className = 'badge-dot';
      bellBtn.appendChild(dot);
    }

    let open = false;
    function renderPanel() {
      const existing = bellWrap.querySelector('.notif-panel');
      if (existing) existing.remove();
      if (!open) return;
      const panel = document.createElement('div');
      panel.className = 'notif-panel';
      const dueHtml = data.dueSoon.length
        ? data.dueSoon.map((t) => `<div class="notif-item">${icons.calendar}<div><b>${escapeHtml(t.title)}</b><span>期限: ${t.end}</span></div></div>`).join('')
        : '<div class="notif-empty">期限が近いタスクはありません</div>';
      const blockedHtml = data.blocked.length
        ? data.blocked.map((t) => `<div class="notif-item">${icons.lock}<div><b>${escapeHtml(t.title)}</b><span>先行: ${t.blockedBy.map((b) => escapeHtml(b.title)).join('、') || '-'}</span></div></div>`).join('')
        : '<div class="notif-empty">ブロック中のタスクはありません</div>';
      panel.innerHTML = `
        <h3>期限が近いタスク</h3>${dueHtml}
        <h3>ブロック中のタスク</h3>${blockedHtml}
      `;
      bellWrap.appendChild(panel);
    }
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      open = !open;
      renderPanel();
    });
    document.addEventListener('click', () => {
      if (open) { open = false; renderPanel(); }
    });
  }

  return {
    getToken, getName, setSession, clearSession, requireAuth, api,
    escapeHtml, avatarClass, initial, statusMeta, icons, renderShell
  };
})();
