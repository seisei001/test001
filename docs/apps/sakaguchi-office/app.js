/* 坂口誠税理士事務所(個人サイト)。演出部品(オープニング・Scenes・FX)は総合パートナーズ版をそのまま使用 */
(() => {
  'use strict';
  const { esc, BRAND, PEOPLE } = U;
  const $ = (id) => document.getElementById(id);
  const view = $('view');
  const reduce = Scenes.reduce;
  let cleanup = [];
  const NAV = [['/', 'ホーム'], ['/strength', '強み・業務・経歴'], ['/consult', 'リスク診断'], ['/faq', 'Q&A'], ['/contact', 'お問い合わせ']];

  const WORDS = [['税務調査', 0], ['国際税務', 0], ['査察', 0], ['申告是認', 0], ['証憑', 0], ['仕訳', 0], ['税務判断', 0], ['論点予測', 0],
    ['システム監査', 1], ['大型コンピュータ', 1], ['AI', 1], ['RAG', 1], ['raglog', 1], ['Transformer', 1],
    ['公益法人会計', 2], ['固有法人', 2], ['新会計基準', 2], ['申請承認', 2], ['法人設立', 2],
    ['法人税', 3], ['所得税', 3], ['相続税', 3], ['消費税', 3], ['記帳', 3], ['決算書', 3], ['ワンストップ', 4]];
  const CATS = [['税務調査', '#1f6a7a'], ['システム・AI', '#6a4c93'], ['公益法人', '#c4553a'], ['申告・相続', '#2f6f4f'], ['総合', '#a8710f']];
  const STRENGTHS = [
    { c: '#1f6a7a', k: '国税の内側', t: '国税の内部構造を理解している税理士', li: ['調査官の思考パターン、勘定科目の着眼点、資料の評価基準を熟知', '国税内部のシステム・データ構造についても深い理解'], go: [['/strength', '強み・経歴を詳しく']] },
    { c: '#a8710f', k: '調査対応', t: '調査に強い税理士', li: ['調査官が疑うポイントを事前に予測', '証憑 → 仕訳 → 税務判断を一気通貫で構造化し、調査対応を型にする', '登録後の通常の税務調査は、対応した案件すべてが申告是認'], go: [['/consult', 'リスク診断へ']] },
    { c: '#c4553a', k: '査察対応', t: '査察(捜査)にも対応', li: ['査察部による捜査を受けた案件で、不起訴という形で立件を阻止', '国際税務調査・査察部国際専門官を歴任'], go: [['/contact', '相談する']] },
    { c: '#6a4c93', k: 'システム・AI', t: 'AIを税務実務に統合できる技術者', li: ['国税局の大型コンピュータのプログラマー・SEを経験', 'Transformerや重み行列などAIの構造を研究者レベルで理解', '会話ログ×RAG基盤「raglog」を開発中(コンセプト)'], go: [['/strength', '強み・業務を詳しく']] },
    { c: '#2f6f4f', k: '公益法人・申告', t: '公益法人から相続・設立まで', li: ['公益法人の申請承認・新会計基準への移行に関する事務に対応', '法人税・個人所得税・相続税の申告、中小企業の設立支援'], go: [['/faq', 'よくある質問']] }
  ];
  const TL = [
    ['昭61', '昭和61年(1986年)4月1日', '大阪国税局に入庁', 'その後4年間、中小企業の税務調査を担当。', '#1f6a7a'],
    ['SE', '在職中', '大型コンピュータのプログラマー・SEに', 'その後、システム監査手法を用いた大規模法人の税務調査を担当。', '#6a4c93'],
    ['国際', '在職中', '国際税務調査・査察部国際専門官など', 'あわせて、消費税における「固有法人」(公益法人等)の申告実務にも携わる。', '#2b8a9c'],
    ['R5', '令和5年(2023年)7月10日', '大阪国税局を退職、税理士登録', '37年3ヶ月のキャリアを経て、税理士として活動を開始。', '#a8710f'],
    ['実績', '税理士登録後', '査察で不起訴・調査は全件申告是認', '査察部による捜査を受けた案件で立件を阻止。通常の税務調査はすべて申告是認。', '#c4553a'],
    ['AI', '現在', 'AIを活用した業務効率化にも取り組む', '会話ログ×RAG基盤「raglog」(開発中)。将来は条文ベースのRAGなど税務実務への応用を目指す。', '#2f6f4f'],
    ['開業', '令和8年(2026年)10月1日', '神戸市に坂口誠税理士事務所を開業', '国税局で培った知見をもとに、中小企業の経営者を税務の面から支える。', '#8a5a12']
  ];

  function chrome() {
    $('gh-brand').innerHTML = `${esc(BRAND)}<small>税理士 坂口 誠</small>`;
    $('gh-nav').innerHTML = NAV.map(([r, l]) => `<a href="#${r}" data-r="${r}">${esc(l)}</a>`).join('');
    $('menu').innerHTML = '<h3>MENU</h3>' + NAV.map(([r, l]) => `<a href="#${r}">${esc(l)}</a>`).join('');
    $('gh-nav').insertAdjacentHTML('afterend', '<div class="modesw" role="group" aria-label="表示の切り替え"><button type="button" data-m="phone" aria-pressed="true">📱<span class="t"> スマホ</span></button><button type="button" data-m="pc" aria-pressed="false">🖥<span class="t"> パソコン</span></button></div>');
    document.querySelectorAll('.modesw button').forEach((b) => { b.setAttribute('aria-pressed', String(b.dataset.m === Mode.mode)); b.addEventListener('click', () => Mode.set(b.dataset.m)); });
    const btn = $('gh-menu'), menu = $('menu');
    const setMenu = (o) => { menu.hidden = false; menu.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.textContent = o ? '閉じる' : 'メニュー'; document.body.style.overflow = o ? 'hidden' : ''; };
    btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    $('gf').innerHTML = `<div class="wrap"><h3>${esc(BRAND)}</h3><p>兵庫県神戸市(2026年10月1日開業)。連絡先は準備中です。</p><p><a href="#/">ホーム</a> / <a href="#/consult">リスク診断</a> / <a href="#/" id="replay">オープニングをもう一度見る</a> / <a href="../../">ハブに戻る</a></p><p style="opacity:.75;font-size:.76rem">パートナー:公認会計士 上原佑介(事業再生・M&amp;Aなど)</p><p style="opacity:.6;font-size:.72rem">表示中の版: ${esc(window.APP_VER || '不明(古い表示です。再読み込みしてください)')}</p></div>`;
    $('replay').addEventListener('click', (e) => { e.preventDefault(); const go2 = () => { window.scrollTo(0, 0); Opening.play({ force: true }); }; if ((location.hash || '#/') !== '#/') { location.hash = '#/'; setTimeout(go2, 900); } else go2(); });
  }

  function mainPage() {
    const nums = [['37', '', '年', '国税局でのキャリア'], ['100', '', '%', '登録後の税務調査 申告是認率'], ['', '不起訴', '', '査察対応で立件を阻止']];
    return `
<section class="hero" id="hero" data-bg="#0f1f33" data-dark="1"><div class="wrap">
  <span class="kicker" style="color:#ffd36b">2026年10月1日 兵庫県神戸市に開業</span>
  <h1>調べる側に、三十七年。<br><em>だから、守れる。</em></h1>
  <p class="lead">元・大阪国税局。税務調査、国際税務、査察、そしてシステム。国税の内側を知り尽くした税理士が、あなたの会社の「備え」を構造から組み立てます。</p>
  <div class="nums">${nums.map(([n, w, s, a]) => `<div class="num"><b${n ? ` data-count="${n}"` : ' style="font-size:1.05rem"'}>${n ? '0' : w}</b>${s ? `<span style="display:inline">${s}</span>` : ''}<span>${a}</span></div>`).join('')}</div>
  <p style="margin-top:14px"><a class="btn gold" href="#/consult">税務調査リスク診断(無料)</a> <a class="btn ghost" href="#/strength" style="color:#fff">強み・経歴を見る</a></p>
</div><div class="hero-fx fx-on-dark" id="hero-fx" aria-hidden="true"></div><p class="hint">SCROLL ↓</p></section>

<div class="label"><span class="kicker">STRENGTH</span><h2>坂口誠の強みを、一目で。</h2><p>5つの強みが重なって、ひとつの力になります。下へスクロールすると、次の強みが重なります。</p></div>
<section class="stack" data-scene="stack">${STRENGTHS.map((s, i) => `<article class="sc" style="--i:${i};background:${s.c}"><span class="no">${i + 1}</span><span class="kicker">${esc(s.k)}</span><h3>${esc(s.t)}</h3><ul>${s.li.map((l) => `<li>${esc(l)}</li>`).join('')}</ul><div class="go">${s.go.map(([r, l]) => `<a href="#${r}">${esc(l)} →</a>`).join('')}</div></article>`).join('')}</section>

<div class="label"><span class="kicker">HISTORY</span><h2>経歴。</h2><p>縦にスクロールすると、横に進みます。「調べる側」としての37年間が、いまの顧問業務の土台です。</p></div>
<section class="hs" data-scene="hscroll"><div class="pin"><div class="hT">${TL.map(([m, d, t, p, c]) => `<div class="pc" style="background:${c}"><span class="mono" aria-hidden="true">${esc(m)}</span><span class="role">${esc(d)}</span><h3 style="font-size:1.35rem">${esc(t)}</h3><p>${esc(p)}</p></div>`).join('')}</div><div class="hbar"><i></i></div></div></section>

<div class="label"><span class="kicker">TOPICS</span><h2>対応する分野。</h2><p>回る球体のキーワードが、平面に広がり、縦の一覧になります。</p></div>
<section class="sph" data-scene="sphere" data-words='${esc(JSON.stringify(WORDS))}' data-cats='${esc(JSON.stringify(CATS))}'><div class="pin"><canvas aria-hidden="true"></canvas>
  <div class="cap top"><h2>調査・システム・公益法人・申告まで</h2><p>下へスクロール</p></div>
  <div class="cap bot" style="opacity:0"><h2>ばらばらの悩みを、ひとつの窓口に</h2></div>
  <div class="cap top" style="opacity:0"><h2>分野を選んで、読み進める</h2><p>下へスクロール</p></div></div></section>

<section class="win" data-scene="window"><div class="pin">
  <div class="cur"><span class="kicker" style="color:var(--teal)">NEXT</span><h2>まず、いまの状況を確認する</h2><p>6つの質問に答えるだけです。</p></div>
  <div class="nxt"><span class="kicker">次の画面</span><h2>調査対象になりやすい傾向の目安が分かります</h2><p>質問に答えると、気になる点と次の一歩が表示されます。</p></div></div></section>
<section class="doors" data-scene="doors"><div class="pin"><div class="core"><h2>診断を、はじめましょう</h2><p>数分で答えられる簡易診断です。</p><a class="btn gold" href="#consult" id="go-consult">税務調査リスクを確かめる</a></div><div class="door l">税務調査</div><div class="door r">リスク診断</div></div></section>

<section class="consult" id="consult" data-bg="#e6ecf1"><div class="wrap"><span class="kicker" style="color:var(--teal)">CHECK</span><h2>簡易・税務調査リスク診断</h2><p class="note" style="font-size:.9rem">診断結果は参考情報であり、正式な税務判断ではありません。</p></div><div class="wrap"><div class="dg" id="dg"></div></div></section>

<div class="label"><span class="kicker">MAP</span><h2>すべてのページへ。</h2><p>気になるページを選んでください。ページが切り替わります。</p></div>
<div class="wrap" style="padding-bottom:30px"><div class="map">${[['#1f6a7a', '強み・業務・経歴', '比較・対象のお客様・年表', '/strength'], ['#a8710f', 'リスク診断', '6つの質問', '/consult'], ['#2f6f4f', 'よくあるご質問', 'Q&A', '/faq'], ['#c4553a', 'お問い合わせ', '無料相談', '/contact']].map(([c, n, s, r]) => `<div class="mapc" style="--ac:${c}"><h3>${esc(n)}</h3><small>${esc(s)}</small><a href="#${r}">開く</a></div>`).join('')}</div></div>
<section class="peek"><div class="wrap"><p class="gtext" data-fill>Contact</p><h3>まずは、無料相談から</h3><p>お問い合わせ先(電話・メール)は準備中です。</p></div></section>`;
  }

  const hero = (o) => `<section class="ms-hero" style="--ac:${o.color}"><div class="wrap"><div class="crumb"><a href="#/">ホーム</a> / ${esc(o.title)}</div><span class="kicker" style="color:#fff">${esc(o.kicker)}</span><h1>${o.title}</h1><p>${o.lead}</p></div><div class="big" aria-hidden="true">${esc(o.big)}</div></section>`;
  const PAGES = {
    strength: { title: '強み・業務・経歴', kicker: 'STRENGTH', big: 'STRENGTH', color: '#1f6a7a', lead: '一般的な事務所との違いと、国税局37年の経歴をまとめています。' },
    faq: { title: 'よくあるご質問', kicker: 'Q&A', big: 'Q&A', color: '#2f6f4f', lead: '顧問料・対応エリア・個人の申告などについて。' },
    contact: { title: 'お問い合わせ', kicker: 'CONTACT', big: 'CONTACT', color: '#c4553a', lead: 'まずは無料相談から。連絡先は準備中です。' }
  };
  async function render(path) {
    cleanup.forEach((f) => f()); cleanup = []; Scenes.destroy();
    const [a] = path.split('/').filter(Boolean);
    if (PAGES[a]) {
      const pg = PAGES[a]; view.innerHTML = hero(pg) + '<div id="s5"></div>'; Sakaguchi.mount($('s5'), { cleanup }, a); document.title = `${pg.title} | ${BRAND}`;
    } else {
      view.innerHTML = mainPage();
      const fxh = $('hero-fx'); if (fxh) { const c = FX.cubes(fxh, { height: 190 }); c.start(); cleanup.push(() => c.stop()); }
      Consult.mount($('dg'), { people: PEOPLE, sites: null, cleanup }, Sakaguchi.RISK);
      const gc = $('go-consult'); if (gc) gc.addEventListener('click', (e) => { e.preventDefault(); $('consult').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
      document.title = BRAND;
      if (a === 'consult') setTimeout(() => $('consult').scrollIntoView({ behavior: 'auto' }), 60);
    }
    document.querySelectorAll('#gh-nav a').forEach((l) => l.classList.toggle('on', l.dataset.r === '/' + (a || '')));
    Scenes.init(view);
  }
  const currentPath = () => (location.hash || '#/').slice(1) || '/';
  let first = true, busy = false;
  async function go() {
    if (busy) return; busy = true;
    const path = currentPath(), w = $('wipe');
    if (first || reduce) { await render(path); window.scrollTo(0, 0); }
    else {
      await w.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 380, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }).finished;
      await render(path); window.scrollTo(0, 0); view.focus({ preventScroll: true });
      await w.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 440, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }).finished;
      w.getAnimations().forEach((x) => x.cancel());
    }
    const wasFirst = first; first = false; busy = false;
    if (wasFirst && path === '/') Mode.ready.then(() => { if (Opening.should()) Opening.play(); });
  }
  async function versionCheck() {
    try {
      const r = await fetch('data/version.json?t=' + Date.now(), { cache: 'no-store' }), j = await r.json();
      if (j.v && j.v !== window.APP_VER) { const k = 'sakaguchiRetry'; if (sessionStorage.getItem(k) === j.v) return; sessionStorage.setItem(k, j.v); location.replace(location.pathname + '?r=' + j.v + location.hash); }
    } catch {}
  }
  function boot() {
    versionCheck(); Mode.init(); chrome();
    Mode.onChange = () => { render(currentPath()); };
    addEventListener('hashchange', () => { if (!location.hash || location.hash.startsWith('#/')) go(); });
    go();
  }
  boot();
})();
