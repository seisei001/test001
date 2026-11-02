// アニメ風の地図の絵(山・火山・街・城・目印)。太い輪郭線・ベタ塗りの明暗2段・白いハイライトで描く。
// 絵は「幅1」の単位座標で描き(原点=足元の中央、上が -y)、呼び出し側が大きさに拡大する。
const SekaiSprites = (function () {
  'use strict';
  const LINE = '#2c2338';          // 輪郭線の色(黒ではなく濃い紫がかった茶)
  let LW = 0.05;                 // 輪郭線の太さ(幅に対する比)
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
    smoke(c, t + (o.seed || 0) * 3000, 0, -0.72, o.active ? 10 : 5, o.active ? 1.7 : 1.0, o.active ? 0.14 : 0.1, o.active ? '#6a6070' : '#e6e1ee');
    c.restore();
  }
  // ---- 街: 実在の歴史的な街をもとにした17種。様式(建物の形・色)・配置の型・城壁・目印の建物が街ごとに違う ----
  // igloo=イヌイットのイグルー集落 turf=北欧の芝屋根の長屋 russian=ロシアの木造集落 hansa=ハンザ同盟の港町(ベルゲン) yurt=モンゴルのゲル
  // medina=イスラムのメディナ(フェズ) djenne=西アフリカの泥の街(ジェンネ) medieval=中世欧州の城壁都市 chinese=中国の城郭都市(平遥)
  // japan=日本の城下町(姫路) starfort=星形要塞都市 greek=ギリシャの白い丘の町(サントリーニ) roman=古代ローマ都市 kraal=円形の泥小屋の集落
  // stilt=東南アジアの高床の村 inca=インカの段々の石の街(マチュピチュ) tibet=チベットの宮殿の街(ラサ)
  const TT = {
    igloo:    { lay: 'scatter', wall: null, hk: 'dome', wc: ['#f4f8ff'], rc: ['#dfeaff'], gr: '#e6eef8', lm: null, r: 0.3 },
    turf:     { lay: 'line', wall: null, hk: 'turf', wc: ['#7a5a42'], rc: ['#6fa05a', '#5f9150'], gr: '#a8b88a', lm: null, r: 0.34 },
    russian:  { lay: 'ring', wall: null, hk: 'gable', wc: ['#a8754a', '#9a6a42'], rc: ['#6b4a3a', '#5a4a46'], gr: '#c9bf9a', lm: 'onion', r: 0.32 },
    hansa:    { lay: 'line', wall: null, hk: 'gable', tall: 1, wc: ['#d94f3d', '#e8b84a', '#3f86c7', '#f2eadb', '#6aa66a'], rc: ['#4a3f4a', '#5a4048'], gr: '#cdbf9c', lm: null, r: 0.36 },
    yurt:     { lay: 'scatter', wall: null, hk: 'cone', wc: ['#f1ecdc'], rc: ['#ebe5d2', '#e0d9c4'], gr: '#c8c490', lm: null, r: 0.34 },
    medina:   { lay: 'ring', dense: 1, wall: 'round', wcol: '#cdb089', hk: 'flat', wc: ['#d8b98a', '#c9a679', '#e0c79c'], rc: ['#b99468'], gr: '#dcc59a', lm: 'minaret', r: 0.36 },
    djenne:   { lay: 'ring', dense: 1, wall: null, hk: 'mud', wc: ['#b98a5e', '#a97b52', '#c79a6a'], rc: ['#9a6e48'], gr: '#d6b98a', lm: 'mosque', r: 0.34 },
    medieval: { lay: 'ring', wall: 'round', wcol: '#c9b79c', hk: 'gable', wc: ['#f2e3c4'], rc: ['#d9603b', '#c4482e', '#e07a4a', '#b8553a', '#8f6a58'], gr: '#cfc59a', lm: 'tower', r: 0.4 },
    chinese:  { lay: 'grid', wall: 'rect', wcol: '#9a8a74', hk: 'hip', wc: ['#e9d7b4', '#d9c79e'], rc: ['#5f6b78', '#4b5563', '#6a7482'], gr: '#cfc59a', lm: 'pagoda', r: 0.4 },
    japan:    { lay: 'grid', wall: 'moat', wcol: '#2f72c4', hk: 'hip', wc: ['#f4f0e6', '#e9e1d0'], rc: ['#4a4f5c', '#3d4250'], gr: '#c4c496', lm: 'keep', r: 0.4 },
    starfort: { lay: 'ring', wall: 'star', wcol: '#b9a58a', hk: 'gable', wc: ['#f2e3c4'], rc: ['#d9603b', '#c4482e', '#e07a4a', '#b8553a'], gr: '#b4c48a', lm: 'tower', r: 0.38 },
    greek:    { lay: 'terrace', wall: null, hk: 'flat', dome: 1, wc: ['#fbfbf6', '#f4f4ec'], rc: ['#2f72c4', '#fbfbf6'], gr: '#d6c8a4', lm: 'bluedome', r: 0.36 },
    roman:    { lay: 'grid', wall: 'rect', wcol: '#d2c3a6', hk: 'hip', wc: ['#f1e2c0', '#e8d6b0'], rc: ['#cf6b43', '#c25a38', '#d97a50'], gr: '#cfc59a', lm: 'temple', r: 0.4 },
    kraal:    { lay: 'ring', wall: null, hk: 'cone', wc: ['#a9764f', '#9a6a45'], rc: ['#c9a24d', '#b8923f'], gr: '#d2b878', lm: null, r: 0.32 },
    stilt:    { lay: 'line', wall: null, hk: 'stilt', wc: ['#a8825a'], rc: ['#c9a24d', '#b8923f'], gr: '#7aa88a', lm: null, r: 0.34, water: 1 },
    inca:     { lay: 'terrace', wall: null, hk: 'gable', wc: ['#a9a79b', '#9c9a8e'], rc: ['#d6bf6a', '#c9ad55'], gr: '#a9b48a', lm: null, r: 0.36, terr: '#9a9a8c' },
    tibet:    { lay: 'terrace', wall: null, hk: 'flat', band: 1, wc: ['#f7f4ec'], rc: ['#8a3a30'], gr: '#c8bc98', lm: 'palace', r: 0.36 }
  };
  function rng(sd) { let a = Math.floor(frac(sd) * 4294967296) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // ---- 外部素材(Kenney RTS Medieval, CC0): 家・人の絵。assets/LICENSE-kenney-rts.txt ----
  const ASSET = {};
  (function () { if (typeof Image === 'undefined') return; for (const n of ['struct0', 'struct1', 'struct2', 'struct3', 'struct4', 'unit', 'env']) { const im = new Image(); im.src = 'assets/' + n + '.png?v=' + (window.APP_VER || '0'); ASSET[n] = im; } })();
  const KHOUSE = [8, 9, 16, 17, 19, 20, 22, 2, 10, 18];
  function kimg(c, set, idx, x, y, w) {
    const im = ASSET[set]; if (!im || !im.complete || !im.naturalWidth) return false;
    c.imageSmoothingEnabled = false; c.drawImage(im, (idx % 8) * 64, ((idx / 8) | 0) * 64, 64, 64, x - w / 2, y - w * 0.94, w, w); return true;
  }
  const TCACHE = new Map();
  function townLayout(o) {
    const sx = o.sx || 0, sy = o.sy || 0, ty = TT[o.ty] ? o.ty : 'medieval', T = TT[ty], key = ty + '|' + (o.seed || 0).toFixed(5) + '|' + (o.n || 3) + '|' + sx.toFixed(1) + '|' + sy.toFixed(1);
    let Lo = TCACHE.get(key); if (Lo) return Lo;
    const r = rng((o.seed || 0.5) * 7.77 + 0.1), n = o.n || 3, big = n >= 5, sq = 0.52, R = T.r * (n >= 4 ? 1 : 0.85), cnt = 12 + n * 8, coast = !!(sx || sy), houses = [];
    const ok = (x, y) => !coast || x * sx + (y / sq) * sy >= -0.05;       // 海側(法線の逆)には建てない
    const pick = a => a[(r() * a.length) | 0];
    const add = (x, y, w, h, extra) => houses.push(Object.assign({ x, y, w, h, wc: pick(T.wc), rc: pick(T.rc), k: T.hk, flip: r() < 0.5 }, extra || {}));
    if (T.lay === 'ring') {
      for (let k = 0, tr = 0; k < cnt && tr < cnt * 14; tr++) {
        const a = r() * 6.2832, rd = R * Math.pow(r(), T.dense ? 0.85 : 0.65), x = Math.cos(a) * rd, y = Math.sin(a) * rd * sq; if (!ok(x, y)) continue;
        const near = rd < 0.1; add(x, y, (near ? 0.05 : 0.045 + r() * 0.04), 0.05 + r() * 0.03); k++;
      }
    } else if (T.lay === 'grid') {
      const sp = 0.095; for (let gx = -R; gx <= R; gx += sp) for (let gy = -R; gy <= R; gy += sp) {
        if (r() < 0.22) continue; const x = gx + (r() - 0.5) * 0.02, y = (gy + (r() - 0.5) * 0.02) * sq; if (!ok(x, y)) continue; if (Math.abs(x) < 0.03 && Math.abs(y) < 0.03) continue;
        add(x, y, 0.062 + r() * 0.02, 0.05 + r() * 0.025);
      }
    } else if (T.lay === 'line') {
      const ax = coast ? -sy : 1, ay = coast ? sx : 0;                                  // 海岸に平行な線
      for (let row = 0; row < 3; row++) for (let t = -R; t <= R; t += 0.07) {
        if (r() < 0.2) continue; const off = (row - 0.2) * 0.1, x = ax * t + sx * off, y = (ay * t + sy * off) * sq; if (!ok(x, y + 0.0001) && row === 0) continue;
        const tall = T.tall ? 0.04 + r() * 0.05 : 0; add(x, y, 0.042 + r() * 0.025, 0.045 + tall + r() * 0.02);
      }
    } else if (T.lay === 'scatter') {
      for (const [rr, c0] of [[0.0, 1], [0.13, 6], [0.25, 11], [0.37, 16]]) for (let k = 0; k < c0; k++) {
        if (rr > R + 0.02) continue; const a = k / c0 * 6.2832 + r() * 0.3, x = Math.cos(a) * rr, y = Math.sin(a) * rr * sq; if (!ok(x, y) || (n < 4 && rr > 0.26) || r() < 0.12) continue; add(x, y, 0.07, 0.05);
      }
    } else if (T.lay === 'terrace') {
      const rows = 4 + (n >= 4 ? 1 : 0); for (let j = 0; j < rows; j++) {
        const yy = -0.22 + j * 0.1, half = (0.12 + j * 0.07) * (R / 0.36);
        for (let x = -half; x <= half; x += 0.075) { if (r() < 0.12) continue; const xx = x + (r() - 0.5) * 0.02; if (ok(xx, yy)) add(xx, yy, 0.06 + r() * 0.02, 0.05 + r() * 0.02, { row: j, dome: T.dome && r() < 0.3 }); }
      }
    }
    houses.sort((a, b) => a.y - b.y);
    const gate = coast ? Math.atan2(sy, sx) : r() * 6.2832, towers = [];
    if (T.wall === 'round' || T.wall === 'star') for (let k = 0; k < 6; k++) { const a = k / 6 * 6.2832 + r() * 0.3, x = Math.cos(a) * (R + 0.04), y = Math.sin(a) * (R + 0.04) * sq; if (ok(x, y)) towers.push({ x, y }); }
    if (T.wall === 'rect') for (const [sx2, sy2] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) towers.push({ x: sx2 * (R + 0.05), y: sy2 * (R + 0.05) * sq });
    Lo = { houses, towers, R, sq, T, ty, gate, big }; if (TCACHE.size > 400) TCACHE.clear(); TCACHE.set(key, Lo); return Lo;
  }
  function stroke0(c, w) { c.lineWidth = LW * w; c.strokeStyle = LINE; c.lineJoin = 'round'; }
  function bhouse(c, h) {
    const { x, y, w } = h, hh = h.h;
    if (h.k === 'gable') { const q = Math.abs((x * 9173 + y * 6151) | 0), set = 'struct' + (q % 5), idx = KHOUSE[(q >> 3) % KHOUSE.length]; if (kimg(c, set, idx, x, y, w * 1.7)) return; }
    c.save(); stroke0(c, 0.35);
    const wall = () => { c.fillStyle = h.wc; c.fillRect(x - w / 2, y - hh, w, hh); c.strokeRect(x - w / 2, y - hh, w, hh); c.fillStyle = 'rgba(70,45,35,.22)'; c.fillRect(x + (h.flip ? -w / 2 : w * 0.05), y - hh, w * 0.45, hh); };
    if (h.k === 'gable') { wall(); const top = y - hh, rh = w * 0.55; c.beginPath(); c.moveTo(x - w * 0.6, top); c.lineTo(x, top - rh); c.lineTo(x + w * 0.6, top); c.closePath(); c.fillStyle = h.rc; c.fill(); c.stroke(); c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.moveTo(x, top - rh); c.lineTo(x + w * 0.6, top); c.lineTo(x, top); c.closePath(); c.fill(); }
    else if (h.k === 'flat' || h.k === 'mud') { wall(); const top = y - hh; c.fillStyle = h.k === 'mud' ? h.wc : h.rc; if (h.dome) { c.beginPath(); c.ellipse(x, top, w * 0.4, w * 0.4, 0, Math.PI, 0); c.fill(); c.stroke(); } else { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x - w / 2, top, w, hh * 0.14); }
      if (h.k === 'mud') { c.strokeStyle = LINE; c.lineWidth = LW * 0.4; for (const d of [-0.3, 0, 0.3]) { c.beginPath(); c.moveTo(x + d * w, top); c.lineTo(x + d * w, top - w * 0.2); c.stroke(); } }
      c.fillStyle = 'rgba(60,40,30,.55)'; c.fillRect(x - w * 0.08, y - hh * 0.55, w * 0.16, hh * 0.55); if (h.band) { c.fillStyle = h.rc; c.fillRect(x - w / 2, top, w, hh * 0.18); } }
    else if (h.k === 'hip') { const wl = hh * 0.55; c.fillStyle = h.wc; c.fillRect(x - w * 0.42, y - wl, w * 0.84, wl); c.strokeRect(x - w * 0.42, y - wl, w * 0.84, wl); const top = y - wl; c.beginPath(); c.moveTo(x - w * 0.62, top + w * 0.04); c.lineTo(x - w * 0.4, top - w * 0.3); c.lineTo(x + w * 0.4, top - w * 0.3); c.lineTo(x + w * 0.62, top + w * 0.04); c.closePath(); c.fillStyle = h.rc; c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x - w * 0.4, top - w * 0.3, w * 0.8, w * 0.05); }
    else if (h.k === 'cone') { const wl = hh * 0.5; c.fillStyle = h.wc; c.fillRect(x - w * 0.4, y - wl, w * 0.8, wl); c.strokeRect(x - w * 0.4, y - wl, w * 0.8, wl); c.beginPath(); c.moveTo(x - w * 0.5, y - wl); c.lineTo(x, y - wl - w * 0.5); c.lineTo(x + w * 0.5, y - wl); c.closePath(); c.fillStyle = h.rc; c.fill(); c.stroke(); c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.moveTo(x, y - wl - w * 0.5); c.lineTo(x + w * 0.5, y - wl); c.lineTo(x, y - wl); c.closePath(); c.fill(); }
    else if (h.k === 'dome') { c.beginPath(); c.ellipse(x, y, w * 0.55, w * 0.5, 0, Math.PI, 0); c.fillStyle = h.wc; c.fill(); c.stroke(); c.strokeStyle = 'rgba(120,150,200,.5)'; c.lineWidth = LW * 0.25; for (const d of [0.3, 0.6]) { c.beginPath(); c.moveTo(x - w * 0.5, y - w * d * 0.5); c.lineTo(x + w * 0.5, y - w * d * 0.5); c.stroke(); } c.fillStyle = '#4a4458'; c.fillRect(x - w * 0.08, y - w * 0.16, w * 0.16, w * 0.16); }
    else if (h.k === 'turf') { c.fillStyle = h.wc; c.fillRect(x - w * 0.6, y - hh * 0.5, w * 1.2, hh * 0.5); c.strokeRect(x - w * 0.6, y - hh * 0.5, w * 1.2, hh * 0.5); c.beginPath(); c.ellipse(x, y - hh * 0.5, w * 0.7, hh * 0.55, 0, Math.PI, 0); c.fillStyle = h.rc; c.fill(); c.stroke(); }
    else if (h.k === 'stilt') { c.strokeStyle = '#6a4a30'; c.lineWidth = LW * 0.6; for (const d of [-0.35, 0.35]) { c.beginPath(); c.moveTo(x + d * w, y); c.lineTo(x + d * w, y - hh * 0.5); c.stroke(); } stroke0(c, 0.35); const by = y - hh * 0.5; c.fillStyle = h.wc; c.fillRect(x - w / 2, by - hh * 0.6, w, hh * 0.6); c.strokeRect(x - w / 2, by - hh * 0.6, w, hh * 0.6); c.beginPath(); c.moveTo(x - w * 0.62, by - hh * 0.6); c.lineTo(x, by - hh * 0.6 - w * 0.5); c.lineTo(x + w * 0.62, by - hh * 0.6); c.closePath(); c.fillStyle = h.rc; c.fill(); c.stroke(); }
    c.restore();
  }
  function polyThin(c, pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.lineWidth = LW * 0.3; c.strokeStyle = LINE; c.lineJoin = 'round'; c.stroke(); } }
  function landmark(c, L, t, sd) {
    const poly = polyThin, lm = L.T.lm; if (!lm) return; c.save(); stroke0(c, 0.5);
    const flag = (x, y) => { const w = Math.sin(t * 0.006 + sd * 9) * 0.015; poly(c, [[x, y], [x + 0.07 + w, y + 0.02], [x, y + 0.04]], '#e5533d', false); };
    if (lm === 'tower') { poly(c, [[-0.035, 0.01], [-0.035, -0.17], [0.035, -0.17], [0.035, 0.01]], '#efe6d6', true); poly(c, [[-0.05, -0.17], [0, -0.3], [0.05, -0.17]], '#3f7fd6', true); flag(0, -0.3); }
    else if (lm === 'minaret') { poly(c, [[-0.03, 0.01], [-0.025, -0.26], [0.025, -0.26], [0.03, 0.01]], '#e8d2a8', true); poly(c, [[-0.045, -0.26], [0.045, -0.26], [0.04, -0.22], [-0.04, -0.22]], '#d6bd90', true); poly(c, [[-0.03, -0.26], [0, -0.36], [0.03, -0.26]], '#3f9a6a', true); }
    else if (lm === 'keep') { poly(c, [[-0.1, 0.01], [-0.07, -0.07], [0.07, -0.07], [0.1, 0.01]], '#9a9aa4', true); let y = -0.07, w = 0.07; for (let k = 0; k < 3; k++) { c.fillStyle = '#f4f0e6'; c.fillRect(-w, y - 0.07, w * 2, 0.07); c.strokeRect(-w, y - 0.07, w * 2, 0.07); poly(c, [[-w - 0.03, y - 0.07], [-w * 0.7, y - 0.11], [w * 0.7, y - 0.11], [w + 0.03, y - 0.07]], '#3d4250', true); y -= 0.1; w *= 0.78; } ell(c, 0, y - 0.04, 0.012, 0.012, '#e8c04a', false); }
    else if (lm === 'onion') { poly(c, [[-0.05, 0.01], [-0.05, -0.12], [0.05, -0.12], [0.05, 0.01]], '#f4efe2', true); c.fillStyle = '#3f7fd6'; c.beginPath(); c.moveTo(-0.045, -0.12); c.quadraticCurveTo(-0.08, -0.2, 0, -0.3); c.quadraticCurveTo(0.08, -0.2, 0.045, -0.12); c.closePath(); c.fill(); c.stroke(); ell(c, 0, -0.32, 0.012, 0.012, '#e8c04a', false); }
    else if (lm === 'mosque') { poly(c, [[-0.16, 0.01], [-0.16, -0.12], [0.16, -0.12], [0.16, 0.01]], '#b98a5e', true); for (const x of [-0.12, 0, 0.12]) { poly(c, [[x - 0.035, -0.12], [x - 0.02, -0.28], [x + 0.02, -0.28], [x + 0.035, -0.12]], '#a97b52', true); ell(c, x, -0.29, 0.012, 0.012, '#f2e3c4', false); } poly(c, [[-0.03, 0.01], [-0.03, -0.06], [0.03, -0.06], [0.03, 0.01]], '#5a3a28', false); }
    else if (lm === 'pagoda') { let y = 0.01, w = 0.06; for (let k = 0; k < 3; k++) { c.fillStyle = '#c8553d'; c.fillRect(-w * 0.7, y - 0.07, w * 1.4, 0.07); c.strokeRect(-w * 0.7, y - 0.07, w * 1.4, 0.07); poly(c, [[-w - 0.02, y - 0.07], [-w * 0.6, y - 0.11], [w * 0.6, y - 0.11], [w + 0.02, y - 0.07]], '#4b5563', true); y -= 0.1; w *= 0.8; } }
    else if (lm === 'temple') { poly(c, [[-0.1, 0.01], [-0.1, -0.02], [0.1, -0.02], [0.1, 0.01]], '#efe6d6', true); for (const x of [-0.08, -0.027, 0.027, 0.08]) { c.fillStyle = '#f7f1e4'; c.fillRect(x - 0.01, -0.12, 0.02, 0.1); c.strokeRect(x - 0.01, -0.12, 0.02, 0.1); } poly(c, [[-0.11, -0.12], [0, -0.19], [0.11, -0.12]], '#cf6b43', true); }
    else if (lm === 'bluedome') { poly(c, [[-0.045, 0.01], [-0.045, -0.08], [0.045, -0.08], [0.045, 0.01]], '#fbfbf6', true); c.fillStyle = '#2f72c4'; c.beginPath(); c.ellipse(0, -0.08, 0.05, 0.06, 0, Math.PI, 0); c.fill(); c.stroke(); ell(c, 0, -0.145, 0.006, 0.014, '#fbfbf6', false); }
    else if (lm === 'palace') { poly(c, [[-0.16, 0.01], [-0.16, -0.09], [0.16, -0.09], [0.16, 0.01]], '#f7f4ec', true); poly(c, [[-0.11, -0.09], [-0.11, -0.19], [0.11, -0.19], [0.11, -0.09]], '#8a3a30', true); poly(c, [[-0.06, -0.19], [-0.06, -0.27], [0.06, -0.27], [0.06, -0.19]], '#f7f4ec', true); for (const [x, y, w] of [[0, -0.27, 0.08], [-0.12, -0.19, 0.05], [0.12, -0.19, 0.05]]) poly(c, [[x - w, y], [x - w * 0.6, y - 0.04], [x + w * 0.6, y - 0.04], [x + w, y]], '#e8c04a', true); }
    c.restore();
  }
  function town(c, o, t) {
    const LW0 = LW; LW = 0.05 * Math.min(1, 110 / (o.px || 110));   // 大きく描くほど輪郭線は細く(画面上の太さを一定に)
    try { town2(c, o, t); } finally { LW = LW0; }
  }
  function town2(c, o, t) {
    const poly = polyThin, L = townLayout(o), T = L.T, sd = o.seed || 0, R = L.R, sq = L.sq;
    c.save(); c.translate(0, -0.02);
    c.save(); c.globalAlpha = 0.55; ell(c, 0, 0, R * 1.15, R * 1.15 * sq, T.gr, false); c.restore();
    if (T.water) { c.save(); c.globalAlpha = 0.7; ell(c, 0, 0.02, R * 1.0, R * 0.9 * sq, '#5aaeee', false); c.restore(); }
    if (T.wall === 'moat') { c.save(); c.strokeStyle = '#2f72c4'; c.lineWidth = 0.05; c.beginPath(); c.ellipse(0, 0, R + 0.06, (R + 0.06) * sq, 0, 0, 6.2832); c.stroke(); c.strokeStyle = '#5aaeee'; c.lineWidth = 0.035; c.stroke(); c.restore(); }
    c.save(); c.strokeStyle = '#efe0bd'; c.lineWidth = 0.028; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(L.gate) * (R + 0.14), Math.sin(L.gate) * (R + 0.14) * sq); c.stroke(); c.restore();
    const wallPath = (back) => {
      const wc = T.wcol; if (!wc || T.wall === 'moat') return; c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
      for (const [col, w] of [[LINE, 0.05], [wc, 0.032]]) {
        c.strokeStyle = col; c.lineWidth = w; c.beginPath();
        if (T.wall === 'round') c.ellipse(0, 0, R + 0.04, (R + 0.04) * sq, 0, back ? Math.PI : 0, back ? 6.2832 : Math.PI);
        else if (T.wall === 'rect') { const a = R + 0.05, b = (R + 0.05) * sq; if (back) { c.moveTo(-a, 0); c.lineTo(-a, -b); c.lineTo(a, -b); c.lineTo(a, 0); } else { c.moveTo(-a, 0); c.lineTo(-a, b); c.lineTo(a, b); c.lineTo(a, 0); } }
        else if (T.wall === 'star') { for (let k = 0; k <= 16; k++) { const a = k / 16 * 6.2832, rr = (k % 2 ? 0.8 : 1.12) * R + 0.03, x = Math.cos(a) * rr, y = Math.sin(a) * rr * sq; if (back ? y > 0.0001 : y < -0.0001) { c.moveTo(x, y); continue; } if (k === 0) c.moveTo(x, y); else c.lineTo(x, y); } }
        c.stroke();
      } c.restore();
    };
    wallPath(true);
    if (T.terr) { c.save(); c.strokeStyle = T.terr; c.lineWidth = 0.02; for (let j = 0; j < 5; j++) { const yy = -0.22 + j * 0.1 + 0.01, half = (0.12 + j * 0.07) * (R / 0.36) + 0.04; c.beginPath(); c.moveTo(-half, yy); c.lineTo(half, yy); c.stroke(); } c.restore(); }
    const items = L.houses.map(h => ({ y: h.y, h })).concat(L.towers.map(tw => ({ y: tw.y + 0.001, tw })));
    items.sort((a, b) => a.y - b.y);
    for (const it of items) {
      if (it.h) bhouse(c, it.h);
      else { const { x, y } = it.tw; c.save(); stroke0(c, 0.4); c.fillStyle = T.wcol || '#c9b79c'; c.fillRect(x - 0.026, y - 0.1, 0.052, 0.1); c.strokeRect(x - 0.026, y - 0.1, 0.052, 0.1); poly(c, [[x - 0.036, y - 0.1], [x, y - 0.17], [x + 0.036, y - 0.1]], T.lm === 'minaret' ? '#3f9a6a' : '#3f7fd6', true); c.restore(); }
    }
    wallPath(false);
    if (o.px && o.um && o.px >= 700 && ASSET.unit && ASSET.unit.complete && ASSET.unit.naturalWidth) {   // 層5: 人は1マス(約1m)の大きさ
      const pr = rng((o.seed || 0.5) * 31.1 + 3), cntp = Math.min(160, 30 + (o.n || 3) * 18), wm = 1.3 / o.um, tt = t * 0.0012;
      for (let k = 0; k < cntp; k++) {
        const a = pr() * 6.2832, rd = R * Math.pow(pr(), 0.7), sp = 0.003 + pr() * 0.004, ph = pr() * 6.2832;
        const x = Math.cos(a) * rd + Math.cos(ph + tt * sp * 900) * 0.012, y = (Math.sin(a) * rd * sq) + Math.sin(ph + tt * sp * 900) * 0.006;
        kimg(c, "unit", (pr() * 24) | 0, x, y, wm * 3.0);
      }
    }
    if (T.lm && (L.big || T.wall || T.lay === 'terrace' || T.lm === 'mosque' || T.lm === 'onion')) { c.save(); c.translate(0, T.lay === 'terrace' ? -0.22 * 0 - 0.18 : 0); if (o.px > 300) { const ks = 0.55; c.translate(0, 0.04); c.scale(ks, ks); } landmark(c, L, t, sd); c.restore(); }
    if (T.hk === 'gable' || T.hk === 'flat') smoke(c, t + sd * 4000, 0.1, -0.1, 2, 0.4, 0.035, '#e6e1ee');
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
