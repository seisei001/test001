'use strict';
// 自動生成: build/build_world.js が work/exp/world から作る。直接編集しない。
const SekaiWorld=(function(){
const R=(function(){
// 種から決まる乱数と雑音。同じ種なら同じ結果(再現性)。段階ごとに別の流れを使う。
function hash32(a, b, c, d) {
  let h = 0x811c9dc5 ^ (a | 0);
  for (const v of [b | 0, c | 0, d | 0]) {
    h = Math.imul(h ^ v, 0x01000193);
    h ^= h >>> 15; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13;
  }
  return h >>> 0;
}
function strHash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// 段階名つきの乱数流れ: stream(seed, 'plates', attempt)
function stream(seed, name, salt = 0) { return mulberry32(hash32(seed, strHash(name), salt, 7)); }
// 値雑音(格子点の乱数を滑らかに補間)。x,y は任意の実数(km を単位あたりで割って渡す)
function vnoise(seed, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const s = t => t * t * (3 - 2 * t);
  const r = (i, j) => hash32(seed, i, j, 99) / 4294967296;
  const a = r(x0, y0), b = r(x0 + 1, y0), c = r(x0, y0 + 1), d = r(x0 + 1, y0 + 1);
  const u = s(fx), v = s(fy);
  return (a + (b - a) * u) + ((c + (d - c) * u) - (a + (b - a) * u)) * v;
}
function fbm(seed, x, y, oct = 4) {
  let amp = 0.5, f = 1, sum = 0, norm = 0;
  for (let o = 0; o < oct; o++) { sum += amp * vnoise(seed + o * 101, x * f, y * f); norm += amp; amp *= 0.5; f *= 2; }
  return sum / norm; // 0..1
}
return { hash32, strHash, mulberry32, stream, vnoise, fbm };
})();
const G=(function(){
// 世界層のマス格子。設計が依存するのは次の3つだけ。
//   N          マス数
//   nb(i,d)    マス i の方向 d(0..5)の隣。無ければ -1。 d の反対は (d+3)%6
//   pos(i)     マス中心の位置(km)。 方向 0 を「東」とし、60度刻みで反時計回りに 1..5
// 六角形の並べ方は決めない。下の実装は「実験用の仮アダプタ」で、別方式に差し替えても上のコードは変わらない。
const W = 60, H = 40;
const SPAN_KM = 170; // 隣のマス中心までの距離
const N = W * H;
const ROW_KM = SPAN_KM * Math.sqrt(3) / 2;
const idx = (c, r) => r * W + c;
const colOf = i => i % W, rowOf = i => (i / W) | 0;
// 仮アダプタ: 行ごとに半マスずらす並べ方(odd-r)
const EVEN = [[1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
const ODD = [[1, 0], [1, -1], [0, -1], [-1, 0], [0, 1], [1, 1]];
const NB = new Int32Array(N * 6);
for (let i = 0; i < N; i++) {
  const c = colOf(i), r = rowOf(i), t = (r & 1) ? ODD : EVEN;
  for (let d = 0; d < 6; d++) {
    const cc = c + t[d][0], rr = r + t[d][1];
    NB[i * 6 + d] = (cc < 0 || cc >= W || rr < 0 || rr >= H) ? -1 : idx(cc, rr);
  }
}
const nb = (i, d) => NB[i * 6 + d];
const px = i => (colOf(i) + ((rowOf(i) & 1) ? 0.5 : 0)) * SPAN_KM;
const py = i => rowOf(i) * ROW_KM;
const pos = i => [px(i), py(i)];
const dist = (a, b) => Math.hypot(px(a) - px(b), py(a) - py(b));
const WIDTH_KM = (W + 0.5) * SPAN_KM, HEIGHT_KM = (H - 1) * ROW_KM;
// 辺は「小さい方向だけ」数える: 方向 0,1,2 を各マスが所有(重複なし)
const OWN_DIRS = [0, 1, 2];
return { W, H, N, SPAN_KM, ROW_KM, nb, pos, px, py, dist, rowOf, colOf, idx, WIDTH_KM, HEIGHT_KM, OWN_DIRS };
})();
// 世界層の生成: 種 -> プレート -> 造山帯 -> 高さ -> 7大陸 -> 気候(風・海流・降水) -> 川 -> 岩石 -> 肥沃度
// 六角形の並べ方には依存しない(grid.js の nb / pos だけを使う)。
const { N, nb, px, py, rowOf, colOf, W, H } = G;

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ---- 区分コード(絵と計算の両方で使う) ----
const BIOME = ['海', '氷雪', 'ツンドラ', '亜寒帯林', '寒冷草原', '砂漠', '温暖草原', '地中海性', '温帯林', '温帯海洋林', 'サバナ', '熱帯雨林', '高山'];
const ROCK = ['海洋地殻', '結晶質基盤', '堆積岩', '石灰岩', '火山岩', '変成褶曲岩', '沖積土'];
const TEC = ['なし', '衝突造山', '大陸縁の火山弧', '島弧', 'リフト', '海嶺', '海溝', 'ホットスポット', '古期造山帯'];
const ORE = ['鉄', '銅金', '石炭', '塩'];

// ---- 小道具: 方向と距離 ----
function bfsDist(sources, passable) {
  const d = new Int16Array(N).fill(-1), q = [];
  for (const s of sources) { d[s] = 0; q.push(s); }
  for (let h = 0; h < q.length; h++) {
    const c = q[h];
    for (let k = 0; k < 6; k++) { const j = nb(c, k); if (j >= 0 && d[j] < 0 && (!passable || passable(j))) { d[j] = d[c] + 1; q.push(j); } }
  }
  return d;
}
function components(mask) {
  const id = new Int16Array(N).fill(-1), comps = [];
  for (let s = 0; s < N; s++) {
    if (!mask[s] || id[s] >= 0) continue;
    const list = [s]; id[s] = comps.length;
    for (let h = 0; h < list.length; h++) for (let k = 0; k < 6; k++) { const j = nb(list[h], k); if (j >= 0 && mask[j] && id[j] < 0) { id[j] = comps.length; list.push(j); } }
    comps.push(list);
  }
  return { id, comps };
}

// ---- 1. プレートと高さ ----
function buildTectonics(seed, attempt) {
  const rnd = R.stream(seed, 'plates', attempt);
  const pts = [];
  const place = (isCont) => {
    const m = isCont ? 3 * G.SPAN_KM : 0; let best = null, bd = -1;
    for (let t = 0; t < 40; t++) {
      const x = m + rnd() * (G.WIDTH_KM - 2 * m), y = m + rnd() * (G.HEIGHT_KM - 2 * m);
      let md = 1e9; for (const p of pts) md = Math.min(md, Math.hypot(p.x - x, p.y - y) / p.w);
      if (md > bd) { bd = md; best = { x, y }; }
    }
    const ang = rnd() * Math.PI * 2, sp = 0.3 + rnd() * 0.7;
    pts.push({ ...best, cont: isCont, w: isCont ? 0.9 + rnd() * 0.4 : 1.0 + rnd() * 0.5, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, age: rnd() });
  };
  for (let k = 0; k < 7; k++) place(true);
  for (let k = 0; k < 7; k++) place(false);
  // 大陸の素の半径(マス数)。近い大陸の中心までの距離の45%を上限にして、勝手に繋がらないようにする
  const cs = pts.filter(p => p.cont);
  for (const p of cs) {
    let nd = 1e9; for (const q of cs) if (q !== p) nd = Math.min(nd, Math.hypot(p.x - q.x, p.y - q.y));
    const want = 5.2 + 5.6 * Math.pow(rnd(), 1.3);
    p.rc = Math.min(want, 0.46 * nd / G.SPAN_KM);
    p.axis = rnd() * Math.PI; p.ratio = 0.6 + 0.4 * rnd();
    // 古い造山帯(大陸内部の山脈): 中心の周りに折れ線を1〜2本
    p.belts = [];
    const nbelt = rnd() < 0.8 ? (rnd() < 0.4 ? 2 : 1) : 0;
    for (let b = 0; b < nbelt; b++) {
      const a0 = rnd() * 6.28, a1 = a0 + 2.2 + rnd() * 1.6, r0 = 0.15 + 0.45 * rnd(), r1 = 0.15 + 0.45 * rnd(), rm = 0.2 + 0.5 * rnd(), am = (a0 + a1) / 2 + (rnd() - 0.5);
      const P = (a, r) => ({ x: p.x + Math.cos(a) * r * p.rc * G.SPAN_KM, y: p.y + Math.sin(a) * r * p.rc * G.SPAN_KM });
      p.belts.push([P(a0, r0), P(am, rm), P(a1, r1)]);
    }
  }
  const wseed = R.hash32(seed, 11, attempt, 1);
  const plate = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const x = px(i) + (R.fbm(wseed, px(i) / 1100, py(i) / 1100, 3) - 0.5) * 1000;
    const y = py(i) + (R.fbm(wseed + 5, px(i) / 1100, py(i) / 1100, 3) - 0.5) * 1000;
    let b = 0, bd = 1e18;
    for (let p = 0; p < pts.length; p++) { const d = Math.hypot(pts[p].x - x, pts[p].y - y) / pts[p].w; if (d < bd) { bd = d; b = p; } }
    plate[i] = b;
  }
  // プレート境界と、そこでの相対運動(近づく/離れる/ずれる)
  const bsrc = []; const isB = new Uint8Array(N);
  const eff = new Float32Array(N), tec = new Uint8Array(N);
  const apply = (i, R_, amp, type) => { // 境界マス i から R_ マス以内に影響を広げる(強い方を採用)
    const d = new Int16Array(0); void d;
    const seen = new Map([[i, 0]]); const q = [i];
    for (let h = 0; h < q.length; h++) {
      const c = q[h], dc = seen.get(c);
      const v = amp * (1 - dc / (R_ + 1));
      if (Math.abs(v) > Math.abs(eff[c])) { eff[c] = v; tec[c] = type; }
      if (dc < R_) for (let k = 0; k < 6; k++) { const j = nb(c, k); if (j >= 0 && !seen.has(j)) { seen.set(j, dc + 1); q.push(j); } }
    }
  };
  for (let i = 0; i < N; i++) for (let k = 0; k < 6; k++) {
    const j = nb(i, k); if (j < 0 || plate[j] === plate[i]) continue;
    isB[i] = 1;
    const A = pts[plate[i]], B = pts[plate[j]];
    const nx = px(j) - px(i), ny = py(j) - py(i), nl = Math.hypot(nx, ny);
    let conv = ((A.vx - B.vx) * nx + (A.vy - B.vy) * ny) / nl; // 正=近づく
    // 大陸どうしの衝突(合体)は全体の2割の組だけに限る。残りは離れる/ずれる側に倒す(大陸が7つ別々に残るため)
    if (A.cont && B.cont) { const lo = Math.min(plate[i], plate[j]), hi = Math.max(plate[i], plate[j]); if ((R.hash32(seed, lo, hi, attempt) % 100) >= 20) conv = -Math.abs(conv) - 0.1; }
    const jit = (R.hash32(seed, i, plate[j], attempt) % 1000) / 1000; // 境界の場所ごとのゆらぎ
    if (conv > 0.25) {
      if (A.cont && B.cont) apply(i, 4, 1.0 * (0.8 + 0.4 * jit), 1);
      else if (A.cont && !B.cont) apply(i, 3, 0.5 * (0.7 + 0.6 * jit), 2);
      else if (!A.cont && B.cont) apply(i, 2, -0.45, 6);
      else if (plate[i] > plate[j]) apply(i, 2, 0.7 * (0.6 + 0.8 * jit), 3);
      else apply(i, 2, -0.4, 6);
    } else if (conv < -0.25) {
      if (A.cont && B.cont) apply(i, 2, -0.14, 4);
      else if (!A.cont && !B.cont) apply(i, 3, 0.28, 5);
    } else if (A.cont === B.cont) apply(i, 1, 0.12 * (0.5 + jit), 0);
  }
  const dEdge = bfsDist(Array.from({ length: N }, (_, i) => i).filter(i => isB[i]));
  return { pts, plate, eff, tec, dEdge };
}

function buildHeight(seed, attempt, T) {
  const { pts, plate, eff, dEdge } = T;
  const s1 = R.hash32(seed, 21, attempt, 0), s2 = R.hash32(seed, 22, attempt, 0);
  const rnd = R.stream(seed, 'hotspot', attempt);
  const hs = [];
  for (let k = 0; k < 2; k++) {
    const x = rnd() * G.WIDTH_KM, y = rnd() * G.HEIGHT_KM, a = rnd() * 6.28;
    for (let t = 0; t < 4; t++) hs.push({ x: x + Math.cos(a) * 190 * t, y: y + Math.sin(a) * 190 * t, a: 0.55 - 0.1 * t });
  }
  const h = new Float32Array(N), tec = T.tec.slice();
  for (let i = 0; i < N; i++) {
    const x = px(i), y = py(i), p = pts[plate[i]], de = dEdge[i];
    let b;
    // 大陸プレート: 中心の周りの楕円形の塊(縁は海へなだらかに沈む)。それ以外は海底。
    if (p.cont) {
      const dx = x - p.x, dy = y - p.y, ca = Math.cos(p.axis), sa = Math.sin(p.axis);
      const u = (dx * ca + dy * sa), v = (-dx * sa + dy * ca) * (1 / p.ratio);
      const wx = (R.fbm(s1 + 3, x / 1300, y / 1300, 3) - 0.5) * 0.8;
      const d = Math.hypot(u, v) / (p.rc * G.SPAN_KM) * (1 + wx);
      b = 0.22 - 0.67 * sstep(0.45, 1.0, d) - 0.2 * sstep(1.0, 1.6, d);
      for (const bl of p.belts) { // 古い造山帯
        let md = 1e9; for (let k = 0; k < 2; k++) { const A = bl[k], B = bl[k + 1]; const abx = B.x - A.x, aby = B.y - A.y; const t = clamp(((x - A.x) * abx + (y - A.y) * aby) / (abx * abx + aby * aby), 0, 1); md = Math.min(md, Math.hypot(x - A.x - abx * t, y - A.y - aby * t)); }
        const v2 = 0.46 * Math.exp(-Math.pow(md / 260, 2)) * (b > 0 ? 1 : 0.3);
        if (v2 > 0.1) { b += v2; if (!tec[i]) tec[i] = 8; }
      }
    } else b = -0.55 - 0.1 * Math.min(de, 4) / 4 + 0.1 * Math.max(0, 1 - de / 2);
    if (p.cont && b < 0) b = Math.max(b, -0.5);
    b += (R.fbm(s1, x / 1500, y / 1500, 4) - 0.5) * 0.30;
    b += eff[i];
    for (const q of hs) { const d = Math.hypot(q.x - x, q.y - y); const v = q.a * Math.exp(-Math.pow(d / 230, 2)); if (v > 0.12) { b += v; if (!tec[i] || v > 0.2) tec[i] = 7; } }
    const ed = Math.min(colOf(i), W - 1 - colOf(i), rowOf(i), H - 1 - rowOf(i));
    b -= 0.45 * Math.pow(Math.max(0, 1 - ed / 3), 1.5);
    h[i] = b;
  }
  return { h, tec };
}

// ---- 2. 7大陸の判定(足りなければ作り直す) ----
function judge(land) {
  const { id, comps } = components(land);
  const order = comps.map((c, k) => k).sort((a, b) => comps[b].length - comps[a].length || a - b);
  const sizes = order.map(k => comps[k].length);
  const total = sizes.reduce((a, b) => a + b, 0);
  const why = [];
  if (sizes.length < 7 || sizes[6] < 20) why.push('大陸が7つに満たない');
  else {
    const [a1, a2, a3, a4] = sizes;
    if (Math.abs(a2 - a3) / a3 < 0.06 || Math.abs(a3 - a4) / a3 < 0.06) why.push('3番目が紛らわしい(上下と6%未満の差)');
    if (a3 < 70 || a3 > 230) why.push('3番目の広さが範囲外');
    if (a1 > 0.42 * total) why.push('最大大陸が大きすぎる');
  }
  let edgeTouch = 0;
  if (!why.length) for (const i of comps[order[2]]) if (Math.min(colOf(i), W - 1 - colOf(i), rowOf(i), H - 1 - rowOf(i)) === 0) edgeTouch++;
  if (edgeTouch > 2) why.push('3番目が世界の端に接する');
  const fr = total / N; if (fr < 0.2 || fr > 0.38) why.push('陸の割合が範囲外(' + fr.toFixed(2) + ')');
  return { ok: why.length === 0, why, order, comps, sizes, id };
}

function buildLandSea(seed, attempt) {
  const T = buildTectonics(seed, attempt);
  const { h, tec } = buildHeight(seed, attempt, T);
  const sl = 0; // 海面の基準は固定。陸の割合は結果として決まり、範囲外なら作り直す
  const land = new Uint8Array(N);
  for (let i = 0; i < N; i++) land[i] = h[i] > sl ? 1 : 0;
  const frac = land.reduce((a, b) => a + b, 0) / N;
  return { T, h, tec, sl, land, frac };
}

// ---- 3. 本体 ----
function build(seed, attempt) {
  const L = buildLandSea(seed, attempt);
  const J = judge(L.land);
  return { L, J };
}

function generateWorld(seed, opts = {}) {
  const maxTry = opts.maxTry || 60;
  let tried = 0, L, J, reasons = {};
  for (let a = 0; a < maxTry; a++) {
    const r = build(seed, a); tried = a + 1; L = r.L; J = r.J;
    if (J.ok) return finish(seed, a, L, J, tried, reasons);
    for (const w of J.why) reasons[w] = (reasons[w] || 0) + 1;
  }
  return { failed: true, seed, tried, reasons };
}

function finish(seed, attempt, L, J, tried, reasons) {
  const { h, tec, sl, land, T } = L;
  const w = { seed, attempt, tried, rejectReasons: reasons, N, W, H };
  w.plate = T.plate; w.plates = T.pts.map((p, k) => ({ id: k, continental: p.cont, vx: +p.vx.toFixed(2), vy: +p.vy.toFixed(2), age: +p.age.toFixed(2) }));
  w.tec = tec; w.uplift = Float32Array.from(T.eff); w.land = land; w.seaLevelRaw = sl;
  // 高さ(m)
    w.elev = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    if (land[i]) w.elev[i] = Math.min(8000, 5400 * Math.pow(h[i] - sl, 1.25)) + 5;
    else w.elev[i] = -Math.min(11000, 80 + 6500 * (sl - h[i]));
  }
  // 大陸番号: 1..7 = 面積順、 8 = 島、 0 = 海
  w.cont = new Uint8Array(N);
  w.contSize = [];
  J.order.forEach((k, rank) => { for (const i of J.comps[k]) w.cont[i] = rank < 7 ? rank + 1 : 8; if (rank < 7) w.contSize.push(J.comps[k].length); });
  w.landCells = land.reduce((a, b) => a + b, 0);
  w.thirdCells = J.comps[J.order[2]].slice().sort((a, b) => a - b);
  climate(w);
  rivers(w);
  rocks(w);
  fertility(w);
  initialState(w);
  return w;
}

// ---- 4. 気候: 緯度・風・海流・降水 ----
const T0 = lat => 27 - 0.00778 * lat * lat;
const capT = t => 0.25 + 0.75 * Math.pow(clamp((t + 10) / 40, 0, 1), 1.3);
function climate(w) {
  const { land, elev } = w, seed = w.seed;
  const rl = R.stream(seed, 'lat', 0);
  const latS = -8 + 20 * rl(); w.latS = +latS.toFixed(1);
  const lat = new Float32Array(N); for (let i = 0; i < N; i++) lat[i] = latS + (G.HEIGHT_KM - py(i)) / 111.2; // 上が北
  w.lat = lat;
  const absLat = i => Math.abs(lat[i]);
  // 風(行ごと): 0..30 貿易風(西へ) / 30..60 偏西風(東へ) / 60.. 極東風(西へ)。向きは 方向0=東, 方向3=西
  const windE = i => { const a = absLat(i); return a >= 30 && a < 60; };
  w.windToEast = new Uint8Array(N); for (let i = 0; i < N; i++) w.windToEast[i] = windE(i) ? 1 : 0;
  // 海流(海のマス): 亜熱帯循環の西縁=暖流、東縁=寒流。亜寒帯循環はその逆。
  const cur = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    if (land[i]) continue;
    const a = absLat(i); let c = 0;
    const sub = a >= 12 && a < 42, pol = a >= 42 && a < 66;
    if (!sub && !pol) continue;
    let westLand = 0, eastLand = 0;
    for (let k = 1; k <= 4; k++) {
      let j = i; for (let t = 0; t < k; t++) { j = nb(j, 3); if (j < 0) break; }
      if (j >= 0 && land[j]) { westLand = 1 - (k - 1) / 4; break; }
    }
    for (let k = 1; k <= 4; k++) {
      let j = i; for (let t = 0; t < k; t++) { j = nb(j, 0); if (j < 0) break; }
      if (j >= 0 && land[j]) { eastLand = 1 - (k - 1) / 4; break; }
    }
    c = sub ? (westLand - eastLand) : (eastLand - westLand);
    cur[i] = c;
  }
  w.current = cur;
  const dsea = bfsDist(Array.from({ length: N }, (_, i) => i).filter(i => !land[i]), j => land[j]);
  w.dsea = dsea;
  const temp = new Float32Array(N), amp = new Float32Array(N), precip = new Float32Array(N), curA_ = new Float32Array(N);
  const jit = R.fbm(R.hash32(seed, 31, 0, 0), 0, 0, 1);
  for (let r = 0; r < H; r++) {
    const east = windE(r * W);
    const order = []; for (let c = 0; c < W; c++) order.push(r * W + c);
    if (east) { /* 西から東へ処理 */ } else order.reverse();
    let m = 0.85, curA = 0, prevE = null, prevLand = false;
    for (const i of order) {
      const a = absLat(i);
      const tBase = T0(a) + (R.fbm(R.hash32(seed, 32, 0, 0), px(i) / 2500, py(i) / 2500, 2) - 0.5) * 2.5 + (jit - 0.5);
      if (!land[i]) {
        curA = cur[i];
        const tsea = tBase + 5 * cur[i];
        temp[i] = tsea; amp[i] = 2 + 0.15 * a;
        m += (capT(tsea) * (1 + 0.1 * Math.min(0, cur[i])) - m) * 0.6;
        prevE = elev[i]; prevLand = false; curA_[i] = curA; continue;
      }
      curA *= 0.55;
      const e = Math.max(0, elev[i]);
      const tl = tBase - 6.5 * e / 1000 + 5 * curA;
      temp[i] = tl;
      const cont = Math.min(1, dsea[i] / 7);
      amp[i] = (8 + 0.45 * a) * (0.35 + 0.65 * cont);
      const cap = capT(tl);
      let rain = 0;
      if (m > cap) { rain += m - cap; m = cap; }
      const r0 = 0.10 + 0.25 * clamp(tl / 30, 0, 1);
      const dh = prevLand || prevE !== null ? Math.max(0, e - Math.max(0, prevE ?? e)) : 0;
      const oro = Math.min(0.6, dh / 1500 * 0.5);
      const taken = m * Math.min(0.85, r0 + oro);
      rain += taken; m -= taken; m += 0.55 * taken;
      precip[i] = rain; prevE = e; prevLand = true; curA_[i] = curA;
    }
  }
  // 緯度帯による降水の増減(熱帯収束帯、亜熱帯高圧帯、前線帯、極域)
  for (let i = 0; i < N; i++) {
    if (!land[i]) continue; const a = absLat(i);
    const z = (1 + 1.0 * Math.exp(-Math.pow(a / 9, 2))) * (1 - 0.55 * Math.exp(-Math.pow((a - 28) / 8, 2))) * (1 + 0.3 * Math.exp(-Math.pow((a - 52) / 9, 2))) * (1 - 0.5 * sstep(60, 80, a));
    precip[i] = precip[i] * 5200 * z;
  }
  w.temp = temp; w.amp = amp; w.precip = precip; w.curAnomaly = curA_;
  // 気候区分
  const biome = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    if (!land[i]) continue;
    const t = temp[i], p = precip[i], tc = t - amp[i] * 0.5, th = t + amp[i] * 0.5, e = elev[i], a = absLat(i);
    let b;
    const thr = 20 * t + 280;
    if (e >= 5000 || th < 0) b = 1;
    else if (e >= 2600) b = 12;
    else if (th < 8) b = 2;
    else if (p < thr * 0.5) b = 5;
    else if (p < thr) b = tc < -3 ? 4 : 6;
    else if (tc < -3) b = 3;
    else if (tc >= 18) b = p >= 1900 ? 11 : 10;
    else if (a >= 30 && a < 46 && dsea[i] <= 5 && p < 1100 && tc > 3) b = 7;
    else if (amp[i] < 14 && p > 1100) b = 9;
    else b = 8;
    biome[i] = b;
  }
  w.biome = biome;
}

// ---- 5. 川(窪みを埋めて海へ流す) ----
function rivers(w) {
  const { land, elev, precip, temp } = w;
  const filled = new Float64Array(N).fill(Infinity), flow = new Int8Array(N).fill(-1), done = new Uint8Array(N);
  const heap = []; // [値, i] の二分ヒープ
  const push = (v, i) => { heap.push([v, i]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { let l = 2 * c + 1, r = l + 1, m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return top; };
  for (let i = 0; i < N; i++) if (!land[i]) { filled[i] = elev[i]; done[i] = 1; push(elev[i], i); }
  const order = [];
  while (heap.length) {
    const [v, c] = pop();
    for (let k = 0; k < 6; k++) {
      const j = nb(c, k); if (j < 0 || done[j]) continue;
      done[j] = 1; const noise = (R.hash32(w.seed, j, 77, 0) % 1000) * 1e-4;
      filled[j] = Math.max(elev[j], v) + 0.05 + noise; flow[j] = (k + 3) % 6; // j から c へ向かう方向
      push(filled[j], j); order.push(j);
    }
  }
  const Q = new Float32Array(N), runoff = new Float32Array(N);
  for (let i = 0; i < N; i++) if (land[i]) {
    const et = Math.min(precip[i], 25 * Math.max(temp[i], -2) + 150);
    runoff[i] = Math.max(0, precip[i] - et) * 0.79; Q[i] = runoff[i];
  }
  for (let n = order.length - 1; n >= 0; n--) { const i = order[n]; const j = nb(i, flow[i]); if (j >= 0 && land[i] && land[j]) Q[j] += Q[i]; }
  // 海に入る所の流量も記録(河口)
  w.flow = flow; w.runoff = runoff; w.riverQ = Q; w.filled = filled;
  w.lake = new Uint8Array(N); for (let i = 0; i < N; i++) if (land[i] && filled[i] - elev[i] > 130) w.lake[i] = 1;
  w.river = new Uint8Array(N); for (let i = 0; i < N; i++) w.river[i] = !land[i] ? 0 : Q[i] >= 1500 ? 2 : Q[i] >= 300 ? 1 : 0;
}

// ---- 6. 岩石・資源 ----
function rocks(w) {
  const { land, tec, uplift, elev, biome, temp, riverQ, plate, plates, precip } = w, seed = w.seed;
  const rock = new Uint8Array(N), ore = new Uint8Array(N), relief = new Uint16Array(N);
  const nBasin = R.hash32(seed, 41, 0, 0), nLime = R.hash32(seed, 42, 0, 0), nOre = R.hash32(seed, 43, 0, 0);
  for (let i = 0; i < N; i++) {
    // 起伏幅(そのマスの中で高さがばらつく幅の目安): 陸の隣との差、高さそのもの、造山の若さから。海岸の落ち込みは含めない
    let mx = elev[i], mn = elev[i];
    for (let k = 0; k < 6; k++) { const j = nb(i, k); if (j >= 0 && land[j] === land[i]) { mx = Math.max(mx, elev[j]); mn = Math.min(mn, elev[j]); } }
    relief[i] = land[i] ? clamp(Math.round(80 + 0.15 * Math.max(0, elev[i]) + 600 * Math.max(0, uplift[i]) + 0.15 * (mx - mn)), 80, 3500) : clamp(Math.round((mx - mn) / 2), 30, 3000);
    if (!land[i]) { rock[i] = 0; continue; }
    const x = px(i), y = py(i), t = tec[i], u = uplift[i];
    const bas = R.fbm(nBasin, x / 1800, y / 1800, 3), age = plates[plate[i]].age;
    if (t === 3 || t === 7) rock[i] = 4;
    else if (t === 2 && u > 0.3) rock[i] = R.fbm(nLime, x / 900, y / 900, 2) < 0.5 ? 4 : 5;
    else if ((t === 1 || t === 8) && u > 0.3) rock[i] = 5;
    else if (t === 8) rock[i] = 5;
    else if (t === 1 || t === 2) rock[i] = 2;
    else if (t === 4) rock[i] = R.fbm(nLime, x / 900, y / 900, 2) < 0.5 ? 4 : 2;
    else if (bas * 0.6 + age * 0.6 > 0.62) rock[i] = 1;
    else if (temp[i] > 14 && R.fbm(nLime, x / 1200, y / 1200, 2) > 0.58) rock[i] = 3;
    else rock[i] = 2;
    if (riverQ[i] >= 500 && elev[i] < 400 && rock[i] !== 4) rock[i] = 6;
    const o = R.fbm(nOre, x / 700, y / 700, 2);
    let m = 0;
    if ((rock[i] === 1 || rock[i] === 5) && o > 0.5) m |= 1;
    if ((t === 1 || t === 2 || t === 3) && u > 0.25 && o < 0.55) m |= 2;
    if (rock[i] === 2 && precip[i] > 800 && o > 0.45) m |= 4;
    if (rock[i] === 2 && (biome[i] === 5 || biome[i] === 6) && o < 0.4) m |= 8;
    ore[i] = m;
  }
  w.rock = rock; w.ore = ore; w.relief = relief;
}

// ---- 7. 肥沃度 ----
const BASE_FERT = [0, 0, .05, .25, .35, .03, .55, .6, .7, .6, .5, .45, .08];
const ROCK_FERT = [0, -.12, .05, 0, .15, -.08, .25];
function fertility(w) {
  const f = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    if (!w.land[i]) continue;
    let v = BASE_FERT[w.biome[i]] + ROCK_FERT[w.rock[i]] - 0.25 * clamp(w.relief[i] / 1500, 0, 1) + (w.riverQ[i] >= 300 ? 0.1 : 0);
    f[i] = clamp(v, 0, 1);
  }
  w.fertility = f;
}

// ---- 8. 動的な値の初期状態(持ち主・荒廃・開発) ----
function initialState(w) {
  w.owner = new Uint8Array(N);      // 0 = 無主 / 未設定
  w.devastation = new Uint8Array(N); // 荒廃 0..255
  w.development = new Uint8Array(N); // 開発度 0..255
  w.road = new Uint8Array(N * 6);   // 辺ごとの道の等級(0..3)。 方向ごとに両側へ同じ値を書く
}

return { R, G, _build: build, generateWorld, BIOME, ROCK, TEC, ORE, bfsDist, components, clamp, T0 };
})();
if(typeof module!=='undefined')module.exports=SekaiWorld;
