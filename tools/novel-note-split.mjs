#!/usr/bin/env node
// なろうの本文ファイルを1話ずつに分け、各話のハッシュ(指紋)を meta.json に書く。
// 使い方: node tools/novel-note-split.mjs N6924DF.txt <出力フォルダ>
import fs from 'node:fs';
import path from 'node:path';
import { splitNarouExport, save, pad3 } from './novel-note-lib.mjs';

const [src, outDir] = process.argv.slice(2);
if (!src || !outDir) { console.error('使い方: node tools/novel-note-split.mjs <N6924DF.txt> <出力フォルダ>'); process.exit(1); }
const eps = splitNarouExport(fs.readFileSync(src, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
for (const e of eps) fs.writeFileSync(path.join(outDir, `${pad3(e.no)}.txt`), e.body);
save(path.join(outDir, 'meta.json'), eps.map(({ body, ...m }) => m));
console.log(`${eps.length}話に分けました → ${outDir}`);
