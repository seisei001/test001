/* 演出部品(自作): FX.check / FX.scan / FX.cubes / FX.goal
   すべてコードで描画。外部素材・ライブラリなし。 */
window.FX = (() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const rnd = (a, b) => a + Math.random() * (b - a);
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const C = { navy: '#173a52', gold: '#e0932e', coral: '#e2694b', teal: '#2f9e83' };
  let uid = 0;
  const dur = ms => reduce ? 1 : ms;
  const stage = (host, h) => { const d = document.createElement('div'); d.className = 'fx-stage'; d.style.height = h + 'px'; host.appendChild(d); return d; };

  /* ---- 成功チェック(紙吹雪つき) ---- */
  const TONES = { teal: ['#7fd8b8', '#237a60'], gold: ['#f6c36b', '#c47a14'], coral: ['#f29a82', '#bf4a30'] };
  function check(host, { height = 170, tone = 'teal', confetti = true } = {}) {
    const id = ++uid, [c1, c2] = TONES[tone] || TONES.teal;
    const box = stage(host, height);
    box.innerHTML = `<svg viewBox="0 0 300 200" role="img" aria-label="成功のアニメーション"><defs><linearGradient id="fxg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient><filter id="fxb${id}"><feGaussianBlur stdDeviation="5"/></filter></defs>
<ellipse cx="150" cy="172" rx="48" ry="7" fill="#000" opacity=".14" filter="url(#fxb${id})"/>
<circle class="a" cx="150" cy="100" r="62" fill="#d6d3cc" style="transform-box:fill-box;transform-origin:center"/>
<circle class="b" cx="150" cy="100" r="62" fill="url(#fxg${id})" opacity="0" style="transform-box:fill-box;transform-origin:center"/>
<path class="c" d="M121 102L143 124L182 80" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="95" stroke-dashoffset="95"/><g class="p"></g></svg>`;
    const q = s => box.querySelector(s), a = q('.a'), b = q('.b'), c = q('.c'), pg = q('.p');
    const cols = ['#f4c430', '#e2694b', '#3498db', '#e75b9f', '#2f9e83'], pieces = [];
    if (confetti) for (let i = 0; i < 20; i++) pieces.push(el('rect', { x: -3, y: -5, width: rnd(5, 7), height: rnd(8, 11), rx: 1, fill: cols[i % cols.length], opacity: 0 }, pg));
    let list = [];
    function play() {
      stop();
      list.push(a.animate([{ transform: 'scale(.5)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: dur(320), easing: 'ease-out', fill: 'both' }));
      list.push(b.animate([{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'scale(1.06)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }], { duration: dur(520), delay: dur(420), easing: 'ease-out', fill: 'both' }));
      list.push(c.animate([{ strokeDashoffset: 95 }, { strokeDashoffset: 0 }], { duration: dur(420), delay: dur(820), easing: 'ease-out', fill: 'both' }));
      pieces.forEach((p, i) => {
        const ang = (i / pieces.length) * Math.PI * 2 + rnd(-.2, .2), d = rnd(88, 132);
        list.push(p.animate([
          { transform: 'translate(150px,100px) rotate(0deg) scale(.4)', opacity: 0 },
          { transform: `translate(${150 + Math.cos(ang) * 70}px,${100 + Math.sin(ang) * 70}px) rotate(${rnd(90, 200)}deg)`, opacity: 1, offset: .25 },
          { transform: `translate(${150 + Math.cos(ang) * d}px,${118 + Math.sin(ang) * d}px) rotate(${rnd(220, 520)}deg)`, opacity: 0 }
        ], { duration: dur(rnd(1300, 1900)), delay: dur(950 + rnd(0, 250)), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' }));
      });
    }
    function stop() { list.forEach(x => x.cancel()); list = []; }
    return { el: box, play, stop };
  }

  /* ---- 虫めがねで書類を探す ---- */
  function scan(host, { height = 170, tint = '#3b82f6' } = {}) {
    const id = ++uid, box = stage(host, height);
    box.innerHTML = `<svg viewBox="0 0 300 200" role="img" aria-label="書類を探すアニメーション"><defs><filter id="fxs${id}" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#173a52" flood-opacity=".25"/></filter><radialGradient id="fxl${id}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#dfe9ff" stop-opacity=".45"/></radialGradient></defs><g class="d"></g>
<g class="m"><line x1="21" y1="21" x2="52" y2="60" stroke="#6b7a88" stroke-width="10" stroke-linecap="round"/><line x1="47" y1="54" x2="52" y2="60" stroke="#173a52" stroke-width="11" stroke-linecap="round"/><circle r="31" fill="url(#fxl${id})" stroke="#173a52" stroke-width="7"/><path d="M-18-8a21 21 0 0 1 14-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/></g></svg>`;
    const g = box.querySelector('.d'), mag = box.querySelector('.m');
    const defs = [[50, 106, -5], [88, 98, 4], [126, 108, -7], [166, 96, 6], [206, 106, -4], [244, 98, 5]];
    const docs = defs.map(([x, y, r]) => {
      const grp = el('g', {}, g), inner = el('g', { transform: `translate(${x} ${y}) rotate(${r})` }, grp);
      el('rect', { x: -22, y: -30, width: 44, height: 60, rx: 4, fill: '#fff', filter: `url(#fxs${id})` }, inner);
      const ls = [0, 1, 2, 3].map(k => el('line', { x1: -13, x2: k % 2 ? 6 : 13, y1: -16 + k * 9, y2: -16 + k * 9, stroke: '#a9b2bd', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, inner));
      return { x, y, grp, ls, k: 0 };
    });
    let running = false, t = 0, last = 0; const pos = { x: 140, y: 100 };
    function frame(now) {
      if (!running) return;
      const dt = Math.min(50, now - last); last = now; t += dt / 1000 * (reduce ? .2 : 1);
      const tx = 140 + 80 * Math.sin(t * .8), ty = 98 + 16 * Math.sin(t * 1.6 + .6);
      pos.x += (tx - pos.x) * .14; pos.y += (ty - pos.y) * .14;
      mag.setAttribute('transform', `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`);
      docs.forEach(d => {
        const want = Math.max(0, 1 - Math.hypot(d.x - pos.x, d.y - pos.y) / 46); d.k += (want - d.k) * .2;
        d.grp.setAttribute('transform', `translate(0 ${(-9 * d.k).toFixed(2)})`);
        const col = d.k > .35 ? tint : '#a9b2bd'; d.ls.forEach(l => l.setAttribute('stroke', col));
      });
      requestAnimationFrame(frame);
    }
    mag.setAttribute('transform', 'translate(140 100)');
    return { el: box, start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); }, stop() { running = false; } };
  }

  /* ---- 等角の床を転がるキューブ ---- */
  function cubes(host, { height = 200, N = 5, S = 34, palette = [[224, 147, 46], [226, 105, 75], [47, 158, 131]] } = {}) {
    const box = stage(host, height); box.classList.add('fx-iso');
    box.innerHTML = '<div class="fx-iso-scale"><div class="fx-cam"><div class="fx-floor"></div></div></div>';
    const wrap = box.firstChild, cam = wrap.firstChild, floor = cam.firstChild, half = N * S / 2;
    Object.assign(floor.style, { width: N * S + 'px', height: N * S + 'px', left: -half + 'px', top: -half + 'px', backgroundSize: `${S}px ${S}px` });
    const fd = [
      { n: [0, 0, 1], t: `translateZ(${S / 2}px)` }, { n: [0, 0, -1], t: `rotateY(180deg) translateZ(${S / 2}px)` },
      { n: [1, 0, 0], t: `rotateY(90deg) translateZ(${S / 2}px)` }, { n: [-1, 0, 0], t: `rotateY(-90deg) translateZ(${S / 2}px)` },
      { n: [0, 1, 0], t: `rotateX(-90deg) translateZ(${S / 2}px)` }, { n: [0, -1, 0], t: `rotateX(90deg) translateZ(${S / 2}px)` }
    ];
    const starts = [[0, 1], [2, 3], [4, 1]];
    const list = palette.map((rgb, i) => {
      const node = document.createElement('div'); node.className = 'fx-cube';
      const faces = fd.map(f => { const d = document.createElement('div'); d.className = 'fx-face'; Object.assign(d.style, { width: S + 'px', height: S + 'px', left: -S / 2 + 'px', top: -S / 2 + 'px', transform: f.t }); node.appendChild(d); return { d, n: f.n }; });
      cam.appendChild(node);
      return { rgb, node, faces, gx: starts[i][0], gy: starts[i][1], M: new DOMMatrix(), roll: null, next: 300 + i * 450 };
    });
    const cell = g => (g - (N - 1) / 2) * S, ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const occupied = (x, y, self) => list.some(c => c !== self && ((c.gx === x && c.gy === y) || (c.roll && c.gx + c.roll.dx === x && c.gy + c.roll.dy === y)));
    const shade = (c, M) => c.faces.forEach(f => {
      const [x, y, z] = f.n, ny = M.m12 * x + M.m22 * y + M.m32 * z, nz = M.m13 * x + M.m23 * y + M.m33 * z;
      const b = Math.max(.45, Math.min(1, .76 + .24 * nz + .14 * ny)); f.d.style.background = `rgb(${c.rgb.map(v => Math.round(v * b)).join(',')})`;
    });
    const rollAxis = (dx, dy, deg) => dx ? [0, 1, 0, dx * deg] : [1, 0, 0, -dy * deg];
    function draw(c, theta) {
      const cx = cell(c.gx), cy = cell(c.gy); let W;
      if (c.roll && theta > 0) {
        const { dx, dy } = c.roll, px = cx + dx * S / 2, py = cy + dy * S / 2, [ax, ay, az, ang] = rollAxis(dx, dy, theta);
        W = new DOMMatrix().translate(px, py, 0).rotateAxisAngle(ax, ay, az, ang).translate(-px, -py, 0).translate(cx, cy, S / 2).multiply(c.M);
        shade(c, new DOMMatrix().rotateAxisAngle(ax, ay, az, ang).multiply(c.M));
      } else { W = new DOMMatrix().translate(cx, cy, S / 2).multiply(c.M); shade(c, c.M); }
      c.node.style.transform = W.toString();
    }
    function startRoll(c, now) {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => { const x = c.gx + dx, y = c.gy + dy; return x >= 0 && y >= 0 && x < N && y < N && !occupied(x, y, c); });
      if (!dirs.length) { c.next = now + 300; return; }
      const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)]; c.roll = { dx, dy, t0: now, dur: 700 };
      const tt = document.createElement('div'); tt.className = 'fx-tint';
      Object.assign(tt.style, { width: S + 'px', height: S + 'px', left: cell(c.gx + dx) - S / 2 + 'px', top: cell(c.gy + dy) - S / 2 + 'px', background: `rgba(${c.rgb.join(',')},.4)` });
      cam.appendChild(tt); tt.animate([{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: 0 }], { duration: 1800 }).onfinish = () => tt.remove();
    }
    let running = false;
    function frame(now) {
      if (!running) return;
      list.forEach(c => {
        if (c.roll) {
          const p = Math.min(1, (now - c.roll.t0) / c.roll.dur); draw(c, ease(p) * 90);
          if (p >= 1) {
            const { dx, dy } = c.roll, [ax, ay, az, ang] = rollAxis(dx, dy, 90);
            c.M = new DOMMatrix().rotateAxisAngle(ax, ay, az, ang).multiply(c.M); c.gx += dx; c.gy += dy; c.roll = null; c.next = now + rnd(100, 450); draw(c, 0);
          }
        } else if (now >= c.next) startRoll(c, now);
      });
      requestAnimationFrame(frame);
    }
    const fit = () => { wrap.style.transform = `scale(${Math.min(1.3, (box.clientWidth || 300) / (N * S * 1.5 + 20), (height - 20) / (N * S * .8 + S))})`; };
    list.forEach(c => draw(c, 0));
    return { el: box, fit, start() { fit(); if (running) return; running = true; requestAnimationFrame(frame); }, stop() { running = false; } };
  }

  /* ---- GOAL!(文字と手が上がる) ---- */
  function goal(host, { height = 190 } = {}) {
    const box = stage(host, height);
    const T = 'transform-box:fill-box;transform-origin:50% 100%';
    box.innerHTML = `<svg viewBox="42 36 216 150" role="img" aria-label="ゴール達成のアニメーション"><g class="dots"></g>
<g font-family="Impact,Haettenschweiler,'Arial Narrow',sans-serif" font-weight="900" font-size="118" fill="${C.coral}">
<text class="gl" x="58" y="148" textLength="42" lengthAdjust="spacingAndGlyphs" style="${T}">G</text><text class="gl" x="104" y="148" textLength="44" lengthAdjust="spacingAndGlyphs" style="${T}">O</text>
<text class="gl" x="152" y="148" textLength="46" lengthAdjust="spacingAndGlyphs" style="${T}">A</text><text class="gl" x="202" y="148" textLength="38" lengthAdjust="spacingAndGlyphs" style="${T}">L</text></g>
<g class="arm"><g class="wave" style="transform-origin:84px 172px"><line x1="76" y1="128" x2="82" y2="150" stroke="${C.navy}" stroke-width="2" stroke-linecap="round"/><path d="M72 138c-8 2-6 10 0 8" fill="none" stroke="${C.teal}" stroke-width="2.5" stroke-linecap="round"/><rect x="78" y="146" width="12" height="28" rx="6" fill="#ffe2ad"/><circle cx="84" cy="146" r="8" fill="#ffe2ad"/></g></g>
<g class="arm"><g class="wave" style="transform-origin:128px 172px"><rect x="122" y="150" width="12" height="24" rx="6" fill="#ffe2ad"/><rect x="114" y="112" width="28" height="42" rx="10" fill="${C.navy}"/><rect x="122" y="94" width="11" height="26" rx="5.5" fill="${C.navy}"/><polyline points="118,132 123,126 128,136 133,126 138,134" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g></g>
<g class="arm"><g class="wave" style="transform-origin:170px 172px"><rect x="164" y="138" width="13" height="36" rx="6.5" fill="${C.teal}"/><circle cx="170" cy="134" r="10" fill="${C.teal}"/><path d="M163 126c-6-2-7 5-2 6M178 126c6-2 7 5 2 6" fill="none" stroke="${C.teal}" stroke-width="5" stroke-linecap="round"/><path d="M186 136c8-1 9 8 2 9" fill="none" stroke="${C.gold}" stroke-width="2.5" stroke-linecap="round"/></g></g>
<g class="arm"><g class="wave" style="transform-origin:208px 172px"><rect x="202" y="146" width="12" height="28" rx="6" fill="#ffe2ad" transform="rotate(14 208 172)"/><path d="M200 126l30-16v36z" fill="${C.gold}"/><ellipse cx="230" cy="128" rx="4.5" ry="18" fill="${C.navy}"/></g></g>
<line x1="66" y1="173" x2="232" y2="173" stroke="${C.coral}" stroke-width="3" stroke-linecap="round"/></svg>`;
    const letters = [...box.querySelectorAll('.gl')], arms = [...box.querySelectorAll('.arm')], waves = [...box.querySelectorAll('.wave')], dg = box.querySelector('.dots');
    const cols = [C.navy, C.teal, C.coral, C.gold], dots = [];
    for (let i = 0; i < 22; i++) dots.push(el('circle', { cx: rnd(50, 250), cy: rnd(40, 150), r: rnd(1.4, 3), fill: cols[i % cols.length] }, dg));
    let list = [];
    function play() {
      stop();
      letters.forEach((l, i) => list.push(l.animate([{ transform: 'translateY(50px) scale(.8)', opacity: 0 }, { transform: 'translateY(-7px) scale(1.04)', opacity: 1, offset: .7 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: dur(520), delay: dur(i * 90), easing: 'ease-out', fill: 'both' })));
      arms.forEach((a, i) => list.push(a.animate([{ transform: 'translateY(90px)' }, { transform: 'translateY(0)' }], { duration: dur(650), delay: dur(300 + i * 110), easing: 'cubic-bezier(.3,1.35,.5,1)', fill: 'both' })));
      if (!reduce) {
        waves.forEach((w, i) => list.push(w.animate([{ transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }], { duration: 650 + i * 70, delay: 1000, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out', fill: 'both' })));
        dots.forEach((d, i) => list.push(d.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(-6px)', offset: .5 }, { opacity: 0, transform: 'translateY(-16px)' }], { duration: rnd(1600, 2800), delay: 500 + i * 60, iterations: Infinity, easing: 'ease-in-out' })));
      }
    }
    function stop() { list.forEach(x => x.cancel()); list = []; }
    letters.forEach(l => l.style.opacity = 0); arms.forEach(a => a.style.opacity = 0);
    const _play = play; play = function () { letters.forEach(l => l.style.opacity = ''); arms.forEach(a => a.style.opacity = ''); _play(); };
    return { el: box, play, stop };
  }

  return { check, scan, cubes, goal, reduce };
})();
