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
    if (kids.length === 0) {
      value = leafProgress(byId.get(id).status);
    } else {
      const sum = kids.reduce((acc, k) => acc + progressOf(k.id), 0);
      value = Math.round(sum / kids.length);
    }
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

module.exports = { buildView };
