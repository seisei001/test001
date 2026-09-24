#!/usr/bin/env node
// 指定した話に関係する今のデータ(あらすじ・登場する固有名詞・関係する伏線)と未回収の伏線を表示する。
// AI が新しい話を読む前・直す前に、既存の記録と矛盾しないよう確認するために使う。
// 使い方: node tools/novel-note-context.mjs <正本.json> <話数 例: 12 15 21-40>
import { load } from './novel-note-lib.mjs';

const [base, ...specs] = process.argv.slice(2);
if (!base || !specs.length) { console.error('使い方: node tools/novel-note-context.mjs <正本.json> <話数...>'); process.exit(1); }
const d = load(base);
const eps = new Set(specs.flatMap((s) => { const [a, b] = s.split('-').map(Number); return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a]; }));
const out = {
  episodes: d.episodes.filter((e) => eps.has(e.no)),
  terms: d.terms.filter((t) => t.episodes.some((n) => eps.has(n))).map(({ episodes, ...t }) => t),
  threads: d.threads.filter((t) => [...t.setup, ...t.payoff].some((n) => eps.has(n))),
  openThreads: d.threads.filter((t) => ['open', 'partial', 'check'].includes(t.status)).map(({ id, title, status, kind, setup }) => ({ id, title, status, kind, setup })),
  termIndex: d.terms.map(({ id, name, aliases, category }) => ({ id, name, aliases, category })),
};
console.log(JSON.stringify(out, null, 1));
