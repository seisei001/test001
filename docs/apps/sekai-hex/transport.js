'use strict';
// 交通網シミュレーター(POLICY §9/§12/§21, OVERVIEW §3/§5)
// 川・湖・水位・道を作る持ち主。viewer は結果を読むだけ。
// 入力 ctx: { L, s, m, qs, rs, hs, idx, key, DIRS, cx, cy, rad, SK, hydro0, onRoad? }
const SekaiTransport = (function () {
  // ---- 移動手段の表(1行=1手段)。足せば増える。 ----
  // slope: 高低差への敏感さ / high: 高地(標高)の追加コスト / road: 既存の道の係数 / sea: 海を渡れるか / fly: 地形を無視
  const MOVERS = {
    walk:  { name: '徒歩', slope: 8, highAt: 2500, high: 3, road: 0.35, sea: false, fly: false, range: 1 },
    horse: { name: '馬',   slope: 6, highAt: 2500, high: 2, road: 0.25, sea: false, fly: false, range: 2 },
    boat:  { name: '舟',   slope: 40, highAt: 400, high: 50, road: 1,   sea: true,  fly: false, river: true, range: 3 },
    fly:   { name: '飛行', slope: 0, highAt: 1e9, high: 0, road: 1,    sea: true,  fly: true,  range: 4 },
  };

  function heapOf() {
    const H = [];
    return {
      get length() { return H.length; },
      push(it) { H.push(it); let c = H.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (H[p][0] <= H[c][0]) break; [H[p], H[c]] = [H[c], H[p]]; c = p; } },
      pop() { const top = H[0], last = H.pop(); if (H.length) { H[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, r = l + 1; let mn = c; if (l < H.length && H[l][0] < H[mn][0]) mn = l; if (r < H.length && H[r][0] < H[mn][0]) mn = r; if (mn === c) break; [H[mn], H[c]] = [H[c], H[mn]]; c = mn; } } return top; },
    };
  }

  // ---- 道: 街と街を、手段の表のコストでつなぐ ----
  function roads(ctx, towns, mover) {
    const { qs, rs, hs, s, idx, key, DIRS, m } = ctx, MV = MOVERS[mover || 'walk'];
    const onRoad = new Uint8Array(m), out = [];
    function path(a, b) {
      const hd = (i, j) => { const dq = qs[i] - qs[j], dr = rs[i] - rs[j]; return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2; };
      const g = new Map([[a, 0]]), from = new Map(), hp = heapOf(), done = new Set(); hp.push([hd(a, b), a]);
      let n = 0;
      while (hp.length && n++ < 4000) {
        const [, i] = hp.pop(); if (done.has(i)) continue; done.add(i);
        if (i === b) { const p = [b]; let c = b; while (c !== a) { c = from.get(c); p.push(c); } return p.reverse(); }
        for (let k = 0; k < 6; k++) {
          const j = idx.get(key(qs[i] + DIRS[k][0], rs[i] + DIRS[k][1])); if (j === undefined) continue;
          if (hs[j] <= 0 && !MV.sea) continue;
          const cost = g.get(i) + (onRoad[j] ? MV.road : 1 + MV.slope * Math.abs(hs[j] - hs[i]) / s + (hs[j] > MV.highAt ? MV.high : 0));
          if (g.has(j) && g.get(j) <= cost) continue; g.set(j, cost); from.set(j, i); hp.push([cost + hd(j, b), j]);
        }
      }
      return null;
    }
    const T = towns, es = new Set();
    for (const a of T) {
      const near = T.filter(b => b !== a).map(b => [Math.hypot(ctx.cpos[a * 3] - ctx.cpos[b * 3], ctx.cpos[a * 3 + 1] - ctx.cpos[b * 3 + 1]), b]).filter(x => x[0] < s * 16).sort((x, y) => x[0] - y[0]).slice(0, 2);
      for (const [, b] of near) { const kk = a < b ? a + ',' + b : b + ',' + a; if (es.has(kk)) continue; es.add(kk); const p = path(a, b); if (p) { for (const i of p) onRoad[i] = 1; out.push(p); } }
    }
    return out;
  }

  // ---- 水: 低い方へ流れる。窪みは湖、水が集まる所が川 ----
  function water(ctx) {
    const { L, s, m, qs, rs, hs, idx, key, DIRS, cx, cy, rad, SK } = ctx;
    const rivers = [], lakes = [];
    const fill = new Float32Array(m).fill(Infinity), down = new Int32Array(m).fill(-1), seen = new Uint8Array(m), order = [], eps = 1e-4 * s, hp = heapOf();
    for (let i = 0; i < m; i++) {
      let edge = false; for (let k = 0; k < 6; k++) if (idx.get(key(qs[i] + DIRS[k][0], rs[i] + DIRS[k][1])) === undefined) { edge = true; break; }
      if (hs[i] <= 0 || edge) { fill[i] = Math.max(0, hs[i]); seen[i] = 1; hp.push([fill[i], i]); }
    }
    while (hp.length) {
      const [, i] = hp.pop(); order.push(i);
      for (let k = 0; k < 6; k++) { const j = idx.get(key(qs[i] + DIRS[k][0], rs[i] + DIRS[k][1])); if (j === undefined || seen[j]) continue; seen[j] = 1; fill[j] = Math.max(hs[j], fill[i] + eps); down[j] = i; hp.push([fill[j], j]); }
    }
    const TH = Math.max(20, m * 0.004);
    const acc = new Float32Array(m).fill(1), fq = [0, 0], rq = [0, 0];
    for (const sg of ctx.hydro0()) {   // 世界の川が窓に入る所に水を流し込む(層をまたいだ川の一貫性)
      const dx = sg[2] - sg[0], dy = sg[3] - sg[1], len = Math.hypot(dx, dy) || 1;
      const t0 = Math.max(0, Math.min(1, ((cx - sg[0]) * dx + (cy - sg[1]) * dy) / (len * len))); if (Math.hypot(sg[0] + dx * t0 - cx, sg[1] + dy * t0 - cy) > rad) continue;
      const steps = Math.max(2, Math.ceil(len / (s * 0.8))); let prevIn = false;
      for (let k = 0; k <= steps; k++) {
        const x = sg[0] + dx * k / steps, y = sg[1] + dy * k / steps; if (Math.hypot(x - cx, y - cy) > rad * 0.97) { prevIn = false; continue; }
        SK.locate(L, x, y, fq); SK.roundAxial(fq[0], fq[1], rq); const j = idx.get(key(rq[0], rq[1])), inW = j !== undefined;
        if (inW && !prevIn && hs[j] > 0 && (k > 0 || !sg[5])) acc[j] += TH * (6 + 2 * Math.log2(sg[4]));
        prevIn = inW;
      }
    }
    for (let o = order.length - 1; o >= 0; o--) { const i = order[o]; if (down[i] >= 0 && hs[i] > 0) acc[down[i]] += acc[i]; }
    const isR = new Uint8Array(m), hasUp = new Uint8Array(m);
    for (let i = 0; i < m; i++) {
      if (hs[i] <= 0) continue;
      if (fill[i] - hs[i] > 0.07 * s) lakes.push(i);
      else if (down[i] >= 0 && acc[i] >= TH) { isR[i] = 1; hasUp[down[i]] = 1; }
    }
    for (let i = 0; i < m; i++) if (isR[i]) {
      const t = down[i], c = isR[t] ? down[t] : t;
      rivers.push(i, t, c, acc[i]);
      if (!hasUp[i]) rivers.push(i, i, t, acc[i]);
    }
    return { rivers, lakes, TH, down, acc };
  }

  // 川幅(m): 集まった水の量(上流のマス数×1マスの面積)から。水量が4倍で幅が約2倍。
  function riverWidthM(acc, cellWidthM) { const areaKm2 = acc * (cellWidthM / 1000) * (cellWidthM / 1000) * 0.866; return Math.max(1, 3.2 * Math.sqrt(areaKm2)); }

  return { MOVERS, roads, water, riverWidthM };
})();
if (typeof module !== 'undefined') module.exports = SekaiTransport;
