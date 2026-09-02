const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'store.json');

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function seedData() {
  const today = new Date();
  const projectId = crypto.randomUUID();

  const T = (offsetStart, offsetEnd) => ({
    start: addDays(today, offsetStart),
    end: addDays(today, offsetEnd)
  });

  const req = crypto.randomUUID();
  const design = crypto.randomUUID();
  const wireframe = crypto.randomUUID();
  const visual = crypto.randomUUID();
  const review = crypto.randomUUID();
  const dev = crypto.randomUUID();
  const front = crypto.randomUUID();
  const back = crypto.randomUUID();
  const integ = crypto.randomUUID();
  const release = crypto.randomUUID();

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
    { id: crypto.randomUUID(), projectId, predecessorId: design, successorId: dev },
    { id: crypto.randomUUID(), projectId, predecessorId: visual, successorId: review },
    { id: crypto.randomUUID(), projectId, predecessorId: front, successorId: integ },
    { id: crypto.randomUUID(), projectId, predecessorId: back, successorId: integ }
  ];

  return {
    projects: [
      { id: projectId, name: 'Webサイトリニューアル', color: '#5a55e0', createdAt: today.toISOString() }
    ],
    tasks,
    dependencies,
    tokens: []
  };
}

function load() {
  if (!fs.existsSync(DB_PATH)) {
    const data = seedData();
    save(data);
    return data;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function save(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

let db = load();

function persist() {
  save(db);
}

module.exports = {
  get db() { return db; },
  persist,
  newId: () => crypto.randomUUID()
};
