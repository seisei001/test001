#!/usr/bin/env node
// 前回データを作ったときの本文ハッシュと、今の本文を比べて、変わった話を出す。
// 使い方: node tools/novel-note-diff.mjs <meta.json> <作品id>
//   前回のハッシュ: docs/apps/novel-note/data/<作品id>.hashes.json
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { load } from './novel-note-lib.mjs';

const [metaPath, id] = process.argv.slice(2);
if (!metaPath || !id) { console.error('使い方: node tools/novel-note-diff.mjs <meta.json> <作品id>'); process.exit(1); }
const dataDir = process.env.NOVEL_NOTE_DATA_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'apps', 'novel-note', 'data');
const hp = path.join(dataDir, `${id}.hashes.json`);
const prev = fs.existsSync(hp) ? load(hp).episodes : {};
const now = Object.fromEntries(load(metaPath).map((m) => [String(m.no), m.hash]));
const covered = Object.keys(prev).map(Number).sort((a, b) => a - b);
const changed = covered.filter((n) => now[n] && now[n] !== prev[n]);
const removed = covered.filter((n) => !now[n]);
const result = { covered: covered.length ? [covered[0], covered[covered.length - 1]] : null, changed, removed, total: Object.keys(now).length };
console.log(JSON.stringify(result));
