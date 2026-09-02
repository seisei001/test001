const path = require('path');
const express = require('express');
const store = require('./lib/store');
const { buildView } = require('./lib/logic');

const PORT = process.env.PORT || 3100;
const PASSWORD = process.env.WM_PASSWORD || 'work1234';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const entry = token && store.db.tokens.find((t) => t.token === token);
  if (!entry) return res.status(401).json({ error: 'unauthorized' });
  req.user = entry;
  next();
}

function collectDescendantIds(taskId, tasks) {
  const ids = [taskId];
  const children = tasks.filter((t) => t.parentId === taskId);
  for (const child of children) ids.push(...collectDescendantIds(child.id, tasks));
  return ids;
}

app.post('/api/login', (req, res) => {
  const { password, name } = req.body || {};
  if (password !== PASSWORD) return res.status(401).json({ error: 'invalid_password' });
  const displayName = (name || '').trim() || 'ゲスト';
  const token = store.newId();
  store.db.tokens.push({ token, name: displayName, createdAt: new Date().toISOString() });
  store.persist();
  res.json({ token, name: displayName });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ name: req.user.name });
});

app.get('/api/projects', requireAuth, (req, res) => {
  const list = store.db.projects.map((p) => {
    const tasks = store.db.tasks.filter((t) => t.projectId === p.id);
    const deps = store.db.dependencies.filter((d) => d.projectId === p.id);
    const { projectProgress } = buildView(tasks, deps);
    return { ...p, progress: projectProgress, taskCount: tasks.length };
  });
  res.json(list);
});

app.post('/api/projects', requireAuth, (req, res) => {
  const { name, color } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'name_required' });
  const project = {
    id: store.newId(),
    name: name.trim(),
    color: color || '#5a55e0',
    createdAt: new Date().toISOString()
  };
  store.db.projects.push(project);
  store.persist();
  res.status(201).json(project);
});

app.get('/api/projects/:id', requireAuth, (req, res) => {
  const project = store.db.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'not_found' });
  const tasks = store.db.tasks.filter((t) => t.projectId === project.id);
  const deps = store.db.dependencies.filter((d) => d.projectId === project.id);
  const { tasks: enriched, projectProgress } = buildView(tasks, deps);
  res.json({ project: { ...project, progress: projectProgress }, tasks: enriched, dependencies: deps });
});

app.post('/api/projects/:id/tasks', requireAuth, (req, res) => {
  const project = store.db.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'not_found' });
  const { title, parentId, assignee, start, end, status } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'title_required' });
  const task = {
    id: store.newId(),
    projectId: project.id,
    parentId: parentId || null,
    title: title.trim(),
    assignee: assignee || '',
    status: status || 'todo',
    start: start || new Date().toISOString().slice(0, 10),
    end: end || new Date().toISOString().slice(0, 10)
  };
  store.db.tasks.push(task);
  store.persist();
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', requireAuth, (req, res) => {
  const task = store.db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'not_found' });
  const fields = ['title', 'assignee', 'status', 'start', 'end', 'parentId'];
  for (const f of fields) {
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, f)) task[f] = req.body[f];
  }
  store.persist();
  res.json(task);
});

app.delete('/api/tasks/:id', requireAuth, (req, res) => {
  const task = store.db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'not_found' });
  const projectTasks = store.db.tasks.filter((t) => t.projectId === task.projectId);
  const removeIds = new Set(collectDescendantIds(task.id, projectTasks));
  store.db.tasks = store.db.tasks.filter((t) => !removeIds.has(t.id));
  store.db.dependencies = store.db.dependencies.filter(
    (d) => !removeIds.has(d.predecessorId) && !removeIds.has(d.successorId)
  );
  store.persist();
  res.status(204).end();
});

app.post('/api/projects/:id/dependencies', requireAuth, (req, res) => {
  const project = store.db.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'not_found' });
  const { predecessorId, successorId } = req.body || {};
  if (!predecessorId || !successorId || predecessorId === successorId) {
    return res.status(400).json({ error: 'invalid_dependency' });
  }
  const exists = store.db.dependencies.some(
    (d) => d.projectId === project.id && d.predecessorId === predecessorId && d.successorId === successorId
  );
  if (exists) return res.status(409).json({ error: 'already_exists' });
  const dep = { id: store.newId(), projectId: project.id, predecessorId, successorId };
  store.db.dependencies.push(dep);
  store.persist();
  res.status(201).json(dep);
});

app.delete('/api/dependencies/:id', requireAuth, (req, res) => {
  const before = store.db.dependencies.length;
  store.db.dependencies = store.db.dependencies.filter((d) => d.id !== req.params.id);
  if (store.db.dependencies.length === before) return res.status(404).json({ error: 'not_found' });
  store.persist();
  res.status(204).end();
});

app.get('/api/projects/:id/notifications', requireAuth, (req, res) => {
  const project = store.db.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'not_found' });
  const tasks = store.db.tasks.filter((t) => t.projectId === project.id);
  const deps = store.db.dependencies.filter((d) => d.projectId === project.id);
  const { tasks: enriched } = buildView(tasks, deps);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in3days = new Date(today);
  in3days.setDate(in3days.getDate() + 3);

  const dueSoon = enriched.filter((t) => {
    if (t.status === 'done') return false;
    const end = new Date(t.end);
    return end >= today && end <= in3days;
  });
  const blocked = enriched.filter((t) => t.blocked);

  res.json({ dueSoon, blocked });
});

app.listen(PORT, () => {
  console.log(`work-management server listening on http://localhost:${PORT}`);
});
