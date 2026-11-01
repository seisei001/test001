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

  // 山: 左が明るく右が影。雪の冠はぎざぎざ。後ろに小さな山をもう1つ添える(山脈っぽく)
  function mountain(c, o) {
    const P = pal(o.b), snow = o.snow;
    c.save(); groundShadow(c, 0.5);
    // 奥の小さな山
    poly(c, [[0.15, 0], [0.42, -0.5], [0.7, 0]], P[1], true);
    // 主峰
    poly(c, [[-0.58, 0], [-0.12, -0.92], [0.1, -0.5], [0.34, -0.66 + 0.5 * 0], [0.12, 0]], P[0], true);
    poly(c, [[-0.12, -0.92], [0.1, -0.5], [0.12, 0], [-0.06, 0], [-0.1, -0.46]], P[1], false);   // 影の面
    poly(c, [[-0.58, 0], [-0.12, -0.92], [0.1, -0.5], [0.12, 0]], null, true);                       // 輪郭
    if (snow) {
      poly(c, [[-0.12, -0.92], [-0.27, -0.6], [-0.2, -0.54], [-0.12, -0.62], [-0.03, -0.5], [0.04, -0.58], [0.1, -0.5]], '#ffffff', false);
      poly(c, [[-0.12, -0.92], [0.1, -0.5], [0.04, -0.58], [-0.03, -0.5], [-0.1, -0.62]], '#d4e4ff', false);
      poly(c, [[-0.12, -0.92], [-0.27, -0.6], [-0.2, -0.54], [-0.12, -0.62], [-0.03, -0.5], [0.04, -0.58], [0.1, -0.5]], null, true);
    }
    c.lineWidth = LW * 0.5; c.strokeStyle = P[2]; c.beginPath(); c.moveTo(-0.32, -0.3); c.lineTo(-0.2, -0.46); c.stroke();   // ハイライト
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
  const TABLE = { mountain, volcano, town, castle, pyramid, ziggurat, icepalace, lighthouse, worldtree, shrine };
  function draw(c, kind, o, t) { const f = TABLE[kind]; if (f) f(c, o, t); }
  return { draw, kinds: Object.keys(TABLE) };
})();
if (typeof module !== 'undefined') module.exports = SekaiSprites;
