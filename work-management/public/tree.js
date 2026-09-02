(async function () {
  let projectId = null;
  let projectData = null;
  const collapsed = new Set();

  const treeRoot = document.getElementById('tree-root');
  const pageHeader = document.getElementById('page-header');
  const modalRoot = document.getElementById('modal-root');

  async function boot() {
    const shell = await WM.renderShell({ activeTab: 'tree' });
    projectId = shell.projectId;
    if (!projectId) {
      treeRoot.innerHTML = '<div class="empty-state">プロジェクトがありません。左のサイドバーから新規プロジェクトを作成してください。</div>';
      pageHeader.innerHTML = '';
      return;
    }
    await load();
  }

  async function load() {
    projectData = await WM.api(`/api/projects/${projectId}`);
    document.getElementById('crumb-name').textContent = projectData.project.name;
    renderHeader();
    renderTree();
  }

  function renderHeader() {
    const p = projectData.project;
    pageHeader.innerHTML = `
      <div>
        <h1>${WM.escapeHtml(p.name)}</h1>
        <div class="meta-row">
          <div class="progress-wrap">
            <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%;"></div></div>
            <span class="progress-num">${p.progress}%</span>
          </div>
          <span class="meta-item">全${projectData.tasks.length}タスク</span>
        </div>
      </div>
      <div class="header-spacer"></div>
      <button class="btn btn-ghost" id="add-root-task">${WM.icons.plus} タスクを追加</button>
    `;
    document.getElementById('add-root-task').addEventListener('click', () => openTaskModal({ mode: 'create', parentId: null }));
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

  function renderTree() {
    const map = childrenMap();
    const top = map.get(null) || [];
    const p = projectData.project;
    treeRoot.innerHTML = `
      <div class="lvl0">
        <div class="node node-root">
          <div class="k">プロジェクト</div>
          <h2>${WM.escapeHtml(p.name)}</h2>
          <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%;"></div></div>
          <div class="meta-row" style="margin-top:8px;gap:8px;">
            <span class="progress-num">${p.progress}%</span>
            <span class="meta-item">全${projectData.tasks.length}タスク</span>
          </div>
        </div>
        ${top.length ? `<div class="line-h"></div>
        <div class="branch">
          <div class="spine" style="top:24px;bottom:24px;"></div>
          <div class="col">${top.map((t) => renderNode(t, map, 0)).join('')}</div>
        </div>` : `<div style="padding-left:24px;">${addChildButton(null)}</div>`}
      </div>
    `;
    bindTreeEvents();
  }

  function addChildButton(parentId) {
    return `<button class="add-child-btn" data-action="add-child" data-id="${parentId ?? ''}">${WM.icons.plus} タスク追加</button>`;
  }

  function renderNode(task, map, depth) {
    const kids = map.get(task.id) || [];
    const hasChildren = kids.length > 0;
    const isCollapsed = collapsed.has(task.id);
    const meta = WM.statusMeta(task.status);
    const cardClass = depth === 0 ? 'node-phase' : 'node-sub';
    const avatarCls = WM.avatarClass(task.assignee);

    let inner;
    if (depth === 0 || hasChildren) {
      inner = `
        <div class="phase-top">
          ${hasChildren ? `<button class="chev" data-action="toggle" data-id="${task.id}">${isCollapsed ? WM.icons.chevronRight : WM.icons.chevronDown}</button>` : ''}
          <div class="phase-title">${WM.escapeHtml(task.title)}</div>
          <span class="pill ${task.blocked ? 'pill-blocked' : meta.pillClass}">
            ${task.blocked ? WM.icons.lock + ' ブロック中' : (task.status === 'done' ? WM.icons.check + ' ' : '') + meta.label}
          </span>
        </div>
        <div class="phase-sub">
          <div class="progress-bar" style="width:88px;"><div class="progress-fill" style="width:${task.progress}%;"></div></div>
          <span class="progress-num">${task.progress}%</span>
          <div class="avatar-xs ${avatarCls}">${WM.escapeHtml(WM.initial(task.assignee))}</div>
          <div class="node-actions">
            <button data-action="add-child" data-id="${task.id}" title="サブタスク追加">${WM.icons.addSub}</button>
            <button data-action="edit" data-id="${task.id}" title="編集">${WM.icons.edit}</button>
            <button data-action="delete" data-id="${task.id}" title="削除">${WM.icons.trash}</button>
          </div>
        </div>
        ${task.blocked ? `<div class="phase-note">${WM.icons.lock} 先行「${task.blockedBy.map((b) => WM.escapeHtml(b.title)).join('、')}」完了後に着手</div>` : ''}
        ${hasChildren && isCollapsed ? `<div class="chip-collapsed" data-action="toggle" data-id="${task.id}">${kids.length}件のサブタスク</div>` : ''}
      `;
    } else {
      inner = `
        <div class="sub-row">
          <button class="status-dot status-${task.status}" data-action="cycle-status" data-id="${task.id}" title="ステータスを変更">
            ${task.status === 'done' ? WM.icons.check.replace('currentColor', '#fff') : ''}
          </button>
          <span class="sub-title ${task.status === 'todo' ? 'dim' : ''}">${WM.escapeHtml(task.title)}</span>
          <div class="avatar-xs ${avatarCls}">${WM.escapeHtml(WM.initial(task.assignee))}</div>
          <div class="node-actions">
            <button data-action="add-child" data-id="${task.id}" title="サブタスク追加">${WM.icons.addSub}</button>
            <button data-action="edit" data-id="${task.id}" title="編集">${WM.icons.edit}</button>
            <button data-action="delete" data-id="${task.id}" title="削除">${WM.icons.trash}</button>
          </div>
        </div>
        ${task.blocked ? `<div class="phase-note" style="margin-top:8px;">${WM.icons.lock} 先行「${task.blockedBy.map((b) => WM.escapeHtml(b.title)).join('、')}」完了後に着手</div>` : ''}
      `;
    }

    const card = `<div class="node ${cardClass}" data-card="${task.id}">${inner}</div>`;

    let branch = '';
    if (hasChildren && !isCollapsed) {
      branch = `
        <div class="line-h"></div>
        <div class="branch">
          <div class="spine" style="top:24px;bottom:24px;"></div>
          <div class="col">${kids.map((k) => renderNode(k, map, depth + 1)).join('')}</div>
        </div>
      `;
    }

    return `<div class="row-center">${depth > 0 ? '<div class="tick"></div>' : ''}${card}${branch}</div>`;
  }

  function bindTreeEvents() {
    treeRoot.querySelectorAll('[data-action]').forEach((el) => {
      el.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = el.dataset.action;
        const id = el.dataset.id || null;
        if (action === 'toggle') {
          if (collapsed.has(id)) collapsed.delete(id); else collapsed.add(id);
          renderTree();
        } else if (action === 'add-child') {
          openTaskModal({ mode: 'create', parentId: id || null });
        } else if (action === 'edit') {
          const task = projectData.tasks.find((t) => t.id === id);
          openTaskModal({ mode: 'edit', task });
        } else if (action === 'delete') {
          if (confirm('このタスクと配下のサブタスクを削除しますか？')) {
            await WM.api(`/api/tasks/${id}`, { method: 'DELETE' });
            await load();
          }
        } else if (action === 'cycle-status') {
          const task = projectData.tasks.find((t) => t.id === id);
          const next = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo';
          await WM.api(`/api/tasks/${id}`, { method: 'PATCH', body: { status: next } });
          await load();
        }
      });
    });
  }

  function descendantIds(taskId) {
    const map = childrenMap();
    const ids = [taskId];
    for (const k of map.get(taskId) || []) ids.push(...descendantIds(k.id));
    return ids;
  }

  function openTaskModal({ mode, parentId, task }) {
    const isEdit = mode === 'edit';
    const excludeIds = isEdit ? new Set(descendantIds(task.id)) : new Set();
    const candidateParents = projectData.tasks.filter((t) => !excludeIds.has(t.id));
    const candidatePreds = projectData.tasks.filter((t) => t.id !== task?.id && !excludeIds.has(t.id));
    const currentPredIds = isEdit
      ? projectData.dependencies.filter((d) => d.successorId === task.id).map((d) => d.predecessorId)
      : [];

    modalRoot.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal">
          <h2>${isEdit ? 'タスクを編集' : '新しいタスク'}</h2>
          <form id="task-form">
            <div class="field">
              <label>タイトル</label>
              <input type="text" id="f-title" required value="${isEdit ? WM.escapeHtml(task.title) : ''}">
            </div>
            <div class="field">
              <label>親タスク</label>
              <select id="f-parent">
                <option value="">なし(トップレベル)</option>
                ${candidateParents.map((t) => `<option value="${t.id}" ${((isEdit ? task.parentId : parentId) === t.id) ? 'selected' : ''}>${WM.escapeHtml(t.title)}</option>`).join('')}
              </select>
            </div>
            <div class="field-row">
              <div class="field">
                <label>担当者</label>
                <input type="text" id="f-assignee" value="${isEdit ? WM.escapeHtml(task.assignee || '') : WM.escapeHtml(WM.getName())}">
              </div>
              <div class="field">
                <label>ステータス</label>
                <select id="f-status">
                  <option value="todo" ${(!isEdit || task.status === 'todo') ? 'selected' : ''}>未着手</option>
                  <option value="in_progress" ${isEdit && task.status === 'in_progress' ? 'selected' : ''}>進行中</option>
                  <option value="done" ${isEdit && task.status === 'done' ? 'selected' : ''}>完了</option>
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>開始日</label>
                <input type="date" id="f-start" value="${isEdit ? task.start : new Date().toISOString().slice(0, 10)}">
              </div>
              <div class="field">
                <label>終了日</label>
                <input type="date" id="f-end" value="${isEdit ? task.end : new Date().toISOString().slice(0, 10)}">
              </div>
            </div>
            <div class="field">
              <label>先行タスク(完了しないとこのタスクは着手できません)</label>
              <select id="f-preds" multiple size="4">
                ${candidatePreds.map((t) => `<option value="${t.id}" ${currentPredIds.includes(t.id) ? 'selected' : ''}>${WM.escapeHtml(t.title)}</option>`).join('')}
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

    document.getElementById('modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'modal-backdrop') modalRoot.innerHTML = '';
    });
    document.getElementById('modal-cancel').addEventListener('click', () => { modalRoot.innerHTML = ''; });
    document.getElementById('task-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        title: document.getElementById('f-title').value,
        parentId: document.getElementById('f-parent').value || null,
        assignee: document.getElementById('f-assignee').value,
        status: document.getElementById('f-status').value,
        start: document.getElementById('f-start').value,
        end: document.getElementById('f-end').value
      };
      const selectedPreds = Array.from(document.getElementById('f-preds').selectedOptions).map((o) => o.value);

      let taskId;
      if (isEdit) {
        taskId = task.id;
        await WM.api(`/api/tasks/${taskId}`, { method: 'PATCH', body });
      } else {
        const created = await WM.api(`/api/projects/${projectId}/tasks`, { method: 'POST', body });
        taskId = created.id;
      }
      await reconcileDependencies(taskId, selectedPreds);
      modalRoot.innerHTML = '';
      await load();
    });
  }

  async function reconcileDependencies(taskId, selectedPredIds) {
    const existing = projectData.dependencies.filter((d) => d.successorId === taskId);
    const existingIds = existing.map((d) => d.predecessorId);
    const toAdd = selectedPredIds.filter((id) => !existingIds.includes(id));
    const toRemove = existing.filter((d) => !selectedPredIds.includes(d.predecessorId));
    for (const predId of toAdd) {
      await WM.api(`/api/projects/${projectId}/dependencies`, { method: 'POST', body: { predecessorId: predId, successorId: taskId } });
    }
    for (const dep of toRemove) {
      await WM.api(`/api/dependencies/${dep.id}`, { method: 'DELETE' });
    }
  }

  boot();
})();
