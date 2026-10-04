/* スクロール演出の部品。ハブの「スクロール演出見本1〜4」の手法を、本サイト用に整理したもの。
   data-scene="stack|window|hscroll|doors|sphere" / data-fill / data-reveal / data-count / data-bg */
window.Scenes = (() => {
  'use strict';
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (x) => (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  let ups = [], undo = [], raf = 0, ticking = false, io = null, sizers = [];
  const HH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 56;
  // pin付きセクションの進み具合(0〜1)
  const prog = (sec) => { const r = sec.getBoundingClientRect(), v = innerHeight - HH(); return clamp((HH() - r.top) / Math.max(1, r.height - v), 0, 1); };

  function destroy() {
    undo.forEach((f) => f()); undo = []; ups = []; sizers = [];
    if (io) { io.disconnect(); io = null; }
    cancelAnimationFrame(raf);
    document.body.style.backgroundColor = ''; document.body.classList.remove('is-dark');
  }

  function init(root) {
    destroy();
    const hh = HH();

    /* A: 重なる面 */
    root.querySelectorAll('[data-scene=stack]').forEach((st) => {
      const cards = [...st.querySelectorAll('.sc')];
      ups.push(() => {
        if (rm) return;
        const v = innerHeight;
        cards.forEach((c, i) => {
          const n = cards[i + 1]; if (!n) return;
          const t = clamp((n.getBoundingClientRect().top - (hh + (i + 1) * 14)) / (v * .8), 0, 1);
          c.style.setProperty('--s', (.93 + .07 * t).toFixed(3));
          c.style.setProperty('--dim', ((1 - t) * .45).toFixed(3));
        });
      });
    });

    /* B: 開く窓 */
    root.querySelectorAll('[data-scene=window]').forEach((sec) => {
      const nxt = sec.querySelector('.nxt');
      ups.push(() => {
        if (rm) return;
        const p = prog(sec), e = ease(p), iy = 34 * (1 - e), ix = 20 * (1 - e), rad = 26 * (1 - e);
        nxt.style.clipPath = `inset(${iy.toFixed(2)}% ${ix.toFixed(2)}% ${iy.toFixed(2)}% ${ix.toFixed(2)}% round ${rad.toFixed(1)}px)`;
        sec.style.setProperty('--co', (1 - clamp(p / .3, 0, 1)).toFixed(3));
        sec.style.setProperty('--no', clamp((p - .5) / .3, 0, 1).toFixed(3));
      });
    });

    /* C: 見出しの塗り */
    const fills = [...root.querySelectorAll('[data-fill]')];
    if (fills.length) ups.push(() => {
      if (rm) return;
      const v = innerHeight;
      fills.forEach((f) => f.style.setProperty('--fill', (clamp((v * .98 - f.getBoundingClientRect().top) / (v * .5), 0, 1) * 100).toFixed(1) + '%'));
    });

    /* D: 縦から横へ */
    root.querySelectorAll('[data-scene=hscroll]').forEach((sec) => {
      const track = sec.querySelector('.hT'), bar = sec.querySelector('.hbar i');
      const size = () => { if (!rm) sec.style.height = (track.scrollWidth - innerWidth + innerHeight - hh) + 'px'; };
      sizers.push(size); size();
      ups.push(() => {
        if (rm) return;
        const p = prog(sec), max = track.scrollWidth - innerWidth;
        track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
        if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
      });
    });

    /* F: 扉が開く */
    root.querySelectorAll('[data-scene=doors]').forEach((sec) => {
      const dl = sec.querySelector('.door.l'), dr = sec.querySelector('.door.r');
      ups.push(() => {
        if (rm) return;
        const p = ease(clamp(prog(sec) / .8, 0, 1));
        dl.style.transform = `rotateY(${(-96 * p).toFixed(1)}deg)`; dr.style.transform = `rotateY(${(96 * p).toFixed(1)}deg)`;
        dl.style.visibility = dr.style.visibility = p >= .995 ? 'hidden' : 'visible';
      });
    });

    /* S: 球体 → 平面 → 一覧 */
    root.querySelectorAll('[data-scene=sphere]').forEach((sec) => sphere(sec));

    /* 背景色の切り替え */
    const bgs = [...root.querySelectorAll('[data-bg]')];
    if (bgs.length) ups.push(() => {
      const mid = innerHeight * .5; let hit = null;
      bgs.forEach((s) => { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom >= mid) hit = s; });
      document.body.style.backgroundColor = hit ? hit.dataset.bg : '';
      document.body.classList.toggle('is-dark', !!(hit && hit.dataset.dark));
    });

    /* 出現・数字のカウント */
    io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target; io.unobserve(t);
      if (t.hasAttribute('data-reveal')) t.classList.add('in');
      if (t.hasAttribute('data-count')) count(t);
    }), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    root.querySelectorAll('[data-reveal],[data-count]').forEach((n) => (rm ? (n.classList.add('in'), n.hasAttribute('data-count') && (n.textContent = n.dataset.count + (n.dataset.suffix || ''))) : io.observe(n)));

    const kick = () => { if (!ticking) { ticking = true; raf = requestAnimationFrame(() => { ticking = false; ups.forEach((f) => f()); }); } };
    const rs = () => { sizers.forEach((f) => f()); kick(); };
    addEventListener('scroll', kick, { passive: true }); addEventListener('resize', rs);
    undo.push(() => { removeEventListener('scroll', kick); removeEventListener('resize', rs); });
    kick();
  }

  function count(el) {
    const to = Number(el.dataset.count), suf = el.dataset.suffix || '', t0 = performance.now(), d = 1200;
    const tick = (now) => { const t = Math.min(1, (now - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + (t >= 1 ? suf : ''); if (t < 1) requestAnimationFrame(tick); else el.parentElement && el.parentElement.classList.add('is-done'); };
    requestAnimationFrame(tick);
  }

  /* 球体の演出(キーワードが球 → 平面 → 縦の一覧へ) */
  function sphere(sec) {
    const cv = sec.querySelector('canvas'), cx = cv.getContext('2d');
    const data = JSON.parse(sec.dataset.words), cats = JSON.parse(sec.dataset.cats);
    const caps = [...sec.querySelectorAll('.cap')];
    const N = data.length, COLS = 5, ROWS = Math.ceil(N / COLS);
    const sph = []; for (let i = 0; i < N; i++) { const y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y), th = i * 2.399963; sph.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    let W = 0, H = 0, dpr = 1; const FONT = '"Zen Kaku Gothic New","Hiragino Kaku Gothic ProN",sans-serif';
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); sec.style.height = (innerHeight * 5.6) + 'px'; };
    const rr = (x, y, w, h, r) => { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); };
    function draw(p, time) {
      cx.clearRect(0, 0, W, H);
      const t1 = ease(clamp((p - .08) / .3, 0, 1)), t2 = ease(clamp((p - .46) / .16, 0, 1)), ls = clamp((p - .62) / .36, 0, 1);
      const R = Math.min(W, H) * .4, F = R * 3.4;
      const cw = Math.min(W / COLS * .92, H * .7 / ROWS * .9), ch = Math.min(H * .7 / ROWS, cw * 1.25);
      const rowW = W * .88, rowH = Math.max(54, Math.min(66, H * .085)), gap = 10, listH = N * (rowH + gap) - gap, listTop = H * .2, off = ls * Math.max(0, listH - H * .76);
      const ang = time * .00035 + p * 5, tilt = .35 * (1 - t1), items = [];
      for (let k = 0; k < N; k++) {
        const s = sph[k], x = s[0] * R, y = s[1] * R, z = s[2] * R, ca = Math.cos(ang), sa = Math.sin(ang);
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, cb = Math.cos(tilt), sb = Math.sin(tilt), y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        const c = k % COLS, rw = Math.floor(k / COLS), gx = (c - (COLS - 1) / 2) * (W / COLS), gy = (rw - (ROWS - 1) / 2) * (ch * 1.06) - H * .04;
        const px = x1 + (gx - x1) * t1, py = y1 + (gy - y1) * t1, pz = z2 * (1 - t1), sc = F / (F - pz);
        const tw = (R * .4 + (cw - R * .4) * t1) * sc, th2 = (R * .32 + (ch - R * .32) * t1) * sc;
        let al = (.28 + .72 * ((pz / R + 1) / 2)) * (1 - t1) + t1;
        const ly = listTop + k * (rowH + gap) + rowH / 2 - off - H / 2, fx = px * (1 - t2), fy = py + (ly - py) * t2, sy = H / 2 + fy;
        const e = 1 - .05 * Math.min(1, Math.abs(sy - H / 2) / (H / 2)), w = (tw + (rowW - tw) * t2) * ((1 - t2) + t2 * e), h2 = (th2 + (rowH - th2) * t2) * ((1 - t2) + t2 * e);
        const edge = clamp((sy - H * .1) / (H * .08), 0, 1) * clamp((H * .985 - sy) / (H * .07), 0, 1);
        al = al * ((1 - t2) + t2 * edge);
        items.push({ k, x: W / 2 + fx * sc * (1 - t2) + fx * t2, y: sy, w, h: h2, z: pz, a: al });
      }
      items.sort((a, b) => a.z - b.z);
      items.forEach((it) => {
        if (it.a <= .01 || it.y < -it.h || it.y > H + it.h) return;
        const d = data[it.k], cc = cats[d[1]][1];
        cx.globalAlpha = clamp(it.a, 0, 1); cx.fillStyle = cc; rr(it.x - it.w / 2, it.y - it.h / 2, it.w, it.h, Math.min(14, it.h * .22)); cx.fill(); cx.fillStyle = '#f3f5f7';
        if (t2 < .42) { cx.globalAlpha = clamp(it.a, 0, 1) * clamp(1 - t2 * 2.4, 0, 1); cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.font = '700 ' + Math.max(9, Math.min(15, it.h * .26)) + 'px ' + FONT; cx.fillText(d[0], it.x, it.y, it.w - 6); }
        if (t2 > .5) { cx.globalAlpha = clamp(it.a, 0, 1) * clamp((t2 - .5) / .5, 0, 1); const x0 = it.x - it.w / 2; cx.textAlign = 'left'; cx.textBaseline = 'middle'; cx.font = '900 ' + Math.round(rowH * .32) + 'px ' + FONT; cx.fillText(d[0], x0 + 18, it.y, it.w * .62); cx.textAlign = 'right'; cx.font = '700 ' + Math.round(rowH * .2) + 'px ' + FONT; cx.globalAlpha *= .85; cx.fillText(cats[d[1]][0], x0 + it.w - 16, it.y, it.w * .34); }
      });
      cx.globalAlpha = 1;
    }
    let running = false, vis = false;
    const upd = (t) => {
      const p = prog(sec);
      draw(rm ? 1 : p, t || 0);
      if (caps.length === 3) {
        caps[0].style.opacity = (1 - clamp(p / .08, 0, 1)).toFixed(2);
        caps[1].style.opacity = (clamp((p - .3) / .06, 0, 1) * (1 - clamp((p - .46) / .05, 0, 1))).toFixed(2);
        caps[2].style.opacity = clamp((p - .64) / .05, 0, 1).toFixed(2);
      }
    };
    const loop = (t) => { running = false; upd(t); if (vis && !rm) { running = true; raf2 = requestAnimationFrame(loop); } };
    let raf2 = 0;
    const o = new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis && !running) { running = true; raf2 = requestAnimationFrame(loop); } }, { rootMargin: '100px' });
    o.observe(sec);
    const rs = () => { size(); upd(0); }; size(); upd(0); addEventListener('resize', rs);
    undo.push(() => { o.disconnect(); cancelAnimationFrame(raf2); removeEventListener('resize', rs); vis = false; });
    ups.push(() => { if (!running) upd(performance.now()); });
  }

  return { init, destroy, reduce: rm };
})();
