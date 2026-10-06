/* 坂口誠税理士事務所 個人サイト。内容は既存の「税理士事務所PRサイト」の記載に基づく(未確定は準備中) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PILLARS = [
    ['国税の内部構造を理解している税理士', '調査官の思考パターン、勘定科目の着眼点、資料の評価基準を熟知。国税内部のシステム・データ構造についても深い理解を持つ。'],
    ['調査に強い税理士', '調査官が疑うポイントを事前に予測。証憑 → 仕訳 → 税務判断を一気通貫で構造化し、調査対応を型にする。'],
    ['AIを税務実務に統合できる技術者', 'Transformerや重み行列などAIの構造を研究者レベルで理解。複数のAIプロバイダを横断利用できる会話ログ×RAG基盤「raglog」(開発中・コンセプト)を構築。将来的には条文ベースのRAGなど、税務実務への応用を目指している。']
  ];
  const FLOW = [
    ['証憑', '根拠となる資料を揃える', '請求書・契約書・領収書など、取引の事実を裏づける資料を、調査官が評価する基準に沿って整えます。', ['資料の評価基準を踏まえた整理', '取引の事実関係の裏づけ']],
    ['仕訳', '勘定科目の着眼点を押さえる', '調査官が着目する勘定科目を事前に予測し、仕訳の根拠と一貫性を確認します。', ['調査官が疑うポイントの事前予測', '処理の一貫性の確認']],
    ['税務判断', '条文・通達・実務で結論を出す', '証憑と仕訳を受けて、条文・通達・実務を統合した「根拠ある税務判断」を行います。', ['根拠を説明できる判断', '調査対応を「型」にする']]
  ];
  const CMP = [
    ['税務調査対応', '調査の連絡が来てから資料をそろえ、当日は調査官の質問に受け身で対応することが多い。', '国税局で税務調査官・国際税務調査・査察部国際専門官などを歴任。税理士登録後、通常の税務調査は対応した案件すべてが申告是認。査察部による捜査(査察)を受けた案件では、不起訴という形で立件を阻止した実績もある。'],
    ['システム・AI活用', '紙の資料や手作業でのチェックが中心で、システムやAIの活用相談までは踏み込みにくい。', '国税局の大型コンピュータのプログラマー・システムエンジニアを経験し、システム監査手法を用いた大規模法人の調査も担当。近年はAIの構造についても研究者レベルの理解を深め、複数のAIを横断利用できるRAG基盤「raglog」を開発中。'],
    ['事業再生', '申告業務が中心で、金融機関との交渉や再生計画づくりは専門外としていることが多い。', '事業再生を専門とする公認会計士と提携。税務面は坂口が担い、再生計画の策定から実行まで連携して伴走する。'],
    ['公益法人対応', '公益法人特有の会計基準や認定事務に対応できる事務所は限られている。', '国税局在籍時には消費税における「固有法人」(公益法人等)の申告実務に携わり、税理士登録後は公益法人の申請承認・新会計基準への移行に関する事務にも対応。']
  ];
  const TL = [
    ['昭和61年(1986年)4月1日', '大阪国税局に入庁', 'その後4年間、中小企業の税務調査を担当。'],
    ['在職中', '国税局の大型コンピュータのプログラマー・システムエンジニアに', 'その後、システム監査手法を用いた大規模法人の税務調査を担当。'],
    ['在職中', '国際税務調査、査察部国際専門官などを歴任', 'あわせて、消費税における「固有法人」(公益法人等)の申告実務にも携わる。'],
    ['令和5年(2023年)7月10日', '大阪国税局を退職、税理士登録', '37年3ヶ月の国税局でのキャリアを経て、税理士として活動を開始。'],
    ['税理士登録後', '査察対応で不起訴、通常の税務調査は全件申告是認', '査察部による捜査を受けた案件に対応し、不起訴という形で立件を阻止。ほかの税務調査にも対応し、通常の税務調査はすべて申告是認。'],
    ['現在', 'AIを活用した業務効率化にも取り組む', '複数のAIを横断利用できる会話ログ×RAG基盤「raglog」(開発中)を構築。将来的には条文ベースのRAGなど、税務実務への応用も目指している。'],
    ['令和8年(2026年)10月1日', '兵庫県神戸市に「坂口誠税理士事務所」を開業', '提携の専門家とともに、守りと立て直しの両面から経営者を支える。']
  ];
  const WORK = [
    ['税務調査対応', '調査前の備えから、立会い・対応まで。査察(捜査)対応の経験も踏まえ、論点予測・資料整理・一貫性を構造化します。'],
    ['法人税・個人所得税', '法人税申告(数十件)、個人所得税申告(数十件)の実績。記帳から決算書・申告書まで一貫して対応します。'],
    ['相続税', '相続税申告(数件)の実績があります。'],
    ['法人設立支援', '中小企業の設立を、記帳〜決算書〜申告書まで一貫して支援します。'],
    ['公益法人', '公益法人の申請承認・新会計基準への移行に関する事務にも対応します。'],
    ['システム・AI活用', '仕組みの見直しや、AIを活用した業務効率化のご相談に対応します。']
  ];
  const FAQ = [
    ['顧問料はどのくらいですか?', '会社の規模や依頼内容によって異なります。まずは無料相談でお気軽にお問い合わせください。(料金体系は準備中です)'],
    ['対応エリアはどこですか?', 'オンライン面談を中心に全国対応しています。(対応エリアは準備中です)'],
    ['個人の確定申告も依頼できますか?', '対応可能です。相続税申告・個人の所得税申告の実績もございます。'],
    ['事業再生や労務の相談もできますか?', '分野に応じて、提携する専門家と連携して対応します。窓口は坂口に一本化できます。']
  ];
  const QS = [
    ['税務署への提出書類(申告書・決算書)の作成体制は?', [['顧問税理士に一任し、内容も共有・確認している', 0], ['自社で作成し、税理士のチェックは受けていない', 2], ['自己流で作成している', 3]]],
    ['現金での取引(現金商売・経費の現金精算など)の割合は?', [['ほとんどない', 0], ['一部ある', 1], ['多い', 2]]],
    ['直近で税務調査を受けたのはいつ頃ですか?', [['5年以内に受けた', 1], ['5〜9年前、または一度も受けたことがない(開業5年以上)', 2], ['10年以上前、または開業から一度も接触がない', 3]]],
    ['ここ数年の売上・利益の推移は?', [['安定して推移している', 0], ['大きく増減した年がある', 2]]],
    ['役員報酬の変更や、同族間・関係会社間の取引はありますか?', [['特にない', 0], ['ある(役員報酬変更・同族間取引など)', 2]]],
    ['インボイス制度・消費税の課税事業者選択への対応状況は?', [['税理士と相談のうえ、適切に対応済み', 0], ['自分で対応したが、あまり自信がない', 2]]]
  ];
  const MAX = QS.reduce((a, q) => a + Math.max(...q[1].map((o) => o[1])), 0);
  const RES = [
    [3, '傾向:低め', '大きな懸念材料は少なそうです。日頃の記帳・証憑管理を継続することが最大の予防策です。定期的な顧問チェックをおすすめします。'],
    [7, '傾向:中程度', 'いくつか、調査官が着目しやすいポイントが見られます。決算前のタイミングで一度、国税局出身の税理士によるセルフチェックを受けておくと安心です。'],
    [99, '傾向:高め', '複数の項目で、税務調査時に指摘を受けやすい傾向が見られます。早めの記帳・申告内容の見直しをおすすめします。']
  ];
  let diagSummary = '';

  /* ---------- 組み立て ---------- */
  $('#ver').textContent = window.APP_VER;
  $('#pillars').innerHTML = PILLARS.map((p, i) => `<button class="pil rv" type="button" aria-expanded="false"><span class="no">0${i + 1}</span><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p><span class="more">タップして詳しく ＋</span></button>`).join('');
  $$('.pil').forEach((b) => {
    b.addEventListener('click', () => { const o = !b.classList.contains('open'); $$('.pil').forEach((x) => { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); }); b.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); });
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });
  $('#tl').innerHTML = '<span class="fill" id="tlfill"></span>' + TL.map(([d, t, p]) => `<li class="rv"><time>${esc(d)}</time><h3>${esc(t)}</h3><p>${esc(p)}</p></li>`).join('');
  $('#faqList').innerHTML = FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  $$('.rv').forEach((e, i) => { e.style.transitionDelay = (i % 3) * 0.08 + 's'; });

  // 調査の備え(3段階)
  const fb = $('#flowBox'); let fi = 0;
  fb.innerHTML = `<div class="flow-steps"><i id="fprog"></i>${FLOW.map((f, i) => `<button class="fs" type="button" data-i="${i}"><b>${i + 1}</b>${f[0]}</button>`).join('')}</div><div class="flow-panel" id="fpanel"></div>`;
  const showFlow = (i) => {
    fi = i; const f = FLOW[i];
    $$('.fs', fb).forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); });
    $('#fprog').style.width = (i / 2 * 68) + '%';
    $('#fpanel').innerHTML = `<h3>${esc(f[1])}</h3><p>${esc(f[2])}</p><ul>${f[3].map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${i === 2 ? '<div id="fxc"></div>' : ''}`;
    if (!reduce) $('#fpanel').animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
    if (i === 2) { const c = FX.check($('#fxc'), { height: 120 }); c.play(); }
  };
  $$('.fs', fb).forEach((b) => b.addEventListener('click', () => showFlow(+b.dataset.i)));
  showFlow(0);

  // 比較タブ
  $('#cmpTabs').innerHTML = CMP.map((c, i) => `<button type="button" role="tab" class="${i ? '' : 'on'}" data-i="${i}">${esc(c[0])}</button>`).join('');
  const showCmp = (i) => { $$('#cmpTabs button').forEach((b, k) => b.classList.toggle('on', k === i)); $('#cmpBody').innerHTML = `<div class="c"><h3>一般的な事務所</h3><p>${esc(CMP[i][1])}</p></div><div class="c me"><h3>坂口誠税理士事務所</h3><p>${esc(CMP[i][2])}</p></div>`; };
  $$('#cmpTabs button').forEach((b) => b.addEventListener('click', () => showCmp(+b.dataset.i))); showCmp(0);

  // 業務チップ
  $('#chips').innerHTML = WORK.map((w, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}">${esc(w[0])}</button>`).join('');
  const showWork = (i) => { $$('#chips button').forEach((b, k) => b.classList.toggle('on', k === i)); $('#chipPanel').innerHTML = `<h3>${esc(WORK[i][0])}</h3><p>${esc(WORK[i][1])}</p>`; };
  $$('#chips button').forEach((b) => b.addEventListener('click', () => showWork(+b.dataset.i))); showWork(0);

  /* ---------- 診断 ---------- */
  function diag() {
    const box = $('#dg'); let n = 0, score = 0;
    const ask = () => {
      if (n >= QS.length) return result();
      const [q, os] = QS[n];
      box.innerHTML = `<div class="bar"><i style="width:${n / QS.length * 100}%"></i></div><div class="q-no">QUESTION ${n + 1} / ${QS.length}</div><h3>${esc(q)}</h3>${os.map((o, i) => `<button class="opt" type="button" data-i="${i}">${esc(o[0])}</button>`).join('')}`;
      $$('.opt', box).forEach((b) => b.addEventListener('click', () => { score += os[+b.dataset.i][1]; n++; ask(); }));
    };
    const result = () => {
      const r = RES.find((x) => score <= x[0]); const len = 251.3; // 半円の弧長
      diagSummary = `【税務調査リスク診断】${r[1]}(スコア ${score}/${MAX})`;
      box.innerHTML = `<div class="res"><svg class="gauge" viewBox="0 0 200 110" aria-hidden="true"><path class="tr" d="M20 100 A80 80 0 0 1 180 100"/><path class="pg" id="pg" d="M20 100 A80 80 0 0 1 180 100" style="--len:${len}"/></svg><div class="lv">${r[1]}</div><div id="fxr"></div><p>${esc(r[2])}</p><p class="dis">※ 一般的な傾向をもとにした簡易チェックであり、正式な税務判断・保証ではありません。</p><div class="acts"><a class="btn gold" href="#contact" data-go>この結果を添えて相談する</a><button class="btn ghost" type="button" id="again">もう一度診断する</button></div></div>`;
      requestAnimationFrame(() => requestAnimationFrame(() => { $('#pg').style.strokeDashoffset = len * (1 - Math.min(1, score / MAX)); }));
      FX.check($('#fxr'), { height: 90, confetti: false }).play();
      $('#again').addEventListener('click', () => { n = 0; score = 0; ask(); });
      bindGo(box);
    };
    ask();
  }
  diag();

  /* ---------- 相談メモ ---------- */
  $('#ccopy').addEventListener('click', async () => {
    const t = `【坂口誠税理士事務所 相談メモ】\n種類:${$('#ctype').value}\n概要:${$('#cmsg').value.trim() || '(未記入)'}\n${diagSummary}`;
    let ok = false; try { await navigator.clipboard.writeText(t); ok = true; } catch {}
    $('#cnote').textContent = ok ? 'コピーしました。連絡先が決まり次第、この文面をお送りください。' : '自動コピーできませんでした。下の文面を手動でコピーしてください:\n' + t;
    $('#cnote').style.whiteSpace = 'pre-wrap';
  });

  /* ---------- スクロール連動 ---------- */
  const secs = $$('[data-nav]');
  $('#gnav').innerHTML = secs.slice(1).map((s) => `<a href="#${s.id}" data-go>${esc(s.dataset.nav)}</a>`).join('');
  $('#rail').innerHTML = secs.map((s) => `<a href="#${s.id}" data-go aria-label="${esc(s.dataset.nav)}"></a>`).join('');
  const bindGo = (r) => $$('[data-go]', r).forEach((a) => { if (a._b) return; a._b = 1; a.addEventListener('click', (e) => { const t = $(a.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } }); });
  bindGo(document);

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.rv').forEach((e) => io.observe(e));
  const cur = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const i = secs.indexOf(e.target); $$('#gnav a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); $$('#rail a').forEach((a, k) => a.classList.toggle('on', k === i)); } }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => cur.observe(s));
  const prog = $('#progress i'), tl = $('#tl'), fill = $('#tlfill');
  const onScroll = () => {
    const h = document.documentElement; prog.style.width = (scrollY / Math.max(1, h.scrollHeight - innerHeight) * 100) + '%';
    const r = tl.getBoundingClientRect(); fill.style.height = Math.max(0, Math.min(r.height - 6, innerHeight * .6 - r.top)) + 'px';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // 数字のカウントアップ
  const cnt = (el) => { const to = +el.dataset.count, sf = el.dataset.suffix || ''; if (reduce) { el.textContent = to + sf; return; } const t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + sf; if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };

  /* ---------- 背景(ゆっくり流れる金の線と、ポインタに反応する光) ---------- */
  (() => {
    const cv = $('#bg'), cx = cv.getContext('2d'); let W, H, dpr, px = .7, py = .2, tx = .7, ty = .2, vis = true;
    const lines = Array.from({ length: 26 }, (_, i) => ({ y: Math.random(), s: .015 + Math.random() * .03, a: .05 + Math.random() * .12, p: Math.random() * 6 }));
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }; size(); addEventListener('resize', size);
    addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth; ty = e.clientY / innerHeight; }, { passive: true });
    new IntersectionObserver((e) => { vis = e[0].isIntersecting; if (vis && !reduce) requestAnimationFrame(draw); }).observe(cv);
    function draw(t = 0) {
      if (!vis) return; px += (tx - px) * .05; py += (ty - py) * .05; cx.clearRect(0, 0, W, H);
      const g = cx.createRadialGradient(px * W, py * H, 0, px * W, py * H, Math.max(W, H) * .5); g.addColorStop(0, 'rgba(201,162,75,.16)'); g.addColorStop(1, 'rgba(201,162,75,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.lineWidth = 1;
      for (const l of lines) { const y = ((l.y + t / 1000 * l.s) % 1) * H, d = Math.abs(y / H - py), a = l.a * (1 + Math.max(0, .25 - d) * 6); cx.strokeStyle = `rgba(201,162,75,${a})`; cx.beginPath(); cx.moveTo(0, y); for (let x = 0; x <= W; x += 40) cx.lineTo(x, y + Math.sin(x * .008 + t / 2500 + l.p) * 6); cx.stroke(); }
      if (!reduce) requestAnimationFrame(draw);
    }
    draw(0);
  })();

  /* ---------- オープニング ---------- */
  const sp = $('#splash'); let started = false;
  const start = () => { if (started) return; started = true; sp.classList.add('out'); document.body.classList.remove('lock'); setTimeout(() => sp.remove(), 800); $('#hero').classList.add('go'); $$('[data-count]').forEach(cnt); try { sessionStorage.setItem('sakaguchiOpening', '1'); } catch {} };
  let seen = false; try { seen = sessionStorage.getItem('sakaguchiOpening') === '1'; } catch {}
  if (seen || reduce || /[?&]skip=1/.test(location.search)) { sp.remove(); start(); }
  else { document.body.classList.add('lock'); sp.addEventListener('click', start); setTimeout(start, 3300); }
})();
