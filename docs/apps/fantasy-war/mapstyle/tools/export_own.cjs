// 自作(sekai-hex/world.js)から1枚の世界を取り出し、六角マスごとの値をJSONで書く。
// 使い方: node export_own.cjs <seed> <出力json>
const S = require('../../../sekai-hex/world.js');
const seed = +process.argv[2], out = process.argv[3];
const t0 = process.hrtime.bigint(); const m0 = process.memoryUsage().heapUsed;
const w = S.generateWorld(seed);
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
if (w.failed) { console.error('failed', JSON.stringify(w.reasons)); process.exit(1); }
const N = w.biome.length, W = 60, H = 40, SPAN = 170, ROW = SPAN * Math.sqrt(3) / 2;
const x = [], y = [];
for (let i = 0; i < N; i++) { const c = i % W, r = (i / W) | 0; x.push((c + ((r & 1) ? 0.5 : 0)) * SPAN); y.push(r * ROW); }
const d = { W: (W + 0.5) * SPAN, H: (H - 1) * ROW, x, y, elev: Array.from(w.elev), land: Array.from(w.land), biome: Array.from(w.biome), cont: Array.from(w.cont || new Array(N).fill(1)), gen_ms: Math.round(ms), heap: Math.round((process.memoryUsage().heapUsed - m0) / 1e6) };
require('fs').writeFileSync(out, JSON.stringify(d));
console.log('own ok seed', seed, 'gen_ms', d.gen_ms, 'tried', w.tried);
