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
    { const hr = o.hr == null ? 0.7 : o.hr, sd = o.seed || 0.5;   // 高さで5段階に分け、高い山ほど大きく描く(丘→岩山→高い岩山→雪山→大雪峰)
      const tier = hr < 0.3 ? 0 : hr < 0.5 ? 1 : hr < 0.7 ? 2 : hr < 0.88 ? 3 : 4, W = [0.55, 0.8, 1.05, 1.35, 1.7][tier], v2 = sd > 0.5;
      const nm = tier === 0 ? (v2 ? 'mt_hill2' : 'mt_hill') : tier === 1 ? (v2 ? 'mt_rocklow2' : 'mt_rocklow') : tier === 2 ? (o.snow ? 'mt_snow' : 'mt_rockhigh') : tier === 3 ? 'mt_snow' : 'mt_peak';
      if (W * c.getTransform().a < 120) { const fn = tier === 0 ? 'f_hill' : (tier === 1 || (tier === 2 && !o.snow)) ? 'f_rock' : 'f_snow'; if (wimg(c, fn, 0, 0.05, W)) return; }   // 小さく映る遠景は、輪郭の太い単純な絵
      if (wimg(c, nm, 0, 0.05, W)) return;
      const nm0 = tier === 0 ? 'C13' : tier === 1 ? 'C12' : tier === 2 ? (o.snow ? 'C11' : (sd > 0.5 ? 'C12' : 'C32')) : 'C11';
      if (wimg(c, nm0, 0, 0.05, W)) return; }
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
    if (1.5 * c.getTransform().a < 120 && wimg(c, 'f_volcano', 0, 0.05, 1.1)) return;
    if (wimg(c, (o.seed || 0) > 0.5 ? 'mt_volcano2' : 'mt_volcano', 0, 0.05, 1.5)) return;
    if (wimg(c, 'C15', 0, 0.05, 1.5)) return;
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
  (function () { if (typeof Image === 'undefined') return; for (const n of ['struct0', 'struct1', 'struct2', 'struct3', 'struct4', 'unit', 'env', 'tile']) { const im = new Image(); im.src = 'assets/' + n + '.png?v=' + (window.APP_VER || '0'); ASSET[n] = im; } })();
  const TOWNIMG = {}; (function () { if (typeof Image === 'undefined') return; for (const n of ['cottage_red', 'shop_blue', 'cottage_thatch', 'inn_green', 'church', 'windmill', 'castle']) { const im = new Image(); im.src = 'assets/town/' + n + '.png?v=' + (window.APP_VER || '0'); TOWNIMG[n] = im; } })();   // 絵師風の家(AI生成・自作素材)
  const HOUSEIMG = ['cottage_red', 'shop_blue', 'cottage_thatch', 'inn_green', 'cottage_red', 'shop_blue'];
  function timg(c, n, x, y, w) { const im = TOWNIMG[n]; if (!im || !im.complete || !im.naturalWidth) return false; const dh = w * im.naturalHeight / im.naturalWidth; c.drawImage(im, x - w / 2, y - dh + w * 0.07, w, dh); return true; }
  // ---- 世界地図の部品(利用者が用意した部品表W01を1個ずつ切り出したもの。assets/world/) ----
  const WIMG = {};
  (function () {
    if (typeof Image === 'undefined') return;
    const names = 'mt_peak mt_snow mt_rockhigh mt_rocklow mt_hill mt_volcano mt_rocklow2 mt_hill2 mt_volcano2 K11 K12 K13 K21 K22 K23 K31 K32 K33 K41 K42 K43 D21 D23 D25 C44 A11 A12 A13 A14 A15 A21 A22 A23 A24 A25 A31 A32 A33 A34 A35 A41 A42 A43 A44 B14 B15 B21 B22 B23 B24 B25 B41 C11 C12 C13 C15 C21 C22 C32 D24 E11 E12 E13 E14 E21 E22'.split(' ');
    for (const n of names) { const im = new Image(); im.src = 'assets/world/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
    for (const n of 'airship archer barge belltower boat_row bridge_stone campfire cmd crane depot dragon_tr e_boom e_circle e_fire e_light e_smoke e_vsmoke f_flower f_green f_orch f_rows f_veg f_wheat fisher flag fort gate_c gate_c2 gate_draw gate_town h_afr h_arab h_cn h_dutch h_fort h_greek h_igloo h_jp h_jp2 h_log h_manor h_market h_rome h_rome2 h_sahara h_sod h_sod2 h_stilt h_thatch h_thatch2 h_tibet h_tudor h_yurt handcart i_arms i_cloth i_food i_gold i_horse i_iron i_magic i_shield i_ship i_stone i_wheat i_wood inf knight_h knight_hv lamp lighthouse2 m_cyclops m_ghost m_goblin m_golem m_gryphon m_orc m_serpent m_skel m_spider m_troll m_wolfman m_wyvern mage_x medic merchant moat p_barrels p_crates p_hay p_sign p_well p_wood packhorse palisade palisade2 pier quay r_crystal r_float r_pyr r_ruins r_stones r_temple ship_coast ship_l siegetower sign spear standard supply t_autumn t_bamboo t_birch t_bush t_cactus t_dead t_fir t_mush t_oak t_palm t_snow t_world tent_cmd tents trebuchet wagon wagon_fly wagon_l wall_corner wall_low wall_mid wall_s warehouse watchtower well'.split(' ')) { const im = new Image(); im.src = 'assets/world2/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
    for (const n of 'd_cactus d_camel d_mummy d_palm d_sandworm d_scorpion i_crystal i_fox i_giant i_polar1 i_polar2 i_rimetree i_snowwoman j_anaconda j_fern j_hydra j_jaguar j_macaw j_palm'.split(' ')) { const im = new Image(); im.src = 'assets/world3/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
    for (const n of 'f_broadleaf f_castle f_conifer f_dune f_hill f_iceberg f_jungle f_marsh f_oasis f_port f_port2 f_rock f_ruins f_snow f_town_cn f_town_desert f_town_eu f_volcano f_wheat'.split(' ')) { const im = new Image(); im.src = 'assets/world4/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }   // 遠景用(輪郭の太い単純な絵)
    for (const n of 'c_birch c_dryad c_moose c_spruce c_troll c_wolf'.split(' ')) { const im = new Image(); im.src = 'assets/world5/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
    for (const n of 's_autumn s_deer s_spring s_summer s_werewolf s_winter'.split(' ')) { const im = new Image(); im.src = 'assets/world6/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
    for (const n of 'a_acacia a_acacia2 a_baobab a_elephant a_elephant2 a_giraffe a_lion a_manticore a_manticore2'.split(' ')) { const im = new Image(); im.src = 'assets/world7/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
    for (const n of 'h_eagle h_flowers h_goat h_golem h_horse h_house h_pine h_tree h_wyvern'.split(' ')) { const im = new Image(); im.src = 'assets/world8/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
    for (const n of 'c_bison c_bison2 c_eagle c_grass c_horse c_thorn c_wolf g_cow g_fairy g_flowers g_hare g_sheep g_tree m_centaur m_cypress m_donkey m_donkey2 m_goat m_house m_olive m_vines o_bear o_bigtree o_cedar o_fairy o_mush o_owl o_rockfern t_fox t_lichen t_mammoth t_moss t_reindeer t_shrub t_slime'.split(' ')) { const im = new Image(); im.src = 'assets/world9/' + n + '.png?v=' + (window.APP_VER || '0'); WIMG[n] = im; }
  })();
  // 画面で約260pxを超えると粗くなるので、その大きさでは使わない(false を返す)
  function wimg(c, n, x, y, w) { const im = WIMG[n]; if (!im || !im.complete || !im.naturalWidth) return false; if (w * c.getTransform().a > 260) return false; const dh = w * im.naturalHeight / im.naturalWidth; c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(im, x - w / 2, y - dh + w * 0.05, w, dh); c.restore(); return true; }
  // 街のタイプごとの家の組(先頭が主役)
  const WFAM = { igloo: ['h_igloo', 'A11'], turf: ['h_sod', 'A12', 'A13'], russian: ['h_log', 'A13', 'A12', 'B24'], hansa: ['h_dutch', 'A14', 'B15', 'B14'], yurt: ['h_yurt', 'A15'], medina: ['h_arab', 'A21', 'A22'], djenne: ['h_sahara', 'A22', 'A21'], medieval: ['h_tudor', 'B14', 'B15', 'B21', 'B22', 'B23', 'B25'], chinese: ['h_cn', 'A23', 'E14', 'A24'], japan: ['h_jp', 'A24', 'A25', 'E13'], starfort: ['h_fort', 'A42', 'A41'], greek: ['h_greek', 'A31', 'A32'], roman: ['h_rome', 'A32', 'E21', 'E22'], kraal: ['h_afr', 'A33', 'A35'], stilt: ['h_stilt', 'A34', 'A35'], inca: ['A43', 'A41'], tibet: ['h_tibet', 'A41', 'A21'] };
  const WPOS = [[0, 0.1], [-0.25, 0.02], [0.25, 0.02], [-0.14, 0.17], [0.14, 0.17], [0, -0.08]];
  function townWorld(c, o) {   // 遠い層の街: 地面の上に、そのタイプの家を数軒並べる
    const fam = WFAM[o.ty]; if (!fam) return false; const n = Math.max(3, Math.min(6, (o.n || 3) + 1)), sd = o.seed || 0, T = TT[o.ty] || {};
    c.save(); c.translate(0, -0.02); c.globalAlpha = 0.6; ell(c, 0, 0.06, 0.42, 0.2, T.gr || '#cdbf9c', false); c.restore();
    const items = []; for (let k = 0; k < n; k++) items.push({ p: WPOS[k], nm: fam[(k === 0 ? 0 : 1 + ((Math.floor(sd * 997) + k) % Math.max(1, fam.length - 1))) % fam.length] });
    items.sort((a, b) => a.p[1] - b.p[1]); let ok = false;
    const big = 0.3 * c.getTransform().a > 130;   // 大きく映る時は、粗くならない描き下ろしの家に切り替える
    let k = 0; for (const it of items) { const hero = it.p === WPOS[0];
      if (big) { const hf = HXFAM[o.ty]; if (hf && hx(c, hf[(k++ + Math.floor(sd * 997)) % hf.length], it.p[0], it.p[1], hero ? 0.4 : 0.3)) ok = true; }
      else if (wimg(c, it.nm, it.p[0], it.p[1], hero ? 0.3 : 0.22)) ok = true; }
    if (ok && T.wall && T.wall !== 'moat') { wli(c, 'gate', 0, 0.3, 0.2); wli(c, 'wall', -0.3, 0.2, 0.21); wli(c, 'wall', 0.3, 0.2, 0.21); wli(c, 'watch', -0.4, 0.05, 0.095); wli(c, 'watch', 0.4, 0.05, 0.095); }
    return ok;
  }
  // ---- 動物・海の生き物・船(利用者が用意した大きな絵を1匹ずつ切り出したもの。assets/animals/) ----
  const AIMG = {};
  (function () {
    if (typeof Image === 'undefined') return;
    for (const n of 'squid serpent mermaid fairy anchor dragon deer wolf fox bear polar lion tiger elephant giraffe camel monkey penguin seal dolphin owl eagle parrot cow sheep goat horse pig duck goose dog whale shark octopus galleon sailboat liner fishingboat tuna mackerel snapper flounder clownfish angelfish turtle marlin'.split(' ')) { const im = new Image(); im.src = 'assets/animals/' + n + '.png?v=' + (window.APP_VER || '0'); AIMG[n] = im; }
  })();
  // 呼び名 → [絵の名前, 幅]。ここに無い生き物は、代わりの絵が用意できるまで描かない
  const AMAP = { treindeer: ['', 0.8, 't_reindeer'], tfox: ['', 0.5, 't_fox'], mammoth: ['', 1.1, 't_mammoth'], slime: ['', 0.7, 't_slime'], chorse: ['', 0.8, 'c_horse'], cbison: ['', 0.95, 'c_bison'], ceagle: ['', 0.6, 'c_eagle'], cwolf: ['', 0.9, 'c_wolf'], gcow: ['', 0.85, 'g_cow'], gsheep: ['', 0.7, 'g_sheep'], ghare: ['', 0.5, 'g_hare'], gfairy: ['', 0.5, 'g_fairy'], mgoat: ['', 0.6, 'm_goat'], mdonkey: ['', 0.7, 'm_donkey'], mcentaur: ['', 0.9, 'm_centaur'], oowl: ['', 0.6, 'o_owl'], obear: ['', 0.9, 'o_bear'], ofairy: ['', 0.55, 'o_fairy'], hgoat: ['', 0.7, 'h_goat'], heagle: ['', 0.8, 'h_eagle'], hwyvern: ['', 0.85, 'h_wyvern'], hgolem: ['', 0.9, 'h_golem'], slion: ['', 0.8, 'a_lion'], selephant: ['', 1.0, 'a_elephant'], sgiraffe: ['', 0.8, 'a_giraffe'], manticore: ['', 0.85, 'a_manticore'], wwolf: ['', 0.6, 's_werewolf'], moose: ['', 0.8, 'c_moose'], gwolf: ['', 0.6, 'c_wolf'], forest_troll: ['', 0.8, 'c_troll'], dryad: ['', 0.7, 'c_dryad'], arcticfox: ['', 0.5, 'i_fox'], icegiant: ['', 0.8, 'i_giant'], snowwoman: ['', 0.55, 'i_snowwoman'], scorpion: ['', 0.45, 'd_scorpion'], mummy: ['', 0.5, 'd_mummy'], sandworm: ['', 0.8, 'd_sandworm'], jaguar: ['', 0.7, 'j_jaguar'], anaconda: ['', 0.7, 'j_anaconda'], hydra: ['', 0.85, 'j_hydra'], goblin: ['', 0.4, 'm_goblin'], orc: ['', 0.55, 'm_orc'], golem: ['', 0.7, 'm_golem'], skeleton: ['', 0.45, 'm_skel'], spider: ['', 0.55, 'm_spider'], werewolf: ['', 0.55, 'm_wolfman'], troll: ['', 0.7, 'm_troll'], cyclops: ['', 0.7, 'm_cyclops'], gryphon: ['', 0.7, 'm_gryphon'], wyvern: ['', 0.7, 'm_wyvern'], ghost: ['', 0.45, 'm_ghost'], cow: ['cow', 0.9], bison: ['cow', 0.95], sheep: ['sheep', 0.75], goat: ['goat', 0.6], horse: ['horse', 0.8], boar: ['pig', 0.75], wolf: ['wolf', 0.55], deer: ['deer', 0.7], fox: ['fox', 0.55], bear: ['bear', 0.85], polar: ['polar', 0.95], lion: ['lion', 0.9], tiger: ['tiger', 0.75], elephant: ['elephant', 1.1], giraffe: ['giraffe', 0.6], camel: ['camel', 0.85], monkey: ['monkey', 0.5], penguin: ['penguin', 0.4], seal: ['seal', 0.7], dolphin: ['dolphin', 0.7], owl: ['owl', 0.4], eagle: ['eagle', 0.45], parrot: ['parrot', 0.35], whale: ['whale', 1.0], shark: ['shark', 0.9], octopus: ['octopus', 0.8], ship: ['galleon', 1.0], sail: ['sailboat', 0.65], squid: ['squid', 0.8], serpent: ['serpent', 0.95], mermaid: ['mermaid', 0.7], fairy: ['fairy', 0.45], anchor: ['anchor', 0.4], dragon: ['dragon', 1.15], cactus: [null, 0.5, 'D21'], mushroom: [null, 0.45, 'D23'], bush: [null, 0.6, 'D25'], island: [null, 0.9, 'C44'] };
  function animalImg(c, o) {
    const m = AMAP[o.a]; if (!m) return false;
    if (m[2]) return wimg(c, m[2], 0, 0.05, m[1]);
    const im = AIMG[m[0]]; if (!im || !im.complete || !im.naturalWidth) return false;
    const w = m[1], dh = w * im.naturalHeight / im.naturalWidth; c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(im, -w / 2, 0.05 - dh, w, dh); c.restore(); return true;
  }
  const PEOPLE = { folk: [4, 5, 10, 11, 16, 17, 22, 23], soldier: [1, 2, 7, 8, 13, 14, 19, 20], mage: [0, 6, 12, 18], king: [3, 9, 15, 21] };   // 絵の並びから(村人・兵・魔術師・王)
  const KHOUSE = [8, 9, 16, 17, 19, 20, 22, 2, 10, 18];
  function kimg(c, set, idx, x, y, w) {
    const im = ASSET[set]; if (!im || !im.complete || !im.naturalWidth) return false;
    c.imageSmoothingEnabled = false; c.drawImage(im, (idx % 8) * 64, ((idx / 8) | 0) * 64, 64, 64, x - w / 2, y - w * 0.94, w, w); return true;
  }
  const TCACHE = new Map();
  // ---- 街並みの生成(ゲームの街づくり: Voronoiの区画 → 通り → 区画を割って建物の敷地) ----
  const polyArea = P => { let a = 0; for (let i = 0; i < P.length; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length]; a += x1 * y2 - x2 * y1; } return a / 2; };
  const polyCen = P => { let x = 0, y = 0; for (const p of P) { x += p[0]; y += p[1]; } return [x / P.length, y / P.length]; };
  function clipHalf(P, nx, ny, d) { // nx*x+ny*y <= d の側だけ残す
    const out = []; for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], da = nx * a[0] + ny * a[1] - d, db = nx * b[0] + ny * b[1] - d;
      if (da <= 0) out.push(a); if ((da < 0 && db > 0) || (da > 0 && db < 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    } return out;
  }
  function shrinkPoly(P, k) { const c = polyCen(P); return P.map(p => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k]); }
  function lotsOf(P, r, minA, out, depth) { // 長い辺の向かいを切って、敷地が小さくなるまで割る
    const A = Math.abs(polyArea(P)); if (P.length < 3 || A < 1e-6) return;
    if (A <= minA * (1 + r() * 0.8) || depth > 6) { out.push(P); return; }
    let bi = 0, bl = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l > bl) { bl = l; bi = i; } }
    const a = P[bi], b = P[(bi + 1) % P.length], ux = (b[0] - a[0]) / bl, uy = (b[1] - a[1]) / bl, nx = -uy, ny = ux, c = polyCen(P), t = (c[0] * ux + c[1] * uy) + (r() - 0.5) * bl * 0.2;
    const P1 = clipHalf(P, ux, uy, t), P2 = clipHalf(P, -ux, -uy, -t); lotsOf(P1, r, minA, out, depth + 1); lotsOf(P2, r, minA, out, depth + 1);
  }
  function lotRect(P) { // 敷地(多角形)に入る向きつきの長方形
    let bi = 0, bl = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l > bl) { bl = l; bi = i; } }
    const a = P[bi], b = P[(bi + 1) % P.length], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), ca = Math.cos(-ang), sa = Math.sin(-ang);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const p of P) { const x = p[0] * ca - p[1] * sa, y = p[0] * sa + p[1] * ca; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, ca2 = Math.cos(ang), sa2 = Math.sin(ang);
    return { x: mx * ca2 - my * sa2, y: mx * sa2 + my * ca2, w: x1 - x0, d: y1 - y0, ang, fill: Math.abs(polyArea(P)) / Math.max(1e-9, (x1 - x0) * (y1 - y0)) };
  }
  function cityPatches(kind, r, R, n) { // 区画(多角形)の一覧
    const patches = [];
    if (kind === 'grid') {
      const sp = 0.1 + 0.02 * r(); const lim = R * 1.02;
      for (let gx = -lim; gx < lim; gx += sp) for (let gy = -lim; gy < lim; gy += sp) {
        const cx = gx + sp / 2, cy = gy + sp / 2; if (Math.hypot(cx, cy) > R) continue;
        patches.push({ P: [[gx, gy], [gx + sp, gy], [gx + sp, gy + sp], [gx, gy + sp]], c: [cx, cy], d: Math.hypot(cx, cy) / R });
      } return patches;
    }
    const sites = [[0, 0]], md = R * (0.34 - 0.03 * Math.min(n, 5) / 5), want = 10 + n * 5;
    for (let t = 0; t < 400 && sites.length < want; t++) { const a = r() * 6.2832, rd = R * Math.sqrt(r()) * 0.95, p = [Math.cos(a) * rd, Math.sin(a) * rd]; if (sites.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > md)) sites.push(p); }
    const circ = []; for (let k = 0; k < 28; k++) { const a = k / 28 * 6.2832; circ.push([Math.cos(a) * R * 1.03, Math.sin(a) * R * 1.03]); }
    for (const s of sites) {
      let P = circ.slice(); for (const t of sites) { if (t === s) continue; const nx = t[0] - s[0], ny = t[1] - s[1], d = (nx * (s[0] + t[0]) + ny * (s[1] + t[1])) / 2; P = clipHalf(P, nx, ny, d); if (P.length < 3) break; }
      if (P.length >= 3) patches.push({ P, c: s, d: Math.hypot(s[0], s[1]) / R });
    } return patches;
  }
  function cityLots(kind, r, R, n, lotA) { // {lots, plaza, patches}
    const patches = cityPatches(kind, r, R, n), lots = [];
    patches.forEach((pa, k) => {
      if (pa.d < 0.02) { pa.plaza = true; return; }                                    // 中心は広場
      if (pa.d < 0.4 && r() < 0.12) { pa.park = true; return; }                       // ときどき公園
      const a = Math.abs(polyArea(pa.P)), sh = Math.max(0.55, 1 - 0.022 / Math.sqrt(a));  // 通りの幅だけ縮める
      const out = []; lotsOf(shrinkPoly(pa.P, sh), r, lotA * (0.7 + 0.8 * pa.d * pa.d + (pa.d < 0.3 ? -0.2 : 0)), out, 0);
      for (const P of out) { const q = lotRect(shrinkPoly(P, 0.86)); if (q.w < 0.012 || q.d < 0.012 || q.fill < 0.55) continue; q.ward = pa.d < 0.35 ? 'core' : pa.d < 0.7 ? 'mid' : 'edge'; lots.push(q); }
    });
    return { lots, patches };
  }
  // ---- 街の見取り図: 大通り(主街路)と横道で区画を切り、区画の両側に敷地を並べる。向きは街ごとに1つ。建物は敷地の中なので重ならない ----
  function cityPlan(r, R, n, th) {
    const lw = 0.072 - 0.003 * Math.min(n, 5) + r() * 0.006, ld = 0.072, sw = 0.024, nb = 3, bu = nb * lw, bv = 2 * ld, pu = bu + sw, pv = bv + sw;
    const ca = Math.cos(th), sa = Math.sin(th), P = (u, v) => [u * ca - v * sa, u * sa + v * ca];
    const lots = [], blocks = [], civic = { u: 0, v: 0 };
    const nI = Math.ceil(R / pu) + 1, nJ = Math.ceil(R / pv) + 1;
    for (let sI = -1; sI <= 1; sI += 2) for (let sJ = -1; sJ <= 1; sJ += 2) for (let i = 0; i < nI; i++) for (let j = 0; j < nJ; j++) {
      const u0 = sI * (sw / 2 + i * pu), v0 = sJ * (sw / 2 + j * pv);          // 区画の、中心に近い角
      const ua = Math.min(u0, u0 + sI * bu), va = Math.min(v0, v0 + sJ * bv), cu = ua + bu / 2, cv = va + bv / 2;
      const far = Math.max(Math.abs(cu) + bu / 2, Math.abs(cv) + bv / 2);
      if (Math.hypot(cu, cv) - 0.5 * Math.hypot(bu, bv) * 0.5 > R) continue;
      const bl = { u: cu, v: cv, w: bu, d: bv, lots: 0 }; blocks.push(bl);
      for (let row = 0; row < 2; row++) for (let k = 0; k < nb; k++) {
        const lu = ua + (k + 0.5) * lw, lv = va + (row + 0.5) * ld, dist = Math.hypot(lu, lv) / R;
        if (dist > 0.96 || Math.hypot(lu, lv) < 0.085) continue;             // 外壁の外・中央の広場には建てない
        const rr = r(); if (rr < 0.04 + 0.22 * dist * dist) continue;         // 外縁ほど空き地が多い
        const front = row === 0 ? -1 : 1, vOut = (row === 0 ? va : va + bv);  // 道に面した側(区画の外側)
        const hd = ld * (0.58 + 0.12 * r()), hw = lw * (0.78 + 0.1 * r());
        const lvc = (row === 0 ? va + 0.1 * ld + hd / 2 : va + bv - 0.1 * ld - hd / 2);   // 道に寄せる
        const pt = P(lu, lvc); lots.push({ x: pt[0], y: pt[1], w: hw, d: hd, ang: th + (front > 0 ? 0 : 0), ward: dist < 0.35 ? 'core' : dist < 0.7 ? 'mid' : 'edge', u: lu, v: lvc });
        bl.lots++;
      }
    }
    return { lots, blocks, th, lw, ld, sw, plazaR: 0.07, P };
  }
  function townLayout(o) {
    const sx = o.sx || 0, sy = o.sy || 0, ty = TT[o.ty] ? o.ty : 'medieval', T = TT[ty], key = ty + '|' + (o.seed || 0).toFixed(5) + '|' + (o.n || 3) + '|' + sx.toFixed(1) + '|' + sy.toFixed(1);
    let Lo = TCACHE.get(key); if (Lo) return Lo;
    let city = null; const r = rng((o.seed || 0.5) * 7.77 + 0.1), n = o.n || 3, big = n >= 5, sq = (o.px || 0) >= 700 ? 0.85 : 0.52, R = T.r * (n >= 4 ? 1 : 0.85), cnt = 12 + n * 8, coast = !!(sx || sy), houses = [];
    const ok = (x, y) => !coast || x * sx + (y / sq) * sy >= -0.05;       // 海側(法線の逆)には建てない
    const pick = a => a[(r() * a.length) | 0];
    const add = (x, y, w, h, extra) => houses.push(Object.assign({ x, y, w, h, wc: pick(T.wc), rc: pick(T.rc), k: T.hk, ty, flip: r() < 0.5 }, extra || {}));
    if (T.lay === 'ring' || T.lay === 'grid') {
      const th = 0;   // 立体の絵(家のスプライト)は正面向きなので、道は画面に水平・垂直にそろえる
         // 海岸があれば海岸に平行、なければ街ごとに決める
      const G = cityPlan(r, R, n, th); city = G; G.th = th;
      for (const q of G.lots) { const x = q.x, y = q.y * sq; if (!ok(x, y)) continue; add(x, y, Math.min(0.09, Math.max(0.03, q.w * 1.1)), 0.04 + r() * 0.035 + (q.ward === 'core' ? 0.012 : 0), { px: q.x, py: q.y, pw: q.w, pd: q.d, ang: q.ang, ward: q.ward }); }
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
    for (const h of houses) if (h.px === undefined) { h.px = h.x; h.py = h.y / sq; h.pw = h.w * 1.1; h.pd = h.w * 0.8; h.ang = 0; }
    houses.sort((a, b) => a.y - b.y);
    const gate = city ? city.th : (coast ? Math.atan2(sy, sx) : r() * 6.2832), towers = [];
    if (T.wall === 'round' || T.wall === 'star') for (let k = 0; k < 6; k++) { const a = k / 6 * 6.2832 + r() * 0.3, x = Math.cos(a) * (R + 0.04), y = Math.sin(a) * (R + 0.04) * sq; if (ok(x, y)) towers.push({ x, y }); }
    if (T.wall === 'rect') for (const [sx2, sy2] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) towers.push({ x: sx2 * (R + 0.05), y: sy2 * (R + 0.05) * sq });
    Lo = { houses, towers, R, sq, T, ty, gate, big, city }; if (TCACHE.size > 400) TCACHE.clear(); TCACHE.set(key, Lo); return Lo;
  }
  function stroke0(c, w) { c.lineWidth = LW * w; c.strokeStyle = LINE; c.lineJoin = 'round'; }
  let DEEP = false;
  // 街の家: 街のタイプごとの絵(AI生成・assets/town2)だけを使う。絵が無いタイプは家を描かない(自作の描画は持たない)
  const HXFAM = {
    igloo: ['d2c_1', 'd2c_7'], turf: ['d2c_5', 'd2c_8'], russian: ['d2c_2'], hansa: ['d2c_3', 'd1m_2', 'd1m_1'], yurt: ['d2c_4'],
    medina: ['d3a_1', 'd3a_2'], djenne: ['d3a_2', 'd3a_1'], medieval: ['d1m_1', 'd1m_3', 'd1m_4', 'd1m_5', 'd1m_7', 'd0g_4', 'd0g_7', 'd1m_2'],
    chinese: ['d4e_1', 'd4e_2'], japan: ['d4e_3', 'd4e_4', 'd4e_5', 'd4e_6'], starfort: ['d0g_1', 'd0g_2', 'd0g_3', 'd0g_5', 'd0g_6', 'd0g_8', 'd0g_9'],
    greek: ['d3a_3'], roman: ['d3a_4'], kraal: ['d5t_5', 'd3a_5'], stilt: ['d5t_1', 'd5t_2', 'd5t_3', 'd5t_4', 'd5t_6', 'd5t_7', 'd3a_7'], inca: ['d3a_6'], tibet: ['d2c_6', 'd2c_9']
  };
  // 層5(近景)用の高解像度の家(assets/town3)。無い街のタイプは、上の組(town2)の絵を使う
  const HXHI = { medieval: ['m_tudor'], turf: ['turf_log'], japan: ['machiya'], chinese: ['cn_a', 'cn_b'], medina: ['medina'], djenne: ['medina'], kraal: ['kraal'], yurt: ['yurt'], igloo: ['igloo'], greek: ['greek'], hansa: ['hansa'], inca: ['inca'], roman: ['roman'], stilt: ['stilt'], tibet: ['tibet'] };
  const HXWH = {}; (function () { if (typeof Image === 'undefined') return; const all = {}; for (const k in HXHI) for (const n of HXHI[k]) all[n] = 1; for (const n in all) { const im = new Image(); im.src = 'assets/town3/' + n + '.png?v=' + (window.APP_VER || '0'); HXWH[n] = im; } })();
  const HXI = {}; (function () { if (typeof Image === 'undefined') return; const all = {}; for (const k in HXFAM) for (const n of HXFAM[k]) all[n] = 1; for (const j of [1, 2, 3, 4, 5, 7]) all['d6v_' + j] = 1; for (const n in all) { const im = new Image(); im.src = 'assets/town2/' + n + '.png?v=' + (window.APP_VER || '0'); HXI[n] = im; } })();
  const WLI = {}; (function () { if (typeof Image === 'undefined') return; for (const n of ['wall_tower', 'gate', 'watch', 'palisade', 'wall']) { const im = new Image(); im.src = 'assets/town4/' + n + '.png?v=' + (window.APP_VER || '0'); WLI[n] = im; } })();
  function wli(c, n, x, y, w) { const im = WLI[n]; if (!im || !im.complete || !im.naturalWidth) return false; const dh = w * im.naturalHeight / im.naturalWidth; c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(im, x - w / 2, y - dh + w * 0.06, w, dh); c.restore(); return true; }
  const LMIMG = { tower: 'd6v_2', keep: 'd6v_2', minaret: 'd6v_4', mosque: 'd6v_4', bluedome: 'd6v_4', onion: 'd6v_1', pagoda: 'd6v_5', temple: 'd6v_5', palace: 'd6v_5' };
  function hx(c, n, x, y, w) { const im = HXI[n]; if (!im || !im.complete || !im.naturalWidth) return false; const dh = w * im.naturalHeight / im.naturalWidth; c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(im, x - w / 2, y - dh + w * 0.07, w, dh); c.restore(); return true; }
  function bhouse(c, h) {
    const fam = HXFAM[h.ty]; if (!fam) return;
    const q = Math.abs((h.x * 9173 + h.y * 6151) | 0), hi = DEEP && HXHI[h.ty];
    if (hi) { const nm = hi[(q >> 2) % hi.length], im = HXWH[nm]; if (im && im.complete && im.naturalWidth) { const w = h.w * 1.05 * Math.min(1, 1.15 * im.naturalHeight / im.naturalWidth > 1.3 ? 0.75 : 1), dh = w * im.naturalHeight / im.naturalWidth; c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(im, h.x - w / 2, h.y - dh + w * 0.07, w, dh); c.restore(); return; } }
    hx(c, fam[(q >> 2) % fam.length], h.x, h.y, h.w * (DEEP ? 0.95 : 1.15));
  }
  function polyThin(c, pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.lineWidth = LW * 0.3; c.strokeStyle = LINE; c.lineJoin = 'round'; c.stroke(); } }
  function town(c, o, t) {
    if ((o.px || 0) < 110 && !(o.px >= 700)) { const T0 = o.ty, nm = (o.nx || o.ny) ? ((o.seed || 0) > 0.5 ? 'f_port' : 'f_port2') : (['chinese', 'japan', 'tibet'].indexOf(T0) >= 0) ? 'f_town_cn' : (['medina', 'djenne', 'kraal', 'inca'].indexOf(T0) >= 0) ? 'f_town_desert' : 'f_town_eu'; if (wimg(c, nm, 0, 0.12, 0.95)) return; }   // 小さく映る街は、輪郭の太い単純な絵
    const LW0 = LW; LW = 0.05 * Math.min(1, 110 / (o.px || 110));   // 大きく描くほど輪郭線は細く(画面上の太さを一定に)
    DEEP = (o.px || 0) >= 700;
    if (!DEEP && townWorld(c, o)) { DEEP = false; LW = LW0; return; }
    try { town2(c, o, t); } finally { LW = LW0; DEEP = false; }
  }
  function town2(c, o, t) {
    const poly = polyThin, L = townLayout(o), T = L.T, sd = o.seed || 0, R = L.R, sq = L.sq, DP = (o.px || 0) >= 700;   // DP: 深い層では自作の壁・塔・堀は描かない(素材の家と区画だけ)
    c.save(); c.translate(0, -0.02);
    c.save(); c.globalAlpha = 0.55; ell(c, 0, 0, R * 1.15, R * 1.15 * sq, T.gr, false); c.restore();
    if (L.city) { c.save(); c.globalAlpha = 0.85; ell(c, 0, 0, 0.045, 0.045 * sq, '#efe0bd', false); c.restore(); }   // 中央の広場
    if (T.water && !DP) { c.save(); c.globalAlpha = 0.7; ell(c, 0, 0.02, R * 1.0, R * 0.9 * sq, '#5aaeee', false); c.restore(); }
    if (T.wall === 'moat' && !DP) { c.save(); c.strokeStyle = '#2f72c4'; c.lineWidth = 0.05; c.beginPath(); c.ellipse(0, 0, R + 0.06, (R + 0.06) * sq, 0, 0, 6.2832); c.stroke(); c.strokeStyle = '#5aaeee'; c.lineWidth = 0.035; c.stroke(); c.restore(); }
    if (!DP) { c.save(); c.strokeStyle = '#efe0bd'; c.lineWidth = 0.028; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(L.gate) * (R + 0.14), Math.sin(L.gate) * (R + 0.14) * sq); c.stroke(); c.restore(); }
    if (T.terr && !DP) { c.save(); c.strokeStyle = T.terr; c.lineWidth = 0.02; for (let j = 0; j < 5; j++) { const yy = -0.22 + j * 0.1 + 0.01, half = (0.12 + j * 0.07) * (R / 0.36) + 0.04; c.beginPath(); c.moveTo(-half, yy); c.lineTo(half, yy); c.stroke(); } c.restore(); }
    const civic = L.city && T.hk === 'gable';   // 街の中心に教会
    const items = L.houses.map(h => ({ y: h.y, h })).concat(DP ? [] : L.towers.map(tw => ({ y: tw.y + 0.001, tw }))).concat(civic ? [{ y: 0.03, civ: true }] : []).concat(DP || !T.wall || T.wall === 'moat' ? [] : [{ y: Math.sin(L.gate) * (R + 0.05) * sq + 0.002, gt: { x: Math.cos(L.gate) * (R + 0.05), y: Math.sin(L.gate) * (R + 0.05) * sq } }]);
    items.sort((a, b) => a.y - b.y);
    const deep = (o.px || 0) >= 700;   // 深い層でも立体の家(スプライト)を奥から順に描く
    if (deep) { c.save(); c.beginPath(); c.ellipse(0, 0, (R + 0.03) * 1.12, (R + 0.03) * 1.12 * sq, 0, 0, 6.2832); c.clip();
      if (L.city) {   // 道(地面の色)→区画(庭・敷地)→広場、の順に塗る
        const G = L.city; c.save(); c.scale(1, sq); c.rotate(G.th);
        c.fillStyle = '#cdb98e'; c.beginPath(); c.arc(0, 0, R * 1.1, 0, 6.2832); c.fill();
        c.fillStyle = '#b4bf8e'; for (const b of G.blocks) c.fillRect(b.u - b.w / 2, b.v - b.d / 2, b.w, b.d);
        c.fillStyle = '#e3d3a6'; c.beginPath(); c.arc(0, 0, G.plazaR, 0, 6.2832); c.fill(); c.strokeStyle = 'rgba(70,50,30,.5)'; c.lineWidth = LW * 0.3; c.stroke();
        c.fillStyle = '#7d9a6a'; c.beginPath(); c.arc(0, 0, G.plazaR * 0.28, 0, 6.2832); c.fill(); c.restore();
      } }   // マスク: 街の区域の中だけに描く
    for (const it of items) {
      if (it.civ) { if (!hx(c, 'd6v_1', 0, 0.045, 0.17)) timg(c, 'church', 0, 0.045, 0.17); continue; }
      if (it.h) bhouse(c, it.h);
      else if (it.gt) { wli(c, 'gate', it.gt.x, it.gt.y, 0.2); }
      else { const { x, y } = it.tw; wli(c, T.wall === 'rect' ? 'watch' : 'wall_tower', x, y, T.wall === 'rect' ? 0.09 : 0.16); }
    }
    if (deep) c.restore();
    if (!deep && !civic && T.lm && (L.big || T.wall || T.lay === 'terrace' || T.lm === 'mosque' || T.lm === 'onion')) { c.save(); c.translate(0, T.lay === 'terrace' ? -0.22 * 0 - 0.18 : 0); if (o.px > 300) { const ks = 0.55; c.translate(0, 0.04); c.scale(ks, ks); } hx(c, LMIMG[T.lm], 0, 0.02, 0.17); c.restore(); }
    if (!DP && (T.hk === 'gable' || T.hk === 'flat')) smoke(c, t + sd * 4000, 0.1, -0.1, 2, 0.4, 0.035, '#e6e1ee');
    c.restore();
  }
  // 城: 中央の本丸と両脇の塔、はためく旗
  function castle(c, o, t) {
    if (1.9 * c.getTransform().a < 110 && wimg(c, 'f_castle', 0, 0.05, 0.95)) return;
    { const CS = ['B41', 'A42', 'K11', 'K12', 'K13', 'K21', 'K22', 'K23', 'K31', 'K32', 'K33', 'K41', 'K42', 'K43']; if (wimg(c, CS[Math.floor((o.seed || 0) * 997) % CS.length], 0, 0.05, 0.95)) return; }
    if (timg(c, 'castle', 0, 0.02, 1.1)) return;
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
    if (wimg(c, 'E11', 0, 0.05, 1.0)) return;
    c.save(); groundShadow(c, 0.55);
    poly(c, [[-0.55, 0], [0, -0.72], [0.1, 0]], '#f5d98b', true);
    poly(c, [[0, -0.72], [0.55, 0], [0.1, 0]], '#c9965a', true);
    poly(c, [[-0.55, 0], [0, -0.72], [0.55, 0]], null, true);
    c.lineWidth = LW * 0.4; c.strokeStyle = 'rgba(80,50,30,.5)'; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(-0.55 + k * 0.1, -k * 0.16); c.lineTo(0.55 - k * 0.1, -k * 0.16); c.stroke(); }
    c.restore();
  }
  // 神殿(熱帯): 階段状の塔と頂上の祠
  function ziggurat(c) {
    if (wimg(c, 'C22', 0, 0.05, 0.95)) return;
    c.save(); groundShadow(c, 0.5);
    const steps = [[0.5, 0, 0.16], [0.4, -0.16, 0.16], [0.3, -0.32, 0.16], [0.2, -0.48, 0.14]];
    for (const [w, y, h] of steps) { poly(c, [[-w, y], [-w, y - h], [w, y - h], [w, y]], '#9fd0a2', true); poly(c, [[w * 0.2, y], [w * 0.2, y - h], [w, y - h], [w, y]], '#5ea27c', false); }
    poly(c, [[-0.14, -0.62], [-0.14, -0.78], [0.14, -0.78], [0.14, -0.62]], '#f1e7c6', true);
    poly(c, [[-0.2, -0.78], [0, -0.96], [0.2, -0.78]], '#e8a02e', true);
    c.restore();
  }
  // 氷の宮殿(極地): 水晶のとげ
  function icepalace(c, o, t) {
    if (wimg(c, 'E12', 0, 0.05, 1.0)) return;
    c.save(); groundShadow(c, 0.45); const tw = 0.5 + 0.5 * Math.sin(t * 0.005 + (o.seed || 0) * 4);
    for (const [x, h, w, col] of [[-0.3, 0.5, 0.12, '#bfe3ff'], [0.3, 0.55, 0.12, '#bfe3ff'], [0, 0.95, 0.17, '#e2f2ff'], [-0.14, 0.7, 0.1, '#d1ebff'], [0.15, 0.72, 0.1, '#d1ebff']]) {
      poly(c, [[x - w, 0], [x, -h], [x + w, 0]], col, true); poly(c, [[x, -h], [x + w, 0], [x + w * 0.1, 0]], 'rgba(120,150,230,.45)', false);
    }
    c.save(); c.globalAlpha = 0.5 + 0.5 * tw; c.fillStyle = '#fff'; c.beginPath(); c.arc(0.04, -0.82, 0.03, 0, 6.2832); c.fill(); c.restore();
    c.restore();
  }
  // 灯台(海辺): 赤白の縞と、まわる光
  function lighthouse(c, o, t) {
    if (wimg(c, 'A44', 0, 0.05, 0.5)) return;
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
    if (wimg(c, 'D24', 0, 0.05, 1.0)) return;
    c.save(); groundShadow(c, 0.4);
    poly(c, [[-0.1, 0], [-0.06, -0.4], [0.06, -0.4], [0.1, 0]], '#9a6a4a', true);
    for (const [x, y, r, col] of [[-0.24, -0.62, 0.26, '#52b86a'], [0.24, -0.62, 0.26, '#52b86a'], [0, -0.84, 0.32, '#6fd27c'], [0, -0.58, 0.3, '#63c872']]) ell(c, x, y, r, r * 0.9, col, true);
    ell(c, -0.1, -0.95, 0.12, 0.07, 'rgba(255,255,255,.35)', false);
    c.fillStyle = '#fff6a8'; for (let k = 0; k < 4; k++) { const ph = Math.sin(t * 0.004 + k * 1.7 + (o.seed || 0) * 3); c.globalAlpha = 0.3 + 0.7 * Math.abs(ph); c.beginPath(); c.arc(-0.25 + k * 0.17, -0.7 - (k % 2) * 0.16, 0.025, 0, 6.2832); c.fill(); }
    c.globalAlpha = 1; c.restore();
  }
  // 山の祠・塔(高山の目印)
  function shrine(c) {
    if (0.8 * c.getTransform().a < 110 && wimg(c, 'f_ruins', 0, 0.05, 0.8)) return;
    if (wimg(c, 'E13', 0, 0.05, 0.8)) return;
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
    animalImg(c, o); return;   // 自作の動物の絵は外した(下のコードは使わない)。用意した絵がある生き物だけ描く
    const a = o.a, A = ANI[a];
    if (A) return quad(c, o, t);
    if (BIRD[a]) return bird(c, o, t);
    const F = { penguin, seal, whale, dolphin, shark, octopus, squid: octopus, ship, sail: ship, mermaid, serpent, dragon, cactus, mushroom, bush, fairy, anchor, island }[a];
    if (F) F(c, o, t);
  }
  function field(c, o) {   // 畑(素材のタイル)。円形にくり抜いて、地面になじませる
    const im = ASSET.tile; if (!im || !im.complete || !im.naturalWidth) return;
    c.save(); c.beginPath(); c.ellipse(0, 0, 0.56, 0.56 * (o.cp || 0.7), 0, 0, 6.2832); c.clip(); c.globalAlpha = 0.92; c.imageSmoothingEnabled = false;
    const k = o.idx || 48; c.drawImage(im, (k % 8) * 64, ((k / 8) | 0) * 64, 64, 64, -0.56, -0.56 * (o.cp || 0.7), 1.12, 1.12 * (o.cp || 0.7)); c.restore();
  }
  let SEASON = 1; const SEASON_TREE = ['s_spring', 's_summer', 's_autumn', 's_winter'];   // 季節(0春 1夏 2秋 3冬)。温帯の広葉樹がこれで変わる
  const BTREE = { 1: ['i_rimetree', 'i_rimetree', 'i_crystal'], 2: ['t_moss', 't_shrub', 't_lichen'], 3: ['c_spruce', 'c_spruce', 'c_birch', 't_fir'], 4: ['c_grass', 'c_thorn', 'c_grass'], 5: ['d_cactus', 'd_cactus', 't_dead'], 6: ['t_oak', 't_birch'], 7: ['m_olive', 'm_cypress', 'm_vines', 'm_olive'], 8: ['t_oak', 't_birch', 't_autumn'], 9: ['o_cedar', 'o_cedar', 'o_rockfern', 'o_mush', 'o_bigtree'], 10: ['a_acacia', 'a_baobab', 'a_acacia2'], 11: ['j_palm', 'j_fern', 'j_palm'], 12: ['h_pine', 'h_flowers', 'h_pine'] };
  function flora(c, o) {   // 木(idx 0-3)は気候ごとの木。岩・花などは従来の素材のまま
    if (o.far) { wimg(c, o.far, 0, 0.45, o.far === 'f_marsh' || o.far === 'f_oasis' ? 0.8 : 0.95); return; }   // 遠景の森のかたまり
    const i = o.idx || 0, L = (o.b === 6 || o.b === 8) ? [SEASON_TREE[SEASON], SEASON_TREE[SEASON], o.b === 6 ? 'g_flowers' : 't_birch'].slice(0, (SEASON === 3 ? 2 : 3)) : BTREE[o.b];
    if (i <= 3 && L) { if ((() => { const nm = L[Math.floor((o.seed || 0) * 997 + i) % L.length]; return wimg(c, nm, 0, 0.45, /cactus|bush|dead|crystal|flowers|moss|shrub|lichen|grass|thorn|vines|rockfern|mush/.test(nm) ? 0.6 : 0.9); })()) return; }
    if (i <= 3 && !L) return;   // 気候に合う木が無い所には何も描かない
    kimg(c, 'env', i, 0, 0.45, 1);
  }
  const TABLE = { field, flora, animal, mountain, volcano, town, castle, pyramid, ziggurat, icepalace, lighthouse, worldtree, shrine };
  function draw(c, kind, o, t) { const f = TABLE[kind]; if (f) f(c, o, t); }
  return { draw, kinds: Object.keys(TABLE), setSeason(v) { SEASON = ((v % 4) + 4) % 4; }, season() { return SEASON; } };
})();
if (typeof module !== 'undefined') module.exports = SekaiSprites;
