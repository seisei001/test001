(() => {
  'use strict';
  const app = document.getElementById('app');
  const cache = {};
  let idx = null;          // data/index.json
  let cur = null;          // current diagnosis
  let qi = 0;              // current question index
  let picks = [];          // chosen option per question

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const load = async (f) => cache[f] || (cache[f] = await (await fetch('data/' + f)).json());

  function showEntrance() {
    cur = null;
    app.innerHTML = `
      <h1>${esc(idx.title)}</h1>
      <p class="lead">${esc(idx.lead)}</p>
      ${idx.entries.map((e) => `<button class="choice" data-f="${esc(e.file)}"><span class="ic">${e.icon}</span><span>${esc(e.label)}</span></button>`).join('')}
      <button class="choice sub" data-other="1"><span class="ic">💬</span><span>${esc(idx.other)}</span></button>`;
    app.querySelectorAll('.choice[data-f]').forEach((b) => b.addEventListener('click', () => start(b.dataset.f)));
    app.querySelector('[data-other]').addEventListener('click', showOther);
  }

  function showOther() {
    app.innerHTML = `
      <h1>ご相談ください</h1>
      <p class="lead">【仮】相談フォームへの案内を入れる場所です。ご状況をうかがったうえで、適切な専門家におつなぎします。</p>
      <button class="btn ghost" id="home">← 最初の質問に戻る</button>`;
    document.getElementById('home').addEventListener('click', showEntrance);
  }

  async function start(file) {
    cur = await load(file);
    qi = 0; picks = [];
    showIntro();
  }

  function showIntro() {
    app.innerHTML = `
      <h1>${esc(cur.title)}</h1>
      <div class="card"><p style="margin:0">${esc(cur.intro)}</p></div>
      <button class="btn" id="go">はじめる</button>
      <button class="btn ghost" id="home">← 戻る</button>`;
    document.getElementById('go').addEventListener('click', showQ);
    document.getElementById('home').addEventListener('click', showEntrance);
  }

  function showQ() {
    const q = cur.questions[qi], n = cur.questions.length;
    app.innerHTML = `
      <div class="progress"><i style="width:${(qi / n) * 100}%"></i></div>
      <div class="card">
        <p class="qno">質問 ${qi + 1} / ${n}</p>
        <p class="qtext">${esc(q.text)}</p>
        ${q.options.map((o, i) => `<button class="choice" data-i="${i}"><span>${esc(o.label)}</span></button>`).join('')}
      </div>
      <button class="back" id="back">← ひとつ前に戻る</button>`;
    app.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => {
      picks[qi] = q.options[Number(b.dataset.i)];
      qi++;
      qi < n ? showQ() : showResult();
    }));
    document.getElementById('back').addEventListener('click', () => {
      if (qi === 0) return showIntro();
      qi--; showQ();
    });
  }

  function showResult() {
    const total = picks.reduce((a, o) => a + o.score, 0);
    const rs = [...cur.results].sort((a, b) => a.min - b.min);
    let li = rs.findIndex((r) => total >= r.min && total <= r.max);
    if (li < 0) li = total < rs[0].min ? 0 : rs.length - 1;
    const r = rs[li];

    // 結果に出す専門家: 診断の担当 + 結果ごとの指定
    const ex = new Set([cur.partner, ...(r.experts || [])]);

    // 他分野にまたがる気になる点(連携質問で、点数が高かった回答)
    const cross = [];
    cur.questions.forEach((q, i) => {
      const o = picks[i];
      if (!q.synergy || !o || o.score < 2) return;
      const others = [...new Set(o.tags)].filter((t) => t !== cur.partner);
      if (!others.length) return;
      others.forEach((t) => ex.add(t));
      cross.push({ text: q.text, tags: others });
    });

    const nm = (t) => (idx.experts[t] ? idx.experts[t].name : t);
    app.innerHTML = `
      <div class="progress"><i style="width:100%"></i></div>
      <div class="card">
        <span class="badge l${li}">${esc(r.level)}</span>
        <h2>診断結果</h2>
        <p style="margin:0">${esc(r.message)}</p>
        <h2>次の一歩</h2>
        <p style="margin:0">${esc(r.next_action)}</p>
        ${cross.length ? `<h2>ほかの専門家の視点も関わりそうな点</h2>
          ${cross.map((c) => `<div class="syn">${esc(c.text)}<div class="chips">${c.tags.map((t) => `<span class="chip">${esc(nm(t))}も関係</span>`).join('')}</div></div>`).join('')}` : ''}
        <h2>対応する専門家(仮)</h2>
        ${[...ex].filter((t) => idx.experts[t]).map((t) => {
          const e = idx.experts[t];
          return `<div class="expert"><b>${esc(e.name)}</b>(${esc(e.who)})<br><span class="note">${esc(e.note)}</span></div>`;
        }).join('')}
        <p class="note" style="margin-top:14px">${esc(cur.disclaimer)}</p>
      </div>
      <button class="btn" id="consult">この結果について相談する(仮)</button>
      <button class="btn ghost" id="again">別の診断をする</button>`;
    document.getElementById('again').addEventListener('click', showEntrance);
    document.getElementById('consult').addEventListener('click', showOther);
    window.scrollTo(0, 0);
  }

  fetch('data/index.json').then((r) => r.json()).then((j) => { idx = j; showEntrance(); })
    .catch(() => { app.innerHTML = '<p class="lead">データを読み込めませんでした。</p>'; });
})();
