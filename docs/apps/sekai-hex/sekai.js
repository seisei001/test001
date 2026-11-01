'use strict';
// 階層六角形世界の幾何と遅延生成(表示に依らない部分)。
// 6層。縮み率=√127(1親=半径6の六角形127マス。隙間も重なりもなく敷き詰まる)。層ごとに格子が約27.5度回る。
// 全層が同じ原点を共有し、親の中心は必ず子の格子点に重なる。最上位(層0)だけ60×40の世界図。
const Sekai = (function () {
  const SQ3 = Math.sqrt(3), RAD = 6, PA = 7, PB = 6, NB = 127, NL = 6;
  const RATIO = Math.sqrt(NB), THETA = Math.atan2(PB * SQ3 / 2, PA + PB / 2);
  const S0 = Math.pow(NB, 2.5);                       // 層0の隣り合うマス中心の距離(m)≒181.8km。層5で約1m
  const LAYER_NAME = ['世界', '地方', '戦域', '戦場', '隊', '兵'];
  const spacing = L => S0 / Math.pow(RATIO, L);
  const angle = L => -L * THETA;
  const hexDist = (dq, dr) => (Math.abs(dq) + Math.abs(dr) + Math.abs(-dq - dr)) / 2;

  // 親(S,T)の子 = 子の格子で (latQ,latR) を中心とした半径6の六角形
  const OFF = []; const OFFIDX = new Int16Array(13 * 13).fill(-1);
  for (let dq = -RAD; dq <= RAD; dq++) for (let dr = -RAD; dr <= RAD; dr++) if (hexDist(dq, dr) <= RAD) { OFFIDX[(dq + RAD) * 13 + (dr + RAD)] = OFF.length; OFF.push([dq, dr]); }
  const latQ = (S, T) => PA * S - PB * T, latR = (S, T) => PB * S + (PA + PB) * T;
  const pr = [0, 0, 0]; // parentOf の出力 [S,T,子番号]
  function parentOf(q, r, out) {
    out = out || pr;
    const sf = Math.floor(((PA + PB) * q + PB * r) / NB), tf = Math.floor((-PB * q + PA * r) / NB);
    for (let dS = -1; dS <= 2; dS++) for (let dT = -1; dT <= 2; dT++) {
      const S = sf + dS, T = tf + dT, dq = q - latQ(S, T), dr = r - latR(S, T);
      if (hexDist(dq, dr) <= RAD) { out[0] = S; out[1] = T; out[2] = OFFIDX[(dq + RAD) * 13 + (dr + RAD)]; return out; }
    }
    throw new Error('parent not found ' + q + ',' + r);
  }
  function pos(L, q, r, out) {
    const x = q + r / 2, y = r * SQ3 / 2, s = spacing(L), a = angle(L), c = Math.cos(a), n = Math.sin(a);
    out[0] = s * (c * x - n * y); out[1] = s * (n * x + c * y); return out;
  }
  function locate(L, X, Y, out) { // 実数の軸座標
    const s = spacing(L), a = angle(L), c = Math.cos(a), n = Math.sin(a);
    const x = (c * X + n * Y) / s, y = (-n * X + c * Y) / s, r = y / (SQ3 / 2);
    out[0] = x - r / 2; out[1] = r; return out;
  }
  function roundAxial(fq, fr, out) {
    let x = fq, z = fr, y = -x - z, rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
    const dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
    if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
    out[0] = rx; out[1] = rz; return out;
  }

  function create(seed) {
    const w = SekaiWorld.generateWorld(seed);
    if (w.failed) throw new Error('world failed');
    const hash32 = SekaiWorld.R.hash32, fbm = SekaiWorld.R.fbm;
    const blocks = new Map(); const MAXB = 9000;
    const bkey = (L, S, T) => (L * 4194304 + (S + 2097152)) * 4194304 + (T + 2097152);
    const tmpP = [0, 0, 0];
    const diffs = new Map();   // 地変による標高の差分: ブロックの鍵 → マスごとの差(m)。世界の「元の姿」は変えず、差分だけを積む

    function worldCell(q, r, o) {
      const c = q + ((r - (r & 1)) >> 1);
      if (r < 0 || r >= w.H || c < 0 || c >= w.W) { o.h = -4500; o.b = 0; o.rel = 300; return o; }
      const i = r * w.W + c; o.h = w.elev[i]; o.b = w.land[i] ? w.biome[i] : 0; o.rel = w.relief[i]; return o;
    }
    function cell(L, q, r, o) {
      if (L === 0) return worldCell(q, r, o);
      parentOf(q, r, tmpP); const S = tmpP[0], T = tmpP[1], k = tmpP[2];
      const bl = block(L, S, T); o.h = bl.h[k]; o.b = bl.b[k]; o.rel = bl.rel[k]; return o;
    }
    function block(L, S, T) {
      const key = bkey(L, S, T); let bl = blocks.get(key);
      if (bl) return bl;
      bl = genBlock(L, S, T);
      if (blocks.size >= MAXB) blocks.delete(blocks.keys().next().value);
      blocks.set(key, bl); return bl;
    }
    const P = [0, 0], F = [0, 0], A = { h: 0, b: 0, rel: 0 }, B = { h: 0, b: 0, rel: 0 }, C = { h: 0, b: 0, rel: 0 };
    function genBlock(L, S, T) {
      const h = new Float32Array(NB), b = new Uint8Array(NB), rel = new Float32Array(NB);
      const pL = L - 1, bq = latQ(S, T), br = latR(S, T), s = spacing(L), lam = 4 * s, ns = hash32(w.seed, 5150, L, 0);
      for (let k = 0; k < NB; k++) {
        const q = bq + OFF[k][0], r = br + OFF[k][1];
        pos(L, q, r, P); const X = P[0], Y = P[1];
        locate(pL, X, Y, F); const q0 = Math.floor(F[0]), r0 = Math.floor(F[1]), u = F[0] - q0, v = F[1] - r0;
        let qa, ra, qb, rb, qc, rc, wa, wb, wc;
        if (u + v <= 1) { qa = q0; ra = r0; qb = q0 + 1; rb = r0; qc = q0; rc = r0 + 1; wa = 1 - u - v; wb = u; wc = v; }
        else { qa = q0 + 1; ra = r0 + 1; qb = q0; rb = r0 + 1; qc = q0 + 1; rc = r0; wa = u + v - 1; wb = 1 - u; wc = 1 - v; }
        cell(pL, qa, ra, A); cell(pL, qb, rb, B); cell(pL, qc, rc, C);
        let hh = wa * A.h + wb * B.h + wc * C.h, rr = wa * A.rel + wb * B.rel + wc * C.rel;
        let bio = 0, bw = -1; // 陸の気候区分のうち重みが最大のもの
        if (A.b > 0 && wa > bw) { bio = A.b; bw = wa; } if (B.b > 0 && wb > bw) { bio = B.b; bw = wb; } if (C.b > 0 && wc > bw) { bio = C.b; bw = wc; }
        const n = (fbm(ns, X / lam, Y / lam, 3) - 0.5) * 2;
        hh += n * Math.min(rr * (hh > 0 ? 0.55 : 0.25), 0.28 * s);   // 細部の振れ幅は、そのマスの大きさに比べて急すぎない範囲に収める
        if (hh > 0 && bio === 0) bio = 8;
        h[k] = hh; b[k] = hh > 0 ? bio : 0; rel[k] = rr * 0.45;
      }
      const df = diffs.get(bkey(L, S, T));
      if (df) for (let k = 0; k < NB; k++) if (df[k] !== 0) { h[k] += df[k]; if (h[k] > 0 && b[k] === 0) b[k] = 8; if (h[k] <= 0) b[k] = 0; }
      return { h, b, rel };
    }
    // 地変の差分を1マスに足す(層L、軸座標q,r、dhメートル)。それより下の層のブロックは作り直しになる(次に見たとき計算される)。
    function applyDiff(L, q, r, dh) {
      if (L < 1) return false;
      parentOf(q, r, tmpP); const S = tmpP[0], T = tmpP[1], k = tmpP[2], key = bkey(L, S, T);
      let df = diffs.get(key); if (!df) { df = new Float32Array(NB); diffs.set(key, df); }
      df[k] += dh;
      const bl = blocks.get(key); if (bl) { bl.h[k] += dh; if (bl.h[k] > 0 && bl.b[k] === 0) bl.b[k] = 8; if (bl.h[k] <= 0) bl.b[k] = 0; }
      return true;
    }
    function invalidateBelow(L) { // 層Lより細かい層のブロックを捨てる(差分を取り込んで作り直すため)
      for (const key of Array.from(blocks.keys())) { if (Math.floor(key / 17592186044416) > L) blocks.delete(key); }
    }

    // 円の中にある層Lのマスを列挙
    function cellsIn(L, cx, cy, rad, qs, rs) {
      let q0 = 1e18, q1 = -1e18, r0 = 1e18, r1 = -1e18; const f = [0, 0];
      for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { locate(L, cx + dx * rad, cy + dy * rad, f); q0 = Math.min(q0, f[0]); q1 = Math.max(q1, f[0]); r0 = Math.min(r0, f[1]); r1 = Math.max(r1, f[1]); }
      q0 = Math.floor(q0) - 1; q1 = Math.ceil(q1) + 1; r0 = Math.floor(r0) - 1; r1 = Math.ceil(r1) + 1;
      const p = [0, 0]; let n = 0; const rad2 = rad * rad;
      for (let r = r0; r <= r1; r++) for (let q = q0; q <= q1; q++) {
        pos(L, q, r, p); const dx = p[0] - cx, dy = p[1] - cy; if (dx * dx + dy * dy <= rad2) { qs[n] = q; rs[n] = r; n++; }
      }
      return n;
    }
    return { seed, w, cell, block, cellsIn, applyDiff, invalidateBelow, diffCount: () => diffs.size, blockCount: () => blocks.size };
  }
  return { create, spacing, angle, pos, locate, roundAxial, parentOf, hexDist, latQ, latR, OFF, NB, RAD, NL, RATIO, THETA, S0, LAYER_NAME, SQ3 };
})();
if (typeof module !== 'undefined') module.exports = Sekai;
