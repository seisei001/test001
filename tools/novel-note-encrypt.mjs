#!/usr/bin/env node
// 小説設定ノート(docs/apps/novel-note)用のデータを暗号化してハブに置く。
// データは公開鍵で暗号化する。開けるのは、アプリで作った秘密鍵(パスワードで保護)を持つ端末だけ。
//
// データを開ける鍵は2つ:
//   - アプリ用: 利用者の公開鍵(RSA)。秘密鍵はパスワードで守られ、利用者の端末にある。
//   - 作業用: マスターキー(AES)。利用者の Google Drive「shousrtsu」の novel-note-master-key.json にだけ置く。
//     AI はこれで最新の正本データをハブから取り出し、更新して暗号化し直す。
//
// 使い方(Node 18 以降。追加パッケージ不要):
//   1. アプリの初回設定で表示された鍵(JSON)を登録する
//      node tools/novel-note-encrypt.mjs keys novel-note-keys.json
//   2. マスターキーを作る(最初の1回だけ。できたファイルは Drive にだけ置き、リポジトリに入れない)
//      node tools/novel-note-encrypt.mjs masterkey novel-note-master-key.json
//   3. 作品データ(format: novel-note の JSON)を暗号化して置く
//      node tools/novel-note-encrypt.mjs data n6924df.novelnote.json novel-note-master-key.json
//   4. ハブの暗号化データから正本データを取り出す
//      node tools/novel-note-encrypt.mjs decrypt n6924df novel-note-master-key.json 出力.json
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

async function masterKey(p) {
  const mk = load(p);
  if (mk.format !== 'novel-note-master-key') fail('マスターキーのファイルではありません');
  return crypto.subtle.importKey('raw', Buffer.from(mk.key, 'base64'), 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function createMasterKey(dest) {
  if (fs.existsSync(dest)) fail(`${dest} はすでにあります(上書きすると今のデータを開けなくなります)`);
  save(dest, { format: 'novel-note-master-key', version: 1, createdAt: new Date().toISOString(), key: b64(crypto.getRandomValues(new Uint8Array(32))) });
  console.log(`${dest} を作りました。Google Drive「shousrtsu」に置き、リポジトリには入れないでください。`);
}

async function decryptData(id, mkPath, dest) {
  const enc = load(path.join(DATA_DIR, `${id}.enc.json`));
  if (!enc.masterWrappedKey) fail('このデータにはマスターキーの鍵が付いていません(マスターキー導入前のデータ)');
  const wrapped = Buffer.from(enc.masterWrappedKey, 'base64');
  const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: wrapped.subarray(0, 12) }, await masterKey(mkPath), wrapped.subarray(12));
  const aes = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(enc.iv, 'base64') }, aes, Buffer.from(enc.ciphertext, 'base64'));
  fs.writeFileSync(dest, zlib.gunzipSync(Buffer.from(plain)).toString('utf8'));
  console.log(`${id} の正本データを取り出しました → ${dest}`);
}

async function encryptData(src, mkPath) {
  const data = load(src);
  if (data.format !== 'novel-note' || !data.work?.id) fail('小説設定ノートのデータ(format: novel-note)ではありません');
  const pub = await importPublic(load(path.join(DATA_DIR, 'keys.json')));
  const raw = Buffer.from(JSON.stringify(data));
  const aes = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, zlib.gzipSync(raw, { level: 9 }));
  const rawKey = await crypto.subtle.exportKey('raw', aes);
  const wrapped = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, rawKey);
  const miv = crypto.getRandomValues(new Uint8Array(12));
  const mwrapped = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: miv }, await masterKey(mkPath), rawKey);
  const id = data.work.id;
  const file = `${id}.enc.json`;
  save(path.join(DATA_DIR, file), {
    format: 'novel-note-enc', version: 1, workId: id,
    wrappedKey: b64(wrapped), masterWrappedKey: b64(Buffer.concat([Buffer.from(miv), Buffer.from(mwrapped)])),
    iv: b64(iv), ciphertext: b64(ct),
  });
  const idxPath = path.join(DATA_DIR, 'index.json');
  const idx = fs.existsSync(idxPath) ? load(idxPath) : { format: 'novel-note-index', version: 1, works: [] };
  idx.works = idx.works.filter((w) => w.id !== id);
  idx.works.push({ id, file, updatedAt: new Date().toISOString() });
  save(idxPath, idx);
  const c = data.coverage || {};
  console.log(`${file} を置きました(第${c.from}〜${c.to}話、${ct.byteLength.toLocaleString()} バイト)`);
}

const [mode, a1, a2, a3] = process.argv.slice(2);
if (mode === 'keys' && a1) await installKeys(a1);
else if (mode === 'masterkey' && a1) createMasterKey(a1);
else if (mode === 'data' && a1 && a2) await encryptData(a1, a2);
else if (mode === 'decrypt' && a1 && a2 && a3) await decryptData(a1, a2, a3);
else fail('使い方: node tools/novel-note-encrypt.mjs keys <鍵.json> | masterkey <出力> | data <データ.json> <マスターキー> | decrypt <作品id> <マスターキー> <出力>');
