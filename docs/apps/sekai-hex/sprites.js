// アニメ風の地図の絵(山・火山・街・城・目印)。太い輪郭線・ベタ塗りの明暗2段・白いハイライトで描く。
// 絵は「幅1」の単位座標で描き(原点=足元の中央、上が -y)、呼び出し側が大きさに拡大する。
const SekaiSprites = (function () {
  'use strict';
  const LINE = '#2c2338';          // 輪郭線の色(黒ではなく濃い紫がかった茶)
  const LW = 0.05;                 // 輪郭線の太さ(幅に対する比)
  function poly(c, pts, fill, stroke) {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.lineWidth = LW; c.strokeStyle = LINE; c.lineJoin = 'round'; c.stroke(); }
  }
  function ell(c, x, y, rx, ry, fill, stroke) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 6.2832); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.lineWidth = LW * 0.8; c.strokeStyle = LINE; c.stroke(); } }
  function groundShadow(c, w) { c.save(); c.globalAlpha = 0.28; ell(c, 0, 0.02, w, w * 0.22, '#1a1a2e'); c.restore(); }
  function smoke(c, t, x0, y0, n, rise, r0, col) { // もくもく上がる煙
    for (let k = 0; k < n; k++) {
      const ph = ((t * 0.00035 + k / n) % 1), y = y0 - ph * rise, x = x0 + Math.sin(ph * 5 + k * 2) * 0.05 + ph * 0.06, r = r0 * (0.6 + 1.1 * ph);
      c.save(); c.globalAlpha = 0.9 * (1 - ph); ell(c, x, y, r, r * 0.85, col, true); c.restore();
    }
  }
  // 気候ごとの配色(明るい面・影の面)
  function pal(b) {
    if (b === 3 || b === 8 || b === 9 || b === 11) return ['#8fd172', '#4e9a78', '#e9f6d8'];
    if (b === 5 || b === 7 || b === 10) return ['#f0cc7c', '#c08a5e', '#fff1c8'];
    if (b === 1 || b === 2 || b === 4 || b === 12) return ['#c3cde4', '#7f89b8', '#f2f6ff'];
    return ['#cdb68c', '#8f7c9c', '#f6ecd6'];
  }
  const ROOF = ['#e5533d', '#3f7fd6', '#e8a02e', '#7a52c7', '#3aa57a'];

  // 山: 1つ1つ形を変える。主峰の位置・幅・高さ・左右の非対称・副峰の数を乱数(seed)で変え、高さ比(hr)で大きさを変える。
  // 左は明るく右は影。山裾は輪郭を引かず地面に溶ける。
  function frac(x) { return x - Math.floor(x); }
  function mountain(c, o) {
    const P = pal(o.b), sd = o.seed || 0.5, hr = o.hr == null ? 0.7 : o.hr;
    const px = (frac(sd * 7.3) - 0.5) * 0.36, hh = (0.5 + 0.55 * hr) * (0.85 + 0.3 * frac(sd * 3.1)), wl = 0.28 + 0.2 * frac(sd * 5.7), wr = 0.28 + 0.2 * frac(sd * 11.3);
    const n = 1 + (frac(sd * 13.7) * 3 | 0), lw = LW * (0.5 + 0.4 * hr);
    c.save(); groundShadow(c, 0.45);
    const peaks = [[px, hh, wl, wr]];
    for (let k = 1; k < n; k++) { const sg = k % 2 ? 1 : -1, f = 0.4 + 0.3 * frac(sd * (17 + k * 5)); peaks.push([px + sg * (0.22 + 0.12 * k), hh * f, 0.16 + 0.1 * frac(sd * (3 + k)), 0.16 + 0.1 * frac(sd * (9 + k))]); }
    peaks.sort((u, v) => u[1] - v[1]);   // 低い峰を先(奥)に描く
    const L2 = (col, a) => { c.fillStyle = col; c.strokeStyle = LINE; c.lineWidth = lw; c.lineJoin = 'round'; };
    for (const [x, h, wl2, wr2] of peaks) {
      const kink = x + (frac(x * 31 + h * 17) - 0.5) * 0.08, mid = h * (0.5 + 0.1 * frac(x * 13));
      // 明るい面(左)と影の面(右)
      poly(c, [[x - wl2, 0], [x - wl2 * 0.45, -mid * 0.8], [x, -h], [kink, -mid * 0.6], [kink - 0.03, 0]], P[0], false);
      poly(c, [[x, -h], [x + wr2 * 0.5, -mid * 0.75], [x + wr2, 0], [kink - 0.03, 0], [kink, -mid * 0.6]], P[1], false);
      // 稜線と輪郭(山裾は引かない)
      c.save(); c.strokeStyle = LINE; c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - wl2, 0); c.lineTo(x - wl2 * 0.45, -mid * 0.8); c.lineTo(x, -h); c.lineTo(x + wr2 * 0.5, -mid * 0.75); c.lineTo(x + wr2, 0); c.stroke();
      c.lineWidth = lw * 0.55; c.globalAlpha = 0.6; c.beginPath(); c.moveTo(x, -h); c.lineTo(kink, -mid * 0.6); c.lineTo(kink - 0.03, -0.01); c.stroke(); c.restore();
      if (o.snow && h > 0.55) { const sy = -h * 0.72; poly(c, [[x, -h], [x - wl2 * 0.45 - (h + sy) * 0.2, sy + 0.04], [x - 0.05, sy - 0.02], [x + 0.02, sy + 0.05], [x + wr2 * 0.3, sy - 0.01], [x + wr2 * 0.45, -mid * 0.75]], '#f7fbff', false); }
      c.save(); c.globalAlpha = 0.5; c.strokeStyle = P[2]; c.lineWidth = lw * 0.5; c.beginPath(); c.moveTo(x - wl2 * 0.55, -h * 0.28); c.lineTo(x - wl2 * 0.28, -h * 0.5); c.stroke(); c.restore();
    }
    c.restore();
  }
  // 火山: 頂上の火口が赤く光り、煙が上がる。山腹に溶岩の筋
  function volcano(c, o, t) {
    const P = pal(o.b === 1 ? 5 : 12), glow = 0.65 + 0.35 * Math.sin(t * 0.004 + (o.seed || 0) * 9);
    c.save(); groundShadow(c, 0.58);
    poly(c, [[-0.64, 0], [-0.17, -0.66], [0.17, -0.66], [0.64, 0]], '#8a6a62', true);
    poly(c, [[0.0, -0.66], [0.17, -0.66], [0.64, 0], [0.0, 0]], '#5d4658', false);
    poly(c, [[-0.64, 0], [-0.17, -0.66], [0.17, -0.66], [0.64, 0]], null, true);
    // 溶岩
    c.save(); c.globalAlpha = 0.85 + 0.15 * glow;
    poly(c, [[-0.05, -0.64], [0.03, -0.64], [0.12, -0.3], [0.1, -0.1], [0.02, -0.28]], '#ff6a2a', false);
    poly(c, [[-0.12, -0.62], [-0.07, -0.62], [-0.12, -0.34], [-0.18, -0.2], [-0.2, -0.3]], '#ffa63a', false);
    c.restore();
    ell(c, 0, -0.66, 0.2, 0.065, '#ff4a1c', true); ell(c, 0, -0.665, 0.12 * glow + 0.04, 0.03, '#ffe08a', false);
    smoke(c, t + (o.seed || 0) * 3000, 0, -0.72, 5, 1.0, 0.1, '#e6e1ee');
    c.restore();
  }
  // 街: 色とりどりの屋根の家が数軒と、とんがり屋根の塔。煙突から煙
  function town(c, o, t) {
    const n = o.n || 3, R = ROOF; c.save(); groundShadow(c, 0.55);
    const spots = [[-0.32, -0.02, 0.3], [0.1, 0.0, 0.34], [0.38, -0.04, 0.26], [-0.08, -0.2, 0.28], [0.22, -0.22, 0.24]];
    for (let k = Math.min(n, 5) - 1; k >= 0; k--) {
      const [x, y, w] = spots[k], rc = R[(o.seed * 7 + k * 3 | 0) % R.length], h = w * 0.62;
      poly(c, [[x - w / 2, y], [x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y]], '#fbeed2', true);
      poly(c, [[x + w * 0.1, y], [x + w * 0.1, y - h], [x + w / 2, y - h], [x + w / 2, y]], '#d9c3a0', false);
      poly(c, [[x - w / 2 - 0.03, y - h], [x, y - h - w * 0.5], [x + w / 2 + 0.03, y - h]], rc, true);
      poly(c, [[x, y - h - w * 0.5], [x + w / 2 + 0.03, y - h], [x + 0.02, y - h]], 'rgba(0,0,0,0.18)', false);
      c.fillStyle = '#6b4a3a'; c.fillRect(x - w * 0.08, y - h * 0.5, w * 0.16, h * 0.5);
    }
    if (n >= 4) { // 塔
      poly(c, [[-0.5, 0.0], [-0.5, -0.5], [-0.36, -0.5], [-0.36, 0.0]], '#e8e2f0', true);
      poly(c, [[-0.54, -0.5], [-0.43, -0.82], [-0.32, -0.5]], '#3f7fd6', true);
    }
    smoke(c, t + (o.seed || 0) * 2000, 0.16, -0.46, 3, 0.45, 0.045, '#f3f0f8');
    c.restore();
  }
  // 城: 中央の本丸と両脇の塔、はためく旗
  function castle(c, o, t) {
    c.save(); groundShadow(c, 0.6);
    const wave = Math.sin(t * 0.006 + (o.seed || 0) * 5) * 0.04;
    poly(c, [[-0.55, 0], [-0.55, -0.26], [0.55, -0.26], [0.55, 0]], '#dcd8ec', true);
    poly(c, [[0.1, 0], [0.1, -0.26], [0.55, -0.26], [0.55, 0]], '#aeaad0', false);
    for (const sx of [-0.52, 0.52]) {
      poly(c, [[sx - 0.11, 0], [sx - 0.11, -0.52], [sx + 0.11, -0.52], [sx + 0.11, 0]], '#e6e2f4', true);
      poly(c, [[sx - 0.15, -0.52], [sx, -0.82], [sx + 0.15, -0.52]], '#3f7fd6', true);
    }
    poly(c, [[-0.2, -0.26], [-0.2, -0.7], [0.2, -0.7], [0.2, -0.26]], '#f0ecfa', true);
    poly(c, [[0.04, -0.26], [0.04, -0.7], [0.2, -0.7], [0.2, -0.26]], '#bdb8dc', false);
    poly(c, [[-0.25, -0.7], [0, -1.12], [0.25, -0.7]], '#e5533d', true);
    c.lineWidth = LW * 0.7; c.strokeStyle = LINE; c.beginPath(); c.moveTo(0, -1.12); c.lineTo(0, -1.3); c.stroke();
    poly(c, [[0, -1.3], [0.2 + wave, -1.25], [0, -1.2]], '#ffd23a', true);
    poly(c, [[-0.07, 0], [-0.07, -0.13], [0.07, -0.13], [0.07, 0]], '#6b4a3a', false);
    c.restore();
  }
  // ピラミッド(砂漠)
  function pyramid(c) {
    c.save(); groundShadow(c, 0.55);
    poly(c, [[-0.55, 0], [0, -0.72], [0.1, 0]], '#f5d98b', true);
    poly(c, [[0, -0.72], [0.55, 0], [0.1, 0]], '#c9965a', true);
    poly(c, [[-0.55, 0], [0, -0.72], [0.55, 0]], null, true);
    c.lineWidth = LW * 0.4; c.strokeStyle = 'rgba(80,50,30,.5)'; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(-0.55 + k * 0.1, -k * 0.16); c.lineTo(0.55 - k * 0.1, -k * 0.16); c.stroke(); }
    c.restore();
  }
  // 神殿(熱帯): 階段状の塔と頂上の祠
  function ziggurat(c) {
    c.save(); groundShadow(c, 0.5);
    const steps = [[0.5, 0, 0.16], [0.4, -0.16, 0.16], [0.3, -0.32, 0.16], [0.2, -0.48, 0.14]];
    for (const [w, y, h] of steps) { poly(c, [[-w, y], [-w, y - h], [w, y - h], [w, y]], '#9fd0a2', true); poly(c, [[w * 0.2, y], [w * 0.2, y - h], [w, y - h], [w, y]], '#5ea27c', false); }
    poly(c, [[-0.14, -0.62], [-0.14, -0.78], [0.14, -0.78], [0.14, -0.62]], '#f1e7c6', true);
    poly(c, [[-0.2, -0.78], [0, -0.96], [0.2, -0.78]], '#e8a02e', true);
    c.restore();
  }
  // 氷の宮殿(極地): 水晶のとげ
  function icepalace(c, o, t) {
    c.save(); groundShadow(c, 0.45); const tw = 0.5 + 0.5 * Math.sin(t * 0.005 + (o.seed || 0) * 4);
    for (const [x, h, w, col] of [[-0.3, 0.5, 0.12, '#bfe3ff'], [0.3, 0.55, 0.12, '#bfe3ff'], [0, 0.95, 0.17, '#e2f2ff'], [-0.14, 0.7, 0.1, '#d1ebff'], [0.15, 0.72, 0.1, '#d1ebff']]) {
      poly(c, [[x - w, 0], [x, -h], [x + w, 0]], col, true); poly(c, [[x, -h], [x + w, 0], [x + w * 0.1, 0]], 'rgba(120,150,230,.45)', false);
    }
    c.save(); c.globalAlpha = 0.5 + 0.5 * tw; c.fillStyle = '#fff'; c.beginPath(); c.arc(0.04, -0.82, 0.03, 0, 6.2832); c.fill(); c.restore();
    c.restore();
  }
  // 灯台(海辺): 赤白の縞と、まわる光
  function lighthouse(c, o, t) {
    c.save(); groundShadow(c, 0.3);
    poly(c, [[-0.17, 0], [-0.1, -0.78], [0.1, -0.78], [0.17, 0]], '#fff7ea', true);
    for (const [y0, y1, a, b] of [[-0.18, -0.34, 0.15, 0.13], [-0.5, -0.66, 0.11, 0.1]]) poly(c, [[-a, y0], [-b, y1], [b, y1], [a, y0]], '#e5533d', false);
    poly(c, [[-0.17, 0], [-0.1, -0.78], [0.1, -0.78], [0.17, 0]], null, true);
    poly(c, [[-0.14, -0.78], [-0.14, -0.92], [0.14, -0.92], [0.14, -0.78]], '#ffe58a', true);
    poly(c, [[-0.18, -0.92], [0, -1.08], [0.18, -0.92]], '#3f7fd6', true);
    const a = 0.35 + 0.35 * Math.sin(t * 0.004); c.save(); c.globalAlpha = a; poly(c, [[0.14, -0.86], [0.7, -0.98], [0.7, -0.74]], '#fff3a8', false); c.restore();
    c.restore();
  }
  // 世界樹(森): 大きな丸い樹冠と太い幹。葉がきらめく
  function worldtree(c, o, t) {
    c.save(); groundShadow(c, 0.4);
    poly(c, [[-0.1, 0], [-0.06, -0.4], [0.06, -0.4], [0.1, 0]], '#9a6a4a', true);
    for (const [x, y, r, col] of [[-0.24, -0.62, 0.26, '#52b86a'], [0.24, -0.62, 0.26, '#52b86a'], [0, -0.84, 0.32, '#6fd27c'], [0, -0.58, 0.3, '#63c872']]) ell(c, x, y, r, r * 0.9, col, true);
    ell(c, -0.1, -0.95, 0.12, 0.07, 'rgba(255,255,255,.35)', false);
    c.fillStyle = '#fff6a8'; for (let k = 0; k < 4; k++) { const ph = Math.sin(t * 0.004 + k * 1.7 + (o.seed || 0) * 3); c.globalAlpha = 0.3 + 0.7 * Math.abs(ph); c.beginPath(); c.arc(-0.25 + k * 0.17, -0.7 - (k % 2) * 0.16, 0.025, 0, 6.2832); c.fill(); }
    c.globalAlpha = 1; c.restore();
  }
  // 山の祠・塔(高山の目印)
  function shrine(c) {
    c.save(); groundShadow(c, 0.3);
    poly(c, [[-0.2, 0], [-0.2, -0.3], [0.2, -0.3], [0.2, 0]], '#f2e6d0', true);
    poly(c, [[-0.3, -0.3], [-0.2, -0.46], [0.2, -0.46], [0.3, -0.3]], '#e5533d', true);
    poly(c, [[-0.24, -0.46], [0, -0.7], [0.24, -0.46]], '#e5533d', true);
    poly(c, [[-0.06, 0], [-0.06, -0.18], [0.06, -0.18], [0.06, 0]], '#6b4a3a', false);
    c.restore();
  }
  // ---- 生き物: アニメ風。太い輪郭・大きな丸い頭・ぱっちりした目。動き(尻尾・瞬き・波)つき ----
  function eye(c, x, y, r, t, seed) { // 目: まれに瞬きする
    const bl = Math.sin(t * 0.0011 + seed * 20) > 0.985; c.save();
    if (bl) { c.lineWidth = LW * 0.6; c.strokeStyle = LINE; c.beginPath(); c.moveTo(x - r, y); c.lineTo(x + r, y); c.stroke(); }
    else { ell(c, x, y, r, r * 1.15, LINE, false); ell(c, x + r * 0.3, y - r * 0.4, r * 0.4, r * 0.4, '#fff', false); }
    c.restore();
  }
  function wave(c, w, t, y) { // 海の生き物の足元の波
    c.save(); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = LW * 0.7; c.lineCap = 'round';
    for (let k = -1; k <= 1; k++) { const x = k * w * 0.8, d = Math.sin(t * 0.003 + k * 2) * 0.02; c.beginPath(); c.moveTo(x - 0.14, y + d); c.quadraticCurveTo(x, y - 0.07 + d, x + 0.14, y + d); c.stroke(); }
    c.restore();
  }
  // 四つ足: bd体 bl腹 sz大きさ lg脚の長さ nk首の長さ hd頭の大きさ ea耳(p尖/r丸/l長) hn角(c曲/a枝角) mn たてがみ tk鼻 tl尾(l長/s短/t房) sp斑点 st縞 mk 差し色
  const ANI = {
    cow: { t: 'q', bd: '#f6f2ea', bl: '#fff', sz: 1, lg: 0.14, nk: 0.06, hd: 0.13, ea: 'r', hn: 'c', tl: 't', sp: '#3b3340', mk: '#f4a6a6' },
    sheep: { t: 'q', bd: '#fdfbf4', bl: '#fff', sz: 0.9, lg: 0.12, nk: 0.05, hd: 0.1, ea: 'r', tl: 's', wool: true, mk: '#5a4a50' },
    goat: { t: 'q', bd: '#e8e0d0', bl: '#fff', sz: 0.9, lg: 0.17, nk: 0.08, hd: 0.1, ea: 'p', hn: 'c', tl: 's', mk: '#8c7a68' },
    bison: { t: 'q', bd: '#8a5a3e', bl: '#6a4330', sz: 1.1, lg: 0.12, nk: 0.03, hd: 0.14, ea: 'r', hn: 'c', tl: 't', mn: '#5a3a2a', hump: true },
    deer: { t: 'q', bd: '#d79a5c', bl: '#f6e2c2', sz: 1, lg: 0.24, nk: 0.14, hd: 0.09, ea: 'l', hn: 'a', tl: 's', sp: '#fff6e0' },
    horse: { t: 'q', bd: '#a9693c', bl: '#c68a58', sz: 1.1, lg: 0.26, nk: 0.15, hd: 0.1, ea: 'p', tl: 'l', mn: '#3a2a2a' },
    wolf: { t: 'q', bd: '#8d94a6', bl: '#d7dbe6', sz: 1, lg: 0.18, nk: 0.06, hd: 0.11, ea: 'p', tl: 'l' },
    fox: { t: 'q', bd: '#ee8a3a', bl: '#fff4e2', sz: 0.85, lg: 0.14, nk: 0.05, hd: 0.11, ea: 'p', tl: 'l', tip: '#fff' },
    bear: { t: 'q', bd: '#8a5e44', bl: '#a9785a', sz: 1.15, lg: 0.12, nk: 0.02, hd: 0.14, ea: 'r', tl: 's', mk: '#d9b690' },
    polar: { t: 'q', bd: '#f4f7fb', bl: '#fff', sz: 1.15, lg: 0.12, nk: 0.03, hd: 0.13, ea: 'r', tl: 's', mk: '#5a5560' },
    boar: { t: 'q', bd: '#7a5f52', bl: '#5d473f', sz: 0.95, lg: 0.12, nk: 0.02, hd: 0.13, ea: 'p', tl: 's', tusk: true },
    lion: { t: 'q', bd: '#e7b25a', bl: '#f5d897', sz: 1.05, lg: 0.17, nk: 0.06, hd: 0.12, ea: 'r', tl: 't', mn: '#a8552e' },
    tiger: { t: 'q', bd: '#f09a3e', bl: '#fff3dc', sz: 1.05, lg: 0.16, nk: 0.05, hd: 0.12, ea: 'r', tl: 'l', st: '#3a2e34' },
    elephant: { t: 'q', bd: '#a9b2c6', bl: '#c4cbdb', sz: 1.4, lg: 0.2, nk: 0.03, hd: 0.15, ea: 'big', tl: 's', tk: true, tusk: true },
    giraffe: { t: 'q', bd: '#f1c761', bl: '#f8e1a0', sz: 1.2, lg: 0.3, nk: 0.36, hd: 0.08, ea: 'r', hn: 'k', tl: 's', sp: '#a8683a' },
    camel: { t: 'q', bd: '#d8b077', bl: '#e9cd9f', sz: 1.15, lg: 0.26, nk: 0.18, hd: 0.09, ea: 'r', tl: 's', hump: true },
    monkey: { t: 'q', bd: '#a9714a', bl: '#e6c39a', sz: 0.8, lg: 0.12, nk: 0.05, hd: 0.12, ea: 'r', tl: 'l', mk: '#e6c39a' }
  };
  function quad(c, o, t) {
    const A = ANI[o.a], sd = o.seed || 0, s = A.sz, ly = A.lg, fl = sd > 0.5 ? -1 : 1, bob = Math.sin(t * 0.003 + sd * 9) * 0.008;
    c.save(); c.scale(fl * s * 0.8, s * 0.8); c.translate(0, -0.0); groundShadow(c, 0.42);
    const by = -ly - 0.17 + bob, dk = 'rgba(30,20,40,.28)';
    const leg = (x, far) => { poly(c, [[x - 0.04, by + 0.1], [x - 0.035, 0], [x + 0.035, 0], [x + 0.04, by + 0.1]], A.bd, true); if (far) poly(c, [[x - 0.04, by + 0.1], [x - 0.035, 0], [x + 0.035, 0], [x + 0.04, by + 0.1]], dk, false); };
    leg(-0.1, true); leg(0.2, true);
    // 尾
    const wg = Math.sin(t * 0.006 + sd * 7) * 0.05; c.lineCap = 'round';
    if (A.tl === 'l') { c.lineWidth = 0.09; c.strokeStyle = LINE; c.beginPath(); c.moveTo(-0.28, by - 0.04); c.quadraticCurveTo(-0.42, by - 0.1 + wg, -0.4, by + 0.1 + wg); c.stroke(); c.lineWidth = 0.05; c.strokeStyle = A.bd; c.stroke(); if (A.tip) { ell(c, -0.4, by + 0.1 + wg, 0.04, 0.05, A.tip, false); } }
    else if (A.tl === 't') { c.lineWidth = 0.05; c.strokeStyle = LINE; c.beginPath(); c.moveTo(-0.28, by); c.quadraticCurveTo(-0.36, by + 0.04 + wg, -0.34, by + 0.14); c.stroke(); ell(c, -0.34, by + 0.15, 0.04, 0.05, A.mn || A.sp || LINE, true); }
    else { ell(c, -0.3, by - 0.04, 0.045, 0.04, A.bd, true); }
    // 胴
    ell(c, 0, by, 0.3, 0.17, A.bd, true); ell(c, 0, by + 0.07, 0.24, 0.08, A.bl, false);
    if (A.hump) ell(c, 0.02, by - 0.17, 0.12, 0.1, A.bd, true), ell(c, 0.02, by - 0.17, 0.1, 0.07, A.bd, false);
    if (A.wool) { for (const [x, y] of [[-0.18, -0.06], [-0.05, -0.12], [0.1, -0.1], [0.2, -0.02], [-0.22, 0.04], [0.0, 0.1]]) ell(c, x, by + y, 0.1, 0.09, A.bd, true); ell(c, 0, by, 0.26, 0.15, A.bd, false); }
    if (A.sp) { c.save(); c.fillStyle = A.sp; for (const [x, y, r] of [[-0.12, -0.05, 0.05], [0.08, 0.02, 0.06], [0.16, -0.07, 0.035], [-0.2, 0.06, 0.035]]) { c.beginPath(); c.ellipse(x, by + y, r, r * 0.85, 0, 0, 6.2832); c.fill(); } c.restore(); }
    if (A.st) { c.save(); c.strokeStyle = A.st; c.lineWidth = 0.035; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 0.1, by - 0.16); c.quadraticCurveTo(k * 0.1 + 0.03, by, k * 0.1, by + 0.15); c.stroke(); } c.restore(); }
    ell(c, 0, by, 0.3, 0.17, null, true);
    leg(-0.2, false); leg(0.1, false);
    // 首と頭
    const hx = 0.3 + (A.nk > 0.2 ? -0.06 : 0), hy = by - 0.1 - A.nk, hd = A.hd * 1.15 + bob;
    poly(c, [[0.16, by - 0.1], [hx - hd * 0.8, hy + hd * 0.6], [hx + hd * 0.2, hy + hd * 1.1], [0.32, by + 0.02]], A.bd, true);
    if (A.mn) { for (let k = 0; k < 4; k++) ell(c, 0.2 + k * 0.03 - A.nk * 0.2, hy + hd * 0.4 + k * (A.nk + 0.1) / 4 * 0.7, 0.07, 0.06, A.mn, true); }
    if (A.hn === 'a') { c.save(); c.strokeStyle = '#7a5a46'; c.lineWidth = 0.035; c.lineCap = 'round'; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(hx + d * 0.03 - 0.02, hy - hd * 0.8); c.lineTo(hx + d * 0.1 - 0.02, hy - hd * 2.1); c.moveTo(hx + d * 0.065 - 0.02, hy - hd * 1.5); c.lineTo(hx + d * 0.14 - 0.02, hy - hd * 1.7); c.stroke(); } c.restore(); }
    if (A.hn === 'c') { c.save(); c.strokeStyle = LINE; c.lineWidth = 0.055; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx - 0.04, hy - hd * 0.7); c.quadraticCurveTo(hx - 0.1, hy - hd * 1.9, hx + 0.02, hy - hd * 1.9); c.stroke(); c.strokeStyle = '#f3e7c8'; c.lineWidth = 0.03; c.stroke(); c.restore(); }
    if (A.hn === 'k') { for (const d of [-0.03, 0.03]) { c.strokeStyle = LINE; c.lineWidth = 0.025; c.beginPath(); c.moveTo(hx + d - 0.02, hy - hd * 0.8); c.lineTo(hx + d - 0.02, hy - hd * 1.5); c.stroke(); ell(c, hx + d - 0.02, hy - hd * 1.6, 0.025, 0.025, LINE, false); } }
    const em = A.ea === 'l' ? [0.07, 0.14] : A.ea === 'big' ? [0.15, 0.17] : A.ea === 'p' ? [0.06, 0.13] : [0.06, 0.07];
    ell(c, hx - hd * 0.7, hy - hd * 0.5, em[0], em[1], A.mk && A.ea === 'r' && A.hn === 'c' ? A.bd : A.bd, true); ell(c, hx - hd * 0.7, hy - hd * 0.45, em[0] * 0.5, em[1] * 0.6, '#f4b6b6', false);
    ell(c, hx, hy, hd, hd * 0.9, A.bd, true);
    if (A.t === 'q' && A.mk && !A.wool) ell(c, hx + hd * 0.55, hy + hd * 0.35, hd * 0.55, hd * 0.42, A.mk, true);
    else ell(c, hx + hd * 0.6, hy + hd * 0.3, hd * 0.5, hd * 0.4, A.bl, true);
    if (A.wool) { ell(c, hx, hy, hd, hd * 0.9, '#5a4a50', true); ell(c, hx - 0.02, hy - hd * 0.9, 0.09, 0.06, A.bd, true); }
    if (A.tk) { c.lineWidth = 0.075; c.strokeStyle = LINE; c.lineCap = 'round'; const sw = Math.sin(t * 0.004 + sd * 5) * 0.04; c.beginPath(); c.moveTo(hx + hd * 0.7, hy + 0.02); c.quadraticCurveTo(hx + hd * 1.3 + sw, hy + 0.14, hx + hd * 1.1 + sw * 2, hy + 0.22); c.stroke(); c.lineWidth = 0.045; c.strokeStyle = A.bd; c.stroke(); }
    if (A.tusk) { poly(c, [[hx + hd * 0.4, hy + hd * 0.6], [hx + hd * 0.9, hy + hd * 0.9], [hx + hd * 0.5, hy + hd * 0.8]], '#fff8e0', true); }
    ell(c, hx + hd * 0.9, hy + hd * 0.3, hd * 0.12, hd * 0.1, LINE, false);
    eye(c, hx + hd * 0.2, hy - hd * 0.1, hd * 0.2, t, sd);
    c.restore();
  }
  // 鳥: 丸い体・大きな頭。翼がぱたぱた
  const BIRD = { owl: { bd: '#b58a62', bl: '#f3e4cc', bk: '#f0b43a', big: 0.5, ears: true }, eagle: { bd: '#7a5238', bl: '#a77a52', hd: '#fff', bk: '#f0b43a', big: 0.25, wide: true }, parrot: { bd: '#e6483d', bl: '#f7a23b', wg: '#2f86d6', bk: '#f4efe0', big: 0.3, crest: '#2fb26a' } };
  function bird(c, o, t) {
    const B = BIRD[o.a], sd = o.seed || 0, fl = sd > 0.5 ? -1 : 1, fw = Math.sin(t * (B.wide ? 0.006 : 0.002) + sd * 9), bob = Math.abs(Math.sin(t * 0.003 + sd * 5)) * 0.02;
    c.save(); c.scale(fl * 0.6, 0.6); groundShadow(c, 0.3);
    poly(c, [[-0.06, -0.06], [-0.06, 0], [-0.1, 0]], '#f0b43a', true); poly(c, [[0.06, -0.06], [0.06, 0], [0.1, 0]], '#f0b43a', true);
    if (B.crest || B.wide) poly(c, [[-0.12, -0.2], [-0.4, 0.0], [-0.22, -0.02]], B.bd, true);
    ell(c, 0, -0.32 - bob, 0.22, 0.26, B.bd, true); ell(c, 0.02, -0.28 - bob, 0.14, 0.18, B.bl, false);
    const wy = -0.34 - bob; poly(c, [[-0.05, wy - 0.1], [-0.3, wy - (B.wide ? 0.34 : 0.16) * (0.5 + fw * 0.5) - 0.1], [-0.35, wy + 0.08], [-0.08, wy + 0.16]], B.wg || B.bd, true);
    if (B.wide) poly(c, [[0.0, wy - 0.1], [0.28, wy - 0.4 * (0.5 + fw * 0.5) - 0.1], [0.34, wy + 0.06], [0.06, wy + 0.14]], B.bd, true);
    const hy = -0.58 - bob; ell(c, 0.04, hy, 0.17, 0.15, B.hd || B.bd, true);
    if (B.ears) { poly(c, [[-0.1, hy - 0.08], [-0.12, hy - 0.26], [0.0, hy - 0.14]], B.bd, true); poly(c, [[0.14, hy - 0.08], [0.18, hy - 0.26], [0.06, hy - 0.14]], B.bd, true); }
    if (B.crest) poly(c, [[-0.02, hy - 0.12], [0.02, hy - 0.3], [0.08, hy - 0.12]], B.crest, true);
    for (const x of [-0.03, 0.12]) { ell(c, x, hy - 0.01, 0.055 * (1 + B.big), 0.06 * (1 + B.big), '#fff', true); eye(c, x + 0.005, hy, 0.025 * (1 + B.big), t, sd); }
    poly(c, [[0.04, hy + 0.02], [0.2, hy + 0.06], [0.05, hy + 0.1]], B.bk, true);
    c.restore();
  }
  function penguin(c, o, t) {
    const sd = o.seed || 0, sw = Math.sin(t * 0.004 + sd * 6) * 0.04; c.save(); c.scale(0.6, 0.6); groundShadow(c, 0.3); c.rotate(sw);
    poly(c, [[-0.1, 0], [-0.1, -0.04], [-0.02, -0.04], [-0.02, 0]], '#f29a2e', true); poly(c, [[0.02, 0], [0.02, -0.04], [0.1, -0.04], [0.1, 0]], '#f29a2e', true);
    ell(c, 0, -0.38, 0.26, 0.36, '#34324a', true); ell(c, 0.02, -0.34, 0.17, 0.28, '#fff', false);
    poly(c, [[-0.22, -0.46], [-0.4, -0.2 + sw * 2], [-0.3, -0.18], [-0.2, -0.3]], '#34324a', true); poly(c, [[0.22, -0.46], [0.4, -0.2 - sw * 2], [0.3, -0.18], [0.2, -0.3]], '#34324a', true);
    eye(c, -0.07, -0.58, 0.04, t, sd); eye(c, 0.11, -0.58, 0.04, t, sd); poly(c, [[-0.03, -0.52], [0.1, -0.52], [0.035, -0.45]], '#f29a2e', true);
    c.restore();
  }
  function seal(c, o, t) {
    const sd = o.seed || 0; c.save(); c.scale(0.7, 0.7); groundShadow(c, 0.42);
    ell(c, -0.05, -0.16, 0.34, 0.16, '#a9a7b8', true); ell(c, 0, -0.12, 0.26, 0.08, '#d9d8e4', false);
    poly(c, [[-0.36, -0.12], [-0.5, -0.04 + Math.sin(t * 0.005) * 0.03], [-0.38, -0.05]], '#8f8da2', true);
    ell(c, 0.28, -0.3, 0.13, 0.12, '#a9a7b8', true); ell(c, 0.36, -0.27, 0.05, 0.04, LINE, false); eye(c, 0.27, -0.33, 0.025, t, sd);
    c.restore();
  }
  // 海の生き物
  function whale(c, o, t) {
    const sd = o.seed || 0, bob = Math.sin(t * 0.002 + sd * 8) * 0.02; c.save(); c.scale(0.8, 0.8); c.translate(0, bob);
    ell(c, 0, -0.14, 0.38, 0.17, '#4f86d9', true); ell(c, 0.03, -0.08, 0.3, 0.08, '#d8e8ff', false); ell(c, 0, -0.14, 0.38, 0.17, null, true);
    poly(c, [[-0.34, -0.14], [-0.5, -0.34], [-0.42, -0.1], [-0.52, -0.02], [-0.32, -0.1]], '#4f86d9', true); eye(c, 0.22, -0.18, 0.025, t, sd);
    const sp = (t * 0.0006 + sd) % 1; if (sp < 0.5) { c.globalAlpha = 1 - sp * 2; c.strokeStyle = '#d9f1ff'; c.lineWidth = 0.04; c.lineCap = 'round'; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(0.1, -0.3); c.quadraticCurveTo(0.1 + d * 0.1, -0.5 - sp * 0.3, 0.1 + d * 0.2, -0.3); c.stroke(); } c.globalAlpha = 1; }
    wave(c, 0.4, t, 0.0); c.restore();
  }
  function dolphin(c, o, t) {
    const sd = o.seed || 0, ph = (t * 0.0012 + sd) % 1, jy = -Math.sin(ph * 3.14159) * 0.3; c.save(); c.scale(0.7, 0.7); c.translate(0, jy); c.rotate((0.5 - ph) * 0.9);
    c.fillStyle = '#6ab0e8'; poly(c, [[-0.36, -0.1], [-0.2, -0.22], [0.1, -0.22], [0.3, -0.12], [0.42, -0.12], [0.3, -0.06], [0.1, -0.04], [-0.2, -0.04]], '#6ab0e8', true);
    poly(c, [[-0.36, -0.1], [-0.5, -0.22], [-0.46, -0.1], [-0.5, 0.0]], '#6ab0e8', true); poly(c, [[-0.05, -0.22], [0.0, -0.36], [0.06, -0.22]], '#4b8fd0', true); eye(c, 0.2, -0.16, 0.02, t, sd);
    c.restore(); c.save(); c.scale(0.7, 0.7); wave(c, 0.4, t, 0.0); c.restore();
  }
  function shark(c, o, t) {
    const sd = o.seed || 0, dx = Math.sin(t * 0.0015 + sd * 7) * 0.15; c.save(); c.scale(0.7, 0.7); c.translate(dx, 0);
    poly(c, [[-0.14, 0], [0.0, -0.4], [0.18, 0]], '#7a869c', true); poly(c, [[0.0, -0.4], [0.18, 0], [0.04, 0]], 'rgba(30,40,70,.3)', false); wave(c, 0.35, t, 0.0); c.restore();
  }
  function octopus(c, o, t) {
    const sd = o.seed || 0; c.save(); c.scale(0.7, 0.7);
    c.strokeStyle = LINE; c.lineCap = 'round'; for (let k = -2; k <= 2; k++) { const w = Math.sin(t * 0.004 + k) * 0.05; c.lineWidth = 0.09; c.beginPath(); c.moveTo(k * 0.09, -0.2); c.quadraticCurveTo(k * 0.16 + w, -0.1, k * 0.2 + w * 2, 0.0); c.stroke(); c.lineWidth = 0.05; c.strokeStyle = o.a === 'squid' ? '#d46a8a' : '#e0809c'; c.stroke(); c.strokeStyle = LINE; }
    ell(c, 0, -0.38, 0.22, 0.24, o.a === 'squid' ? '#d46a8a' : '#e0809c', true); ell(c, -0.08, -0.46, 0.06, 0.05, 'rgba(255,255,255,.5)', false);
    eye(c, -0.08, -0.32, 0.04, t, sd); eye(c, 0.08, -0.32, 0.04, t, sd); wave(c, 0.3, t, 0.02); c.restore();
  }
  function ship(c, o, t) {
    const sd = o.seed || 0, rk = Math.sin(t * 0.002 + sd * 6) * 0.05, big = o.a === 'ship'; c.save(); c.scale(0.8, 0.8); c.rotate(rk);
    poly(c, [[-0.34, -0.14], [0.34, -0.14], [0.22, 0], [-0.22, 0]], '#9a5c3a', true); poly(c, [[-0.34, -0.14], [0.34, -0.14], [0.32, -0.1], [-0.32, -0.1]], '#e5533d', false);
    c.lineWidth = LW * 0.8; c.strokeStyle = LINE; c.beginPath(); c.moveTo(0, -0.14); c.lineTo(0, -0.8); c.stroke();
    poly(c, [[0.03, -0.76], [0.3, -0.2], [0.03, -0.2]], '#fff8ea', true); poly(c, [[-0.03, -0.7], [-0.26, -0.2], [-0.03, -0.2]], '#f3e3c3', true);
    if (big) poly(c, [[0.0, -0.8], [0.16, -0.76], [0.0, -0.72]], '#e5533d', true);
    c.restore(); wave(c, 0.4, t, 0.01);
  }
  function mermaid(c, o, t) {
    const sd = o.seed || 0, sw = Math.sin(t * 0.004 + sd * 5) * 0.05; c.save(); c.scale(0.7, 0.7);
    poly(c, [[-0.08, -0.3], [0.08, -0.3], [0.06, -0.1], [0.2 + sw, 0.0], [0.0, -0.04], [-0.2 - sw, 0.0], [-0.06, -0.1]], '#3ec2b0', true);
    ell(c, 0, -0.42, 0.1, 0.13, '#ffe0c4', true); ell(c, 0, -0.5, 0.13, 0.08, '#ff9a5a', true); poly(c, [[-0.12, -0.5], [-0.14, -0.3 + sw], [-0.06, -0.4]], '#ff9a5a', true); eye(c, -0.03, -0.42, 0.02, t, sd); eye(c, 0.04, -0.42, 0.02, t, sd);
    wave(c, 0.3, t, 0.0); c.restore();
  }
  function serpent(c, o, t) {
    const sd = o.seed || 0; c.save(); c.scale(0.8, 0.8);
    for (let k = 2; k >= 0; k--) { const x = -0.3 + k * 0.28, h = 0.2 + 0.08 * Math.sin(t * 0.003 + k * 1.5 + sd * 4); ell(c, x, -h * 0.4, 0.13, h, '#3ea88a', true); ell(c, x, -h * 0.2, 0.09, h * 0.5, '#8fe0bc', false); }
    ell(c, 0.5, -0.38, 0.13, 0.1, '#3ea88a', true); poly(c, [[0.56, -0.38], [0.7, -0.34], [0.58, -0.3]], '#e5533d', true); eye(c, 0.5, -0.4, 0.025, t, sd); poly(c, [[0.42, -0.46], [0.46, -0.6], [0.5, -0.46]], '#e5533d', true);
    wave(c, 0.5, t, 0.0); c.restore();
  }
  function dragon(c, o, t) {
    const sd = o.seed || 0, fl = sd > 0.5 ? -1 : 1, fw = Math.sin(t * 0.005 + sd * 9); c.save(); c.scale(fl * 0.85, 0.85); groundShadow(c, 0.4);
    poly(c, [[-0.1, -0.2], [-0.4, -0.5 - 0.2 * fw], [-0.5, -0.1], [-0.2, -0.06]], '#c04a6a', true); // 翼
    ell(c, 0, -0.18, 0.28, 0.16, '#5aa86a', true); ell(c, 0.02, -0.12, 0.2, 0.07, '#f2e0a0', false);
    c.strokeStyle = LINE; c.lineWidth = 0.1; c.lineCap = 'round'; c.beginPath(); c.moveTo(-0.26, -0.16); c.quadraticCurveTo(-0.48, -0.12, -0.5, -0.28 + fw * 0.04); c.stroke(); c.strokeStyle = '#5aa86a'; c.lineWidth = 0.06; c.stroke();
    for (const x of [-0.12, 0.14]) poly(c, [[x - 0.04, -0.08], [x - 0.04, 0], [x + 0.05, 0], [x + 0.05, -0.08]], '#5aa86a', true);
    poly(c, [[0.18, -0.24], [0.28, -0.46], [0.36, -0.44], [0.28, -0.22]], '#5aa86a', true); ell(c, 0.36, -0.5, 0.12, 0.09, '#5aa86a', true);
    poly(c, [[0.3, -0.56], [0.33, -0.7], [0.38, -0.56]], '#f2e0a0', true); eye(c, 0.37, -0.52, 0.025, t, sd);
    if (fw > 0.6) { c.save(); c.globalAlpha = 0.9; ell(c, 0.56, -0.48, 0.1 * fw, 0.05 * fw, '#ff8a2a', false); ell(c, 0.55, -0.48, 0.06 * fw, 0.03 * fw, '#ffe08a', false); c.restore(); }
    c.restore();
  }
  // 植物など
  function cactus(c) { c.save(); c.scale(0.6, 0.6); groundShadow(c, 0.25); ell(c, 0, -0.3, 0.1, 0.32, '#5cb868', true); ell(c, -0.2, -0.32, 0.06, 0.14, '#5cb868', true); ell(c, 0.2, -0.42, 0.06, 0.14, '#5cb868', true); poly(c, [[-0.14, -0.2], [-0.2, -0.2], [-0.2, -0.3], [-0.14, -0.3]], '#5cb868', true); ell(c, 0, -0.64, 0.04, 0.04, '#ff8ab0', true); c.restore(); }
  function mushroom(c) { c.save(); c.scale(0.55, 0.55); groundShadow(c, 0.25); poly(c, [[-0.09, 0], [-0.07, -0.26], [0.07, -0.26], [0.09, 0]], '#fbeed2', true); poly(c, [[-0.3, -0.24], [-0.2, -0.5], [0.2, -0.5], [0.3, -0.24]], '#e5533d', true); for (const [x, y] of [[-0.1, -0.38], [0.1, -0.4], [0.0, -0.3]]) ell(c, x, y, 0.04, 0.03, '#fff', false); c.restore(); }
  function bush(c) { c.save(); c.scale(0.6, 0.6); groundShadow(c, 0.3); for (const [x, y, r] of [[-0.16, -0.12, 0.16], [0.16, -0.12, 0.16], [0, -0.22, 0.2]]) ell(c, x, y, r, r * 0.85, '#5cb868', true); ell(c, -0.06, -0.3, 0.07, 0.04, 'rgba(255,255,255,.4)', false); c.restore(); }
  function fairy(c, o, t) { const sd = o.seed || 0, fl = Math.sin(t * 0.02) * 0.5 + 0.5, by = -0.4 + Math.sin(t * 0.003 + sd * 6) * 0.06; c.save(); c.scale(0.55, 0.55); for (const d of [-1, 1]) ell(c, d * 0.12, by - 0.04, 0.12 * (0.4 + fl * 0.6), 0.1, 'rgba(190,230,255,.85)', true); ell(c, 0, by, 0.06, 0.09, '#ffd3e6', true); ell(c, 0, by - 0.12, 0.06, 0.06, '#ffe6d0', true); c.globalAlpha = 0.7; c.fillStyle = '#fff6a8'; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(Math.sin(t * 0.004 + k * 2) * 0.2, by + 0.1 + k * 0.1, 0.02, 0, 6.2832); c.fill(); } c.restore(); }
  function anchor(c) { c.save(); c.scale(0.55, 0.55); groundShadow(c, 0.2); c.strokeStyle = LINE; c.lineWidth = 0.12; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -0.7); c.lineTo(0, -0.1); c.moveTo(-0.14, -0.55); c.lineTo(0.14, -0.55); c.moveTo(-0.24, -0.24); c.quadraticCurveTo(0, 0.04, 0.24, -0.24); c.stroke(); c.strokeStyle = '#8fa0b8'; c.lineWidth = 0.06; c.stroke(); c.restore(); }
  function island(c, o, t) { c.save(); c.scale(0.7, 0.7); ell(c, 0, -0.04, 0.34, 0.1, '#f0d28a', true); poly(c, [[-0.02, -0.06], [0.0, -0.5], [0.05, -0.06]], '#9a6a4a', true); for (const [dx, dy] of [[-0.3, -0.04], [0.28, -0.06], [-0.2, 0.06], [0.2, 0.04]]) { const w = Math.sin(t * 0.003 + dx * 9) * 0.03; c.strokeStyle = LINE; c.lineWidth = 0.1; c.lineCap = 'round'; c.beginPath(); c.moveTo(0.01, -0.5); c.quadraticCurveTo(dx * 0.6, -0.62 + w, dx, -0.42 + dy); c.stroke(); c.strokeStyle = '#4fb86a'; c.lineWidth = 0.06; c.stroke(); } wave(c, 0.4, t, 0.04); c.restore(); }
  function animal(c, o, t) {
    const a = o.a, A = ANI[a];
    if (A) return quad(c, o, t);
    if (BIRD[a]) return bird(c, o, t);
    const F = { penguin, seal, whale, dolphin, shark, octopus, squid: octopus, ship, sail: ship, mermaid, serpent, dragon, cactus, mushroom, bush, fairy, anchor, island }[a];
    if (F) F(c, o, t);
  }
  const TABLE = { animal, mountain, volcano, town, castle, pyramid, ziggurat, icepalace, lighthouse, worldtree, shrine };
  function draw(c, kind, o, t) { const f = TABLE[kind]; if (f) f(c, o, t); }
  return { draw, kinds: Object.keys(TABLE) };
})();
if (typeof module !== 'undefined') module.exports = SekaiSprites;
