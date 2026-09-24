#!/usr/bin/env node
// 小説設定ノートの正本データに、AIの作業結果(パッチ)と作者の修正を取り込む。
// 取り込んだあと、固有名詞の登場話を全話で数え直し、各話のタイトル・章・字数・ハッシュを本文から付け直す。
//
// 使い方:
//   node tools/novel-note-merge.mjs --base 正本.json --texts 分割フォルダ \
//        [--patch パッチ.json] [--edits 修正データ.json] --out 新しい正本.json
//
// ルール:
//   - 作者の修正(--edits)は最優先。修正した項目は authorEdited に記録し、以後パッチで上書きしない。
//   - パッチの項目は id(話は no)で既存と照合し、書かれた項目だけを置き換える。新しい id は追加する。
//   - history は "history" なら置き換え、"historyAdd" なら追記する。
import path from 'node:path';
import { load, save, countEpisodes, EDIT_FIELDS, CATEGORIES, STATUSES, KINDS, pad3 } from './novel-note-lib.mjs';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
if (!args.base || !args.texts || !args.out) {
  console.error('使い方: node tools/novel-note-merge.mjs --base 正本.json --texts 分割フォルダ [--patch パッチ.json] [--edits 修正データ.json] --out 出力.json');
  process.exit(1);
}
const data = load(args.base);
const meta = new Map(load(path.join(args.texts, 'meta.json')).map((m) => [m.no, m]));
const warnings = [];
const keyOf = (coll, r) => String(coll === 'episodes' ? r.no : r.id);
const index = (coll) => new Map(data[coll].map((r) => [keyOf(coll, r), r]));

// 1. パッチ(AIの作業結果)
if (args.patch) {
  const patch = load(args.patch);
  if (patch.workId && patch.workId !== data.work.id) throw new Error(`作品IDが違います: ${patch.workId}`);
  for (const coll of ['episodes', 'terms', 'threads']) {
    const map = index(coll);
    for (const rec of patch[coll] || []) {
      const key = keyOf(coll, rec);
      const cur = map.get(key);
      if (!cur) {
        const fresh = { ...rec };
        if (fresh.historyAdd) { fresh.history = [...(fresh.history || []), ...fresh.historyAdd]; delete fresh.historyAdd; }
        data[coll].push(fresh);
        map.set(key, fresh);
        continue;
      }
      const locked = new Set(cur.authorEdited || []);
      for (const [f, v] of Object.entries(rec)) {
        if (f === 'no' || f === 'id' || f === 'authorEdited') continue;
        if (locked.has(f)) { warnings.push(`${coll} ${key}: 作者が直した「${f}」は変更しませんでした`); continue; }
        if (f === 'historyAdd') {
          const seen = new Set((cur.history || []).map((h) => `${h.ep}|${h.note}`));
          cur.history = [...(cur.history || []), ...v.filter((h) => !seen.has(`${h.ep}|${h.note}`))].sort((a, b) => a.ep - b.ep);
        } else {
          cur[f] = v;
        }
      }
    }
  }
  for (const id of patch.removeTerms || []) data.terms = data.terms.filter((t) => t.id !== id);
  for (const id of patch.removeThreads || []) data.threads = data.threads.filter((t) => t.id !== id);
}

// 2. 作者の修正(アプリで直した内容)
if (args.edits) {
  const edits = load(args.edits);
  if (edits.workId !== data.work.id) throw new Error(`修正データの作品IDが違います: ${edits.workId}`);
  for (const coll of Object.keys(EDIT_FIELDS)) {
    const map = index(coll);
    for (const [key, e] of Object.entries(edits[coll] || {})) {
      const cur = map.get(String(key));
      if (!cur) { warnings.push(`${coll} ${key}: 修正の対象が見つかりません`); continue; }
      const fields = EDIT_FIELDS[coll].filter((f) => f in e);
      for (const f of fields) cur[f] = e[f];
      cur.authorEdited = [...new Set([...(cur.authorEdited || []), ...fields])];
    }
  }
}

// 3. 各話の情報を本文から付け直し、収録範囲を決める
data.episodes.sort((a, b) => a.no - b.no);
for (const e of data.episodes) {
  const m = meta.get(e.no);
  if (!m) { warnings.push(`第${e.no}話の本文がありません`); continue; }
  Object.assign(e, { title: m.title, chapter: m.chapter, chars: m.chars });
}
const nos = data.episodes.map((e) => e.no);
data.coverage = { from: Math.min(...nos), to: Math.max(...nos) };
data.work.episodeCount = meta.size;
data.generatedAt = new Date().toISOString().slice(0, 10);

// 4. 固有名詞の登場話を数え直す
const texts = new Map();
for (let n = data.coverage.from; n <= data.coverage.to; n++) {
  const p = path.join(args.texts, `${pad3(n)}.txt`);
  if (fs.existsSync(p)) texts.set(n, fs.readFileSync(p, 'utf8'));
}
for (const t of data.terms) {
  t.episodes = countEpisodes([t.name, t.name.replace(/\s/g, ''), ...(t.aliases || [])], texts);
  if (!t.episodes.length) warnings.push(`固有名詞「${t.name}」が本文に見つかりません(別名の追加を検討)`);
}

// 5. 検査
const errors = [];
const threadIds = new Set(data.threads.map((t) => t.id));
const termIds = new Set();
for (const t of data.terms) {
  if (termIds.has(t.id)) errors.push(`固有名詞の id が重複: ${t.id}`);
  termIds.add(t.id);
  if (!CATEGORIES.includes(t.category)) errors.push(`固有名詞 ${t.id}: 種類が不正 ${t.category}`);
  for (const f of ['name', 'description']) if (!t[f]) errors.push(`固有名詞 ${t.id}: ${f} がありません`);
}
for (const t of data.threads) {
  if (!STATUSES.includes(t.status)) errors.push(`伏線 ${t.id}: 状態が不正 ${t.status}`);
  if (!KINDS.includes(t.kind)) errors.push(`伏線 ${t.id}: 種類が不正 ${t.kind}`);
  for (const f of ['title', 'summary']) if (!t[f]) errors.push(`伏線 ${t.id}: ${f} がありません`);
  for (const n of [...(t.setup || []), ...(t.payoff || [])]) if (!nos.includes(n)) errors.push(`伏線 ${t.id}: 収録外の話数 ${n}`);
  for (const r of t.related || []) if (!threadIds.has(r)) errors.push(`伏線 ${t.id}: 関連先 ${r} がありません`);
}
for (const e of data.episodes) if (!e.summary) errors.push(`第${e.no}話: あらすじがありません`);
for (let n = data.coverage.from; n <= data.coverage.to; n++) if (!nos.includes(n)) errors.push(`第${n}話のあらすじが抜けています`);
if (errors.length) {
  console.error('エラー:\n' + errors.map((x) => '  - ' + x).join('\n'));
  process.exit(1);
}

save(args.out, data);
// 本文のハッシュを保存(次回の変更チェック用。内容は推測できないので公開してよい)
const dataDir = process.env.NOVEL_NOTE_DATA_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'apps', 'novel-note', 'data');
fs.mkdirSync(dataDir, { recursive: true });
save(path.join(dataDir, `${data.work.id}.hashes.json`), {
  format: 'novel-note-hashes', version: 1, workId: data.work.id, updatedAt: new Date().toISOString(),
  episodes: Object.fromEntries(nos.map((n) => [String(n), meta.get(n) ? meta.get(n).hash : null])),
});
console.log(`第${data.coverage.from}〜${data.coverage.to}話 / 固有名詞${data.terms.length} / 伏線${data.threads.length} → ${args.out}`);
if (warnings.length) console.log('注意:\n' + warnings.map((x) => '  - ' + x).join('\n'));
