'use strict';
// 領主・国の成立(POLICY §19/§22/§23/§25/§26)。世界図(層0)で、人口の集中から国・都市が自然に生じる。
// 設定(決め打ちの表) + 自然増減の単純規則 + 土地の価値。イベントは events で与える。
const SekaiRealm = (function () {
  const RULES = {
    popPerFert: 380000,   // 肥沃度1の1マス(約25,000km²)の収容人口(仮置き)
    growth: 0.03,         // 1ターン(=1年)の増え方(仮置き)
    mobilize: 0.03,       // 動員可能数/人口(仮置き)
    idealTax: 0.4,        // ちょうど良い税率
    seedPop: 0.35,        // 初期人口/収容力
  };
  // 兵数→階級(POLICY §25.4)
  const RANKS = [
    [1000000, '大帝国', '大帝'], [500000, '帝国', '皇帝'], [300000, '大国', '大王'], [100000, '国', '王'],
    [50000, '大将軍領', '大将軍'], [10000, '軍', '将軍'], [5000, '五千人隊', '五千人隊長'], [1000, '千人隊', '千人隊長'],
    [500, '五百人隊', '五百人隊長'], [100, '百人隊', '百人隊長'], [0, '集落', '村長'],
  ];
  const rankOf = troops => { for (const r of RANKS) if (troops >= r[0]) return { realm: r[1], lord: r[2] }; return { realm: '集落', lord: '村長' }; };
  // 税率の効き: 4割が最良(1)。高いと民が逃げ、低いと治安が悪化し生産が落ちる
  const taxEffect = t => { const d = t - RULES.idealTax; return d > 0 ? { flee: Math.min(1, d * 2.5), order: 1 - d * 0.5 } : { flee: 0, order: Math.max(0.2, 1 + d * 1.6) }; };

  function landValues(w, G) {
    const N = G.N, food = new Float32Array(N), haul = new Float32Array(N), move = new Uint8Array(N), industry = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      if (!w.land[i]) continue;
      food[i] = w.fertility[i];
      const rel = Math.min(1, w.relief[i] / 1500), riv = w.riverQ[i] >= 300 ? 0.25 : 0;
      haul[i] = Math.max(0.05, 1 - rel + riv);
      move[i] = (rel < 0.8 && w.elev[i] < 3500) ? 1 : 0;
      let o = 0, m = w.ore[i]; while (m) { o += m & 1; m >>= 1; }
      industry[i] = Math.min(1, 0.25 * o + 0.3 * rel);
    }
    return { food, haul, move, industry };
  }

  function create(w, G, opts) {
    opts = opts || {};
    const N = G.N, LV = landValues(w, G), pop = new Float32Array(N), cap = new Float32Array(N), order = new Float32Array(N).fill(0.7);
    for (let i = 0; i < N; i++) { cap[i] = LV.food[i] > 0.02 ? RULES.popPerFert * Math.pow(LV.food[i], 1.3) : 0; pop[i] = cap[i] * RULES.seedPop; }
    const st = { w, G, LV, pop, cap, order, tax: opts.tax == null ? RULES.idealTax : opts.tax, year: 0 };
    return st;
  }

  // 1ターン(1年): 自然増減(単純規則) + 近隣へのゆるやかな移住。events: [{cell, kill}] 
  function step(st, events) {
    const { G, pop, cap, order } = st, N = G.N, te = taxEffect(st.tax), np = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      if (cap[i] <= 0) continue;
      const ce = cap[i] * (0.6 + 0.4 * order[i]), r = pop[i] / ce;   // 治安が悪いと生産性が下がり、養える人口も減る
      let g = r <= 1 ? RULES.growth * (1 - r) * (0.5 + 0.5 * order[i]) : -0.08 * (r - 1);   // 増えすぎて糧食が足りなければ減る
      g -= 0.03 * te.flee;                                                                  // 高税で民が逃げる
      np[i] = Math.max(0, pop[i] * (1 + g));
    }
    // 移住: 空きのある隣へ、人口の少しだけ
    const mv = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      if (cap[i] <= 0 || np[i] <= 0) continue;
      const ri = np[i] / cap[i]; if (ri < 0.85) continue;
      let best = -1, br = ri;
      for (let k = 0; k < 6; k++) { const j = G.nb(i, k); if (j < 0 || cap[j] <= 0) continue; const rj = np[j] / cap[j]; if (rj < br - 0.15) { br = rj; best = j; } }
      if (best >= 0) { const m = np[i] * 0.03; mv[i] -= m; mv[best] += m; }
    }
    for (let i = 0; i < N; i++) pop[i] = Math.max(0, np[i] + mv[i]);
    if (events) for (const e of events) if (e.cell >= 0) pop[e.cell] *= (1 - (e.kill || 0));
    // 治世: 税の効き×(領主がいれば上がる。ここでは基準値へ寄せる)
    for (let i = 0; i < N; i++) order[i] += (Math.min(1, te.order) * 0.8 - order[i]) * 0.1;
    st.year++;
  }

  // 人口の集中から核を見つけ、支配圏と階級を決める
  function realms(st) {
    const { G, pop, LV, w } = st, N = G.N, mob = RULES.mobilize;
    const smooth = new Float32Array(N);
    for (let i = 0; i < N; i++) { if (!w.land[i]) continue; let s = pop[i], n = 1; for (let k = 0; k < 6; k++) { const j = G.nb(i, k); if (j >= 0 && w.land[j]) { s += pop[j] * 0.5; n += 0.5; } } smooth[i] = s / n; }
    const cores = [];
    for (let i = 0; i < N; i++) {
      if (!w.land[i] || smooth[i] < 20000) continue;
      let top = true; for (let k = 0; k < 6 && top; k++) { const j = G.nb(i, k); if (j >= 0 && (smooth[j] > smooth[i] || (smooth[j] === smooth[i] && j < i))) top = false; }
      if (top) cores.push(i);
    }
    // 核どうしが近すぎるなら小さい方を従える(2マス以内)
    cores.sort((a, b) => smooth[b] - smooth[a]);
    const mainCores = [];
    for (const c of cores) { let ok = true; for (const m of mainCores) if (G.dist(c, m) < 2.6 * G.SPAN_KM) { ok = false; break; } if (ok) mainCores.push(c); }
    // 支配圏: 通行コストの近さ(力の大きい核ほど遠くまで)で割り当てる(陸のみ、山・険しさは費用)
    const owner = new Int16Array(N).fill(-1), dist = new Float32Array(N).fill(Infinity), heap = [];
    const push = it => { heap.push(it); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
    const pop2 = () => { const t = heap[0], l = heap.pop(); if (heap.length) { heap[0] = l; let c = 0; for (;;) { const a = 2 * c + 1, b = a + 1; let m = c; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return t; };
    mainCores.forEach((c, k) => { owner[c] = k; dist[c] = 0; push([0, c, k]); });
    const power = mainCores.map(c => Math.sqrt(smooth[c]));
    while (heap.length) {
      const [d, i, k] = pop2(); if (d > dist[i]) continue;
      for (let q = 0; q < 6; q++) {
        const j = G.nb(i, q); if (j < 0 || !w.land[j]) continue;
        const step = (1 / Math.max(0.1, LV.haul[j])) * (LV.move[j] ? 1 : 3) / (power[k] / power[0] * 0.6 + 0.4);
        const nd = d + step; if (nd < dist[j] && nd < 7) { dist[j] = nd; owner[j] = k; push([nd, j, k]); }
      }
    }
    const R = mainCores.map((c, k) => ({ id: k, capital: c, cells: 0, pop: 0, troops: 0, ord: 0 }));
    for (let i = 0; i < N; i++) if (owner[i] >= 0) { const r = R[owner[i]]; r.cells++; r.pop += pop[i]; r.ord += st.order[i]; }
    for (const r of R) { r.ord = r.cells ? r.ord / r.cells : 0; r.troops = Math.round(r.pop * mob); Object.assign(r, rankOf(r.troops)); }
    return { realms: R, owner, cores: mainCores };
  }

  return { RULES, RANKS, rankOf, taxEffect, landValues, create, step, realms };
})();
if (typeof module !== 'undefined') module.exports = SekaiRealm;
