/* オープニング演出(最初に1回): 専門分野の言葉を順に表示 → 専門家の統合 → シナジー
   → 上へ流れる四角 → 横長の円筒 → 球体 → 球の中からGOAL → 横長の円筒 → 縦スクロールへ */
window.Opening = (() => {
  'use strict';
  const reduce = FX.reduce;
  const KEY = 'sogoOpening';
  // [言葉, 表示開始(秒), 表示時間(秒)] 最後の「シナジー」は少し長く見せる
const WORDS = ['公認会計士', '税理士', '社会保険労務士', '事業再生', '社会福祉法人', '公益法人', '国税調査対応', 'クラウド対応社労管理', '専門家の統合', 'シナジー'].map((w, i, a) => [w, .25 + i * .5, i === a.length - 1 ? 1 : .5]);
  const T = { A: 5.9, B: 6.7, C: 7.4, D: 9.3, E1: 9.9, E2: 10.6, E3: 11.5 };   // 各場面の終わり(秒)
  const COLS = [[31, 106, 122], [201, 138, 27], [47, 111, 79], [217, 104, 74], [106, 76, 147], [43, 138, 156]];
  const FONT = '"Zen Kaku Gothic New","Hiragino Kaku Gothic ProN","Hiragino Sans",sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const out = (x) => 1 - Math.pow(1 - x, 3);
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  let ov = null, running = false;

  const should = () => { if (reduce) return false; if (/[?&]opening=1/.test(location.search)) return true; try { return sessionStorage.getItem(KEY) !== '1'; } catch { return true; } };

  function play(opts = {}) {
    if (running || (reduce && !opts.force)) return Promise.resolve();
    running = true;
    return new Promise((resolve) => {
      ov = document.createElement('div'); ov.className = 'opening'; ov.setAttribute('role', 'img'); ov.setAttribute('aria-label', 'オープニング映像');
      ov.innerHTML = '<canvas aria-hidden="true"></canvas><div class="op-goal" aria-hidden="true"></div><button class="op-skip" type="button">スキップ ›</button>';
      document.body.appendChild(ov); document.body.style.overflow = 'hidden';
      const cv = ov.querySelector('canvas'), cx = cv.getContext('2d'), gh = ov.querySelector('.op-goal'), skip = ov.querySelector('.op-skip');
      let W = 0, H = 0, dpr = 1, raf = 0, t0 = 0, done = false, goal = null, goalStarted = false, rects = [], snap = null;
      const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); layout(); };

      // 上へ流れる四角(縦長・横長・正方形)
      function layout() {
        const n = 16; rects = [];
        for (let i = 0; i < n; i++) {
          const kind = i % 3, base = Math.max(26, W * .09);
          const w = kind === 0 ? base * (1.8 + (i % 4) * .3) : kind === 1 ? base * (.8 + (i % 3) * .2) : base * 1.1;
          const h = kind === 0 ? base * (.8 + (i % 3) * .15) : kind === 1 ? base * (2 + (i % 4) * .4) : base * 1.1;
          rects.push({ i, w, h, x: ((i + .5) / n) * W + ((i * 37) % 11 - 5), y0: (i * 211) % (H + 240), vy: 70 + ((i * 53) % 110), c: COLS[i % COLS.length] });
        }
      }
      const posA = (r, t) => { const span = H + 240; return { x: r.x, y: ((r.y0 - r.vy * t) % span + span) % span - 120 }; };

      function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
      const shade = (c, k) => `rgb(${c.map((v) => clamp(Math.round(v * k), 0, 255)).join(',')})`;
      // 横長の円筒(縦方向のグラデーションと反射)
      function capsule(x, y, w, h, c, a, roundness = 1) {
        if (a <= 0 || w <= 1 || h <= 1) return;
        cx.globalAlpha = a; const g = cx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
        g.addColorStop(0, shade(c, 1.35)); g.addColorStop(.45, shade(c, 1)); g.addColorStop(1, shade(c, .55));
        cx.fillStyle = g; rr(x - w / 2, y - h / 2, w, h, (h / 2) * roundness); cx.fill();
        cx.globalAlpha = a * .35; cx.fillStyle = '#fff'; rr(x - w / 2 + h * .25, y - h / 2 + h * .12, Math.max(0, w - h * .5), h * .16, h * .08); cx.fill(); cx.globalAlpha = 1;
      }
      // 球体(放射状のグラデーション)
      function sphere(x, y, R, c, a) {
        if (a <= 0 || R <= 1) return;
        cx.globalAlpha = a; const g = cx.createRadialGradient(x - R * .35, y - R * .4, R * .08, x, y, R);
        g.addColorStop(0, shade(c, 1.6)); g.addColorStop(.5, shade(c, 1)); g.addColorStop(1, shade(c, .45));
        cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, R, 0, Math.PI * 2); cx.fill(); cx.globalAlpha = 1;
      }

      const mid = { x: 0, y: 0 };
      function frame(t) {
        W = innerWidth; H = innerHeight; mid.x = W / 2; mid.y = H / 2;
        cx.clearRect(0, 0, W, H);
        const capW = Math.min(W * .82, 330), capH = Math.max(54, Math.min(70, W * .17)), Rs = Math.min(W, H) * .4, teal = COLS[0];
        const fs = Math.min(W * .2, 92);

        /* A: 上へ流れる四角と、順に出る文字 */
        if (t < T.B) {
          const fadeIn = seg(t, 0, .6);
          const pB = ease(seg(t, T.A, T.B));
          if (t >= T.A && !snap) snap = rects.map((r) => posA(r, T.A));
          rects.forEach((r, k) => {
            const p = t < T.A ? posA(r, t) : snap[k];
            if (t < T.A) { cx.globalAlpha = .8 * fadeIn; cx.fillStyle = shade(r.c, 1); rr(p.x - r.w / 2, p.y - r.h / 2, r.w, r.h, 6); cx.fill(); cx.globalAlpha = 1; return; }
            // B: 四角 → 丸みを帯びた横長の円筒(のかけら)になり、中央に集まって並ぶ
            const n = rects.length, sw = capW / n, tx = mid.x - capW / 2 + (k + .5) * sw, ty = mid.y;
            const x = lerp(p.x, tx, pB), y = lerp(p.y, ty, pB), w = lerp(r.w, sw + 1, pB), h = lerp(r.h, capH, pB), rad = lerp(6, Math.min(w, h) / 2, pB);
            cx.globalAlpha = .85 + .15 * pB; cx.fillStyle = shade(r.c, 1); rr(x - w / 2, y - h / 2, w, h, rad); cx.fill(); cx.globalAlpha = 1;
          });
          if (t >= T.A) capsule(mid.x, mid.y, capW, capH, teal, ease(seg(t, T.A + .55, T.B)));
          // 文字(専門分野の言葉 → 専門家の統合 → シナジー)
          WORDS.forEach(([w, s0, d]) => {
            const p = seg(t, s0, s0 + d); if (p <= 0 || p >= 1) return;
            const a = Math.min(seg(p, 0, .25), 1 - seg(p, .8, 1)), ty = lerp(26, 0, out(seg(p, 0, .3)));
            cx.save(); cx.globalAlpha = a; cx.textAlign = 'center'; cx.textBaseline = 'middle';
            let f = fs; cx.font = `900 ${f}px ${FONT}`; const mw = cx.measureText(w).width; if (mw > W * .88) { f = f * W * .88 / mw; cx.font = `900 ${f}px ${FONT}`; }
            cx.shadowColor = 'rgba(0,0,0,.45)'; cx.shadowBlur = 24; cx.fillStyle = '#fff'; cx.fillText(w, mid.x, mid.y + ty); cx.restore();
          });
        }
        /* C: 円筒 → 球体 */
        else if (t < T.C) {
          const p = ease(seg(t, T.B, T.C)), w = lerp(capW, 2 * Rs, p), h = lerp(capH, 2 * Rs, p);
          capsule(mid.x, mid.y, w, h, teal, 1 - p * p);
          sphere(mid.x, mid.y, h / 2, teal, p);
        }
        /* D: 球の中央からGOAL */
        else if (t < T.D) {
          const q = t - T.C, pulse = 1 + .045 * Math.sin(q * 7) * Math.exp(-q * 1.2), R = Rs * pulse;
          sphere(mid.x, mid.y, R, teal, 1);
          const disc = ease(seg(t, T.C + .15, T.C + .7)); cx.globalAlpha = .96 * disc; cx.fillStyle = '#f4f8fa'; cx.beginPath(); cx.arc(mid.x, mid.y, R * .93, 0, Math.PI * 2); cx.fill(); cx.globalAlpha = 1;
          const ring = seg(t, T.C + .1, T.C + 1); if (ring > 0 && ring < 1) { cx.globalAlpha = (1 - ring) * .7; cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.beginPath(); cx.arc(mid.x, mid.y, R * (1 + ring * .9), 0, Math.PI * 2); cx.stroke(); cx.globalAlpha = 1; }
          const gp = out(seg(t, T.C + .25, T.C + .85)), gOut = 1 - seg(t, T.D - .25, T.D);
          gh.style.opacity = String(Math.min(gp, gOut)); gh.style.transform = `translate(-50%,-50%) scale(${lerp(.05, 1, gp)})`;
          if (!goalStarted && t >= T.C + .3) { goalStarted = true; goal.play(); }
        }
        /* E1: 球体 → 横長の円筒 */
        else if (t < T.E1) {
          gh.style.opacity = '0';
          const p = ease(seg(t, T.D, T.E1)), w = lerp(2 * Rs, capW, p), h = lerp(2 * Rs, capH, p);
          capsule(mid.x, mid.y, w, h, teal, p); sphere(mid.x, mid.y, h / 2, teal, 1 - p);
        }
        /* E2: 円筒 → 何本もの横長の円筒(縦に並ぶ) / E3: 縦スクロールへ */
        else {
          const M = 9, rowH = Math.max(44, capH * .8), gap = 14, pS = ease(seg(t, T.E1, T.E2)), sc = Math.pow(seg(t, T.E2, T.E3), 2) * (H + M * (rowH + gap));
          for (let j = 0; j < M; j++) {
            const rw = capW * (.62 + ((j * 29) % 7) / 20), y = mid.y + (j - (M - 1) / 2) * (rowH + gap) * pS - sc;
            capsule(mid.x, y, lerp(capW, rw, pS), lerp(capH, rowH, pS), COLS[j % COLS.length].map((v, k) => lerp(teal[k], v, pS)), 1);
          }
          ov.style.opacity = String(1 - ease(seg(t, T.E3 - .55, T.E3)));
        }
      }

      function finish(fast) {
        if (done) return; done = true; cancelAnimationFrame(raf);
        try { sessionStorage.setItem(KEY, '1'); } catch {}
        const end = () => { if (goal) goal.stop(); ov.remove(); ov = null; document.body.style.overflow = ''; running = false; resolve(); };
        if (fast) { ov.animate([{ opacity: +ov.style.opacity || 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' }).onfinish = end; } else end();
      }
      const loop = (now) => { if (done) return; const t = (now - t0) / 1000; frame(t); if (t >= T.E3) return finish(false); raf = requestAnimationFrame(loop); };
      goal = FX.goal(gh, { height: 1 }); // 高さは下で調整
      const sizeGoal = () => { const gw = Math.min(W * .74, 300); gh.style.width = gw + 'px'; goal.el.style.height = Math.round(gw * 150 / 216) + 'px'; };
      size(); sizeGoal(); addEventListener('resize', () => { size(); sizeGoal(); });
      skip.addEventListener('click', (e) => { e.stopPropagation(); finish(true); }); ov.addEventListener('click', () => finish(true));
      if (opts.freeze != null) { snap = null; frame(opts.freeze); return; }  // 動作確認用(静止画)
      t0 = performance.now();
      raf = requestAnimationFrame(loop);
    });
  }
  return { play, should };
})();
