// 小説設定ノートのデータ処理で共通に使う関数(Node 18 以降。追加パッケージ不要)
import fs from 'node:fs';
import crypto from 'node:crypto';

export const CATEGORIES = ['person', 'place', 'magic', 'thing'];
export const STATUSES = ['open', 'partial', 'resolved', 'contradiction', 'check', 'ok'];
export const KINDS = ['mystery', 'promise', 'inconsistency'];
export const EDIT_FIELDS = {
  episodes: ['summary'],
  terms: ['name', 'reading', 'aliases', 'description'],
  threads: ['title', 'summary', 'resolution', 'status', 'note'],
};

export const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
export const save = (p, obj, pretty = true) => fs.writeFileSync(p, JSON.stringify(obj, null, pretty ? 1 : 0) + '\n');
export const sha256 = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
export const pad3 = (n) => String(n).padStart(3, '0');

// なろうの「投稿済み作品テキストダウンロード」の本文ファイル(例: N6924DF.txt)を話ごとに分ける。
// 各話は「章見出し(ある話のみ)・話タイトル・前書き・本文・後書き」をつなげた文章にする。
export function splitNarouExport(text) {
  const src = text.replace(/\r\n/g, '\n').split('\n【免責事項】')[0];
  const parts = src.split(/^-+ エピソード(\d+)開始 -+\n/m);
  const hdr = /^【(第\d+章|エピソードタイトル|前書き|本文|後書き|リアクション)】\n/m;
  const episodes = [];
  let chapter = '';
  for (let i = 1; i < parts.length; i += 2) {
    const no = parseInt(parts[i], 10);
    const pieces = parts[i + 1].split(hdr);
    const sec = {};
    for (let k = 1; k < pieces.length; k += 2) {
      sec[pieces[k].startsWith('第') ? '章' : pieces[k]] = pieces[k + 1].replace(/^\n+|\n+$/g, '');
    }
    if (sec['章']) chapter = sec['章'].split('\n').pop().trim();
    const out = [];
    if (sec['章']) out.push(sec['章']);
    out.push(sec['エピソードタイトル'] || '');
    for (const key of ['前書き', '本文', '後書き']) if ((sec[key] || '').trim()) out.push(sec[key]);
    const body = out.join('\n\n').replace(/<i\d+\|\d+>/g, '[挿絵]').replace(/\s+$/, '') + '\n';
    episodes.push({ no, title: (sec['エピソードタイトル'] || '').trim(), chapter, chars: body.length, hash: sha256(body), body });
  }
  return episodes;
}

// 固有名詞が登場する話を数える(カタカナ名は前後がカタカナのときは別の語とみなす)
const isKata = (c) => (c >= '゠' && c <= 'ヿ') || c === 'ー';
export function countEpisodes(names, texts) {
  const list = [...new Set(names.filter(Boolean))].sort((a, b) => b.length - a.length);
  const hits = [];
  for (const [no, t] of texts) {
    let found = false;
    for (const nm of list) {
      const kata = [...nm].every((ch) => isKata(ch) || ch === '・');
      let from = 0;
      while (!found) {
        const a = t.indexOf(nm, from);
        if (a < 0) break;
        const b = a + nm.length;
        if (!(kata && ((a > 0 && isKata(t[a - 1])) || (b < t.length && isKata(t[b]))))) found = true;
        from = a + 1;
      }
      if (found) break;
    }
    if (found) hits.push(no);
  }
  return hits.sort((a, b) => a - b);
}
