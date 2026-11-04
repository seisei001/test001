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
  // 山の形(アルプス風・エベレスト風・キリマンジャロ風・富士山風・メサ・ドロミテ・ヨセミテ・アンデス・氷山・異世界風など。assets/town5)
  const MT = {}; (function () { if (typeof Image === 'undefined') return; for (const n of 'alps everest kili fuji canyon dolomite yosemite andes hill lowrock desertrock ice volcano float crystal bone deadtree zhang f2_hill f2_rock f2_snow f2_volcano'.split(' ')) { const im = new Image(); im.src = 'assets/town5/' + n + '.png?v=' + (window.APP_VER || '0'); MT[n] = im; } })();
  function mimg(c, n, w) { const im = MT[n]; if (!im || !im.complete || !im.naturalWidth) return false; const dh = w * im.naturalHeight / im.naturalWidth; c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(im, -w / 2, 0.05 - dh + w * 0.05, w, dh); c.restore(); return true; }
  // 高さの段(0丘 1低い岩山 2高い岩山 3雪山 4大雪峰)と気候(1氷雪 5砂漠 10サバナ 11熱帯 12高山 など)から、山の形の候補を選ぶ
  const MPOOL = (tier, b) => {
    const warm = b === 10 || b === 11, dry = b === 5, ice = b === 1 || b === 2, temp = b === 6 || b === 8 || b === 9 || b === 7;
    if (tier === 0) return dry ? ['desertrock'] : ice ? ['lowrock', 'ice'] : warm ? ['hill', 'hill', 'kili'] : ['hill', 'hill', 'lowrock'];
    if (tier === 1) return dry ? ['desertrock', 'canyon'] : ice ? ['ice', 'lowrock'] : warm ? ['lowrock', 'kili', 'zhang'] : b === 12 ? ['lowrock', 'dolomite', 'andes'] : ['lowrock', 'dolomite', 'lowrock'];
    if (tier === 2) return dry ? ['canyon', 'desertrock', 'yosemite'] : ice ? ['ice', 'dolomite'] : warm ? ['kili', 'zhang', 'yosemite'] : b === 12 ? ['andes', 'dolomite', 'yosemite', 'alps'] : temp ? ['yosemite', 'dolomite', 'andes', 'zhang'] : ['yosemite', 'dolomite', 'andes'];
    if (tier === 3) return ice ? ['ice', 'alps', 'everest'] : warm ? ['kili', 'fuji'] : dry ? ['canyon', 'alps'] : temp ? ['fuji', 'alps', 'andes'] : ['alps', 'fuji', 'andes', 'ice'];
    return ice ? ['ice', 'everest'] : warm ? ['kili', 'everest'] : ['everest', 'alps', 'everest'];
  };
  function mountain(c, o) {
    { const hr = o.hr == null ? 0.7 : o.hr, sd = o.seed || 0.5;   // 高さで5段階に分け、高い山ほど大きく描く(丘→岩山→高い岩山→雪山→大雪峰)
      const tier = hr < 0.3 ? 0 : hr < 0.5 ? 1 : hr < 0.7 ? 2 : hr < 0.88 ? 3 : 4, W = [0.55, 0.8, 1.05, 1.35, 1.7][tier], v2 = sd > 0.5;
      const nm = tier === 0 ? (v2 ? 'mt_hill2' : 'mt_hill') : tier === 1 ? (v2 ? 'mt_rocklow2' : 'mt_rocklow') : tier === 2 ? (o.snow ? 'mt_snow' : 'mt_rockhigh') : tier === 3 ? 'mt_snow' : 'mt_peak';
      if (W * c.getTransform().a < 120) { const fn = tier === 0 ? 'f_hill' : (tier === 1 || (tier === 2 && !o.snow)) ? 'f_rock' : 'f_snow'; if (mimg(c, tier === 0 ? 'f2_hill' : (tier === 1 || (tier === 2 && !o.snow)) ? 'f2_rock' : 'f2_snow', W * 0.95)) return; if (wimg(c, fn, 0, 0.05, W)) return; }   // 小さく映る遠景は、輪郭の太い単純な絵
      { const pool = MPOOL(tier, o.b), r = Math.floor(sd * 9973), rare = (r % 23) === 0 && tier >= 1 ? ['float', 'crystal', 'bone', 'deadtree'][(r >> 3) % 4] : null;   // まれに異世界風
        if (mimg(c, rare || pool[r % pool.length], W * 1.15)) return; }
      if (wimg(c, nm, 0, 0.05, W)) return;
      const nm0 = tier === 0 ? 'C13' : tier === 1 ? 'C12' : tier === 2 ? (o.snow ? 'C11' : (sd > 0.5 ? 'C12' : 'C32')) : 'C11';
      if (wimg(c, nm0, 0, 0.05, W)) return; }
  }
  // 火山: 頂上の火口が赤く光り、煙が上がる。山腹に溶岩の筋
  function volcano(c, o, t) {
    if (1.5 * c.getTransform().a < 120 && (mimg(c, 'f2_volcano', 1.2) || wimg(c, 'f_volcano', 0, 0.05, 1.1))) return;
    if ((o.seed || 0) > 0.35 && mimg(c, 'volcano', 1.7)) return;
    if (wimg(c, (o.seed || 0) > 0.5 ? 'mt_volcano2' : 'mt_volcano', 0, 0.05, 1.5)) return;
    if (wimg(c, 'C15', 0, 0.05, 1.5)) return;
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
  function wimg(c, n, x, y, w) { const im = WIMG[n]; if (!im || !im.complete || !im.naturalWidth) return false; const dh = w * im.naturalHeight / im.naturalWidth; c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(im, x - w / 2, y - dh + w * 0.05, w, dh); c.restore(); return true; }
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
  const WLI = {}; (function () { if (typeof Image === 'undefined') return; for (const n of ['wall_tower', 'gate', 'watch', 'palisade', 'wall', 'castle', 'pyramid', 'worldtree', 'lighthouse', 'ziggurat', 'shrine', 'icepalace']) { const im = new Image(); im.src = 'assets/town4/' + n + '.png?v=' + (window.APP_VER || '0'); WLI[n] = im; } })();
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
    if (wli(c, 'castle', 0, 0.05, 1.0)) return;
    { const CS = ['B41', 'A42', 'K11', 'K12', 'K13', 'K21', 'K22', 'K23', 'K31', 'K32', 'K33', 'K41', 'K42', 'K43']; if (wimg(c, CS[Math.floor((o.seed || 0) * 997) % CS.length], 0, 0.05, 0.95)) return; }
    if (timg(c, 'castle', 0, 0.02, 1.1)) return;
  }
  // ピラミッド(砂漠)
  function pyramid(c) {
    if (wli(c, 'pyramid', 0, 0.05, 1.0)) return;
  }
  // 神殿(熱帯): 階段状の塔と頂上の祠
  function ziggurat(c) {
    if (wli(c, 'ziggurat', 0, 0.05, 0.95)) return;
  }
  // 氷の宮殿(極地): 水晶のとげ
  function icepalace(c, o, t) {
    if (wli(c, 'icepalace', 0, 0.05, 0.85)) return;
  }
  // 灯台(海辺): 赤白の縞と、まわる光
  function lighthouse(c, o, t) {
    if (wli(c, 'lighthouse', 0, 0.05, 0.26)) return;
  }
  // 世界樹(森): 大きな丸い樹冠と太い幹。葉がきらめく
  function worldtree(c, o, t) {
    if (wli(c, 'worldtree', 0, 0.05, 1.2)) return;
  }
  // 山の祠・塔(高山の目印)
  function shrine(c) {
    if (0.8 * c.getTransform().a < 110 && wimg(c, 'f_ruins', 0, 0.05, 0.8)) return;
    if (wli(c, 'shrine', 0, 0.05, 0.8)) return;
  }
  function animal(c, o, t) { animalImg(c, o); }   // 動物は用意した絵だけを描く(自作の動物の絵は持たない)
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
