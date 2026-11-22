// 球体の世界を作り、全周を緯度経度の長方形(1400×700)に展開して書き出す検証用。
import { writeFileSync } from 'node:fs';
import { Pipeline } from '../src/gen/pipeline';
import { STAGES } from '../src/gen/stages';
import { resolve } from '../src/shared/config/resolve';
import { dirToCell, latLonDir, surfaceLatLon } from '../src/shared/cube';
const seed = Number(process.argv[2]); const pins = JSON.parse(process.argv[3] || '{}'); const out = process.argv[4];
const resolved = resolve({ seed, archetype: 'earth', pins: { worldShape: 'sphere', ...pins } } as any);
const t0 = Date.now(); const p = new Pipeline(STAGES); let err = '';
await p.run(resolved, 'build', 1, (m: any) => { if (m.type === 'error') err = m.message; }, () => false);
if (err) throw new Error(err);
const hy: any = p.output('hydro')!.extra, bi: any = p.output('biome')!.extra, n = hy.n;
const W = 1400, H = 700, el = new Float32Array(W * H), bio = new Uint8Array(W * H), wc = new Uint8Array(W * H); const d = new Float64Array(3);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { latLonDir(90 - (y + .5) * 180 / H, (x + .5) * 360 / W - 180, d); const c = dirToCell(d[0], d[1], d[2], n); el[y * W + x] = hy.elevation[c]; bio[y * W + x] = bi.biome[c]; wc[y * W + x] = hy.waterClass[c]; }
const w = (nm: string, a: ArrayBufferView) => writeFileSync(`${out}_${nm}.bin`, Buffer.from(a.buffer, a.byteOffset, a.byteLength));
w('elev', el); w('biome', bio); w('water', wc);

// 川・湖: 細い川を拾えるよう縦横2倍(2800x1400)で標本を取る。流量は川のセルだけ大きいので、後で2x2の最大値にまとめる
const W2 = 2800, H2 = 1400, dis = new Float32Array(W2 * H2), lk = new Int32Array(W2 * H2); const d2 = new Float64Array(3);
for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { latLonDir(90 - (y + .5) * 180 / H2, (x + .5) * 360 / W2 - 180, d2); const c = dirToCell(d2[0], d2[1], d2[2], n); dis[y * W2 + x] = hy.discharge[c]; lk[y * W2 + x] = hy.lakeId[c]; }
w('disch', dis); w('lake', lk);

// 川の線データ(PWGの川の網: 蛇行・合流・三角州つき)。節点の緯度経度・幅・流量・ストラーラー順位・下流の節点
const rg: any = p.output('hydro')!.vectors!.rivers; const radiusM = hy.cellKm * 1000 * n * 2 / Math.PI; const ll = new Float64Array(2);
const rlon = new Float32Array(rg.n), rlat = new Float32Array(rg.n);
for (let i = 0; i < rg.n; i++) { surfaceLatLon(rg.face[i], rg.x[i], rg.y[i], radiusM, ll); rlat[i] = ll[0]; rlon[i] = ll[1]; }
w('rlon', rlon); w('rlat', rlat); w('rq', rg.q); w('rwidth', rg.width); w('rstr', rg.strahler); w('rdown', rg.down); w('rflags', rg.flags);
console.log(JSON.stringify({ riverNodes: rg.n, reaches: rg.reachStart.length, maxStrahler: Math.max(...rg.strahler) }));
let land = 0; for (let i = 0; i < wc.length; i++) if (wc[i] !== 0) land++;
console.log(JSON.stringify({ seed, n, W, H, ms: Date.now() - t0, planetKm: resolved.values.planetSize, landFracEquirect: +(land / wc.length).toFixed(3), values: { landFraction: resolved.values.landFraction, continentCount: resolved.values.continentCount } }));
