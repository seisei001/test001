#!/usr/bin/env node
// 小説設定ノート(docs/apps/novel-note)用のデータを暗号化してハブに置く。
// データは公開鍵で暗号化する。開けるのは、アプリで作った秘密鍵(パスワードで保護)を持つ端末だけ。
//
// 使い方(Node 18 以降。追加パッケージ不要):
//   1. アプリの初回設定で表示された鍵(JSON)を登録する
//      node tools/novel-note-encrypt.mjs keys novel-note-keys.json
//   2. 作品データ(format: novel-note の JSON)を暗号化して置く
//      node tools/novel-note-encrypt.mjs data n6924df.novelnote.json
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { webcrypto as crypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DATA_DIR = process.env.NOVEL_NOTE_DATA_DIR
  || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'apps', 'novel-note', 'data');
const b64 = (buf) => Buffer.from(buf).toString('base64');
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj, null, 1) + '\n');
const fail = (msg) => { console.error(msg); process.exit(1); };

async function importPublic(keys) {
  return crypto.subtle.importKey('spki', Buffer.from(keys.publicKey, 'base64'), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
}

async function installKeys(src) {
  const keys = load(src);
  const need = ['publicKey', 'encPrivateKey', 'salt', 'iv', 'iterations'];
  if (keys.format !== 'novel-note-keys' || need.some((k) => !(k in keys))) fail('鍵のJSONではありません');
  await importPublic(keys); // 壊れていないか確認
  fs.mkdirSync(DATA_DIR, { recursive: true });
  save(path.join(DATA_DIR, 'keys.json'), keys);
  console.log('keys.json を置きました');
}

async function encryptData(src) {
  const data = load(src);
  if (data.format !== 'novel-note' || !data.work?.id) fail('小説設定ノートのデータ(format: novel-note)ではありません');
  const pub = await importPublic(load(path.join(DATA_DIR, 'keys.json')));
  const raw = Buffer.from(JSON.stringify(data));
  const aes = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, zlib.gzipSync(raw, { level: 9 }));
  const wrapped = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, await crypto.subtle.exportKey('raw', aes));
  const id = data.work.id;
  const file = `${id}.enc.json`;
  save(path.join(DATA_DIR, file), { format: 'novel-note-enc', version: 1, workId: id, wrappedKey: b64(wrapped), iv: b64(iv), ciphertext: b64(ct) });
  const idxPath = path.join(DATA_DIR, 'index.json');
  const idx = fs.existsSync(idxPath) ? load(idxPath) : { format: 'novel-note-index', version: 1, works: [] };
  idx.works = idx.works.filter((w) => w.id !== id);
  idx.works.push({ id, file, updatedAt: new Date().toISOString() });
  save(idxPath, idx);
  const c = data.coverage || {};
  console.log(`${file} を置きました(第${c.from}〜${c.to}話、${ct.byteLength.toLocaleString()} バイト)`);
}

const [mode, src] = process.argv.slice(2);
if (!src || !['keys', 'data'].includes(mode)) fail('使い方: node tools/novel-note-encrypt.mjs keys|data <ファイル>');
await (mode === 'keys' ? installKeys : encryptData)(src);
