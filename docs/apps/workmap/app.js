(() => {
  const STORAGE_KEY = 'workmapApp.data.v1';
  const DAY_W = 30;
  const ROW_H = 44;

  const icons = {
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    bell: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    chevronDown: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevronRight: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
    check: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    lock: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    calendar: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>',
    arrowLeft: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    arrowRight: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    trash: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    edit: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    more: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>'
  };

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  }
  function uid() { return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
  function initial(name) { return (name || '?').trim().slice(0, 1); }
  function addDays(base, days) { const d = new Date(base); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }
  function statusMeta(status) {
    if (status === 'done') return { label: '完了', pillClass: 'pill-done' };
    if (status === 'in_progress') return { label: '進行中', pillClass: 'pill-progress' };
    return { label: '未着手', pillClass: 'pill-todo' };
  }

  function seedData() {
    const today = new Date();
    const T = (s, e) => ({ start: addDays(today, s), end: addDays(today, e) });
    const projectId = uid();
    const req = uid(), design = uid(), wireframe = uid(), visual = uid(), review = uid();
    const dev = uid(), front = uid(), back = uid(), integ = uid(), release = uid();
    const tasks = [
      { id: req, projectId, parentId: null, title: '要件定義', assignee: '田中', status: 'done', ...T(-10, -6) },
      { id: design, projectId, parentId: null, title: 'デザイン', assignee: '佐藤', status: 'in_progress', ...T(-5, 5) },
      { id: wireframe, projectId, parentId: design, title: 'ワイヤーフレーム', assignee: '佐藤', status: 'done', ...T(-5, -2) },
      { id: visual, projectId, parentId: design, title: 'ビジュアルデザイン', assignee: '佐藤', status: 'in_progress', ...T(-2, 3) },
      { id: review, projectId, parentId: design, title: 'デザインレビュー', assignee: '田中', status: 'todo', ...T(3, 5) },
      { id: dev, projectId, parentId: null, title: '開発', assignee: '鈴木', status: 'todo', ...T(6, 17) },
      { id: front, projectId, parentId: dev, title: 'フロントエンド実装', assignee: '鈴木', status: 'todo', ...T(6, 11) },
      { id: back, projectId, parentId: dev, title: 'バックエンドAPI開発', assignee: '山本', status: 'todo', ...T(6, 13) },
      { id: integ, projectId, parentId: dev, title: '結合テスト', assignee: '田中', status: 'todo', ...T(14, 17) },
      { id: release, projectId, parentId: null, title: '公開・運用', assignee: '田中', status: 'todo', ...T(18, 19) }
    ];
    const dependencies = [
      { id: uid(), projectId, predecessorId: design, successorId: dev },
      { id: uid(), projectId, predecessorId: visual, successorId: review },
      { id: uid(), projectId, predecessorId: front, successorId: integ },
      { id: uid(), projectId, predecessorId: back, successorId: integ }
    ];
    return {
      projects: [{ id: projectId, name: 'Webサイトリニューアル', color: '#2563eb', createdAt: today.toISOString() }],
      tasks,
      dependencies
    };
  }

  function loadDB() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    const data = seedData();
    saveDB(data);
    return data;
  }
  function saveDB(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  let DB = loadDB();
  let currentProjectId = DB.projects[0] ? DB.projects[0].id : null;
  let activeTab = 'tree';
  const collapsedTree = new Set();
  const collapsedTimeline = new Set();
  let viewDate = new Date();
  let notifOpen = false;
  let openMenuId = null;

  function renderActions(task) {
    const open = openMenuId === task.id;
    return `
      <div class="node-actions">
        <button data-action="menu" data-id="${task.id}" title="操作メニュー">${icons.more}</button>
        ${open ? `
          <div class="action-menu" data-menu="${task.id}">
            <button data-action="add-child" data-id="${task.id}">${icons.plus} サブタスク追加</button>
            <button data-action="edit" data-id="${task.id}">${icons.edit} 編集</button>
            <button data-action="delete" data-id="${task.id}" class="danger">${icons.trash} 削除</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function leafProgress(status) {
    if (status === 'done') return 100;
    if (status === 'in_progress') return 50;
    return 0;
  }
  function buildView(tasks, dependencies) {
    const byId = new Map(tasks.map((t) => [t.id, t]));
    const childrenOf = new Map();
    for (const t of tasks) {
      const list = childrenOf.get(t.parentId) || [];
      list.push(t);
      childrenOf.set(t.parentId, list);
    }
    const progressCache = new Map();
    function progressOf(id) {
      if (progressCache.has(id)) return progressCache.get(id);
      const kids = childrenOf.get(id) || [];
      let value;
      if (kids.length === 0) value = leafProgress(byId.get(id).status);
      else value = Math.round(kids.reduce((acc, k) => acc + progressOf(k.id), 0) / kids.length);
      progressCache.set(id, value);
      return value;
    }
    function displayStatusOf(id) {
      const kids = childrenOf.get(id) || [];
      if (kids.length === 0) return byId.get(id).status;
      const p = progressOf(id);
      if (p >= 100) return 'done';
      if (p <= 0) return 'todo';
      return 'in_progress';
    }
    const enriched = tasks.map((t) => {
      const blockedBy = dependencies
        .filter((d) => d.successorId === t.id)
        .map((d) => byId.get(d.predecessorId))
        .filter((pred) => pred && displayStatusOf(pred.id) !== 'done');
      const status = displayStatusOf(t.id);
      return {
        ...t,
        status,
        progress: progressOf(t.id),
        hasChildren: (childrenOf.get(t.id) || []).length > 0,
        blocked: status !== 'done' && blockedBy.length > 0,
        blockedBy: blockedBy.map((p) => ({ id: p.id, title: p.title }))
      };
    });
    const topLevel = enriched.filter((t) => t.parentId === null);
    const projectProgress = topLevel.length
      ? Math.round(topLevel.reduce((acc, t) => acc + t.progress, 0) / topLevel.length)
      : 0;
    return { tasks: enriched, projectProgress };
  }

  function getProject() { return DB.projects.find((p) => p.id === currentProjectId) || null; }
  function getProjectTasks() { return DB.tasks.filter((t) => t.projectId === currentProjectId); }
  function getProjectDeps() { return DB.dependencies.filter((d) => d.projectId === currentProjectId); }
  function childrenMap(tasks) {
    const map = new Map();
    for (const t of tasks) {
      const list = map.get(t.parentId) || [];
      list.push(t);
      map.set(t.parentId, list);
    }
    return map;
  }
  function descendantIds(taskId, tasks) {
    const map = childrenMap(tasks);
    const ids = [taskId];
    for (const k of map.get(taskId) || []) ids.push(...descendantIds(k.id, tasks));
    return ids;
  }

  const el = (id) => document.getElementById(id);

  function positionTabIndicator() {
    const activeEl = activeTab === 'tree' ? el('tab-tree') : el('tab-timeline');
    const indicator = el('tab-indicator');
    if (!activeEl || !indicator) return;
    indicator.style.width = activeEl.offsetWidth + 'px';
    indicator.style.transform = `translateX(${activeEl.offsetLeft}px)`;
  }

  function render() {
    renderProjectSelect();
    el('tab-tree').classList.toggle('active', activeTab === 'tree');
    el('tab-timeline').classList.toggle('active', activeTab === 'timeline');
    positionTabIndicator();
    const project = getProject();
    if (!project) {
      el('page-header').innerHTML = '';
      el('tree-view').innerHTML = '<div class="empty-state">プロジェクトがありません。「+ 新規プロジェクト」から作成してください。</div>';
      el('timeline-view').innerHTML = '';
      renderNotif();
      return;
    }
    const tasks = getProjectTasks();
    const deps = getProjectDeps();
    const { tasks: enriched, projectProgress } = buildView(tasks, deps);

    el('page-header').innerHTML = `
      <div>
        <h2>${escapeHtml(project.name)}</h2>
        <div class="progress-wrap" style="margin-top:6px;">
          <div class="progress-bar"><div class="progress-fill" style="width:${projectProgress}%;"></div></div>
          <span class="progress-num">${projectProgress}%</span>
          <span class="meta-item">全${tasks.length}タスク</span>
        </div>
      </div>
      <div class="toolbar-spacer"></div>
      <button class="btn btn-ghost" id="add-root-task">${icons.plus} タスクを追加</button>
    `;
    el('add-root-task').addEventListener('click', () => openTaskModal({ mode: 'create', parentId: null }));

    el('tree-view').style.display = activeTab === 'tree' ? '' : 'none';
    el('timeline-view').style.display = activeTab === 'timeline' ? '' : 'none';
    el('month-nav').style.display = activeTab === 'timeline' ? 'flex' : 'none';

    if (activeTab === 'tree') renderTree(enriched);
    else renderTimeline(enriched, deps);

    renderNotif();
  }

  function renderProjectSelect() {
    const sel = el('project-select');
    sel.innerHTML = DB.projects.map((p) => `<option value="${p.id}" ${p.id === currentProjectId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('');
  }

  /* ---------- tree view ---------- */
  function renderTree(enriched) {
    const map = childrenMap(enriched);
    const top = map.get(null) || [];
    const project = getProject();
    const treeEl = el('tree-view');
    const projectProgress = enriched.length ? Math.round(top.reduce((a, t) => a + t.progress, 0) / (top.length || 1)) : 0;
    treeEl.innerHTML = `
      <div class="scroll-x">
        <div class="lvl0">
          <div class="node node-root">
            <div class="k">プロジェクト</div>
            <h2>${escapeHtml(project.name)}</h2>
            <div class="progress-bar"><div class="progress-fill" style="width:${projectProgress}%;"></div></div>
            <div class="meta-item" style="color:#fff;opacity:.9;margin-top:8px;">${projectProgress}% ・ 全${enriched.length}タスク</div>
          </div>
          ${top.length ? `<div class="line-h"></div>
          <div class="branch"><div class="spine" style="top:22px;bottom:22px;"></div><div class="col">${top.map((t) => renderNode(t, map, 0)).join('')}</div></div>` : ''}
        </div>
      </div>
    `;
    bindTreeEvents();
  }

  function renderNode(task, map, depth) {
    const kids = map.get(task.id) || [];
    const hasChildren = kids.length > 0;
    const isCollapsed = collapsedTree.has(task.id);
    const meta = statusMeta(task.status);
    const cardClass = depth === 0 ? 'node-phase' : 'node-sub';

    let inner;
    if (depth === 0 || hasChildren) {
      inner = `
        <div class="phase-top">
          ${hasChildren ? `<button class="chev" data-action="toggle" data-id="${task.id}">${isCollapsed ? icons.chevronRight : icons.chevronDown}</button>` : ''}
          <div class="phase-title">${escapeHtml(task.title)}</div>
          <span class="pill ${task.blocked ? 'pill-blocked' : meta.pillClass}">
            ${task.blocked ? icons.lock + ' ブロック中' : (task.status === 'done' ? icons.check + ' ' : '') + meta.label}
          </span>
        </div>
        <div class="phase-sub">
          <div class="progress-bar" style="width:76px;"><div class="progress-fill" style="width:${task.progress}%;"></div></div>
          <span class="progress-num">${task.progress}%</span>
          <span class="avatar-xs">${escapeHtml(initial(task.assignee))}</span>
          ${renderActions(task)}
        </div>
        ${task.blocked ? `<div class="phase-note">${icons.lock} 先行「${task.blockedBy.map((b) => escapeHtml(b.title)).join('、')}」完了後に着手</div>` : ''}
        ${hasChildren && isCollapsed ? `<div class="chip-collapsed" data-action="toggle" data-id="${task.id}">${kids.length}件のサブタスク</div>` : ''}
      `;
    } else {
      inner = `
        <div class="sub-row">
          <button class="status-dot status-${task.status}" data-action="cycle-status" data-id="${task.id}" title="ステータスを変更">
            ${task.status === 'done' ? icons.check.replace(/currentColor/g, '#fff') : ''}
          </button>
          <span class="sub-title ${task.status === 'todo' ? 'dim' : ''}">${escapeHtml(task.title)}</span>
          <span class="avatar-xs">${escapeHtml(initial(task.assignee))}</span>
          ${renderActions(task)}
        </div>
        ${task.blocked ? `<div class="phase-note" style="margin-top:8px;">${icons.lock} 先行「${task.blockedBy.map((b) => escapeHtml(b.title)).join('、')}」完了後に着手</div>` : ''}
      `;
    }
    const card = `<div class="node ${cardClass}" data-card="${task.id}">${inner}</div>`;
    let branch = '';
    if (hasChildren && !isCollapsed) {
      branch = `<div class="line-h"></div><div class="branch"><div class="spine" style="top:22px;bottom:22px;"></div><div class="col">${kids.map((k) => renderNode(k, map, depth + 1)).join('')}</div></div>`;
    }
    return `<div class="row-center">${depth > 0 ? '<div class="tick"></div>' : ''}${card}${branch}</div>`;
  }

  function bindTreeEvents() {
    el('tree-view').querySelectorAll('[data-action]').forEach((elm) => {
      elm.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = elm.dataset.action;
        const id = elm.dataset.id || null;
        if (action === 'toggle') {
          if (collapsedTree.has(id)) collapsedTree.delete(id); else collapsedTree.add(id);
          render();
        } else if (action === 'menu') {
          openMenuId = openMenuId === id ? null : id;
          render();
        } else if (action === 'add-child') {
          openMenuId = null;
          openTaskModal({ mode: 'create', parentId: id || null });
        } else if (action === 'edit') {
          openMenuId = null;
          const task = DB.tasks.find((t) => t.id === id);
          openTaskModal({ mode: 'edit', task });
        } else if (action === 'delete') {
          openMenuId = null;
          if (confirm('このタスクと配下のサブタスクを削除しますか？')) {
            const finishDelete = () => {
              const removeIds = new Set(descendantIds(id, getProjectTasks()));
              DB.tasks = DB.tasks.filter((t) => !removeIds.has(t.id));
              DB.dependencies = DB.dependencies.filter((d) => !removeIds.has(d.predecessorId) && !removeIds.has(d.successorId));
              saveDB(DB);
              render();
            };
            const cardEl = document.querySelector(`[data-card="${id}"]`);
            if (cardEl) {
              cardEl.classList.add('card-removing');
              cardEl.addEventListener('animationend', finishDelete, { once: true });
            } else {
              finishDelete();
            }
          } else {
            render();
          }
        } else if (action === 'cycle-status') {
          const task = DB.tasks.find((t) => t.id === id);
          task.status = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo';
          saveDB(DB);
          render();
          const dot = document.querySelector(`[data-action="cycle-status"][data-id="${id}"]`);
          if (dot) {
            dot.classList.add('pop');
            dot.addEventListener('animationend', () => dot.classList.remove('pop'), { once: true });
          }
        }
      });
    });
  }

  /* ---------- timeline view ---------- */
  function flattenVisible(map) {
    const rows = [];
    function walk(parentId, depth) {
      for (const t of map.get(parentId) || []) {
        const hasChildren = (map.get(t.id) || []).length > 0;
        rows.push({ task: t, depth, hasChildren });
        if (hasChildren && !collapsedTimeline.has(t.id)) walk(t.id, depth + 1);
      }
    }
    walk(null, 0);
    return rows;
  }
  function toDateOnly(str) { return new Date(str + 'T00:00:00'); }
  function statusGlyph(t) {
    if (t.status === 'done') return `<span class="check-sm">${icons.check.replace(/currentColor/g, '#fff').replace('width="10" height="10"', 'width="8" height="8"')}</span>`;
    if (t.status === 'in_progress') return '<span class="dot-sm" style="background:var(--accent);"></span>';
    return '<span class="ring-sm"></span>';
  }
  function pillBg(status) { return status === 'done' ? 'var(--success-bg)' : status === 'in_progress' ? 'var(--accent-soft)' : 'var(--neutral-bg)'; }
  function pillColor(status) { return status === 'done' ? 'var(--success-text)' : status === 'in_progress' ? 'var(--accent)' : 'var(--muted)'; }

  function renderMonthNav() {
    const y = viewDate.getFullYear(), m = viewDate.getMonth();
    el('month-label').textContent = `${y}年${m + 1}月`;
  }

  function renderTimeline(enriched, deps) {
    renderMonthNav();
    const map = childrenMap(enriched);
    const rows = flattenVisible(map);
    const timelineEl = el('timeline-view');
    if (!rows.length) {
      timelineEl.innerHTML = '<div class="empty-state">タスクがありません。タスク分解タブから追加してください。</div>';
      return;
    }
    const year = viewDate.getFullYear(), month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, daysInMonth);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const gridWidth = daysInMonth * DAY_W;
    const gridHeight = rows.length * ROW_H;

    let dayHeader = '', weekendLayer = '';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isToday = isCurrentMonth && d === today.getDate();
      dayHeader += `<div class="day-cell">${isToday ? `<span class="day-num-today">${d}</span>` : d}</div>`;
      if (date.getDay() === 0 || date.getDay() === 6) weekendLayer += `<div class="weekend" style="left:${(d - 1) * DAY_W}px;width:${DAY_W}px;"></div>`;
    }

    let taskListHtml = '<div class="tl-head">タスク</div>';
    let barsHtml = '';
    rows.forEach((row, i) => {
      const t = row.task;
      const meta = statusMeta(t.status);
      const top = i * ROW_H;
      taskListHtml += `
        <div class="tl-row ${row.depth > 0 ? 'indent' : ''}">
          ${row.hasChildren ? `<button class="chev" style="width:12px;height:12px;" data-action="toggle-tl" data-id="${t.id}">${collapsedTimeline.has(t.id) ? icons.chevronRight : icons.chevronDown}</button>` : (row.depth === 0 ? '<span style="width:12px;"></span>' : statusGlyph(t))}
          <span class="tl-title ${row.depth === 0 ? 'phase' : ''} ${t.status === 'todo' ? 'dim' : ''}">${escapeHtml(t.title)}</span>
          <span class="pill-xs" style="background:${t.blocked ? 'var(--warn-bg)' : pillBg(t.status)};color:${t.blocked ? 'var(--warn-text)' : pillColor(t.status)};">${t.blocked ? 'ブロック中' : meta.label}</span>
        </div>`;

      const barStart = toDateOnly(t.start) < monthStart ? monthStart : toDateOnly(t.start);
      const barEnd = toDateOnly(t.end) > monthEnd ? monthEnd : toDateOnly(t.end);
      if (barStart <= barEnd && toDateOnly(t.end) >= monthStart && toDateOnly(t.start) <= monthEnd) {
        const startIdx = Math.round((barStart - monthStart) / 86400000);
        const endIdx = Math.round((barEnd - monthStart) / 86400000);
        const left = startIdx * DAY_W;
        const width = (endIdx - startIdx + 1) * DAY_W;
        const cls = t.blocked ? 'bar-blocked' : t.status === 'done' ? 'bar-done' : t.status === 'in_progress' ? 'bar-progress' : 'bar-todo';
        barsHtml += `
          <div class="bar ${cls}" data-bar="${t.id}" style="left:${left}px;top:${top + 9}px;width:${width}px;">
            ${t.blocked ? icons.lock : ''}
            <span style="position:relative;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(t.title)}</span>
          </div>`;
      }
    });

    let todayLine = '';
    if (isCurrentMonth) {
      const x = (today.getDate() - 1) * DAY_W + DAY_W / 2;
      todayLine = `<div class="today-line" style="left:${x}px;height:${gridHeight + ROW_H}px;"></div><div class="today-tag" style="left:${x}px;">本日</div>`;
    }

    timelineEl.innerHTML = `
      <div class="scroll-x">
        <div class="gantt">
          <div class="tasklist">${taskListHtml}</div>
          <div class="grid-wrap">
            <div class="grid-header">${dayHeader}</div>
            <div class="grid-body" id="grid-body" style="width:${gridWidth}px;height:${gridHeight}px;">
              ${weekendLayer}
              ${barsHtml}
              <svg id="dep-svg" width="${gridWidth}" height="${gridHeight}" style="position:absolute;left:0;top:0;pointer-events:none;overflow:visible;">
                <defs>
                  <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#c9862a"/></marker>
                  <marker id="arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#9a9aa2"/></marker>
                </defs>
              </svg>
            </div>
            ${todayLine}
          </div>
        </div>
      </div>
    `;
    drawDependencies(deps);
    timelineEl.querySelectorAll('[data-action="toggle-tl"]').forEach((elm) => {
      elm.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = elm.dataset.id;
        if (collapsedTimeline.has(id)) collapsedTimeline.delete(id); else collapsedTimeline.add(id);
        render();
      });
    });
    timelineEl.querySelectorAll('[data-bar]').forEach((elm) => {
      elm.addEventListener('click', () => {
        const task = DB.tasks.find((t) => t.id === elm.dataset.bar);
        if (task) openTaskModal({ mode: 'edit', task });
      });
    });
  }

  function drawDependencies(deps) {
    const svg = el('dep-svg');
    const gridBody = el('grid-body');
    if (!svg || !gridBody) return;
    const gridRect = gridBody.getBoundingClientRect();
    const bars = {};
    gridBody.querySelectorAll('[data-bar]').forEach((elm) => { bars[elm.dataset.bar] = elm.getBoundingClientRect(); });
    const { tasks: enriched } = buildView(getProjectTasks(), getProjectDeps());
    for (const dep of deps) {
      const predRect = bars[dep.predecessorId];
      const succRect = bars[dep.successorId];
      if (!predRect || !succRect) continue;
      const successorTask = enriched.find((t) => t.id === dep.successorId);
      const isBlocking = successorTask && successorTask.blocked && successorTask.blockedBy.some((b) => b.id === dep.predecessorId);
      const fromX = predRect.right - gridRect.left, fromY = predRect.top + predRect.height / 2 - gridRect.top;
      const toX = succRect.left - gridRect.left, toY = succRect.top - gridRect.top;
      const midX = toX >= fromX ? (fromX + toX) / 2 : fromX + 16;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${fromX},${fromY} L${midX},${fromY} L${midX},${toY} L${toX},${toY}`);
      path.setAttribute('fill', 'none');
      if (isBlocking) {
        path.setAttribute('stroke', '#c9862a'); path.setAttribute('stroke-width', '2.2');
        path.setAttribute('stroke-dasharray', '5 4'); path.setAttribute('marker-end', 'url(#arrow-amber)');
      } else {
        path.setAttribute('stroke', '#9a9aa2'); path.setAttribute('stroke-width', '1.8');
        path.setAttribute('marker-end', 'url(#arrow-gray)');
      }
      svg.appendChild(path);
    }
  }

  /* ---------- notifications ---------- */
  function renderNotif() {
    const bellWrap = el('notif-wrap');
    const project = getProject();
    let dueSoon = [], blocked = [];
    if (project) {
      const { tasks: enriched } = buildView(getProjectTasks(), getProjectDeps());
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const in3 = new Date(today); in3.setDate(in3.getDate() + 3);
      dueSoon = enriched.filter((t) => t.status !== 'done' && toDateOnly(t.end) >= today && toDateOnly(t.end) <= in3);
      blocked = enriched.filter((t) => t.blocked);
    }
    const total = dueSoon.length + blocked.length;
    el('bell-btn').innerHTML = icons.bell + (total > 0 ? '<span class="badge-dot"></span>' : '');
    const panelHost = el('notif-panel-host');
    panelHost.innerHTML = '';
    if (!notifOpen) return;
    const dueHtml = dueSoon.length
      ? dueSoon.map((t) => `<div class="notif-item">${icons.calendar}<div><b>${escapeHtml(t.title)}</b><span>期限: ${t.end}</span></div></div>`).join('')
      : '<div class="notif-empty">期限が近いタスクはありません</div>';
    const blockedHtml = blocked.length
      ? blocked.map((t) => `<div class="notif-item">${icons.lock}<div><b>${escapeHtml(t.title)}</b><span>先行: ${t.blockedBy.map((b) => escapeHtml(b.title)).join('、') || '-'}</span></div></div>`).join('')
      : '<div class="notif-empty">ブロック中のタスクはありません</div>';
    panelHost.innerHTML = `<div class="notif-panel"><h3>期限が近いタスク</h3>${dueHtml}<h3>ブロック中のタスク</h3>${blockedHtml}</div>`;
  }

  /* ---------- modal ---------- */
  function openTaskModal({ mode, parentId, task }) {
    const isEdit = mode === 'edit';
    const projectTasks = getProjectTasks();
    const excludeIds = isEdit ? new Set(descendantIds(task.id, projectTasks)) : new Set();
    const candidateParents = projectTasks.filter((t) => !excludeIds.has(t.id));
    const candidatePreds = projectTasks.filter((t) => t.id !== task?.id && !excludeIds.has(t.id));
    const currentPredIds = isEdit ? getProjectDeps().filter((d) => d.successorId === task.id).map((d) => d.predecessorId) : [];
    const modalRoot = el('modal-root');
    modalRoot.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal">
          <h2>${isEdit ? 'タスクを編集' : '新しいタスク'}</h2>
          <form id="task-form">
            <div class="field"><label>タイトル</label><input type="text" id="f-title" required value="${isEdit ? escapeHtml(task.title) : ''}"></div>
            <div class="field"><label>親タスク</label>
              <select id="f-parent">
                <option value="">なし(トップレベル)</option>
                ${candidateParents.map((t) => `<option value="${t.id}" ${((isEdit ? task.parentId : parentId) === t.id) ? 'selected' : ''}>${escapeHtml(t.title)}</option>`).join('')}
              </select>
            </div>
            <div class="field-row">
              <div class="field"><label>担当者</label><input type="text" id="f-assignee" value="${isEdit ? escapeHtml(task.assignee || '') : ''}"></div>
              <div class="field"><label>ステータス</label>
                <select id="f-status">
                  <option value="todo" ${(!isEdit || task.status === 'todo') ? 'selected' : ''}>未着手</option>
                  <option value="in_progress" ${isEdit && task.status === 'in_progress' ? 'selected' : ''}>進行中</option>
                  <option value="done" ${isEdit && task.status === 'done' ? 'selected' : ''}>完了</option>
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field"><label>開始日</label><input type="date" id="f-start" value="${isEdit ? task.start : new Date().toISOString().slice(0, 10)}"></div>
              <div class="field"><label>終了日</label><input type="date" id="f-end" value="${isEdit ? task.end : new Date().toISOString().slice(0, 10)}"></div>
            </div>
            <div class="field"><label>先行タスク(完了しないと着手できません)</label>
              <select id="f-preds" multiple size="4">
                ${candidatePreds.map((t) => `<option value="${t.id}" ${currentPredIds.includes(t.id) ? 'selected' : ''}>${escapeHtml(t.title)}</option>`).join('')}
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-ghost" id="modal-cancel">キャンセル</button>
              <button type="submit" class="btn btn-primary">${isEdit ? '保存' : '追加'}</button>
            </div>
          </form>
        </div>
      </div>
    `;
    el('modal-backdrop').addEventListener('click', (e) => { if (e.target.id === 'modal-backdrop') modalRoot.innerHTML = ''; });
    el('modal-cancel').addEventListener('click', () => { modalRoot.innerHTML = ''; });
    el('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const body = {
        title: el('f-title').value.trim(),
        parentId: el('f-parent').value || null,
        assignee: el('f-assignee').value.trim(),
        status: el('f-status').value,
        start: el('f-start').value,
        end: el('f-end').value
      };
      if (!body.title) return;
      const selectedPreds = Array.from(el('f-preds').selectedOptions).map((o) => o.value);
      let taskId;
      if (isEdit) {
        taskId = task.id;
        Object.assign(task, body);
      } else {
        taskId = uid();
        DB.tasks.push({ id: taskId, projectId: currentProjectId, ...body });
      }
      const existing = DB.dependencies.filter((d) => d.successorId === taskId);
      const existingIds = existing.map((d) => d.predecessorId);
      for (const predId of selectedPreds) {
        if (!existingIds.includes(predId)) DB.dependencies.push({ id: uid(), projectId: currentProjectId, predecessorId: predId, successorId: taskId });
      }
      for (const dep of existing) {
        if (!selectedPreds.includes(dep.predecessorId)) DB.dependencies = DB.dependencies.filter((d) => d.id !== dep.id);
      }
      saveDB(DB);
      modalRoot.innerHTML = '';
      render();
    });
  }

  /* ---------- tap ripple feedback ---------- */
  function spawnRipple(target, evt) {
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const size = Math.max(rect.width, rect.height) * 1.3;
    const originX = evt.clientX ?? rect.left + rect.width / 2;
    const originY = evt.clientY ?? rect.top + rect.height / 2;
    const span = document.createElement('span');
    span.className = 'ripple-wave';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (originX - rect.left - size / 2) + 'px';
    span.style.top = (originY - rect.top - size / 2) + 'px';
    const cs = getComputedStyle(target);
    if (cs.position === 'static') target.style.position = 'relative';
    if (cs.overflow !== 'hidden') target.style.overflow = 'hidden';
    target.appendChild(span);
    span.addEventListener('animationend', () => span.remove(), { once: true });
  }
  document.addEventListener('pointerdown', (e) => {
    const target = e.target.closest('.btn, .icon-btn, .tab, .node-actions > button, .action-menu button, .bar, .status-dot, .chip-collapsed');
    if (target) spawnRipple(target, e);
  });

  /* ---------- wiring ---------- */
  function init() {
    el('project-select').addEventListener('change', (e) => { currentProjectId = e.target.value; render(); });
    el('new-project-btn').addEventListener('click', () => {
      const name = prompt('新規プロジェクト名を入力してください');
      if (!name || !name.trim()) return;
      const id = uid();
      DB.projects.push({ id, name: name.trim(), color: '#2563eb', createdAt: new Date().toISOString() });
      saveDB(DB);
      currentProjectId = id;
      render();
    });
    el('tab-tree').addEventListener('click', () => { activeTab = 'tree'; render(); });
    el('tab-timeline').addEventListener('click', () => { activeTab = 'timeline'; render(); });
    el('bell-btn').addEventListener('click', (e) => { e.stopPropagation(); notifOpen = !notifOpen; renderNotif(); });
    document.addEventListener('click', () => {
      if (notifOpen) { notifOpen = false; renderNotif(); }
      if (openMenuId) { openMenuId = null; render(); }
    });
    el('prev-month').addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1); render(); });
    el('next-month').addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1); render(); });
    window.addEventListener('resize', positionTabIndicator);
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
