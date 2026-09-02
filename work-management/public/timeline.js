(async function () {
  const DAY_W = 32;
  const ROW_H = 44;
  let projectId = null;
  let projectData = null;
  let viewDate = new Date();
  const collapsed = new Set();

  const ganttRoot = document.getElementById('gantt-root');
  const pageHeader = document.getElementById('page-header');

  async function boot() {
    const shell = await WM.renderShell({ activeTab: 'timeline' });
    projectId = shell.projectId;
    if (!projectId) {
      ganttRoot.innerHTML = '<div class="empty-state">プロジェクトがありません。左のサイドバーから新規プロジェクトを作成してください。</div>';
      pageHeader.innerHTML = '';
      return;
    }
    await load();
  }

  async function load() {
    projectData = await WM.api(`/api/projects/${projectId}`);
    document.getElementById('crumb-name').textContent = projectData.project.name;
    renderHeader();
    renderGantt();
  }

  function renderHeader() {
    const p = projectData.project;
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    pageHeader.innerHTML = `
      <div>
        <h1>タイムライン</h1>
        <div class="page-sub">${WM.escapeHtml(p.name)}</div>
      </div>
      <div class="header-spacer"></div>
      <div class="month-nav" style="display:flex;align-items:center;gap:10px;font-size:13.5px;font-weight:700;">
        <div class="icon-btn" id="prev-month" style="width:26px;height:26px;">${WM.icons.arrowLeft}</div>
        ${y}年${m + 1}月
        <div class="icon-btn" id="next-month" style="width:26px;height:26px;">${WM.icons.arrowRight}</div>
      </div>
    `;
    document.getElementById('prev-month').addEventListener('click', () => {
      viewDate = new Date(y, m - 1, 1);
      renderHeader();
      renderGantt();
    });
    document.getElementById('next-month').addEventListener('click', () => {
      viewDate = new Date(y, m + 1, 1);
      renderHeader();
      renderGantt();
    });
  }

  function childrenMap() {
    const map = new Map();
    for (const t of projectData.tasks) {
      const list = map.get(t.parentId) || [];
      list.push(t);
      map.set(t.parentId, list);
    }
    return map;
  }

  function flattenVisible(map) {
    const rows = [];
    function walk(parentId, depth) {
      for (const t of map.get(parentId) || []) {
        const hasChildren = (map.get(t.id) || []).length > 0;
        rows.push({ task: t, depth, hasChildren });
        if (hasChildren && !collapsed.has(t.id)) walk(t.id, depth + 1);
      }
    }
    walk(null, 0);
    return rows;
  }

  function toDateOnly(str) {
    const d = new Date(str + 'T00:00:00');
    return d;
  }

  function renderGantt() {
    const map = childrenMap();
    const rows = flattenVisible(map);
    if (!rows.length) {
      ganttRoot.innerHTML = '<div class="empty-state">タスクがありません。タスク分解画面からタスクを追加してください。</div>';
      return;
    }

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, daysInMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const gridWidth = daysInMonth * DAY_W;
    const gridHeight = rows.length * ROW_H;

    let dayHeader = '';
    let weekendLayer = '';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isToday = isCurrentMonth && d === today.getDate();
      dayHeader += `<div class="day-cell" style="width:${DAY_W}px;">${isToday ? `<span class="day-num-today">${d}</span>` : d}</div>`;
      if (date.getDay() === 0 || date.getDay() === 6) {
        weekendLayer += `<div class="weekend" style="left:${(d - 1) * DAY_W}px;width:${DAY_W}px;"></div>`;
      }
    }

    let taskListHtml = '<div class="tl-head">タスク</div>';
    let barsHtml = '';
    rows.forEach((row, i) => {
      const t = row.task;
      const meta = WM.statusMeta(t.status);
      const top = i * ROW_H;
      taskListHtml += `
        <div class="tl-row ${row.depth > 0 ? 'indent' : ''}">
          ${row.hasChildren ? `<button class="chev" style="width:12px;height:12px;" data-action="toggle" data-id="${t.id}">${collapsed.has(t.id) ? WM.icons.chevronRight : WM.icons.chevronDown}</button>` : (row.depth === 0 ? '<span style="width:12px;"></span>' : statusGlyph(t))}
          <span class="tl-title ${row.depth === 0 ? 'phase' : ''} ${t.status === 'todo' ? 'dim' : ''}">${WM.escapeHtml(t.title)}</span>
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
          <div class="bar ${cls}" data-bar="${t.id}" style="left:${left}px;top:${top + 8}px;width:${width}px;">
            ${t.blocked ? WM.icons.lock : ''}
            ${cls === 'bar-progress' ? `<span style="position:absolute;left:0;top:0;bottom:0;width:${t.progress}%;background:var(--accent);opacity:.18;border-radius:7px 0 0 7px;"></span>` : ''}
            <span style="position:relative;overflow:hidden;text-overflow:ellipsis;">${WM.escapeHtml(t.title)}</span>
          </div>`;
      }
    });

    let todayLine = '';
    if (isCurrentMonth) {
      const x = (today.getDate() - 1) * DAY_W + DAY_W / 2;
      todayLine = `<div class="today-line" style="left:${x}px;height:${gridHeight + ROW_H}px;"></div><div class="today-tag" style="left:${x}px;">本日</div>`;
    }

    ganttRoot.innerHTML = `
      <div class="gantt">
        <div class="tasklist" style="width:260px;">${taskListHtml}</div>
        <div class="grid-wrap">
          <div class="grid-header">${dayHeader}</div>
          <div class="grid-body" id="grid-body" style="width:${gridWidth}px;height:${gridHeight}px;">
            ${weekendLayer}
            ${barsHtml}
            <svg id="dep-svg" width="${gridWidth}" height="${gridHeight}" style="position:absolute;left:0;top:0;pointer-events:none;overflow:visible;">
              <defs>
                <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#c9862a"/></marker>
                <marker id="arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#b9b6ae"/></marker>
              </defs>
            </svg>
          </div>
          ${todayLine}
        </div>
      </div>
    `;

    drawDependencies();
    bindEvents();
  }

  function statusGlyph(t) {
    if (t.status === 'done') return `<span class="check-sm">${WM.icons.check.replace('currentColor', '#fff').replace('width="10" height="10"', 'width="8" height="8"')}</span>`;
    if (t.status === 'in_progress') return '<span class="dot-sm" style="background:var(--accent);"></span>';
    return '<span class="ring-sm"></span>';
  }
  function pillBg(status) {
    if (status === 'done') return 'var(--success-bg)';
    if (status === 'in_progress') return 'var(--accent-soft)';
    return 'var(--neutral-bg)';
  }
  function pillColor(status) {
    if (status === 'done') return 'var(--success-text)';
    if (status === 'in_progress') return 'var(--accent-text)';
    return 'var(--muted)';
  }

  function drawDependencies() {
    const svg = document.getElementById('dep-svg');
    const gridBody = document.getElementById('grid-body');
    if (!svg || !gridBody) return;
    const gridRect = gridBody.getBoundingClientRect();
    const bars = {};
    gridBody.querySelectorAll('[data-bar]').forEach((el) => {
      bars[el.dataset.bar] = el.getBoundingClientRect();
    });

    for (const dep of projectData.dependencies) {
      const predRect = bars[dep.predecessorId];
      const succRect = bars[dep.successorId];
      if (!predRect || !succRect) continue;
      const successorTask = projectData.tasks.find((t) => t.id === dep.successorId);
      const isBlocking = successorTask && successorTask.blocked && successorTask.blockedBy.some((b) => b.id === dep.predecessorId);

      const fromX = predRect.right - gridRect.left;
      const fromY = predRect.top + predRect.height / 2 - gridRect.top;
      const toX = succRect.left - gridRect.left;
      const toY = succRect.top - gridRect.top;
      const midX = toX >= fromX ? (fromX + toX) / 2 : fromX + 16;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${fromX},${fromY} L${midX},${fromY} L${midX},${toY} L${toX},${toY}`);
      path.setAttribute('fill', 'none');
      if (isBlocking) {
        path.setAttribute('stroke', '#c9862a');
        path.setAttribute('stroke-width', '2.2');
        path.setAttribute('stroke-dasharray', '5 4');
        path.setAttribute('marker-end', 'url(#arrow-amber)');
      } else {
        path.setAttribute('stroke', '#b9b6ae');
        path.setAttribute('stroke-width', '1.8');
        path.setAttribute('marker-end', 'url(#arrow-gray)');
      }
      svg.appendChild(path);
    }
  }

  function bindEvents() {
    document.querySelectorAll('[data-action="toggle"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.dataset.id;
        if (collapsed.has(id)) collapsed.delete(id); else collapsed.add(id);
        renderGantt();
      });
    });
    document.querySelectorAll('[data-bar]').forEach((el) => {
      el.addEventListener('click', () => {
        window.location.href = `index.html?project=${projectId}`;
      });
    });
  }

  boot();
})();
