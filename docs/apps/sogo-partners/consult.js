/* お悩み別の簡易診断(アニメーション版)。質問データは data/shindan/*.json */
window.Consult = (() => {
  'use strict';
  const { esc, wait, tickSvg } = U;
  const reduce = FX.reduce;
  const cache = {};
  const load = async (f) => cache[f] || (cache[f] = await (await fetch('data/shindan/' + f, { cache: 'no-cache' })).json());
  // 診断の分野 → 対応する専門家
  const EXPERTS = { tax: ['honda', 'sakaguchi'], labor: ['yamada', 'honda'], restructure: ['uehara', 'sakashita'], it: ['sakaguchi'] };
  const NOTE = {
    sakaguchi: '国税局37年のキャリア。税務調査対応・システム・AIの活用の相談に。',
    honda: '税理士・社会保険労務士・行政書士のトリプルライセンス。',
    yamada: '医療・介護・保育業界の労務管理、全国の行政調査対応、助成金申請。',
    uehara: '金融機関対応・M&A・事業承継・中小企業の再生支援。',
    sakashita: '公認会計士・税理士・公認不正検査士。監査、税務、会計、不正調査等。'
  };
  const RELATED = {
    chosa: [['/honda', '本田 智広のページ'], ['/sakaguchi', '坂口 誠 税理士事務所のページ']],
    setsuzei: [['/honda', '本田 智広のページ'], ['/sakaguchi', '坂口 誠 税理士事務所のページ'], ['/uehara/s-succession', '事業承継・廃業支援(上原)']],
    koeki: [['/shafuku/about-3', '社会福祉法人会計基準(社福サポート)'], ['/sakaguchi', '坂口 誠 税理士事務所のページ']],
    saisei: [['/uehara/s-succession', '事業承継・廃業支援(上原)'], ['/uehara/s-plan', '事業計画策定(上原)'], ['/sr/services', '社会保険料の換価の猶予(社労士法人)']],
    romu: [['/sr/services', '業務内容(日本綜合社会保険労務士法人)'], ['/shafuku/labor', '給与・労務(社福サポート)']],
    ai: [['/sakaguchi', '坂口 誠 税理士事務所のページ']]
  };
  const CHECK = '<circle cx="12" cy="12" r="12"/><path d="M6.5 12.5l4 4 7-8.5"/>';

  async function mount(el, ctx, single) {
    const { people } = ctx;
    const idx = single ? null : await (await fetch('data/shindan/index.json', { cache: 'no-cache' })).json();
    let cur = null, cid = '', qi = 0, picks = [], busy = false, token = 0, live = null, n = 0;
    ctx.cleanup.push(() => { token++; if (live) live.stop(); });

    async function swap(html, dir = 1) {
      el.getAnimations().forEach((a) => a.cancel());
      if (!reduce && el.firstChild) await el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * 30}px)` }], { duration: 190, easing: 'ease-in', fill: 'forwards' }).finished;
      el.getAnimations().forEach((a) => a.cancel());
      if (live) { live.stop(); live = null; }
      el.innerHTML = html;
      if (!reduce) el.animate([{ opacity: 0, transform: `translateX(${dir * 30}px)` }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.2,.8,.3,1)' });
      busy = false;
    }
    function ripple(btn, e) {
      const r = btn.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
      const x = (e && e.clientX ? e.clientX : r.left + r.width / 2) - r.left - s / 2, y = (e && e.clientY ? e.clientY : r.top + r.height / 2) - r.top - s / 2;
      const sp = document.createElement('span'); sp.className = 'ripple'; Object.assign(sp.style, { width: s + 'px', height: s + 'px', left: x + 'px', top: y + 'px' });
      btn.appendChild(sp); sp.animate([{ transform: 'scale(0)', opacity: .6 }, { transform: 'scale(1)', opacity: 0 }], { duration: reduce ? 1 : 550, easing: 'ease-out' }).onfinish = () => sp.remove();
    }
    async function pickAnim(btn, e) {
      ripple(btn, e); btn.parentElement.classList.add('is-locked'); btn.classList.add('is-picked'); btn.insertAdjacentHTML('beforeend', tickSvg);
      await wait(reduce ? 50 : 620);
    }

    /* 入口 */
    function entrance() {
      cur = null; busy = false;
      swap(`<h3>${esc(idx.title)}</h3><p class="lead">${esc(idx.lead)}</p><div class="choices">${idx.entries.map((e, i) => `<button class="choice" type="button" data-i="${i}"><span class="ic">${e.icon}</span><span>${esc(e.label)}</span></button>`).join('')}<button class="choice sub" type="button" data-o="1"><span class="ic">💬</span><span>${esc(idx.other)}</span></button></div>`, -1).then(() => {
        el.querySelectorAll('.choice').forEach((b, k) => {
          if (!reduce) b.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 120 + k * 70, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' });
          b.addEventListener('click', async (ev) => {
            if (busy) return; busy = true; await pickAnim(b, ev);
            if (b.dataset.o) return other(); const en = idx.entries[Number(b.dataset.i)]; cid = en.id; cur = await load(en.file); qi = 0; picks = []; intro();
          });
        });
      });
    }
    function other() { swap(`<h3>ご相談ください</h3><p class="lead">どれにも当てはまらない場合も、まずはご相談ください。状況をうかがったうえで、適切な専門家におつなぎします。</p><p><a class="btn" href="#/map">全ページ一覧を見る</a></p><button class="back" type="button" id="home">← 最初の質問に戻る</button>`).then(() => el.querySelector('#home').addEventListener('click', entrance)); }
    function intro() {
      swap(`<h3>${esc(cur.title)}</h3><div class="syn">${esc(cur.intro)}</div><p style="margin-top:16px"><button class="btn" type="button" id="go">はじめる</button></p>${single ? '' : '<button class="back" type="button" id="home">← 戻る</button>'}`).then(() => {
        el.querySelector('#go').addEventListener('click', () => { ripple(el.querySelector('#go')); question(1); });
        const hm = el.querySelector('#home'); if (hm) hm.addEventListener('click', entrance);
      });
    }

    /* 質問 */
    function stepsHTML(done, now) {
      n = cur.questions.length;
      return `<div class="steps" aria-hidden="true"><div class="ln"><i style="width:${(Math.min(done, n - 1) / (n - 1)) * 100}%"></i></div>${cur.questions.map((_, i) => `<div class="dot ${i < done ? 'done' : ''} ${i === now ? 'now' : ''}"><span>${i + 1}</span><svg viewBox="0 0 24 24"><path d="M6.5 12.5l4 4 7-8.5"/></svg></div>`).join('')}</div>`;
    }
    function question(dir) {
      const q = cur.questions[qi];
      swap(`${stepsHTML(qi, qi)}<p class="qno">質問 ${qi + 1} / ${cur.questions.length}</p><p class="qtext">${esc(q.text)}</p><div class="choices">${q.options.map((o, i) => `<button class="choice" type="button" data-i="${i}"><span>${esc(o.label)}</span></button>`).join('')}</div><button class="back" type="button" id="back">← ひとつ前に戻る</button>`, dir).then(() => {
        el.querySelectorAll('.choice').forEach((b, k) => {
          if (!reduce) b.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 140 + k * 80, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' });
          b.addEventListener('click', async (ev) => {
            if (busy) return; busy = true; await pickAnim(b, ev); picks[qi] = q.options[Number(b.dataset.i)]; qi++;
            qi < cur.questions.length ? question(1) : thinking();
          });
        });
        el.querySelector('#back').addEventListener('click', () => { if (busy) return; busy = true; if (qi === 0) intro(); else { qi--; question(-1); } });
      });
    }

    /* 探す → 考える */
    async function thinking() {
      const tk = ++token;
      await swap(`<div class="steps" aria-hidden="true"><div class="ln"><i style="width:100%"></i></div>${cur.questions.map(() => '<div class="dot done"><span></span><svg viewBox="0 0 24 24"><path d="M6.5 12.5l4 4 7-8.5"/></svg></div>').join('')}</div><div class="think"><div id="fxh"></div><p class="t"></p><div class="bar"><i></i></div></div>`);
      const host = el.querySelector('#fxh'), tx = el.querySelector('.t'), bar = el.querySelector('.bar i');
      const ph = [
        ['書類の中から、気になる点を探しています…', 1600, () => FX.scan(host, { height: 170 })],
        ['回答を組み合わせて、状況を整理しています…', 1800, () => FX.cubes(host, { height: 190, palette: [[47, 158, 131], [224, 147, 46], [226, 105, 75]] })]
      ];
      const total = ph.reduce((a, p) => a + (reduce ? 300 : p[1]), 0);
      bar.animate([{ width: '0%' }, { width: '100%' }], { duration: total, easing: 'linear', fill: 'forwards' });
      for (const [t, ms, make] of ph) {
        if (tk !== token) return; host.replaceChildren(); tx.textContent = t;
        if (!reduce) tx.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320 });
        live = make(); live.start(); await wait(reduce ? 300 : ms); if (tk !== token) return; live.stop();
      }
      result();
    }

    /* 結果 */
    async function result() {
      const total = picks.reduce((a, o) => a + o.score, 0);
      const max = cur.questions.reduce((a, q) => a + Math.max(...q.options.map((o) => o.score)), 0);
      const rs = [...cur.results].sort((a, b) => a.min - b.min);
      let li = rs.findIndex((r) => total >= r.min && total <= r.max); if (li < 0) li = total < rs[0].min ? 0 : rs.length - 1;
      const r = rs[li], tags = new Set([cur.partner, ...(r.experts || [])]), cross = [];
      cur.questions.forEach((q, i) => { const o = picks[i]; if (!q.synergy || !o || o.score < 2) return; const others = [...new Set(o.tags)].filter((t) => t !== cur.partner); if (!others.length) return; others.forEach((t) => tags.add(t)); cross.push({ text: q.text, tags: others }); });
      const ids = []; [...tags].forEach((t) => (EXPERTS[t] || []).forEach((id) => { if (!ids.includes(id)) ids.push(id); }));
      const tn = { tax: '税理士', labor: '社会保険労務士', restructure: '公認会計士', it: 'AI・システム' };
      const pct = Math.round((total / Math.max(1, max)) * 100);
      await swap(`<div id="fxh"></div><span class="badge l${li}">${esc(r.level)}</span><h3>診断結果</h3>
<div class="gauge"><i></i></div><p class="gnum">状況の目安 <b>0</b> / ${max}</p>
<p>${esc(r.message)}</p><h3>次の一歩</h3><p>${esc(r.next_action)}</p>
${cross.length ? `<h3>ほかの専門家の視点も関わりそうな点</h3>${cross.map((c) => `<div class="syn">${esc(c.text)}<div class="chips" style="margin-top:6px">${c.tags.map((t) => `<span class="chip">${esc(tn[t] || t)}も関係</span>`).join('')}</div></div>`).join('')}` : ''}
<h3>相談できる専門家</h3>${ids.map((id) => { const p = people[id]; return `<a class="exp" href="#${p.route}">${U.monoC(p)}<span><b>${esc(p.name)}(${esc(p.role)})</b><small>${esc(NOTE[id] || '')}</small></span><span class="arrow">→</span></a>`; }).join('')}
${(RELATED[cid] || []).length ? `<h3>あわせて見るページ</h3><div class="chips">${RELATED[cid].map(([rt, l]) => `<a class="chip" href="#${rt}">${esc(l)}</a>`).join('')}</div>` : ''}
<p class="note" style="margin-top:14px">${esc(cur.disclaimer)}</p>
<p style="margin-top:12px"><button class="btn ghost sm" type="button" id="again">${single ? 'もう一度診断する' : '別の診断をする'}</button></p>`);
      const host = el.querySelector('#fxh');
      live = li === 0 ? FX.check(host, { height: 150, tone: 'teal' }) : FX.scan(host, { height: 140, tint: li === 1 ? '#c07a1a' : '#c14b34' });
      li === 0 ? live.play() : live.start();
      const cover = el.querySelector('.gauge i'), num = el.querySelector('.gnum b'), t0 = performance.now() + (reduce ? 0 : 900);
      cover.animate([{ width: '100%' }, { width: `${100 - pct}%` }], { duration: reduce ? 1 : 1200, delay: reduce ? 0 : 900, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      const tick = (now) => { const p = Math.max(0, Math.min(1, (now - t0) / (reduce ? 1 : 1200))); num.textContent = Math.round(total * (1 - Math.pow(1 - p, 3))); if (p < 1 && el.contains(num)) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      el.querySelector('#again').addEventListener('click', () => { if (single) { qi = 0; picks = []; intro(); } else entrance(); });
    }
    if (single) { cur = single; cid = 'risk'; qi = 0; picks = []; intro(); } else entrance();
  }
  return { mount };
})();
