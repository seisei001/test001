'use strict';
// 斜めから見る立体表示(WebGL)。1マスを六角形の角柱にして描く。
// 見ている位置・拡大率から「どの層を描くか」を決め、その層のマスだけを遅延生成して並べる。
const SekaiView = (function () {
  const SK = Sekai, SQ3 = Math.sqrt(3);
  const MINPX = 10;                 // 層を細かくする条件: 1マスの幅がこれ(css px)以上
  const BIOME_COL = [null, [236, 242, 247], [169, 181, 154], [63, 107, 77], [181, 181, 106], [217, 187, 122], [168, 184, 74], [143, 174, 79], [79, 138, 69], [61, 122, 74], [194, 179, 71], [31, 122, 58], [139, 133, 121]];
  const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
  const HEX_GROUND = DIRS.map(([q, r]) => [q + r / 2, r * SQ3 / 2]); // 軸座標での隣の向き(層の回転前)
  const LIGHT = (function () { const x = -0.45, y = -0.65, z = 0.62, n = Math.hypot(x, y, z); return [x / n, y / n, z / n]; })();

  const VS = `attribute vec3 aPos; attribute vec4 aCol;
uniform vec2 uOff; uniform vec2 uYaw; uniform vec2 uHalf;
uniform float uPpm, uCosP, uSinP, uEx, uD, uZ0; varying vec3 vCol; varying vec3 vP; varying vec2 vG; varying float vId;
void main(){ vec2 g=aPos.xy+uOff; float u=uYaw.x*g.x+uYaw.y*g.y; float v=-uYaw.y*g.x+uYaw.x*g.y; float zz=(aPos.z-uZ0)*uEx;
 float sx=u*uPpm; float sy=(v*uCosP-zz*uSinP)*uPpm; float dp=v*uSinP+zz*uCosP;
 gl_Position=vec4(sx/uHalf.x,-sy/uHalf.y,-dp/uD,1.0); vCol=aCol.rgb; vP=aPos; vG=g; vId=aCol.a*255.0/20.0; }`;
  // 地図帳・地形模型の流儀: 等高線(段になった模型の縁)、海の波線、砂漠の点描、湿地の横線、畑の畝。遠くは霞に溶ける(観察していない所は見えない)
  const FS_BODY = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec3 vCol; varying vec3 vP; varying vec2 vG; varying float vId;
uniform float uPer, uCont, uPat, uFogR; uniform vec2 uPh; uniform vec3 uFogC;
float hs(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
void main(){
  vec3 c=vCol; float id=floor(vId+0.5);
  if(uPat>0.5){
    vec2 w=(vP.xy+uPh)/uPer;
    if(id<0.5||id>1.5){ // 陸: 等高線(5本ごとに太い線)
      if(vP.z>0.5){ float k=vP.z/uCont; float d=abs(fract(k)-0.5); float fw=FW(k)*1.4+0.002; float ln=1.0-smoothstep(0.5-fw*2.0,0.5-fw*0.3,d);
        float idx=step(abs(mod(floor(k+0.5),5.0)),0.5); c*=1.0-ln*(0.07+0.13*idx); }
    }
    if(id>0.5&&id<1.5){ float y=w.y*0.9+0.35*sin(w.x*1.6); float f=abs(fract(y)-0.5); float l=smoothstep(0.43,0.47,f); c=mix(c,c*1.12+vec3(0.02,0.03,0.04),l*0.6); }
    else if(id>1.5&&id<2.5){ vec2 q=w*2.2; vec2 g=floor(q); vec2 f=fract(q)-0.5; vec2 off=(vec2(hs(g+3.1),hs(g+7.7))-0.5)*0.5; float d2=length(f-off); float dt=(hs(g)>0.5)?(1.0-smoothstep(0.07,0.12,d2)):0.0; c*=1.0-0.2*dt; }
    else if(id>2.5&&id<3.5){ float yy=w.y*1.4; float row=fract(yy); float seg=fract(w.x*0.6+floor(yy)*0.37); float l=smoothstep(0.0,0.06,row)*(1.0-smoothstep(0.1,0.16,row))*step(seg,0.55); c=mix(c,c*vec3(0.6,0.8,0.95),l*0.6); }
    else if(id>3.5&&id<4.5){ float s2=fract(w.x*0.9); float l=smoothstep(0.35,0.4,s2)*(1.0-smoothstep(0.5,0.55,s2)); c*=1.0-0.1*l; }
  }
  float fg=smoothstep(uFogR*0.78,uFogR,length(vG)); c=mix(c,uFogC,fg);
  gl_FragColor=vec4(c,1.0);
}`;


  // ---- 地表の色: 気候(12区分)×標高×傾き×水辺×場所ごとのむら で、実際の世界地図のような多様さを出す ----
  // 参考にした実世界の分類: 土地被覆(樹木・低木・草地・耕地・裸地・雪氷・水域・湿地・マングローブ・コケ地衣類)、ケッペンの気候区分、地形(山・台地・平野・谷・カルスト・砂丘・メサ・氷河ほか)
  function mix(a, b, t) { return a + (b - a) * t; }
  function mixc(c1, c2, t) { return [mix(c1[0], c2[0], t), mix(c1[1], c2[1], t), mix(c1[2], c2[2], t)]; }
  function sstep(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function hash2(x, y, sd) { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(sd | 0, 1274126177)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  function vnoise(x, y, sd) { // なめらかな値ノイズ(0〜1)。広い範囲で色が連続して変わる
    const x0 = Math.floor(x), y0 = Math.floor(y), u = x - x0, v = y - y0, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
    const a = hash2(x0, y0, sd), b = hash2(x0 + 1, y0, sd), c = hash2(x0, y0 + 1, sd), d = hash2(x0 + 1, y0 + 1, sd);
    return mix(mix(a, b, su), mix(c, d, su), sv);
  }
  const ROCK = [[132, 126, 116], [150, 140, 126], [118, 112, 106], [160, 150, 138]];
  const CROP = [[226, 204, 110], [196, 214, 96], [170, 130, 80], [120, 170, 70], [214, 176, 96], [150, 190, 110]];
  function pick(arr, r) { return arr[Math.min(arr.length - 1, (r * arr.length) | 0)]; }
  function seaColor(h, nearBiome, cellR, shoreN) { // 深さと岸の様子で色を変える
    const t = Math.min(1, Math.max(0, -h / 6000)), s = Math.sqrt(t);
    let c = [mix(70, 14, s), mix(150, 40, s), mix(200, 98, s)];
    if (h > -250) { // 大陸棚: 浅いほど明るく
      const k = sstep(-250, -2, h); c = mixc(c, [92, 176, 204], k * 0.85);
      if (nearBiome === 10 || nearBiome === 11 || nearBiome === 5 || nearBiome === 7) c = mixc(c, [64, 200, 196], k * (0.5 + 0.4 * shoreN)); // 暖かい浅瀬: ターコイズ
      if (h > -40 && (nearBiome === 10 || nearBiome === 11) && cellR > 0.55) c = mixc(c, [92, 198, 170], 0.5); // サンゴ礁
    }
    if (nearBiome === 1 || nearBiome === 2 && cellR > 0.4) c = mixc(c, [214, 232, 242], nearBiome === 1 ? 0.85 : 0.45); // 氷雪の岸辺は海氷
    return c;
  }
  // b=気候区分, h=標高, slope=傾き, coast=海に接するか, nz=広い範囲のむら, nz2=別のむら, rnd=マスごとの乱数
  let LK = 0, PK = 0;   // PK: 模様の種類 0なし 2砂漠の点描 3湿地の線 4畑の畝   // 1=耕地・湿地・海辺・岩・雪など、木が生えない地表になった
  function landColor(b, h, slope, coast, nz, nz2, rnd) {
    const hh = Math.max(0, h);
    let c; LK = 0; PK = 0;
    switch (b) {
      case 1: c = nz > 0.55 ? mixc([238, 244, 250], [200, 224, 240], (nz - 0.55) * 2) : [238, 244, 250]; if (slope > 0.12) c = mixc(c, [176, 204, 226], 0.5); break;   // 雪原・氷河・クレバス
      case 2: { PK = nz > 0.75 ? 3 : 0; const k = nz; c = k < 0.3 ? [150, 158, 130] : k < 0.55 ? [128, 140, 110] : k < 0.75 ? [186, 184, 140] : [100, 130, 120]; if (nz2 > 0.7) c = [140, 136, 128]; break; }   // ツンドラ: 苔・地衣類・凍土の裸地・湿地
      case 3: c = nz < 0.4 ? [44, 86, 62] : nz < 0.75 ? [58, 100, 70] : [90, 105, 70]; if (nz2 > 0.82) c = [110, 125, 90]; break;   // 針葉樹林(タイガ)と湿原
      case 4: c = nz < 0.4 ? [176, 184, 106] : nz < 0.75 ? [150, 170, 100] : [200, 186, 120]; break;   // ステップ
      case 5: { PK = 2; // 砂漠: 砂・赤い岩・礫・塩湖
        c = nz < 0.35 ? [220, 190, 128] : nz < 0.6 ? [206, 168, 104] : nz < 0.8 ? [190, 120, 80] : [170, 160, 145];
        if (nz2 > 0.88 && slope < 0.04 && hh < 900) c = [238, 234, 224]; else if (nz2 > 0.45 && nz2 < 0.55 && slope < 0.08) c = mixc(c, [232, 204, 140], 0.5); break; }
      case 6: c = nz < 0.5 ? [150, 184, 76] : [180, 190, 90]; break;
      case 7: c = nz < 0.4 ? [150, 170, 84] : nz < 0.7 ? [196, 170, 100] : [128, 150, 84]; break;   // オリーブ・乾いた低木
      case 8: c = nz < 0.35 ? [74, 132, 66] : nz < 0.7 ? [96, 148, 70] : [120, 140, 60]; if (nz2 > 0.84) c = [176, 120, 50]; break;   // 落葉樹・黄葉
      case 9: c = nz < 0.5 ? [52, 114, 72] : [70, 128, 88]; break;
      case 10: c = nz < 0.4 ? [196, 176, 84] : nz < 0.75 ? [170, 160, 70] : [120, 146, 62]; break;   // サバナ: 枯れ草と木立
      case 11: c = nz < 0.4 ? [24, 112, 52] : nz < 0.7 ? [18, 92, 48] : [44, 130, 60]; break;
      case 12: c = slope < 0.15 && hh < 3000 ? [128, 150, 96] : ROCK[((nz * 4) | 0) & 3]; break;   // 高山草原・岩
      default: c = [79, 138, 69];
    }
    // 耕地: 平らで低い、人が住みやすい気候のところにパッチ状に広がる
    if ((b === 6 || b === 7 || b === 8 || b === 4 || b === 9 || b === 10) && slope < 0.05 && hh < 700 && nz2 > 0.5 && nz2 < 0.72) { LK = 1; PK = 4; c = pick(CROP, hash2((nz * 4000) | 0, (nz2 * 4000) | 0, 91)); }
    // 湿地: 低くて平らで雨の多い所
    if ((b === 3 || b === 8 || b === 9 || b === 11 || b === 2 || b === 4) && slope < 0.03 && hh < 90 && !coast && nz2 > 0.88) { LK = 1; PK = 3; c = nz > 0.5 ? [96, 140, 120] : [80, 140, 140]; }
    // 海辺: 砂浜・マングローブ・岩礁
    if (coast) {
      LK = 1; PK = 0;
      if (slope > 0.15) c = mixc(c, [120, 112, 104], 0.7);
      else if ((b === 11 || b === 10) && hh < 12) c = nz > 0.4 ? [60, 110, 80] : [40, 120, 100];
      else if (hh < 40 && b !== 1) c = mixc(c, b === 11 || b === 10 || b === 5 ? [242, 230, 188] : [226, 210, 160], 0.8);
    }
    // 急斜面は岩肌(ガレ場)
    if (b !== 1 && b !== 5 && slope > 0.14) { LK = 1; PK = 0; }
    if (b !== 1 && b !== 5 && slope > 0.14) c = mixc(c, ROCK[((rnd * 4) | 0) & 3], sstep(0.14, 0.3, slope));
    // 森林限界: 高いほど岩へ。さらに高いと雪
    if (b !== 1 && b !== 5) {
      c = mixc(c, ROCK[((nz2 * 4) | 0) & 3], sstep(2400, 3400, hh) * 0.85);
      const snow = sstep(3300 + 800 * (nz - 0.5), 5200, hh); if (snow > 0.05 || hh > 2500) { LK = 1; PK = 0; }
      c = mixc(c, [246, 248, 252], snow);
    } else if (b === 5) { c = mixc(c, [190, 170, 150], sstep(2600, 4200, hh) * 0.5); c = mixc(c, [246, 248, 252], sstep(5000, 6000, hh)); }
    const j = 0.93 + 0.14 * rnd; // マスごとのわずかな明暗
    return [c[0] * j, c[1] * j, c[2] * j];
  }

  // ---- 絵記号: 絵本・図鑑・絵地図のように、土地ごとの生き物や目印を絵で添える ----
  const STAMPS = { 1: ['penguin', 'seal', 'polar'], 2: ['deer', 'wolf', 'owl'], 3: ['bear', 'deer', 'fox'], 4: ['horse', 'eagle', 'sheep'], 5: ['camel', 'cactus', 'dragon'], 6: ['cow', 'bison', 'sheep'], 7: ['sheep', 'goat', 'bush'], 8: ['fox', 'mushroom', 'boar'], 9: ['owl', 'fairy', 'deer'], 10: ['lion', 'elephant', 'giraffe'], 11: ['parrot', 'monkey', 'tiger'], 12: ['goat', 'dragon', 'eagle'] };
  const SEA_STAMPS = ['whale', 'ship', 'octopus', 'shark', 'sail', 'dolphin'], DEEP_STAMPS = ['serpent', 'squid', 'mermaid', 'whale'];   // 深い海には「ここにドラゴンあり」の怪物
  function stampFor(b, h, coast, r) { // 生き物もアニメ風の絵(sprites.js の animal)
    let a;
    if (h < -3500) a = DEEP_STAMPS[Math.min(DEEP_STAMPS.length - 1, (r * DEEP_STAMPS.length) | 0)];
    else if (h <= 0) a = SEA_STAMPS[Math.min(SEA_STAMPS.length - 1, (r * SEA_STAMPS.length) | 0)];
    else if (coast && b !== 1) a = r < 0.5 ? 'anchor' : 'island';
    else { const l = STAMPS[b] || STAMPS[8]; a = l[Math.min(l.length - 1, (r * l.length) | 0)]; }
    return { k: 'animal', a, seed: (r * 977) % 1 };
  }
  function create(canvas, sk, hooks) {
    hooks = hooks || {};
    const gl = canvas.getContext('webgl', { antialias: true, alpha: false, depth: true });
    if (!gl) throw new Error('WebGL unavailable');
    function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); const dext = gl.getExtension('OES_standard_derivatives'); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, (dext ? '#extension GL_OES_standard_derivatives : enable\n#define FW(x) fwidth(x)\n' : '#define FW(x) 0.03\n') + FS_BODY)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const U = {}; ['uOff', 'uYaw', 'uHalf', 'uPpm', 'uCosP', 'uSinP', 'uEx', 'uD', 'uZ0', 'uPer', 'uCont', 'uPat', 'uFogR', 'uPh', 'uFogC'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
    const aPos = gl.getAttribLocation(prog, 'aPos'), aCol = gl.getAttribLocation(prog, 'aCol');
    const vbo = gl.createBuffer(), selBuf = gl.createBuffer();
    gl.enable(gl.DEPTH_TEST); gl.clearColor(0.05, 0.1, 0.16, 1); const FOGC = [0.05, 0.1, 0.16];

    const FV = new Set();   // 噴火で生まれた火山(層,q,r)
    const fv = FV;
    // 街は「親のマスが街なら、子の層でも真ん中の子が街」で層をまたいで同じ場所に出る(新しく生まれる街は層ごとに少しだけ)
    const K0 = SK.OFF.findIndex(o => o[0] === 0 && o[1] === 0), tcell = { h: 0, b: 0, rel: 0 };
    function townOwn(L, q, r) { sk.cell(L, q, r, tcell); return tcell.h > 0 && tcell.h < (tcell.b === 12 ? 3200 : 900) && tcell.b >= 1 && tcell.b <= 12 && hash2(q, r, L + 62) < (L === 0 ? 0.02 : 0.003); }
    // 火山: 高い山の頂(隣に自分より高い所がない)の一部。親が火山なら子の層でも真ん中の子が火山(層をまたいで同じ場所)
    const tc2 = { h: 0, b: 0, rel: 0 };
    function volOwn(L, q, r) {
      if (L > 3) return false; sk.cell(L, q, r, tcell); const h0 = tcell.h; if (h0 < 1800) return false;
      for (let k = 0; k < 6; k++) { sk.cell(L, q + DIRS[k][0], r + DIRS[k][1], tc2); if (tc2.h > h0) return false; }
      return hash2(q, r, L + 64) < (L === 0 ? 0.2 : 0.006);
    }
    function isVolcano(L, q, r) {
      if (FV.has(L + ',' + q + ',' + r) || volOwn(L, q, r)) return true; if (L < 1 || L > 3) return false;
      const pt = SK.parentOf(q, r, [0, 0, 0]); if (pt[2] !== K0) return false; return isVolcano(L - 1, pt[0], pt[1]);
    }
    function findVolcano(L, q, r) { if (isVolcano(L, q, r)) return [q, r]; for (let k = 0; k < 6; k++) if (isVolcano(L, q + DIRS[k][0], r + DIRS[k][1])) return [q + DIRS[k][0], r + DIRS[k][1]]; return null; }
    // 街の「根」(最初に生まれた層と場所)を返す。子の層の街は根を引き継ぐので、街の種類・大きさは層をまたいで同じになる
    function isTown(L, q, r) {
      if (townOwn(L, q, r)) return [L, q, r]; if (L < 1) return null;
      const pt = SK.parentOf(q, r, [0, 0, 0]); if (pt[2] !== K0) return null; return isTown(L - 1, pt[0], pt[1]);
    }
    // 実在の歴史的な街をもとにした型(sprites.js の TT)を、気候区分から選ぶ
    const TOWN_TYPES = { 1: ['igloo'], 2: ['turf', 'russian'], 3: ['russian', 'hansa'], 4: ['yurt'], 5: ['medina', 'djenne'], 6: ['medieval', 'chinese', 'starfort'], 7: ['greek', 'roman', 'medina'], 8: ['japan', 'medieval', 'chinese'], 9: ['hansa', 'medieval', 'starfort'], 10: ['djenne', 'kraal'], 11: ['stilt', 'kraal'], 12: ['inca', 'tibet'] };
    const w = sk.w;
    const worldW = (w.W + 0.5) * SK.spacing(0);
    const st = {
      fx: worldW / 2 - SK.spacing(0) / 2, fy: (w.H - 1) * SK.spacing(0) * SQ3 / 4,
      ppm: 1, yaw: 0, tilt: 55 * Math.PI / 180, exMul: 1,
      W: 300, H: 600, dpr: 1, L: 0, z0: 0,
    };
    st.fx = (w.W - 0.5) * SK.spacing(0) / 2; st.fy = (w.H - 1) * SK.spacing(0) * SQ3 / 2 / 2;
    const exByLayer = [];
    let mesh = null;      // 構築結果
    let sel = null;       // 選択中のマス {L,q,r}
    const qsA = new Int32Array(60000), rsA = new Int32Array(60000);

    function fitPpm() { return (st.W / (worldW * 1.04)); }
    function minPpm() { return fitPpm() * 0.9; }
    function maxPpm() { return 170; }
    function clampPpm() { st.ppm = Math.min(maxPpm(), Math.max(minPpm(), st.ppm)); }

    function chooseLayer() {
      let L = 0;
      for (let l = 1; l < SK.NL; l++) if (SK.spacing(l) * st.ppm >= MINPX) L = l;
      return L;
    }
    function needRadius() {
      const cp = Math.max(Math.cos(st.tilt), 0.3);
      return 0.56 * Math.hypot(st.W / st.ppm, st.H / (st.ppm * cp));
    }

    let PID = 0, mesh_TH = 12;
    function build() {
      const t0 = performance.now();
      const L = st.L = chooseLayer(), s = SK.spacing(L), a = SK.angle(L);
      const need = needRadius();
      let rad = need * 1.55, cx = st.fx, cy = st.fy;
      if (L === 0) { rad = Math.max(rad, worldW); cx = (w.W - 0.5) * s / 2; cy = (w.H - 1) * s * SQ3 / 4; }
      let n = sk.cellsIn(L, cx, cy, rad, qsA, rsA);
      // 範囲を絞る(多すぎるときは半径を縮める)
      while (n > 14000) { rad *= 0.85; n = sk.cellsIn(L, cx, cy, rad, qsA, rsA); }
      const cell = { h: 0, b: 0, rel: 0 };
      const qs = [], rs = [], hs = [], bs = [];
      const idx = new Map(); const key = (q, r) => (q + 33554432) * 67108864 + (r + 33554432);
      for (let i = 0; i < n; i++) {
        const q = qsA[i], r = rsA[i];
        if (L === 0) { const c = q + ((r - (r & 1)) >> 1); if (r < 0 || r >= w.H || c < 0 || c >= w.W) continue; }
        sk.cell(L, q, r, cell);
        idx.set(key(q, r), qs.length); qs.push(q); rs.push(r); hs.push(cell.h); bs.push(cell.b);
      }
      const m = qs.length;
      const zOf = h => (h > 0 ? h : 0);
      const nbH = new Float32Array(6), tmp = { h: 0, b: 0, rel: 0 };
      // 高さの強調: その層での隣どうしの高さ差の平均が、マスの大きさの何割かになるように
      if (exByLayer[L] === undefined) {
        let sum = 0, cnt = 0;
        for (let i = 0; i < m; i += Math.max(1, (m / 800) | 0)) for (let k = 0; k < 3; k++) {
          const j = idx.get(key(qs[i] + DIRS[k][0], rs[i] + DIRS[k][1])); if (j === undefined) continue;
          sum += Math.abs(zOf(hs[i]) - zOf(hs[j])); cnt++;
        }
        const mean = cnt ? sum / cnt : 0;
        exByLayer[L] = 1;   // 高さは実寸のまま。立体感は陰影と、各層で生成する本物の起伏で出す
      }
      const ex = exByLayer[L] * st.exMul;
      // 頂点: 位置3 float + 色4 byte = 16byte
      const maxV = m * 54 + m * 52;
      const buf = new ArrayBuffer(maxV * 16), f32 = new Float32Array(buf), u8 = new Uint8Array(buf);
      let nv = 0, zmax = 1;
      const ox = st.fx, oy = st.fy, ca = Math.cos(a), sa = Math.sin(a), Rc = s / SQ3;
      const corner = []; for (let j = 0; j < 6; j++) { const th = (30 + 60 * j) * Math.PI / 180; const px = Math.cos(th), py = Math.sin(th); corner.push([Rc * (ca * px - sa * py), Rc * (sa * px + ca * py)]); }
      const dirU = HEX_GROUND.map(([x, y]) => { const X = ca * x - sa * y, Y = sa * x + ca * y, l = Math.hypot(X, Y); return [X / l, Y / l]; });
      const P = [0, 0]; const cpos = new Float64Array(m * 3);
      function vert(x, y, z, r, g, b, shade) {
        const o = nv * 4; f32[o] = x; f32[o + 1] = y; f32[o + 2] = z;
        const ob = nv * 16 + 12; u8[ob] = Math.min(255, r * shade); u8[ob + 1] = Math.min(255, g * shade); u8[ob + 2] = Math.min(255, b * shade); u8[ob + 3] = PID * 20; nv++;
      }
      // なめらか表示: 六角形は計算の格子にすぎない。見た目は、3マスが集まる角の高さ・色・明るさを3マスの平均にして連続した地面にする
      const STP = [], FV = fv, sprK = Math.min(1, 1500 / Math.max(1, m)), sprT = Math.min(1, 2000 / Math.max(1, m)), stampP = Math.min(0.2, 90 / Math.max(1, m));
      const SM = st.smooth !== false, COL = new Float32Array(m * 3), SHD = new Float32Array(m);
      for (let pass = SM ? 1 : 2; pass <= 2; pass++) for (let i = 0; i < m; i++) {
        const q = qs[i], r = rs[i], h = hs[i], z = zOf(h);
        SK.pos(L, q, r, P); const cxl = P[0] - ox, cyl = P[1] - oy;
        cpos[i * 3] = P[0]; cpos[i * 3 + 1] = P[1]; cpos[i * 3 + 2] = z;
        if (z + 0.25 * s / ex > zmax) zmax = z + 0.25 * s / ex;
        // 隣の高さ
        let gx = 0, gy = 0;
        for (let k = 0; k < 6; k++) {
          const j = idx.get(key(q + DIRS[k][0], r + DIRS[k][1]));
          let hn; if (j !== undefined) hn = hs[j]; else { sk.cell(L, q + DIRS[k][0], r + DIRS[k][1], tmp); if (L === 0 && 0) hn = 0; hn = tmp.h; }
          nbH[k] = zOf(hn); gx += (nbH[k] - z) * dirU[k][0]; gy += (nbH[k] - z) * dirU[k][1];
        }
        gx = gx / (3 * s) * ex * 2.5; gy = gy / (3 * s) * ex * 2.5;   // 陰影だけに使う傾き(地図の陰影起伏と同じ。形は変えない)           // 見かけの傾き
        const nl = Math.hypot(gx, gy, 1), nd = (-gx * LIGHT[0] - gy * LIGHT[1] + LIGHT[2]) / nl;
        let drop = 0, coast = false, nearB = 0, shoreN = 0;
        for (let k = 0; k < 6; k++) { const dd = Math.abs(nbH[k] - z); if (dd > drop) drop = dd; }
        for (let k = 0; k < 6; k++) { const j = idx.get(key(q + DIRS[k][0], r + DIRS[k][1])); let hn2, bn2; if (j !== undefined) { hn2 = hs[j]; bn2 = bs[j]; } else { sk.cell(L, q + DIRS[k][0], r + DIRS[k][1], tmp); hn2 = tmp.h; bn2 = tmp.b; }
          if (h > 0 && hn2 <= 0) coast = true; if (h <= 0 && hn2 > 0 && bn2 > 0) { nearB = bn2; shoreN++; } }
        const slope = drop / s, nzs = s * 6, nzA = vnoise(P[0] / nzs, P[1] / nzs, L * 7 + 1), nzB = vnoise(P[0] / (nzs * 0.45) + 17, P[1] / (nzs * 0.45) + 31, L * 7 + 2), rnd = hash2(q, r, L + 5);
        const col = h > 0 ? landColor(bs[i], h, slope, coast, nzA, nzB, rnd) : seaColor(h, nearB, rnd, Math.min(1, shoreN / 3));
        // 谷と尾根の陰影(Kashmir 3D のような地図の陰影起伏): 周りの平均より高ければ明るく(尾根)、低ければ暗く(谷)。高さの強調に頼らず立体に見せる
        let nsum = 0; for (let k = 0; k < 6; k++) nsum += nbH[k];
        const curv = Math.max(-0.28, Math.min(0.28, ((z - nsum / 6) / s) * 5));
        const shade = h > 0 ? Math.min(1.25, Math.max(0.5, 0.58 + 0.62 * nd + curv)) : 1.0;
        const pk = PK; COL[i * 3] = col[0]; COL[i * 3 + 1] = col[1]; COL[i * 3 + 2] = col[2]; SHD[i] = shade;
        if (pass === 1) continue;
        PID = h > 0 ? pk : 1;
        { // アニメ風の絵(山・火山・街・城・目印)を選ぶ。選ばれなければ生き物の絵記号
          const sr = hash2(q, r, L + 60), sr2 = hash2(q, r, L + 62), sr3 = hash2(q, r, L + 63), b0 = bs[i]; let spec = null;
          if (FV.has(L + ',' + q + ',' + r)) spec = { k: 'volcano', b: b0, seed: sr, active: true };
          else if (h > 0) {
            let peak = true; for (let k = 0; k < 6; k++) if (nbH[k] > z) { peak = false; break; }
            let ridge = true; { let hi = 0; for (let k = 0; k < 6; k++) if (nbH[k] > z) hi++; ridge = hi <= 1; }   // 尾根(隣に高い所が1つ以下)
            if (L <= 3 && isVolcano(L, q, r)) spec = { k: 'volcano', b: b0, seed: sr };
            else if (L <= 3 && h > 2200 && (sr < 0.04 * sprK || (sr < 0.5 * sprK && ridge))) spec = { k: 'mountain', b: b0, snow: h > 3600, seed: sr, hr: Math.max(0.25, Math.min(1, (h - 1500) / 3500)) };
            else if (L <= 2 && h > 1100 && slope > 0.09 && sr < 0.1 * sprK) spec = { k: 'mountain', b: b0, snow: false, seed: sr, hr: Math.max(0.2, Math.min(0.6, (h - 800) / 3000)) };
            else if (sr3 < 0.008 * sprT * (coast && b0 !== 1 ? 0.4 : 1)) { const kd = b0 === 5 ? 'pyramid' : (b0 === 11 || b0 === 10) ? 'ziggurat' : b0 === 1 ? 'icepalace' : coast ? 'lighthouse' : (b0 === 3 || b0 === 8 || b0 === 9) ? 'worldtree' : b0 === 12 ? 'shrine' : 'castle'; spec = { k: kd, b: b0, seed: sr2 }; }
            else if (isTown(L, q, r)) {
              const rt = isTown(L, q, r), rs0 = hash2(rt[1], rt[2], rt[0] + 99), lst = TOWN_TYPES[b0] || TOWN_TYPES[6];
              let cx = 0, cy = 0, sea = 0; for (let k = 0; k < 6; k++) if (nbH[k] <= 0) { cx -= dirU[k][0]; cy -= dirU[k][1]; sea++; }
              const cl = Math.hypot(cx, cy) || 1;   // 海から陸へ向かう向き(海岸の街は海側に建てない)
              spec = { k: 'town', b: b0, ty: lst[Math.min(lst.length - 1, (hash2(rt[1], rt[2], rt[0] + 98) * lst.length) | 0)], n: 2 + ((rs0 * 40) | 0) % 4, seed: rs0, nx: sea ? cx / cl : 0, ny: sea ? cy / cl : 0 };
            }
          }
          if (spec) STP.push(i, spec);
          else { const sp = h > 0 ? 1 : (h < -300 ? 0.3 : 0); if (L < 4 && sr < stampP * sp * (L >= 3 ? 0.3 : 1)) STP.push(i, stampFor(b0, h, coast, hash2(q, r, L + 61))); }
        }
        if (SM) {
          const cz = [0, 0, 0, 0, 0, 0], cR = [0, 0, 0, 0, 0, 0], cG = [0, 0, 0, 0, 0, 0], cB = [0, 0, 0, 0, 0, 0], cS = [0, 0, 0, 0, 0, 0];
          for (let k = 0; k < 6; k++) {
            const ka = k, kb = (k + 1) % 6;
            const ja = idx.get(key(q + DIRS[ka][0], r + DIRS[ka][1])), jb = idx.get(key(q + DIRS[kb][0], r + DIRS[kb][1]));
            const ia = ja === undefined ? i : ja, ib = jb === undefined ? i : jb;
            cz[k] = (h <= 0 || nbH[ka] <= 0 || nbH[kb] <= 0) ? 0 : (z + nbH[ka] + nbH[kb]) / 3;   // 海に接する角は海面の高さ(海岸はなだらかに海へ下る)
            cR[k] = (COL[i * 3] + COL[ia * 3] + COL[ib * 3]) / 3; cG[k] = (COL[i * 3 + 1] + COL[ia * 3 + 1] + COL[ib * 3 + 1]) / 3; cB[k] = (COL[i * 3 + 2] + COL[ia * 3 + 2] + COL[ib * 3 + 2]) / 3;
            cS[k] = (SHD[i] + SHD[ia] + SHD[ib]) / 3;
          }
          for (let k = 0; k < 6; k++) {
            const k1 = (k + 1) % 6, c0 = corner[k], c1 = corner[k1];
            vert(cxl, cyl, z, col[0], col[1], col[2], shade);
            vert(cxl + c0[0], cyl + c0[1], cz[k], cR[k], cG[k], cB[k], cS[k]);
            vert(cxl + c1[0], cyl + c1[1], cz[k1], cR[k1], cG[k1], cB[k1], cS[k1]);
          }
        } else
        for (let k = 0; k < 6; k++) {
          const c0 = corner[k], c1 = corner[(k + 1) % 6];
          vert(cxl, cyl, z, col[0], col[1], col[2], shade);
          vert(cxl + c0[0], cyl + c0[1], z, col[0], col[1], col[2], shade);
          vert(cxl + c1[0], cyl + c1[1], z, col[0], col[1], col[2], shade);
        }
        PID = 0;
        // 木: 森のマスに、円すい形の木を数本立てる(層が細かくなっても大きさはマスに合わせて変わる)
        if (h > 0 && !LK) {
          const bb = bs[i], cnt = bb === 3 ? 4 : bb === 11 ? 4 : bb === 8 ? 3 : bb === 9 ? 3 : bb === 10 ? 1 : bb === 7 ? 1 : 0;
          for (let t = 0; t < cnt; t++) {
            const hr = hash2(q * 7 + t, r * 13 - t, L + 40), ha = hash2(q * 5 - t, r * 11 + t, L + 41), hs3 = hash2(q + t * 3, r + t * 5, L + 42);
            const ang = hr * 6.2832, rad = (0.15 + 0.38 * Math.sqrt(ha)) * Rc, tx = cxl + Math.cos(ang) * rad, ty = cyl + Math.sin(ang) * rad;
            const tall = (bb === 11 ? 0.2 : bb === 3 ? 0.24 : 0.17) * s * (0.7 + 0.6 * hs3) / ex, rb = (bb === 8 || bb === 9 ? 0.085 : 0.06) * s * (0.8 + 0.4 * hs3);
            const tc = bb === 3 ? [30, 76, 52] : bb === 11 ? [20, 100, 44] : bb === 8 ? [58, 124, 54] : bb === 9 ? [44, 108, 66] : bb === 10 ? [110, 136, 56] : [112, 130, 70];
            const tj = 0.85 + 0.3 * hs3;
            for (let k = 0; k < 4; k++) {
              const a0 = k * Math.PI / 2 + 0.785, a1 = a0 + Math.PI / 2, am = (a0 + a1) / 2, nx = Math.cos(am), ny = Math.sin(am), sd2 = Math.min(1.15, Math.max(0.5, 0.78 - 0.4 * (nx * LIGHT[0] + ny * LIGHT[1])));
              vert(tx, ty, z + tall, tc[0] * tj * 1.15, tc[1] * tj * 1.15, tc[2] * tj * 1.15, sd2);
              vert(tx + Math.cos(a0) * rb, ty + Math.sin(a0) * rb, z, tc[0] * tj, tc[1] * tj, tc[2] * tj, sd2);
              vert(tx + Math.cos(a1) * rb, ty + Math.sin(a1) * rb, z, tc[0] * tj, tc[1] * tj, tc[2] * tj, sd2);
            }
          }
        }
        // 側面: 隣より高いところだけ
        if (!SM) for (let k = 0; k < 6; k++) {
          if (nbH[k] >= z) continue;
          // 辺 k は角 (k-1) と k の間
          const c0 = corner[(k + 5) % 6], c1 = corner[k], zn = nbH[k];
          const sd = 0.62 + 0.18 * (dirU[k][0] * LIGHT[0] + dirU[k][1] * LIGHT[1]) * -1;
          const sc = [col[0] * 0.8, col[1] * 0.8, col[2] * 0.8];
          vert(cxl + c0[0], cyl + c0[1], z, sc[0], sc[1], sc[2], sd); vert(cxl + c1[0], cyl + c1[1], z, sc[0], sc[1], sc[2], sd); vert(cxl + c1[0], cyl + c1[1], zn, sc[0], sc[1], sc[2], sd);
          vert(cxl + c0[0], cyl + c0[1], z, sc[0], sc[1], sc[2], sd); vert(cxl + c1[0], cyl + c1[1], zn, sc[0], sc[1], sc[2], sd); vert(cxl + c0[0], cyl + c0[1], zn, sc[0], sc[1], sc[2], sd);
        }
      }
      // 街と街をつなぐ道: 近い街2つへ。海は渡らず、急な坂を避け、すでにある道には乗り入れる
      const roads = [], onRoad = new Uint8Array(m);
      function roadPath(a, b) {
        const hd = (i, j) => { const dq = qs[i] - qs[j], dr = rs[i] - rs[j]; return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2; };
        const g = new Map([[a, 0]]), from = new Map(), heap = [[hd(a, b), a]], done = new Set();
        const push = (it) => { heap.push(it); let c = heap.length - 1; while (c > 0) { const p2 = (c - 1) >> 1; if (heap[p2][0] <= heap[c][0]) break; [heap[p2], heap[c]] = [heap[c], heap[p2]]; c = p2; } };
        const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { let l = 2 * c + 1, r2 = l + 1, mn = c; if (l < heap.length && heap[l][0] < heap[mn][0]) mn = l; if (r2 < heap.length && heap[r2][0] < heap[mn][0]) mn = r2; if (mn === c) break; [heap[mn], heap[c]] = [heap[c], heap[mn]]; c = mn; } } return top; };
        let n = 0;
        while (heap.length && n++ < 4000) {
          const [, i] = pop(); if (done.has(i)) continue; done.add(i);
          if (i === b) { const pth = [b]; let c = b; while (c !== a) { c = from.get(c); pth.push(c); } return pth.reverse(); }
          for (let k = 0; k < 6; k++) {
            const j = idx.get(key(qs[i] + DIRS[k][0], rs[i] + DIRS[k][1])); if (j === undefined || hs[j] <= 0) continue;
            const cost = g.get(i) + (onRoad[j] ? 0.35 : 1 + 8 * Math.abs(hs[j] - hs[i]) / s + (hs[j] > 2500 ? 3 : 0));
            if (g.has(j) && g.get(j) <= cost) continue; g.set(j, cost); from.set(j, i); push([cost + hd(j, b), j]);
          }
        }
        return null;
      }
      if (L > 0) {
        const T = []; for (let k = 0; k < STP.length; k += 2) if (typeof STP[k + 1] === 'object' && STP[k + 1].k === 'town') T.push(STP[k]);
        const es = new Set();
        for (const a of T) {
          const near = T.filter(b => b !== a).map(b => [Math.hypot(cpos[a * 3] - cpos[b * 3], cpos[a * 3 + 1] - cpos[b * 3 + 1]), b]).filter(x => x[0] < s * 16).sort((x, y) => x[0] - y[0]).slice(0, 2);
          for (const [, b] of near) { const kk = a < b ? a + ',' + b : b + ',' + a; if (es.has(kk)) continue; es.add(kk); const pth = roadPath(a, b); if (pth) { for (const i of pth) onRoad[i] = 1; roads.push(pth); } }
        }
      }
      // 川と湖: 水は低い方へ流れる。窪みは水を溜めて湖になり(あふれた先へ流れ出る)、集まった水の量が多い所が川になる
      const rivers = [], lakes = [];
      if (L > 0) {
        const fill = new Float32Array(m).fill(Infinity), down = new Int32Array(m).fill(-1), seen = new Uint8Array(m), order = [], eps = 1e-4 * s, HH = [];
        const hpush = it => { HH.push(it); let c = HH.length - 1; while (c > 0) { const p2 = (c - 1) >> 1; if (HH[p2][0] <= HH[c][0]) break; [HH[p2], HH[c]] = [HH[c], HH[p2]]; c = p2; } };
        const hpop = () => { const top = HH[0], last = HH.pop(); if (HH.length) { HH[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, r2 = l + 1; let mn = c; if (l < HH.length && HH[l][0] < HH[mn][0]) mn = l; if (r2 < HH.length && HH[r2][0] < HH[mn][0]) mn = r2; if (mn === c) break; [HH[mn], HH[c]] = [HH[c], HH[mn]]; c = mn; } } return top; };
        for (let i = 0; i < m; i++) {
          let edge = false; for (let k = 0; k < 6; k++) if (idx.get(key(qs[i] + DIRS[k][0], rs[i] + DIRS[k][1])) === undefined) { edge = true; break; }
          if (hs[i] <= 0 || edge) { fill[i] = Math.max(0, hs[i]); seen[i] = 1; hpush([fill[i], i]); }
        }
        while (HH.length) {
          const [, i] = hpop(); order.push(i);
          for (let k = 0; k < 6; k++) { const j = idx.get(key(qs[i] + DIRS[k][0], rs[i] + DIRS[k][1])); if (j === undefined || seen[j]) continue; seen[j] = 1; fill[j] = Math.max(hs[j], fill[i] + eps); down[j] = i; hpush([fill[j], j]); }
        }
        const acc = new Float32Array(m).fill(1);
        for (let o = order.length - 1; o >= 0; o--) { const i = order[o]; if (down[i] >= 0 && hs[i] > 0) acc[down[i]] += acc[i]; }
        const TH = Math.max(12, m * 0.002); mesh_TH = TH;
        const isR = new Uint8Array(m), hasUp = new Uint8Array(m);
        for (let i = 0; i < m; i++) {
          if (hs[i] <= 0) continue;
          if (fill[i] - hs[i] > 0.03 * s) lakes.push(i);
          else if (down[i] >= 0 && acc[i] >= TH) { isR[i] = 1; hasUp[down[i]] = 1; }
        }
        // なめらかな曲線にするため、各マスで「上流側の辺の中点 → このマス → 下流側の辺の中点」をつなぐ(a,b,c,水量)
        for (let i = 0; i < m; i++) if (isR[i]) {
          const t = down[i], c = isR[t] ? down[t] : t;
          rivers.push(i, t, c, acc[i]);
          if (!hasUp[i]) rivers.push(i, i, t, acc[i]);
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, buf.slice(0, nv * 16), gl.STATIC_DRAW);
      let hmx = 1; for (let i = 0; i < m; i++) if (hs[i] > hmx) hmx = hs[i];
      const raw = Math.max(2, hmx / 12), pw = Math.pow(10, Math.floor(Math.log10(raw))), nm = raw / pw, cstep = pw * (nm < 1.5 ? 1 : nm < 3.5 ? 2 : nm < 7.5 ? 5 : 10);
      mesh = { L, s, ox, oy, cx, cy, rad, nv, m, ex, zmax, cstep, qs, rs, hs, bs, cpos, Rc, stamps: STP, roads, rivers, lakes, riverTH: mesh_TH, ms: performance.now() - t0, tilt: st.tilt };
      mesh.D = 3 * Math.max(rad, need * 2) + 2 * zmax * ex + 10;
      if (hooks.onBuild) hooks.onBuild(mesh);
    }

    function needRebuild() {
      if (!mesh) return true;
      if (chooseLayer() !== mesh.L) return true;
      if (mesh.L === 0) return false;
      const need = needRadius(), d = Math.hypot(st.fx - mesh.cx, st.fy - mesh.cy);
      return d + need > mesh.rad || Math.abs(st.tilt - mesh.tilt) > 0.35;
    }

    const fq = [0, 0], fr2 = [0, 0], fcell = { h: 0, b: 0, rel: 0 };
    function focusHeight() {
      if (!mesh || mesh.L === 0) return 0;
      SK.locate(mesh.L, st.fx, st.fy, fq); SK.roundAxial(fq[0], fq[1], fr2);
      sk.cell(mesh.L, fr2[0], fr2[1], fcell); return fcell.h > 0 ? fcell.h : 0;
    }
    function draw() {
      if (needRebuild()) build();
      const tz = focusHeight(), dz = tz - st.z0;
      if (Math.abs(dz) > 0.002 * mesh.s) { st.z0 += dz * 0.35; changed(); } else st.z0 = tz;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform2f(U.uOff, mesh.ox - st.fx, mesh.oy - st.fy);
      gl.uniform2f(U.uYaw, Math.cos(st.yaw), Math.sin(st.yaw));
      gl.uniform2f(U.uHalf, st.W / 2, st.H / 2);
      gl.uniform1f(U.uPpm, st.ppm); gl.uniform1f(U.uCosP, Math.cos(st.tilt)); gl.uniform1f(U.uSinP, Math.sin(st.tilt));
      gl.uniform1f(U.uEx, mesh.ex); gl.uniform1f(U.uD, mesh.D); gl.uniform1f(U.uZ0, st.z0);
      const per = mesh.s * 0.28; gl.uniform1f(U.uPer, per); gl.uniform1f(U.uCont, mesh.cstep); gl.uniform1f(U.uPat, st.pattern === false ? 0 : 1);
      gl.uniform2f(U.uPh, ((mesh.ox % (per * 40)) + per * 40) % (per * 40), ((mesh.oy % (per * 40)) + per * 40) % (per * 40));
      gl.uniform1f(U.uFogR, mesh.L === 0 ? 1e12 : mesh.rad * 0.92); gl.uniform3f(U.uFogC, FOGC[0], FOGC[1], FOGC[2]);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(aCol); gl.vertexAttribPointer(aCol, 4, gl.UNSIGNED_BYTE, true, 16, 12);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.nv);
      if (sel && sel.L === mesh.L) drawSel();
      drawStamps();
    }
    function drawStamps() { // 絵を、地面の上に重ねた2D画像として描く(3Dの位置を画面へ投影)。アニメ風の絵は動く(煙・旗・光)
      const ov = hooks.overlay; if (!ov || !mesh) return;
      if (ov.width !== canvas.width || ov.height !== canvas.height) { ov.width = canvas.width; ov.height = canvas.height; }
      const c2 = ov.getContext('2d'); c2.setTransform(1, 0, 0, 1, 0, 0); c2.clearRect(0, 0, ov.width, ov.height);
      if (!mesh.stamps.length && !(mesh.roads && mesh.roads.length) && !(mesh.rivers && mesh.rivers.length) && !(mesh.lakes && mesh.lakes.length)) return;
      const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.tilt), sp = Math.sin(st.tilt), list = [], st2 = mesh.stamps, tm = performance.now();
      for (let k = 0; k < st2.length; k += 2) {
        const i = st2[k], gx = mesh.cpos[i * 3] - st.fx, gy = mesh.cpos[i * 3 + 1] - st.fy, zz = (mesh.cpos[i * 3 + 2] - st.z0) * mesh.ex;
        const X = st.W / 2 + (cy * gx + sy * gy) * st.ppm, Y = st.H / 2 + ((-sy * gx + cy * gy) * cp - zz * sp) * st.ppm;
        if (X < -60 || X > st.W + 60 || Y < -60 || Y > st.H + 160) continue;
        const fd = Math.hypot(gx, gy); if (mesh.L > 0 && fd > mesh.rad * 0.9) continue;   // 霞の向こうは描かない
        list.push([Y, X, st2[k + 1]]);
      }
      { // 湖と川(道の下に)。濃い縁取りの上に明るい青を重ね、水量が多いほど太くする
        const cellpx = mesh.s * st.ppm, fogR = mesh.rad * 0.9, proj = i => { const gx = mesh.cpos[i * 3] - st.fx, gy = mesh.cpos[i * 3 + 1] - st.fy, zz = (mesh.cpos[i * 3 + 2] - st.z0) * mesh.ex; return [(st.W / 2 + (cy * gx + sy * gy) * st.ppm) * st.dpr, (st.H / 2 + ((-sy * gx + cy * gy) * cp - zz * sp) * st.ppm) * st.dpr, Math.hypot(gx, gy)]; };
        if (mesh.lakes && mesh.lakes.length) { const rx = cellpx * 0.62 * st.dpr; for (const [col, k] of [['#2f6fbf', 1.18], ['#5aaeee', 1]]) { c2.fillStyle = col; for (const i of mesh.lakes) { const [X, Y, d] = proj(i); if (d > fogR || X < -60 || X > ov.width + 60 || Y < -60 || Y > ov.height + 60) continue; c2.beginPath(); c2.ellipse(X, Y, rx * k, rx * k * cp, 0, 0, 6.2832); c2.fill(); } } }
        if (mesh.rivers && mesh.rivers.length) {
          c2.lineCap = 'round'; const R = mesh.rivers, TH = mesh.riverTH;
          for (const [col, add] of [['#1f5fae', 2.2], ['#58b4ff', 0]]) {
            c2.strokeStyle = col;
            for (let k = 0; k < R.length; k += 4) {
              const a = proj(R[k]), b = proj(R[k + 1]), e = proj(R[k + 2]); if (a[2] > fogR || b[2] > fogR) continue;
              c2.lineWidth = (Math.max(2.5, Math.min(22, cellpx * 0.11 * (0.7 + Math.log2(R[k + 3] / TH + 1)))) + add) * st.dpr;
              c2.beginPath(); c2.moveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); c2.quadraticCurveTo(b[0], b[1], (b[0] + e[0]) / 2, (b[1] + e[1]) / 2); c2.stroke();
            }
          }
        }
      }
      if (mesh.roads && mesh.roads.length) { // 道(絵の下に)。2本の線を重ねて縁取りする
        const cellpx = mesh.s * st.ppm, wd = Math.max(2, Math.min(10, cellpx * 0.16)) * st.dpr; c2.lineCap = 'round'; c2.lineJoin = 'round';
        for (const [col, w] of [['#5b4030', wd * 1.5], ['#e7cf9a', wd]]) {
          c2.strokeStyle = col; c2.lineWidth = w;
          for (const pth of mesh.roads) {
            c2.beginPath(); let on = false;
            for (const i of pth) {
              const gx = mesh.cpos[i * 3] - st.fx, gy = mesh.cpos[i * 3 + 1] - st.fy, zz = (mesh.cpos[i * 3 + 2] - st.z0) * mesh.ex;
              const X = (st.W / 2 + (cy * gx + sy * gy) * st.ppm) * st.dpr, Y = (st.H / 2 + ((-sy * gx + cy * gy) * cp - zz * sp) * st.ppm) * st.dpr;
              if (Math.hypot(gx, gy) > mesh.rad * 0.9) { on = false; continue; }
              if (!on) { c2.moveTo(X, Y); on = true; } else c2.lineTo(X, Y);
            }
            c2.stroke();
          }
        }
      }
      if (st.stamps === false) return;
      list.sort((a, b) => a[0] - b[0]);
      const cell = mesh.s * st.ppm, px = Math.max(13, Math.min(34, cell * 0.8)) * st.dpr, MUL = { mountain: 2.0, volcano: 2.8, town: 2.4, castle: 1.9, animal: 1.1 };
      for (const [Y, X, sp0] of list) {
        if (sp0.k === 'town') { sp0.sx = cy * sp0.nx + sy * sp0.ny; sp0.sy = -sy * sp0.nx + cy * sp0.ny; }   // 海岸の向きを画面の向きに直す
        if (typeof sp0 === 'string') {
          c2.font = px + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; c2.textAlign = 'center'; c2.textBaseline = 'middle';
          c2.shadowColor = 'rgba(255,255,255,.85)'; c2.shadowBlur = 5 * st.dpr; c2.fillText(sp0, X * st.dpr, (Y - px / st.dpr * 0.45) * st.dpr); c2.shadowBlur = 0;
        } else {
          const an = sp0.k === 'animal', tw = sp0.k === 'town', hk = sp0.k === 'mountain' ? 0.6 + 0.7 * (sp0.hr == null ? 0.7 : sp0.hr) : 1, size = (an && mesh.L >= 3 ? 20 : Math.max(an ? 26 : tw ? 64 : 24, Math.min(an ? (mesh.L === 0 ? 40 : 80) : (mesh.L === 0 ? 62 : tw ? 200 : 130), cell * (MUL[sp0.k] || 1.7) * hk))) * st.dpr;   // 下の層では生き物は小さな点景(実際の大きさに合わせて)
          c2.save(); c2.translate(X * st.dpr, Y * st.dpr); c2.scale(size, size); SekaiSprites.draw(c2, sp0.k, sp0, tm); c2.restore();
        }
      }
    }
    (function loop(t) { // 煙・旗・光を動かすため、絵の層だけを定期的に描き直す(地面は描き直さない)
      if (!document.hidden && mesh && mesh.stamps && mesh.stamps.length && st.stamps !== false && (!loop.t || t - loop.t > 45)) { loop.t = t; drawStamps(); }
      requestAnimationFrame(loop);
    })(0);
    function drawSel() {
      const i = sel.i; if (i === undefined) return;
      const s = mesh.s, a = SK.angle(mesh.L), ca = Math.cos(a), sa = Math.sin(a), Rc = mesh.Rc;
      const arr = new Float32Array(6 * 4 /* 3 float + packed color as 1 float */);
      const bytes = new Uint8Array(arr.buffer);
      const cx = mesh.cpos[i * 3] - mesh.ox, cy = mesh.cpos[i * 3 + 1] - mesh.oy, z = mesh.cpos[i * 3 + 2] + 0.0001 * mesh.s;
      for (let j = 0; j < 6; j++) {
        const th = (30 + 60 * j) * Math.PI / 180, px = Math.cos(th), py = Math.sin(th);
        arr[j * 4] = cx + Rc * (ca * px - sa * py); arr[j * 4 + 1] = cy + Rc * (sa * px + ca * py); arr[j * 4 + 2] = z;
        bytes[j * 16 + 12] = 255; bytes[j * 16 + 13] = 240; bytes[j * 16 + 14] = 60; bytes[j * 16 + 15] = 255;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, selBuf); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 16, 0); gl.vertexAttribPointer(aCol, 4, gl.UNSIGNED_BYTE, true, 16, 12);
      gl.disable(gl.DEPTH_TEST); gl.drawArrays(gl.LINE_LOOP, 0, 6); gl.enable(gl.DEPTH_TEST);
    }

    // 画面 → 地面(z=0の面を仮定)
    function screenToGround(dx, dy) {
      const u = dx / st.ppm, v = dy / (st.ppm * Math.cos(st.tilt)), c = Math.cos(st.yaw), s = Math.sin(st.yaw);
      return [c * u - s * v, s * u + c * v];
    }
    function pickAt(px, py) { // css座標 → 最も近いマス
      if (!mesh) return null;
      const cP = Math.cos(st.tilt), sP = Math.sin(st.tilt), c = Math.cos(st.yaw), s = Math.sin(st.yaw);
      let best = -1, bd = 1e18;
      const rpx = mesh.s * st.ppm * 0.62;
      for (let i = 0; i < mesh.m; i++) {
        const gx = mesh.cpos[i * 3] - st.fx, gy = mesh.cpos[i * 3 + 1] - st.fy, z = (mesh.cpos[i * 3 + 2] - st.z0) * mesh.ex;
        const u = c * gx + s * gy, v = -s * gx + c * gy;
        const sx = st.W / 2 + u * st.ppm, sy = st.H / 2 + (v * cP - z * sP) * st.ppm;
        const d = (sx - px) * (sx - px) + (sy - py) * (sy - py);
        // 手前のマスほど優先(同じ画面位置なら depth が大きい=手前)
        const dep = v * sP + z * cP;
        const score = d - dep * st.ppm * 0.05;
        if (d < rpx * rpx && score < bd) { bd = score; best = i; }
      }
      if (best < 0) return null;
      return { i: best, L: mesh.L, q: mesh.qs[best], r: mesh.rs[best], h: mesh.hs[best], b: mesh.bs[best] };
    }

    // 入力
    const ptrs = new Map(); let g = null; let tapInfo = null;
    function rectXY(e) { const rc = canvas.getBoundingClientRect(); return [e.clientX - rc.left, e.clientY - rc.top]; }
    canvas.addEventListener('pointerdown', e => {
      canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, rectXY(e));
      tapInfo = ptrs.size === 1 ? { x: e.clientX, y: e.clientY, t: performance.now(), moved: false } : (tapInfo && (tapInfo.moved = true), tapInfo);
      g = null; e.preventDefault();
    });
    canvas.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId)) return;
      const old = ptrs.get(e.pointerId), cur = rectXY(e); ptrs.set(e.pointerId, cur);
      if (tapInfo && Math.hypot(e.clientX - tapInfo.x, e.clientY - tapInfo.y) > 7) tapInfo.moved = true;
      if (ptrs.size === 1) {
        const d = screenToGround(cur[0] - old[0], cur[1] - old[1]); st.fx -= d[0]; st.fy -= d[1]; changed();
      } else if (ptrs.size === 2) {
        const pts = [...ptrs.values()], dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1];
        const dist = Math.hypot(dx, dy), ang = Math.atan2(dy, dx), mx = (pts[0][0] + pts[1][0]) / 2, my = (pts[0][1] + pts[1][1]) / 2;
        if (!g) g = { dist, ang }; else {
          const before = screenToGround(mx - st.W / 2, my - st.H / 2);
          st.ppm *= dist / g.dist; clampPpm();
          let da = ang - g.ang; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; st.yaw += da;
          const after = screenToGround(mx - st.W / 2, my - st.H / 2);
          st.fx += before[0] - after[0]; st.fy += before[1] - after[1];
          g = { dist, ang }; changed();
        }
      }
    });
    function up(e) {
      const wasTap = tapInfo && !tapInfo.moved && ptrs.size === 1 && performance.now() - tapInfo.t < 400;
      if (wasTap) { const p = pickAt(...rectXY(e)); setSel(p); }
      ptrs.delete(e.pointerId); g = null; if (ptrs.size === 0) tapInfo = null;
    }
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', e => { ptrs.delete(e.pointerId); g = null; });
    canvas.addEventListener('wheel', e => {
      e.preventDefault(); const [px, py] = rectXY(e);
      const before = screenToGround(px - st.W / 2, py - st.H / 2);
      st.ppm *= Math.exp(-e.deltaY * 0.0016); clampPpm();
      const after = screenToGround(px - st.W / 2, py - st.H / 2);
      st.fx += before[0] - after[0]; st.fy += before[1] - after[1]; changed();
    }, { passive: false });

    function setSel(p) { sel = p; if (hooks.onSelect) hooks.onSelect(p); changed(); }
    let raf = 0;
    function changed() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); if (hooks.onFrame) hooks.onFrame(st, mesh); }); }
    function resize() {
      const rc = canvas.getBoundingClientRect(); st.W = Math.max(50, rc.width); st.H = Math.max(50, rc.height);
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(st.W * st.dpr); canvas.height = Math.round(st.H * st.dpr);
      const lo = minPpm(); if (st.ppm < lo || !st.inited) { st.ppm = fitPpm(); st.inited = true; } clampPpm();
      mesh = null; changed();
    }
    window.addEventListener('resize', resize);

    return {
      st, resize, changed, draw, build,
      get mesh() { return mesh; },
      setTilt(deg) { st.tilt = Math.min(72, Math.max(0, deg)) * Math.PI / 180; changed(); },
      tiltDeg() { return st.tilt * 180 / Math.PI; },
      rotate(rad) { st.yaw += rad; changed(); },
      setExMul(v) { st.exMul = v; mesh = null; changed(); },
      zoomTo(ppm) { st.ppm = ppm; clampPpm(); changed(); },
      jumpTo(fx, fy, ppm) { st.fx = fx; st.fy = fy; if (ppm) { st.ppm = ppm; clampPpm(); } changed(); },
      reset() { st.fx = (w.W - 0.5) * SK.spacing(0) / 2; st.fy = (w.H - 1) * SK.spacing(0) * SQ3 / 4; st.ppm = fitPpm(); st.yaw = 0; st.tilt = 55 * Math.PI / 180; mesh = null; changed(); },
      refresh() { mesh = null; changed(); },   // 地形の差分を足したあとなどに、見た目を作り直す
      addVolcano(L, q, r) { FV.add(L + ',' + q + ',' + r); mesh = null; changed(); },
      findVolcano,
      setPattern(v) { st.pattern = v; changed(); },
      setStamps(v) { st.stamps = v; changed(); },
      setSmooth(v) { st.smooth = v; mesh = null; changed(); },
      select: setSel, pickAt, fitPpm, getSel: () => sel,
    };
  }
  return { create, BIOME_COL };
})();
