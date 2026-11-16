'use strict';
// mapparts.js の動作確認。目的: 小さな仮の六角地図で、3部品が不変条件を満たし絵にして破綻しないかを見る。
// 使い方: node test_mapparts.js [svg出力先]
const MP = require('./mapparts.js');
const fs = require('fs');
const W = 70, H = 56, SEA = 20;

// 乱数(種固定)
let sd = 12345; const rnd = () => ((sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = (() => { // 値雑音を数重ねる
  const G = Array.from({ length: 5 }, () => Array.from({ length: 40 * 40 }, rnd));
  return (x, y) => {
    let v = 0, a = 1, tot = 0;
    for (let o = 0; o < 5; o++) {
      const f = 0.06 * 2 ** o, X = x * f, Y = y * f, x0 = Math.floor(X), y0 = Math.floor(Y), fx = X - x0, fy = Y - y0;
      const s = t => t * t * (3 - 2 * t), r = (i, j) => G[o][((i % 40) + 40) % 40 + (((j % 40) + 40) % 40) * 40];
      const m = r(x0, y0) * (1 - s(fx)) + r(x0 + 1, y0) * s(fx), n = r(x0, y0 + 1) * (1 - s(fx)) + r(x0 + 1, y0 + 1) * s(fx);
      v += (m * (1 - s(fy)) + n * s(fy)) * a; tot += a; a *= 0.5;
    }
    return v / tot;
  };
})();

// 六角格子(奇数行ずらし)
const n = W * H, id = (c, r) => r * W + c;
const g = { n, nb: [], x: new Float64Array(n), y: new Float64Array(n), h: new Float64Array(n), border: new Uint8Array(n),
  biome: new Uint8Array(n), culture: new Uint8Array(n), s: new Float64Array(n), t: new Int8Array(n),
  town: new Uint16Array(n), capital: new Uint8Array(n) };
const prec = new Float64Array(n);
for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
  const i = id(c, r); g.x[i] = c + (r % 2 ? 0.5 : 0); g.y[i] = r * 0.866;
  const off = r % 2 ? [[-1, 0], [1, 0], [0, -1], [1, -1], [0, 1], [1, 1]] : [[-1, 0], [1, 0], [-1, -1], [0, -1], [-1, 1], [0, 1]];
  g.nb[i] = off.map(([dc, dr]) => [c + dc, r + dr]).filter(([a, b]) => a >= 0 && a < W && b >= 0 && b < H).map(([a, b]) => id(a, b));
  g.border[i] = c === 0 || r === 0 || c === W - 1 || r === H - 1 ? 1 : 0;
  const dx = (c - W / 2) / (W / 2), dy = (r - H / 2) / (H / 2), fall = 1 - Math.min(1, Math.hypot(dx, dy) ** 1.6);
  g.h[i] = Math.max(0, Math.min(100, (noise(c, r) * 0.7 + fall * 0.55 - 0.2) * 130));
  prec[i] = 1 + noise(c + 300, r + 300) * 5;
}
for (let i = 0; i < n; i++) { // 海岸の段階
  if (g.h[i] >= SEA) { if (g.nb[i].some(c => g.h[c] < SEA)) g.t[i] = 1; else if (g.nb[i].some(c => g.t[c] === 1)) g.t[i] = 2; }
  else if (g.nb[i].some(c => g.h[c] >= SEA)) g.t[i] = -1;
}
const biomes = [{ hab: 0, cost: 0 }, { hab: 100, cost: 20 }, { hab: 80, cost: 40 }, { hab: 40, cost: 90 }, { hab: 0, cost: 5000 }];
for (let i = 0; i < n; i++) {
  const m = noise(g.x[i] + 500, g.y[i] + 500);
  g.biome[i] = g.h[i] < SEA ? 0 : g.h[i] > 80 ? 4 : g.h[i] > 62 ? 3 : m > 0.5 ? 2 : 1;
}

// 川
let t0 = Date.now();
const rivers = MP.makeRivers(g, prec);
const tRiver = Date.now() - t0;

// 適地度(自作側の簡易版: 住みやすさ+川+低さ+海岸)
const maxFl = Math.max(...g.fl);
for (let i = 0; i < n; i++) {
  if (g.h[i] < SEA) continue;
  let sc = biomes[g.biome[i]].hab; if (!sc) continue;
  sc += (g.fl[i] / maxFl) * 250 - (g.h[i] - 50) / 5 + (g.t[i] === 1 ? 5 : 0);
  g.s[i] = sc / 5;
}
// 街: 適地度の高い順に、間隔を空けて置く。最初の6つが首都。
const order = [...Array(n).keys()].filter(i => g.s[i] > 0).sort((a, b) => g.s[b] - g.s[a]);
const towns = [], cultureCenters = [];
for (const i of order) {
  const minDist = towns.length < 6 ? 14 : 5;
  if (towns.some(j => Math.hypot(g.x[i] - g.x[j], g.y[i] - g.y[j]) < minDist)) continue;
  towns.push(i); g.town[i] = towns.length; if (towns.length <= 6) { g.capital[i] = 1; cultureCenters.push(i); }
  if (towns.length >= 40) break;
}
for (let i = 0; i < n; i++) { // 文化 = 最も近い首都
  let b = 0, bd = 1e9; cultureCenters.forEach((c, k) => { const d = Math.hypot(g.x[i] - g.x[c], g.y[i] - g.y[c]); if (d < bd) { bd = d; b = k; } });
  g.culture[i] = b + 1;
}

// 国境
const states = cultureCenters.map((c, k) => ({ id: k + 1, center: c, culture: k + 1, type: 'Generic', expansionism: 1 + k * 0.1 }));
t0 = Date.now(); MP.expandStates(g, states, biomes, { growthRate: 3 }); MP.normalizeStates(g); const tState = Date.now() - t0;

// 道
t0 = Date.now(); const roads = MP.makeRoads(g, biomes); const tRoad = Date.now() - t0;

// ---- 検査 ----
const res = []; const ok = (name, cond, info = '') => { res.push([cond ? 'OK ' : 'NG ', name, info]); };
const hf = g.hFilled;
ok('川が1本以上ある', rivers.length > 0, rivers.length + '本');
let bad = 0, notEnd = 0;
for (const rv of rivers) {
  const cs = rv.cells.filter(c => c >= 0);
  for (let k = 1; k < cs.length; k++) if (hf[cs[k]] > hf[cs[k - 1]] + 1e-9) { bad++; break; } // 下る一方か
  const last = rv.cells[rv.cells.length - 1], pen = rv.cells[rv.cells.length - 2];
  const endsOk = last === -1 || hf[last] < SEA || (g.r[last] && g.r[last] !== rv.id) || g.conf[last] > 0 || g.nb[last].some(c => hf[c] < SEA) || g.border[last];
  if (!endsOk) notEnd++;
}
ok('どの川も下る一方', bad === 0, '違反 ' + bad);
ok('どの川も海・縁・他の川で終わる', notEnd === 0, '違反 ' + notEnd);
ok('川は水の上に引かれない', rivers.every(rv => rv.cells.every(c => c < 0 || hf[c] >= SEA || c === rv.cells[rv.cells.length - 1] || c === rv.cells[rv.cells.length - 2])), '');
const maxRiverFlux = Math.max(...Array.from(g.fl)); ok('流量が下流ほど増える(最大流量が源流より大きい)', rivers.some(rv => g.fl[rv.mouth] > g.fl[rv.source]), 'max ' + maxRiverFlux.toFixed(0));
ok('首都は自国に属する', states.every(s => g.state[s.center] === s.id), '');
ok('国のマスはすべて陸(水は国を持たない)', Array.from(g.state).every((s, i) => !s || g.h[i] >= SEA), '');
const comp = (sid) => { const cells = []; for (let i = 0; i < n; i++) if (g.state[i] === sid) cells.push(i); if (!cells.length) return [0, 0]; const seen = new Set([cells[0]]), st = [cells[0]]; while (st.length) { const c = st.pop(); for (const m of g.nb[c]) if (g.state[m] === sid && !seen.has(m)) { seen.add(m); st.push(m); } } return [cells.length, seen.size]; };
const comps = states.map(s => comp(s.id)); const cut = comps.reduce((a, [t, c]) => a + (t - c), 0);
ok('国はほぼ一つながり(飛び地が全体の2%未満)', cut / Math.max(1, comps.reduce((a, [t]) => a + t, 0)) < 0.02, comps.map(c => c.join('/')).join(' ') + ' 飛び地計' + cut);
ok('国ごとに陸の何割かを持つ', states.every(s => comp(s.id)[0] > 20), comps.map(c => c[0]).join(','));
const lowHab = i => g.s[i] > 0 && g.h[i] < 67; // 高山(67以上)は費用が大きく、元の規則でも国境の外に残りやすい
const habitable = Array.from(g.s).filter((v, i) => lowHab(i)).length;
const unowned = Array.from(g.state).filter((s, i) => !s && lowHab(i)).length;
ok('平地・丘の住める陸の無所属が1割未満', unowned < 0.1 * habitable, '無所属 ' + unowned + ' / 住める陸 ' + habitable);
ok('道が引かれる', roads.length > 0, roads.length + '区間');
ok('道のマスはすべて陸', roads.every(rd => rd.cells.every(c => g.h[c] >= SEA)), '');
const mass = g.mass; const capsByMass = {}; for (const c of cultureCenters) (capsByMass[mass[c]] ||= []).push(c);
const adj = new Map(); const link = (a, b) => { (adj.get(a) || adj.set(a, new Set()).get(a)).add(b); (adj.get(b) || adj.set(b, new Set()).get(b)).add(a); };
for (const rd of roads) for (let k = 0; k + 1 < rd.cells.length; k++) link(rd.cells[k], rd.cells[k + 1]);
const reach = (s) => { const seen = new Set([s]), st = [s]; while (st.length) { const c = st.pop(); for (const m of adj.get(c) || []) if (!seen.has(m)) { seen.add(m); st.push(m); } } return seen; };
let disc = 0; for (const list of Object.values(capsByMass)) { const rs = reach(list[0]); for (const c of list) if (!rs.has(c)) disc++; }
ok('同じ陸地の首都どうしが道でつながる', disc === 0, '不通 ' + disc);
const townsByMass = {}; for (const c of towns) (townsByMass[mass[c]] ||= []).push(c);
let discT = 0; for (const list of Object.values(townsByMass)) { const rs = reach(list[0]); for (const c of list) if (!rs.has(c)) discT++; }
ok('同じ陸地の街どうしが道でつながる', discT === 0, '不通 ' + discT);
// Urquhart: 辺数は 3点なら2, 一般に 点数-1 以上 3点数 未満
const P = towns.map(c => [g.x[c], g.y[c]]); const ue = MP.urquhartEdges(P);
ok('Urquhart網の辺数が妥当', ue.length >= P.length - 1 && ue.length < 3 * P.length, P.length + '点 ' + ue.length + '辺');

console.log(res.map(r => r.join(' ')).join('\n'));
console.log(`\n所要(ms): 川${tRiver} 国境${tState} 道${tRoad} / マス${n} 街${towns.length} 川${rivers.length} 道区間${roads.length}`);
const fails = res.filter(r => r[0] === 'NG ').length; console.log(fails ? `NG ${fails}件` : '全項目 OK');

// ---- 絵(SVG) ----
const out = process.argv[2];
if (out) {
  const sc = 14, pal = ['#cdb', '#e8a0a0', '#e8c060', '#a8d890', '#d0a8e0', '#f0a070', '#c8c8a0'];
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * sc + 20}" height="${H * sc * 0.866 + 20}"><rect width="100%" height="100%" fill="#9cc4e0"/>`;
  for (let i = 0; i < n; i++) {
    if (g.h[i] < SEA) continue; const cx = g.x[i] * sc + 10, cy = g.y[i] * sc + 10, st = g.state[i];
    const sh = Math.floor(255 - g.h[i] * 1.2); const col = st ? pal[st] : '#ddd';
    let pts = ''; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; pts += `${(cx + Math.cos(a) * sc * 0.58).toFixed(1)},${(cy + Math.sin(a) * sc * 0.58).toFixed(1)} `; }
    s += `<polygon points="${pts}" fill="${col}" opacity="${(0.55 + g.h[i] / 220).toFixed(2)}" stroke="${col}" stroke-width="0.5"/>`;
  }
  const line = (cells, color, w) => { const pts = cells.filter(c => c >= 0).map(c => `${(g.x[c] * sc + 10).toFixed(1)},${(g.y[c] * sc + 10).toFixed(1)}`).join(' '); return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`; };
  for (const rv of rivers) s += line(rv.cells, '#3a7bd5', Math.min(4, 1 + Math.log10(Math.max(1, g.fl[rv.mouth])) * 0.8));
  for (const rd of roads) s += line(rd.cells, rd.group === 'road' ? '#5a3a1a' : '#8a6a4a', rd.group === 'road' ? 2.2 : 1);
  for (const c of towns) s += `<circle cx="${g.x[c] * sc + 10}" cy="${g.y[c] * sc + 10}" r="${g.capital[c] ? 6 : 3}" fill="${g.capital[c] ? '#c22' : '#222'}" stroke="#fff" stroke-width="1"/>`;
  s += '</svg>'; fs.writeFileSync(out, s);
}
process.exit(fails ? 1 : 0);
