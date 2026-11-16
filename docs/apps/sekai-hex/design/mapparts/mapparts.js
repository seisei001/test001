'use strict';
/*
 * mapparts.js — 地形だけを扱う3部品(国境の広がり・道の経路・川)の最小の自作版。
 *
 * 元のロジックは Azgaar's Fantasy Map Generator (MIT) の次のファイルから写した:
 *   src/model/political/states-generator.ts (expandStates, normalize と費用の表)
 *   src/model/economy/routes-generator.ts   (Urquhart網, 陸路の費用, 区間分け)
 *   src/utils/path-utils.ts                 (findPath)
 *   src/model/physical/river-generator.ts   (流量の集計, 合流, くぼ地埋め)
 * データの形・名前・構成は自作(pack/grid は使わない)。省いた物は各部品の見出しに書いた。
 *
 * MIT License
 *
 * Copyright 2017-2024 Max Haniyeu (Azgaar), azgaar.fmg@yandex.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * You can produce, without restrictions, any derivative works from the original
 * software and even reap commercial benefits from the sale of the secondary product.
 * The derivates include created maps, map images, screenshots, videos, and other materials.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const MapParts = (function () {
  // ---- 入力の形(自作) --------------------------------------------------
  // g = {
  //   n,                 マスの数
  //   nb[i]              隣のマスの番号の配列
  //   x[i], y[i]         マスの中心
  //   h[i]               標高 0〜100(20未満が水)
  //   biome[i]           生物群系の番号。biomes[b] = {hab: 住みやすさ0〜100, cost: 国境が越える費用}
  //   culture[i]         文化の番号
  //   s[i]               適地度(人口の元)。0なら住めない
  //   t[i]               海岸の段階 1=陸の海岸 2=その内側 -1=水の海岸 0=その他(Azgaarと同じ)
  //   border[i]          1なら地図の縁(川は縁で外へ流れ出る)
  //   town[i]            街の番号(なければ0) / capital[i] 1なら首都
  //   fl[i], r[i]        川の流量と川の番号(川の部品が書く)
  // }
  const SEA = 20;
  const minmax = (v, a, b) => Math.min(b, Math.max(a, v));
  const d2 = (g, a, b) => (g.x[a] - g.x[b]) ** 2 + (g.y[a] - g.y[b]) ** 2;

  // 小さな優先度つきキュー(小さい key が先に出る)。元は FlatQueue。
  class Heap {
    constructor() { this.a = []; }
    get length() { return this.a.length; }
    push(v, k) {
      const a = this.a; a.push([k, v]);
      let i = a.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
    }
    peekKey() { return this.a[0][0]; }
    pop() {
      const a = this.a, top = a[0], last = a.pop();
      if (a.length) {
        a[0] = last; let i = 0;
        for (;;) {
          const l = 2 * i + 1, r = l + 1; let m = i;
          if (l < a.length && a[l][0] < a[m][0]) m = l;
          if (r < a.length && a[r][0] < a[m][0]) m = r;
          if (m === i) break;
          [a[m], a[i]] = [a[i], a[m]]; i = m;
        }
      }
      return top[1];
    }
  }

  // ====================================================================
  // 1. 国境(expandStates + normalize)
  //   首都から、費用の安い順に同時に広げる。費用 = 文化の一致 + 人口の元 + 生物群系 + 標高 + 川 + 海岸。
  //   states[k] = {id>=1, center(首都のマス), culture, type, expansionism, nativeBiome}
  //   省いた物: 固定(lock)された国, 湖の特例(g.lake[i]があれば使う)
  // ====================================================================
  const biomeCost = (g, biomes, b, biome, type) => {
    if (b === biome) return 10;
    if (type === 'Hunting') return biomes[biome].cost * 2;
    if (type === 'Nomadic' && biome > 4 && biome < 10) return biomes[biome].cost * 3;
    return biomes[biome].cost;
  };
  const heightCost = (isLake, h, type) => {
    if (type === 'Lake' && isLake) return 10;
    if (type === 'Naval' && h < SEA) return 300;
    if (type === 'Nomadic' && h < SEA) return 10000;
    if (h < SEA) return 1000;
    if (type === 'Highland' && h < 62) return 1100;
    if (type === 'Highland') return 0;
    if (h >= 67) return 2200;
    if (h >= 44) return 300;
    return 0;
  };
  const riverCost = (g, i, type) => {
    const r = g.r ? g.r[i] : 0;
    if (type === 'River') return r ? 0 : 100;
    if (!r) return 0;
    return minmax(g.fl[i] / 10, 20, 100);
  };
  const coastCost = (t, type) => {
    if (t === 1) return type === 'Naval' || type === 'Lake' ? 0 : type === 'Nomadic' ? 60 : 20;
    if (t === 2) return type === 'Naval' || type === 'Nomadic' ? 30 : 0;
    if (t !== -1) return type === 'Naval' || type === 'Lake' ? 100 : 0;
    return 0;
  };

  function expandStates(g, states, biomes, opt = {}) {
    const growthRate = (g.n / 2) * (opt.growthRate ?? 1); // 広がりの費用の上限
    const state = g.state = new Uint16Array(g.n);
    const cost = new Float64Array(g.n).fill(Infinity);
    const q = new Heap();
    const byId = [];
    for (const s of states) {
      byId[s.id] = s;
      state[s.center] = s.id;
      const b = g.biome[s.nativeBiome ?? s.center];
      q.push({ e: s.center, p: 0, s: s.id, b }, 0);
      cost[s.center] = 1;
    }
    while (q.length) {
      const { e, p, s, b } = q.pop();
      const { type, culture, expansionism } = byId[s];
      for (const n of g.nb[e]) {
        if (state[n] && n === byId[state[n]].center) continue; // 首都のマスは奪わない
        const cultureCost = culture === g.culture[n] ? -9 : 100;
        const popCost = g.h[n] < SEA ? 0 : g.s[n] ? Math.max(20 - g.s[n], 0) : 5000;
        const c = Math.max(cultureCost + popCost + biomeCost(g, biomes, b, g.biome[n], type)
          + heightCost(g.lake && g.lake[n], g.h[n], type) + riverCost(g, n, type) + coastCost(g.t[n], type), 0);
        const total = p + 10 + c / expansionism;
        if (total > growthRate) continue;
        if (total < cost[n]) {
          if (g.h[n] >= SEA) state[n] = s;
          cost[n] = total;
          q.push({ e: n, p: total, s, b }, total);
        }
      }
    }
    return state;
  }

  // 飛び地・ギザギザの整理: 周りの陸が二つ以上他国で、味方が少ないマスは多数派へ。街と首都の隣は動かさない。
  function normalizeStates(g) {
    const st = g.state;
    for (let i = 0; i < g.n; i++) {
      if (g.h[i] < SEA || g.town[i]) continue;
      if (g.nb[i].some(c => g.capital[c])) continue;
      const nbs = g.nb[i].filter(c => g.h[c] >= SEA);
      const adversaries = nbs.filter(c => st[c] !== st[i]);
      if (adversaries.length < 2) continue;
      const buddies = nbs.filter(c => st[c] === st[i]);
      if (buddies.length > 2) continue;
      if (adversaries.length <= buddies.length) continue;
      st[i] = st[adversaries[0]];
    }
    return st;
  }

  // ====================================================================
  // 2. 道(routes)
  //   街のうち、同じ陸地どうしを Urquhart網(三角形分割から各三角形の最長辺を除く)でつなぎ、
  //   費用つき最短経路で道筋を引く。幹線=首都どうし → 小道=すべての街。既にある道は半額。
  //   省いた物: 海路(港と haven の持ち方は設計で決める), 川の蛇行の幾何
  // ====================================================================
  function delaunay(P) {
    const n = P.length;
    let minx = 1e18, miny = 1e18, maxx = -1e18, maxy = -1e18;
    for (const [x, y] of P) { minx = Math.min(minx, x); miny = Math.min(miny, y); maxx = Math.max(maxx, x); maxy = Math.max(maxy, y); }
    const d = Math.max(maxx - minx, maxy - miny, 1) * 20, mx = (minx + maxx) / 2, my = (miny + maxy) / 2;
    const V = P.concat([[mx - d, my - d], [mx, my + d], [mx + d, my - d]]);
    const circ = (a, b, c) => {
      const [ax, ay] = V[a], [bx, by] = V[b], [cx, cy] = V[c];
      const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
      const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D;
      const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D;
      return { a, b, c, ux, uy, r2: (ax - ux) ** 2 + (ay - uy) ** 2 };
    };
    let tris = [circ(n, n + 1, n + 2)];
    for (let i = 0; i < n; i++) {
      const [px, py] = V[i], bad = [], keep = [];
      for (const t of tris) ((px - t.ux) ** 2 + (py - t.uy) ** 2 < t.r2 - 1e-9 ? bad : keep).push(t);
      const cnt = new Map();
      for (const t of bad) for (const [u, v] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
        const k = u < v ? u * (n + 3) + v : v * (n + 3) + u;
        cnt.set(k, (cnt.get(k) || [0, u, v])); cnt.get(k)[0]++;
      }
      for (const [c, u, v] of cnt.values()) if (c === 1) keep.push(circ(u, v, i));
      tris = keep;
    }
    return tris.filter(t => t.a < n && t.b < n && t.c < n).map(t => [t.a, t.b, t.c]);
  }

  function urquhartEdges(P) {
    if (P.length < 2) return [];
    if (P.length === 2) return [[0, 1]];
    const dd = (a, b) => (P[a][0] - P[b][0]) ** 2 + (P[a][1] - P[b][1]) ** 2;
    const key = (u, v) => (u < v ? u + ',' + v : v + ',' + u);
    const all = new Map(), removed = new Set();
    for (const [a, b, c] of delaunay(P)) {
      const e = [[a, b, dd(a, b)], [b, c, dd(b, c)], [c, a, dd(c, a)]];
      for (const [u, v] of e) all.set(key(u, v), [u, v]);
      const longest = e.reduce((m, x) => (x[2] > m[2] ? x : m));
      removed.add(key(longest[0], longest[1]));
    }
    return [...all].filter(([k]) => !removed.has(k)).map(([, uv]) => uv);
  }

  // 費用つき最短経路(Dijkstra)。isExit(next,current) が真になったマスで終わる。
  function findPath(g, start, isExit, getCost) {
    if (isExit(start)) return null;
    const from = [], cost = [], q = new Heap();
    q.push(start, 0);
    while (q.length) {
      const cc = q.peekKey(), cur = q.pop();
      for (const next of g.nb[cur]) {
        if (isExit(next, cur)) {
          from[next] = cur;
          const path = [next];
          while (path[0] !== start) path.unshift(from[path[0]]);
          return path;
        }
        const c = getCost(cur, next);
        if (c === Infinity) continue;
        const total = cc + c;
        if (total >= (cost[next] ?? Infinity)) continue;
        from[next] = cur; cost[next] = total; q.push(next, total);
      }
    }
    return null;
  }

  function landMasses(g) { // 陸地ごとの番号(0=水)
    const mass = new Int32Array(g.n); let id = 0;
    for (let i = 0; i < g.n; i++) {
      if (g.h[i] < SEA || mass[i]) continue;
      id++; mass[i] = id; const st = [i];
      while (st.length) { const c = st.pop(); for (const n of g.nb[c]) if (g.h[n] >= SEA && !mass[n]) { mass[n] = id; st.push(n); } }
    }
    return mass;
  }

  function makeRoads(g, biomes, opt = {}) {
    const mass = g.mass || (g.mass = landMasses(g));
    const conn = new Set();
    const addConn = seg => { for (let i = 0; i + 1 < seg.length; i++) { conn.add(seg[i] + '-' + seg[i + 1]); conn.add(seg[i + 1] + '-' + seg[i]); } };
    const landCost = (cur, next) => {
      if (g.h[next] < SEA) return Infinity;
      const hab = biomes[g.biome[next]].hab;
      if (!hab) return Infinity;
      return d2(g, cur, next) * (1 + Math.max(100 - hab, 0) / 1000) * (1 + Math.max(g.h[next] - 25, 25) / 25)
        * (conn.has(cur + '-' + next) ? 0.5 : 1) * (g.town[next] ? 1 : 3);
    };
    const segmentsOf = path => {
      const segs = []; let seg = [];
      for (let i = 0; i < path.length; i++) {
        if (conn.has(path[i] + '-' + path[i + 1]) || conn.has(path[i + 1] + '-' + path[i])) {
          if (seg.length) { seg.push(path[i]); segs.push(seg); seg = []; }
          continue;
        }
        seg.push(path[i]);
      }
      if (seg.length > 1) segs.push(seg);
      return segs;
    };
    const build = (cells, group) => {
      const byMass = {};
      for (const c of cells) (byMass[mass[c]] ||= []).push(c);
      const out = [];
      for (const [m, list] of Object.entries(byMass)) {
        const P = list.map(c => [g.x[c], g.y[c]]);
        for (const [a, b] of urquhartEdges(P)) {
          const start = list[a], exit = list[b];
          const path = findPath(g, start, next => next === exit, landCost);
          if (!path) continue;
          for (const seg of segmentsOf(path)) { addConn(seg); out.push({ group, mass: +m, cells: seg }); }
        }
      }
      return out;
    };
    const towns = []; for (let i = 0; i < g.n; i++) if (g.town[i]) towns.push(i);
    const capitals = towns.filter(c => g.capital[c]);
    return [...build(capitals, 'road'), ...build(towns, 'trail')];
  }

  // ====================================================================
  // 3. 川(river-generator)
  //   降水を高い所から低い方へ流して流量を集め、一定以上で川にする。合流は流量の多い方が本流。
  //   先に標高をなめて、くぼ地を埋める(元の反復式。後で速い方式に替える余地)。
  //   入力 prec[i]: 降水。出力 g.fl, g.r, g.conf, 戻り値 rivers[{id, cells, source, mouth, parent}]
  //   省いた物: 湖の出口と流入, 川の下刻(標高を削る), 蛇行・幅・名前
  // ====================================================================
  const MIN_FLUX_TO_FORM_RIVER = 30;

  function alterHeights(g) {
    return Array.from(g.h, (h, i) => {
      if (h < SEA || g.t[i] < 1) return h;
      const m = g.nb[i].reduce((s, c) => s + g.t[c], 0) / g.nb[i].length;
      return h + g.t[i] / 100 + m / 10000;
    });
  }

  function resolveDepressions(g, h, maxIterations = 250) {
    const land = [];
    for (let i = 0; i < g.n; i++) if (h[i] >= SEA && !g.border[i]) land.push(i);
    land.sort((a, b) => h[a] - h[b]);
    for (let it = 0, dep = Infinity; dep && it < maxIterations; it++) {
      dep = 0;
      for (const i of land) {
        let min = Infinity; for (const c of g.nb[i]) if (h[c] < min) min = h[c];
        if (min >= 100 || h[i] > min) continue;
        dep++; h[i] = min + 0.1;
      }
    }
    return h;
  }

  function makeRivers(g, prec, opt = {}) {
    const mod = (g.n / 10000) ** 0.25;
    const fl = g.fl = new Float64Array(g.n), r = g.r = new Uint16Array(g.n), conf = g.conf = new Float64Array(g.n);
    const h = resolveDepressions(g, alterHeights(g), opt.maxIterations);
    const data = {}, parents = {}; let next = 1;
    const add = (c, id) => (data[id] ||= []).push(c);

    const flowDown = (to, fromFlux, river) => {
      const toFlux = fl[to] - conf[to], toRiver = r[to];
      if (toRiver) {
        if (fromFlux > toFlux) { conf[to] += fl[to]; if (h[to] >= SEA) parents[toRiver] = river; r[to] = river; }
        else { conf[to] += fromFlux; if (h[to] >= SEA) parents[river] = toRiver; }
      } else r[to] = river;
      if (h[to] >= SEA) fl[to] += fromFlux; // 水域ならそこで終わり
      add(to, river);
    };

    const land = []; for (let i = 0; i < g.n; i++) if (h[i] >= SEA) land.push(i);
    land.sort((a, b) => h[b] - h[a]); // 高い所から
    for (const i of land) {
      fl[i] += prec[i] / mod;
      if (g.border[i] && r[i]) { add(-1, r[i]); continue; } // 縁: 図の外へ
      let min = g.nb[i][0]; for (const c of g.nb[i]) if (h[c] < h[min]) min = c;
      if (h[i] <= h[min]) continue; // 窪み(埋め残し)
      if (fl[i] < MIN_FLUX_TO_FORM_RIVER) { if (h[min] >= SEA) fl[min] += fl[i]; continue; }
      if (!r[i]) { r[i] = next; add(i, next); next++; }
      flowDown(min, fl[i], r[i]);
    }

    // 川の確定(3マス未満は捨てる)。川の番号を振り直し、二つ以上が通るマスは合流とする。
    r.fill(0); conf.fill(0);
    const rivers = [];
    for (const key in data) {
      const cells = data[key];
      if (cells.length < 3) continue;
      const id = +key;
      for (const c of cells) { if (c < 0 || h[c] < SEA) continue; if (r[c]) conf[c] = 1; else r[c] = id; }
      rivers.push({ id, source: cells[0], mouth: cells[cells.length - 2], parent: parents[key] || 0, cells });
    }
    // 合流点の流量 = 流れ込む支流のうち最大を除いた合計
    for (let i = 0; i < g.n; i++) {
      if (!conf[i]) continue;
      const infl = g.nb[i].filter(c => r[c] && h[c] > h[i]).map(c => fl[c]).sort((a, b) => b - a);
      conf[i] = infl.reduce((acc, f, k) => (k ? acc + f : acc), 0);
    }
    g.hFilled = h;
    return rivers;
  }

  const isNavigable = (g, i) => !!g.r[i] && g.fl[i] >= 100;

  return { SEA, Heap, expandStates, normalizeStates, urquhartEdges, findPath, landMasses, makeRoads, makeRivers, isNavigable };
})();
if (typeof module !== 'undefined') module.exports = MapParts;
