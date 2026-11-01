'use strict';
// 斜めから見る立体表示(WebGL)。1マスを六角形の角柱にして描く。
// 見ている位置・拡大率から「どの層を描くか」を決め、その層のマスだけを遅延生成して並べる。
const SekaiView = (function () {
  const SK = Sekai, SQ3 = Math.sqrt(3);
  const MINPX = 18;                 // 層を細かくする条件: 1マスの幅がこれ(css px)以上
  const BIOME_COL = [null, [236, 242, 247], [169, 181, 154], [63, 107, 77], [181, 181, 106], [217, 187, 122], [168, 184, 74], [143, 174, 79], [79, 138, 69], [61, 122, 74], [194, 179, 71], [31, 122, 58], [139, 133, 121]];
  const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
  const HEX_GROUND = DIRS.map(([q, r]) => [q + r / 2, r * SQ3 / 2]); // 軸座標での隣の向き(層の回転前)
  const LIGHT = (function () { const x = -0.45, y = -0.65, z = 0.62, n = Math.hypot(x, y, z); return [x / n, y / n, z / n]; })();

  const VS = `attribute vec3 aPos; attribute vec4 aCol;
uniform vec2 uOff; uniform vec2 uYaw; uniform vec2 uHalf;
uniform float uPpm, uCosP, uSinP, uEx, uD, uZ0; varying vec3 vCol;
void main(){ vec2 g=aPos.xy+uOff; float u=uYaw.x*g.x+uYaw.y*g.y; float v=-uYaw.y*g.x+uYaw.x*g.y; float zz=(aPos.z-uZ0)*uEx;
 float sx=u*uPpm; float sy=(v*uCosP-zz*uSinP)*uPpm; float dp=v*uSinP+zz*uCosP;
 gl_Position=vec4(sx/uHalf.x,-sy/uHalf.y,-dp/uD,1.0); vCol=aCol.rgb; }`;
  const FS = `precision mediump float; varying vec3 vCol; void main(){ gl_FragColor=vec4(vCol,1.0); }`;

  function mix(a, b, t) { return a + (b - a) * t; }
  function seaColor(h) { // 深さで色を変える(0〜-6000m)
    const t = Math.min(1, Math.max(0, -h / 6000)), s = Math.sqrt(t);
    return [mix(70, 14, s), mix(150, 40, s), mix(200, 98, s)];
  }
  function landColor(b, h) {
    const c = BIOME_COL[b] || BIOME_COL[8];
    let r = c[0], g = c[1], bl = c[2];
    const hh = Math.max(0, h);
    const lift = Math.min(1, hh / 3500);               // 高いほど少し明るく乾いた色へ
    r = mix(r, 205, lift * 0.35); g = mix(g, 198, lift * 0.35); bl = mix(bl, 185, lift * 0.35);
    const snow = Math.min(1, Math.max(0, (hh - 4200) / 1800));
    r = mix(r, 245, snow); g = mix(g, 247, snow); bl = mix(bl, 250, snow);
    return [r, g, bl];
  }

  function create(canvas, sk, hooks) {
    hooks = hooks || {};
    const gl = canvas.getContext('webgl', { antialias: true, alpha: false, depth: true });
    if (!gl) throw new Error('WebGL unavailable');
    function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const U = {}; ['uOff', 'uYaw', 'uHalf', 'uPpm', 'uCosP', 'uSinP', 'uEx', 'uD', 'uZ0'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
    const aPos = gl.getAttribLocation(prog, 'aPos'), aCol = gl.getAttribLocation(prog, 'aCol');
    const vbo = gl.createBuffer(), selBuf = gl.createBuffer();
    gl.enable(gl.DEPTH_TEST); gl.clearColor(0.05, 0.1, 0.16, 1);

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
        exByLayer[L] = Math.min(40, Math.max(1, 0.42 * s / Math.max(mean, 0.02 * s)));
        if (L >= 3) exByLayer[L] = Math.min(exByLayer[L], 6);
      }
      const ex = exByLayer[L] * st.exMul;
      // 頂点: 位置3 float + 色4 byte = 16byte
      const maxV = m * 54;
      const buf = new ArrayBuffer(maxV * 16), f32 = new Float32Array(buf), u8 = new Uint8Array(buf);
      let nv = 0, zmax = 1;
      const ox = st.fx, oy = st.fy, ca = Math.cos(a), sa = Math.sin(a), Rc = s / SQ3;
      const corner = []; for (let j = 0; j < 6; j++) { const th = (30 + 60 * j) * Math.PI / 180; const px = Math.cos(th), py = Math.sin(th); corner.push([Rc * (ca * px - sa * py), Rc * (sa * px + ca * py)]); }
      const dirU = HEX_GROUND.map(([x, y]) => { const X = ca * x - sa * y, Y = sa * x + ca * y, l = Math.hypot(X, Y); return [X / l, Y / l]; });
      const P = [0, 0]; const cpos = new Float64Array(m * 3);
      function vert(x, y, z, r, g, b, shade) {
        const o = nv * 4; f32[o] = x; f32[o + 1] = y; f32[o + 2] = z;
        const ob = nv * 16 + 12; u8[ob] = Math.min(255, r * shade); u8[ob + 1] = Math.min(255, g * shade); u8[ob + 2] = Math.min(255, b * shade); u8[ob + 3] = 255; nv++;
      }
      for (let i = 0; i < m; i++) {
        const q = qs[i], r = rs[i], h = hs[i], z = zOf(h);
        SK.pos(L, q, r, P); const cxl = P[0] - ox, cyl = P[1] - oy;
        cpos[i * 3] = P[0]; cpos[i * 3 + 1] = P[1]; cpos[i * 3 + 2] = z;
        if (z > zmax) zmax = z;
        // 隣の高さ
        let gx = 0, gy = 0;
        for (let k = 0; k < 6; k++) {
          const j = idx.get(key(q + DIRS[k][0], r + DIRS[k][1]));
          let hn; if (j !== undefined) hn = hs[j]; else { sk.cell(L, q + DIRS[k][0], r + DIRS[k][1], tmp); if (L === 0 && 0) hn = 0; hn = tmp.h; }
          nbH[k] = zOf(hn); gx += (nbH[k] - z) * dirU[k][0]; gy += (nbH[k] - z) * dirU[k][1];
        }
        gx = gx / (3 * s) * ex; gy = gy / (3 * s) * ex;           // 見かけの傾き
        const nl = Math.hypot(gx, gy, 1), nd = (-gx * LIGHT[0] - gy * LIGHT[1] + LIGHT[2]) / nl;
        const col = h > 0 ? landColor(bs[i], h) : seaColor(h);
        const shade = h > 0 ? Math.min(1.18, Math.max(0.55, 0.58 + 0.62 * nd)) : 1.0;
        // 上面(6枚の三角形)
        for (let k = 0; k < 6; k++) {
          const c0 = corner[k], c1 = corner[(k + 1) % 6];
          vert(cxl, cyl, z, col[0], col[1], col[2], shade);
          vert(cxl + c0[0], cyl + c0[1], z, col[0], col[1], col[2], shade);
          vert(cxl + c1[0], cyl + c1[1], z, col[0], col[1], col[2], shade);
        }
        // 側面: 隣より高いところだけ
        for (let k = 0; k < 6; k++) {
          if (nbH[k] >= z) continue;
          // 辺 k は角 (k-1) と k の間
          const c0 = corner[(k + 5) % 6], c1 = corner[k], zn = nbH[k];
          const sd = 0.62 + 0.18 * (dirU[k][0] * LIGHT[0] + dirU[k][1] * LIGHT[1]) * -1;
          const sc = [col[0] * 0.8, col[1] * 0.8, col[2] * 0.8];
          vert(cxl + c0[0], cyl + c0[1], z, sc[0], sc[1], sc[2], sd); vert(cxl + c1[0], cyl + c1[1], z, sc[0], sc[1], sc[2], sd); vert(cxl + c1[0], cyl + c1[1], zn, sc[0], sc[1], sc[2], sd);
          vert(cxl + c0[0], cyl + c0[1], z, sc[0], sc[1], sc[2], sd); vert(cxl + c1[0], cyl + c1[1], zn, sc[0], sc[1], sc[2], sd); vert(cxl + c0[0], cyl + c0[1], zn, sc[0], sc[1], sc[2], sd);
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, buf.slice(0, nv * 16), gl.STATIC_DRAW);
      mesh = { L, s, ox, oy, cx, cy, rad, nv, m, ex, zmax, qs, rs, hs, bs, cpos, Rc, ms: performance.now() - t0, tilt: st.tilt };
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
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(aCol); gl.vertexAttribPointer(aCol, 4, gl.UNSIGNED_BYTE, true, 16, 12);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.nv);
      if (sel && sel.L === mesh.L) drawSel();
    }
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
      select: setSel, pickAt, fitPpm, getSel: () => sel,
    };
  }
  return { create, BIOME_COL };
})();
