(() => {
  'use strict';
  const { esc, wait, BRAND, PEOPLE, KIND, OFFICES, mapLink, monoC } = U;
  const $ = (id) => document.getElementById(id);
  const view = $('view');
  const reduce = Scenes.reduce;
  let SITES = null, PB = null, cleanup = [];
  const SITE_ORDER = ['uehara', 'sr', 'shafuku'];
  const norm = (s) => String(s).replace(/[\s　・、。!！?？「」()（）]/g, '');

  /* ============ 本文ブロック(①②③の本文)を、そのまま見やすく描く ============ */
  const KEYS = new Set(['事業所名', '代表者', '従業員数', '所在地', '業務内容', '受付時間', '事業内容']);
  const YEAR = /^(\d{4}年(～\d{4}年)?|現在)$/;
  const KV1 = /^(設立|人数|代表社員)\s+(.+)$/;
  function blocksHTML(blocks, pageLabel) {
    let secs = [], cur = null, i = 0;
    const open = (h) => { cur = { h: h || '', body: [] }; secs.push(cur); };
    const add = (x) => { if (!cur) open(''); cur.body.push(x); };
    const bl = blocks.slice();
    // 先頭の見出しがページ名と同じなら省く(ページの表紙に出すため)
    if (bl.length && /^h[12]$/.test(bl[0][0]) && (norm(bl[0][1]).includes(norm(pageLabel)) || norm(pageLabel).includes(norm(bl[0][1])))) bl.shift();
    let buf = [];
    const flushBuf = () => { if (buf.length) { add(`<p>${buf.join('<br>')}</p>`); buf = []; } };
    const TERM = /[。！？!?」）)]$/;
    while (i < bl.length) {
      const [t, x] = bl[i];
      const plain = t === 'p' && !KEYS.has(x) && !KV1.test(x) && !YEAR.test(x) && !/^[●・▼◆■]/.test(x) && !/^【.*】$/.test(x);
      if (!plain) flushBuf();
      if (t === 'h1' || t === 'h2' || t === 'h5') { open(x); i++; continue; }
      if (/^h[3-6]$/.test(t)) { add(`<h3>${esc(x)}</h3>`); i++; continue; }
      if (t === 'l') { const li = []; while (i < bl.length && bl[i][0] === 'l') li.push(`<li>${esc(bl[i++][1])}</li>`); add(`<ul>${li.join('')}</ul>`); continue; }
      if (KEYS.has(x)) { const v = []; i++; while (i < bl.length && bl[i][0] === 'p' && !KEYS.has(bl[i][1])) v.push(esc(bl[i++][1])); add(`<div class="kv"><b>${esc(x)}</b><div>${v.join('<br>')}</div></div>`); continue; }
      const m = KV1.exec(x); if (m && t === 'p') { add(`<div class="kv"><b>${esc(m[1])}</b><div>${esc(m[2])}</div></div>`); i++; continue; }
      if (YEAR.test(x)) { const items = []; while (i < bl.length && YEAR.test(bl[i][1])) { const y = bl[i++][1], d = []; while (i < bl.length && bl[i][0] === 'p' && !YEAR.test(bl[i][1]) && !KEYS.has(bl[i][1])) d.push(esc(bl[i++][1])); items.push(`<li><b>${esc(y)}</b><br>${d.join('<br>')}</li>`); } add(`<ul class="tl">${items.join('')}</ul>`); continue; }
      if (/^[●・]/.test(x)) { add(`<div class="bl">${esc(x.replace(/^[●・]\s*/, ''))}</div>`); i++; continue; }
      if (/^[▼◆■]/.test(x)) { add(`<p class="sub">${esc(x.replace(/^[▼◆■]\s*/, ''))}</p>`); i++; continue; }
      if (/^【.*】$/.test(x)) { add(`<p class="sub">${esc(x)}</p>`); i++; continue; }
      // 段落(「、」で終わる行は次の行とつなげ、短い行は文の終わりまでまとめる)
      let para = x; i++;
      while (/[、…]$/.test(para) && i < bl.length && bl[i][0] === 'p' && !/^[●・▼◆■【]/.test(bl[i][1]) && !KEYS.has(bl[i][1])) para += bl[i++][1];
      buf.push(esc(para));
      if (TERM.test(para) || para.length > 40 || buf.length >= 8) flushBuf();
    }
    flushBuf();
    return secs.filter((s) => s.h || s.body.length).map((s, k) => `<section class="sec" data-reveal style="--d:${Math.min(k, 3) * .05}s">${s.h ? `<h2>${esc(s.h)}</h2>` : ''}${s.body.join('')}</section>`).join('');
  }

  /* ============ 画面の枠(ヘッダー・メニュー・フッター) ============ */
  const NAV = [
    ['/', 'ホーム'], ['/uehara', '上原', '公認会計士'], ['/sakashita', '坂下', '公認会計士'], ['/honda', '本田', '税理士・社労士'], ['/sakaguchi', '坂口', '税理士'], ['/sr', '社労士法人', '日本綜合'], ['/shafuku', '社福サポート', '社会福祉法人'], ['/consult', 'お悩み診断'], ['/map', '全ページ']
  ];
  function chrome() {
    $('gh-brand').innerHTML = `${esc(BRAND)}<small>公認会計士・税理士・社会保険労務士</small>`;
    $('gh-nav').innerHTML = NAV.map(([r, l]) => `<a href="#${r}" data-r="${r}">${esc(l)}</a>`).join('');
    const grp = (t, rows) => `<h3>${t}</h3>${rows.map(([r, l, s]) => `<a href="#${r}">${esc(l)}${s ? `<small>${esc(s)}</small>` : ''}</a>`).join('')}`;
    $('menu').innerHTML =
      grp('MAIN', [['/', 'ホーム(総合)'], ['/consult', 'お悩み診断', 'まずはここから'], ['/map', '全ページ一覧']]) +
      grp('公認会計士', [['/uehara', '上原 佑介', '事務所サイト'], ['/sakashita', '坂下 藤男']]) +
      grp('税理士', [['/honda', '本田 智広'], ['/sakaguchi', '坂口 誠']]) +
      grp('社会保険労務士', [['/sr', '日本綜合社会保険労務士法人'], ['/yamada', '山田 抄織'], ['/shafuku', '社会福祉法人サポートセンター']]);
    const btn = $('gh-menu'), menu = $('menu');
    const setMenu = (o) => { menu.hidden = false; menu.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.textContent = o ? '閉じる' : 'メニュー'; document.body.style.overflow = o ? 'hidden' : ''; };
    btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    $('gf').innerHTML = `<div class="wrap"><h3>${esc(BRAND)}</h3><p>公認会計士・税理士・社会保険労務士の専門家チームです。拠点は次のとおりです(事務所により連絡先が異なります)。</p><div class="offs">${OFFICES.map((o) =>
      `<div class="off"><b>${esc(o.city)}</b>${esc(o.zip)}<br>${esc(o.addr)}<br>${o.tel.map(([n, t]) => `${n ? esc(n) + ' ' : ''}TEL <a href="tel:${t.replace(/-/g, '')}">${t}</a>`).join('<br>')}${o.fax ? `<br>FAX ${o.fax}` : ''}<br><a href="${mapLink(o.addr)}" target="_blank" rel="noopener">地図を開く</a></div>`).join('')}</div>
      <p><a href="#/map">全ページ一覧</a> / <a href="#/consult">お悩み診断</a> / <a href="#/" id="replay">オープニングをもう一度見る</a> / <a href="../../">ハブに戻る</a></p><p style="opacity:.6;font-size:.72rem">表示中の版: ${esc(window.APP_VER || '不明(古い表示です。再読み込みしてください)')}</p></div>`;
    $('replay').addEventListener('click', (e) => { e.preventDefault(); const go2 = () => { window.scrollTo(0, 0); Opening.play({ force: true }); }; if ((location.hash || '#/') !== '#/') { location.hash = '#/'; setTimeout(go2, 900); } else go2(); });
  }
  const setNav = (path) => document.querySelectorAll('#gh-nav a').forEach((a) => a.classList.toggle('on', a.dataset.r === path || (a.dataset.r !== '/' && path.startsWith(a.dataset.r + '/'))));

  /* ============ 共通パーツ ============ */
  const peopleChips = (ids) => `<div class="people">${ids.map((id) => { const p = PEOPLE[id]; return `<a class="pp" href="#${p.route}">${monoC(p)}<span><b>${esc(p.name)}</b><small>${esc(p.role)}</small></span></a>`; }).join('')}</div>`;
  const offices = () => `<div class="duo">${OFFICES.map((o) => `<div class="card"><b>${esc(o.city)}</b><br>${esc(o.zip)} ${esc(o.addr)}<br>${o.tel.map(([n, t]) => `${n ? esc(n) + ' ' : ''}TEL <a href="tel:${t.replace(/-/g, '')}">${t}</a>`).join('<br>')}${o.fax ? `<br>FAX ${o.fax}` : ''}${o.note ? `<br><span class="note">${esc(o.note)}</span>` : ''}<br><a href="${mapLink(o.addr)}" target="_blank" rel="noopener">地図を開く</a></div>`).join('')}</div>`;
  const hero = (o) => `<section class="ms-hero" style="--ac:${o.color}"><div class="wrap"><div class="crumb"><a href="#/">ホーム</a>${o.crumb || ''}</div>${o.kicker ? `<span class="kicker" style="color:#fff">${esc(o.kicker)}</span>` : ''}<h1>${o.title}</h1>${o.lead ? `<p>${o.lead}</p>` : ''}</div><div class="big" aria-hidden="true">${esc(o.big || '')}</div></section>`;
  function mailForm(opts) {
    return `<form class="form card" id="cf"><h3>メールで相談する</h3>${opts.length > 1 ? `<label>宛先<select name="to">${opts.map((o, i) => `<option value="${i}">${esc(o[0])}</option>`).join('')}</select></label>` : ''}<label>お名前<input name="name" required></label><label>メールアドレス<input type="email" name="email" required></label><label>ご相談内容<textarea name="msg" rows="4" required></textarea></label><button class="btn" type="submit">この内容で相談する</button><p class="note">送信するとメールの下書きが開きます。</p></form>`;
  }
  function bindForm(opts) {
    const f = $('cf'); if (!f) return;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(f), o = opts[Number(d.get('to') || 0)];
      const goal = FX.goal(U_goalHost(), { height: 170 });
      goal.play();
      setTimeout(() => { location.href = `mailto:${o[1]}?subject=${encodeURIComponent('【ホームページから】' + d.get('name'))}&body=${encodeURIComponent(`お名前: ${d.get('name')}\nメール: ${d.get('email')}\n\n${d.get('msg')}`)}`; }, reduce ? 200 : 1800);
    });
  }
  function U_goalHost() {
    let ov = $('goalov');
    if (!ov) { ov = document.createElement('div'); ov.id = 'goalov'; ov.className = 'goalov'; ov.innerHTML = '<div class="goalc"><div id="goalhost"></div><h3>ご相談ありがとうございます</h3><p class="note">メールの下書きを開きます。内容をご確認のうえ送信してください。</p><button class="btn ghost sm" type="button" id="goalx">閉じる</button></div>'; document.body.appendChild(ov); ov.addEventListener('click', (e) => { if (e.target === ov || e.target.id === 'goalx') ov.hidden = true; }); }
    ov.hidden = false; const h = $('goalhost'); h.replaceChildren(); return h;
  }
  const EMAIL = { sr: ['日本綜合社会保険労務士法人・社福サポート', 'info@nihonsogo-sr.com'], sakashita: ['坂下 藤男', 'fsakashita@uehara-cpa.com'] };

  /* ============ トップ(総合) ============ */
  const WORDS = [['金融機関対応', 0], ['M&A', 0], ['事業承継', 0], ['事業計画', 0], ['法定監査', 0], ['任意監査', 0], ['上場支援', 0], ['補助金', 0], ['会社の健康診断', 0], ['廃業支援', 0], ['不正調査', 0], ['デューデリジェンス', 0],
    ['税務調査', 1], ['国際税務', 1], ['申告', 1], ['査察', 1], ['システム監査', 1], ['公益法人会計', 1], ['相続', 1], ['法人税', 1], ['消費税', 1],
    ['給与計算', 2], ['就業規則', 2], ['社会保険手続', 2], ['行政調査対応', 2], ['助成金', 2], ['換価の猶予', 2], ['労務相談', 2], ['クラウド労務', 2],
    ['処遇改善等加算', 3], ['社会福祉法人会計基準', 3], ['支払資金', 3], ['内部研修', 3], ['経営診断', 3], ['ワンストップ', 4]];
  const CATS = [['公認会計士', '#1f6a7a'], ['税理士', '#a8710f'], ['社会保険労務士', '#2f6f4f'], ['社会福祉法人', '#c4553a'], ['総合', '#6a4c93']];
  const STRENGTHS = [
    { c: '#1f6a7a', k: '公認会計士', t: '金融機関対応から、M&A・事業承継・監査まで', li: ['金融機関対応・資金繰り・事業計画の策定', 'M&A・事業承継・廃業支援・会社の健康診断', '法定監査・任意監査・上場支援、補助金の申請', '監査、税務、会計、不正調査等'], go: [['/uehara', '上原 佑介'], ['/sakashita', '坂下 藤男']] },
    { c: '#a8710f', k: '税理士', t: '多資格の税理士と、国税の内側を知る税理士', li: ['税理士・社会保険労務士・行政書士のトリプルライセンス(本田)', '法人税法・所得税法・消費税法の3科目で官報合格(本田)', '国税局37年のキャリアを活かした税務調査対応(坂口)'], go: [['/honda', '本田 智広'], ['/sakaguchi', '坂口 誠']] },
    { c: '#2f6f4f', k: '社会保険労務士', t: '大規模給与計算・行政調査対応・資金繰り改善', li: ['数百人規模の給与計算が可能', '数々の各種行政調査を乗り越えてきた実績', '社会保険料の資金繰り改善(換価の猶予)', '複数名のチーム体制・多数のITツール'], go: [['/sr', '社労士法人'], ['/yamada', '山田 抄織'], ['/honda', '本田 智広']] },
    { c: '#c4553a', k: '社会福祉法人', t: '処遇改善等加算・社会福祉法人会計基準に完全対応', li: ['給与計算・労務管理(処遇改善等加算にも対応)', '社会福祉法人会計基準に沿った会計サポート', '経営診断・処遇改善等加算取得サポート・内部研修'], go: [['/shafuku', '社福サポートセンター']] },
    { c: '#6a4c93', k: 'ワンストップ', t: '労務・会計・税務を、ひとつの窓口で', li: ['併設の会計事務所には、公認会計士・税理士・中小企業診断士・ITの専門家等が在籍', '労務だけでなく、会計・税務といった経営のあらゆる課題にワンストップで対応可能'], go: [['/consult', 'お悩み診断'], ['/map', '全ページ一覧']] }
  ];
  function mapHTML() {
    const card = (c, n, sub, links) => `<div class="mapc" style="--ac:${c}"><h3>${esc(n)}</h3><small>${esc(sub)}</small>${links.map(([r, l]) => `<a href="#${r}">${esc(l)}</a>`).join('')}</div>`;
    let h = '';
    SITE_ORDER.forEach((sid) => { const s = SITES[sid]; h += card(s.accent, s.name, s.kind, s.pages.map((p) => [`/${sid}${p.id === 'home' ? '' : '/' + p.id}`, p.label])); });
    h += card('#2b8a9c', '坂下 藤男(公認会計士・税理士)', '新規ページ(名刺の内容)', [['/sakashita', '坂下 藤男']]);
    h += card('#8a5a12', '本田 智広', '税理士・社会保険労務士・行政書士', [['/honda', '本田 智広']]);
    h += card('#a8710f', '坂口誠税理士事務所', '税理士 坂口 誠', [['/sakaguchi', '坂口 誠 トップ']]);
    h += card('#2f6f4f', '山田 抄織', '社会保険労務士', [['/yamada', '山田 抄織']]);
    return `<div class="map">${h}</div>`;
  }
  function mainPage() {
    const nums = [['2', '公認会計士', '上原・坂下', 2], ['2', '税理士', '本田・坂口', 2], ['2', '社会保険労務士', '山田・本田', 2], ['7', '併設の事務所・法人', '名刺に記載', 7]];
    return `
<section class="hero" data-bg="#0f1f33" data-dark="1"><div class="wrap">
  <span class="kicker" style="color:#ffd36b">神戸・大阪・沖縄・東京</span>
  <h1>会計・税務・労務を、<br><em>ひとつのチーム</em>で。</h1>
  <p class="lead">公認会計士・税理士・社会保険労務士のパートナーが連携します。お悩みをお聞きして、最適な専門家と、見るべきページをご案内します。</p>
  <div class="nums">${nums.map(([n, a, b]) => `<div class="num"><b data-count="${n}">0</b><span>${a}<br>${b}</span></div>`).join('')}</div>
  <p style="margin-top:14px"><a class="btn gold" href="#/consult">お悩みから探す(診断)</a> <a class="btn ghost" href="#/map" style="color:#fff">全ページを見る</a></p>
</div><div class="hero-fx fx-on-dark" id="hero-fx" aria-hidden="true"></div><p class="hint">SCROLL ↓</p></section>

<div class="label"><span class="kicker">STRENGTH</span><h2>組織の強みを、一目で。</h2><p>5つの強みが重なって、ひとつの総合力になります。下へスクロールすると、次の強みが重なります。</p></div>
<section class="stack" data-scene="stack">${STRENGTHS.map((s, i) => `<article class="sc" style="--i:${i};background:${s.c}"><span class="no">${i + 1}</span><span class="kicker">${esc(s.k)}</span><h3>${esc(s.t)}</h3><ul>${s.li.map((l) => `<li>${esc(l)}</li>`).join('')}</ul><div class="go">${s.go.map(([r, l]) => `<a href="#${r}">${esc(l)} →</a>`).join('')}</div></article>`).join('')}</section>

<div class="label"><span class="kicker">PARTNERS</span><h2>5名の専門家。</h2><p>縦にスクロールすると、横に進みます。カードを押すと、それぞれのページへ。</p></div>
<section class="hs" data-scene="hscroll"><div class="pin"><div class="hT">${Object.values(PEOPLE).map((p) => `<a class="pc" href="#${p.route}" style="background:${p.color}"><span class="mono" aria-hidden="true">${esc(p.mono)}</span><span class="role">${esc(p.role)}</span><h3>${esc(p.name)}</h3><p>${esc(p.line)}</p><span class="more">ページを見る →</span></a>`).join('')}</div><div class="hbar"><i></i></div></div></section>

<div class="label"><span class="kicker">TOPICS</span><h2>悩みの数だけ、専門分野がある。</h2><p>回る球体のキーワードが、平面に広がり、縦の一覧になります。</p></div>
<section class="sph" data-scene="sphere" data-words='${esc(JSON.stringify(WORDS))}' data-cats='${esc(JSON.stringify(CATS))}'><div class="pin"><canvas aria-hidden="true"></canvas>
  <div class="cap top"><h2>悩みの数だけ、専門分野がある</h2><p>下へスクロール</p></div>
  <div class="cap bot" style="opacity:0"><h2>ばらばらの悩みを、ひとつの窓口に</h2></div>
  <div class="cap top" style="opacity:0"><h2>分野を選んで、読み進める</h2><p>下へスクロール</p></div></div></section>

<section class="win" data-scene="window"><div class="pin">
  <div class="cur"><span class="kicker" style="color:var(--teal)">NEXT</span><h2>まず、いまの悩みを選ぶ</h2><p>6つの入口から、近いものをひとつ選ぶだけです。</p></div>
  <div class="nxt"><span class="kicker">次の画面</span><h2>数分で、状況の目安が分かります</h2><p>質問に答えると、気になる点と、次の一歩、そして相談できる専門家が表示されます。</p></div></div></section>
<section class="doors" data-scene="doors"><div class="pin"><div class="core"><h2>診断を、はじめましょう</h2><p>数分で答えられる簡易診断です。結果から、各専門家のページへ進めます。</p><a class="btn gold" href="#consult" id="go-consult">いま一番の悩みを選ぶ</a></div><div class="door l">お悩み</div><div class="door r">から</div></div></section>

<section class="consult" id="consult" data-bg="#e6ecf1"><div class="wrap"><span class="kicker" style="color:var(--teal)">CONSULT</span><h2>ご相談は、ここから。</h2><p class="note" style="font-size:.9rem">診断結果は参考情報であり、正式な判断ではありません。</p></div><div class="wrap"><div class="dg" id="dg"></div></div></section>

<div class="label"><span class="kicker">MAP</span><h2>すべてのページへ。</h2><p>各事務所のページ、専門家のページへ、ここから移動できます。</p></div>
<div class="wrap" style="padding-bottom:30px">${mapHTML()}</div>
<section class="peek"><div class="wrap"><p class="gtext" data-fill>Contact</p><h3>お問い合わせ・拠点</h3><p>各事務所のお問い合わせは、それぞれのページからお願いします。拠点は、このページ下部をご覧ください。</p></div></section>`;
  }

  /* ============ 事務所サイト(①上原 ②社労士法人 ③社福サポート) ============ */
  const HOME_LEAD = {
    uehara: '経営者の一番身近な相談相手。金融機関対応・M&A・事業承継・財務・経理・人事の総合的なアウトソーシングに強い、中小企業専門のコンサルティング事務所。',
    sr: '会社を創る、どんな規模の会社にも対応。ＤＸ化導入もご相談ください。',
    shafuku: '最新の処遇改善等加算制度及び社会福祉法人会計基準に完全に対応した高品質なサービスを提供しています。'
  };
  function sitePage(sid, pid) {
    const s = SITES[sid], page = s.pages.find((p) => p.id === pid) || s.pages[0], idx = s.pages.indexOf(page), nxt = s.pages[idx + 1];
    const href = (p) => `#/${sid}${p.id === 'home' ? '' : '/' + p.id}`;
    const isHome = page.id === 'home';
    let body = '';
    if (page.id === 'contact') body = contactBody(sid, page);
    else if (page.id === 'access' && sid === 'uehara') body = `<section class="sec" data-reveal><h2>アクセス</h2>${offices()}</section>`;
    else body = blocksHTML(page.blocks, page.label);
    let extra = '';
    if (sid === 'uehara' && page.id === 'services') extra = `<div class="cards">${s.pages.filter((p) => p.id.startsWith('s-')).map((p) => `<a class="lc" href="${href(p)}" style="--ac:${s.accent}" data-reveal><b>${esc(p.label)}</b><small>詳しく見る →</small></a>`).join('')}</div>`;
    if (isHome) extra = `<div class="cards">${s.pages.filter((p) => p.id !== 'home' && !p.id.startsWith('s-') && p.id !== 'privacy').map((p) => `<a class="lc" href="${href(p)}" data-reveal><b>${esc(p.label)}</b><small>ページを見る →</small></a>`).join('')}</div>`;
    return `${hero({ color: s.accent, crumb: ` / ${esc(s.name)}${isHome ? '' : ' / ' + esc(page.label)}`, kicker: s.kind, title: isHome ? esc(s.name) : esc(page.label), lead: isHome ? esc(HOME_LEAD[sid]) : esc(s.name), big: isHome ? s.short : page.label })}
<nav class="tabs" aria-label="${esc(s.name)}のページ">${s.pages.map((p) => `<a href="${href(p)}" class="${p === page ? 'on' : ''}" style="--ac:${s.accent}">${esc(p.label)}</a>`).join('')}</nav>
<div class="wrap body" style="--ac:${s.accent}">${body}${extra}${peopleChips(s.people)}</div>
${nxt ? `<a class="next" href="${href(nxt)}"><div class="wrap"><small>NEXT PAGE</small><p class="gtext" data-fill>${esc(nxt.label)}</p></div></a>` : `<a class="next" href="#/map"><div class="wrap"><small>BACK TO MAP</small><p class="gtext" data-fill>全ページへ</p></div></a>`}`;
  }
  function contactBody(sid, page) {
    const em = sid === 'uehara' ? [] : [EMAIL.sr];
    const lines = page.blocks.filter(([t, x]) => !/^(お名前|会社名|メールアドレス|電話番号|メッセージ|コードを入力|プライバシーポリシーが適用|メモ|\*)/.test(x)).map(([, x]) => x);
    const intro = sid === 'uehara' ? lines.filter((x) => x.length > 12) : [];
    return `<section class="sec" data-reveal><h2>お問い合わせ</h2>${intro.map((x) => `<p>${esc(x)}</p>`).join('')}${sid === 'uehara' ? '<p>お電話の場合は、下記の拠点の電話番号へ(受付時間 10:00〜17:00。ご来訪の際は一度メールもしくは電話にて予約ください)。</p>' : ''}${offices()}</section>${em.length ? mailForm(em) : '<p class="note">メールでのお問い合わせ先アドレスは、準備中です。お電話でお問い合わせください。</p>'}`;
  }

  /* ============ 人物ページ ============ */
  function personBlocksPage(id, blocks, extra) {
    const p = PEOPLE[id];
    return `<section class="ms-hero" style="--ac:${p.color}"><div class="wrap"><div class="crumb"><a href="#/">ホーム</a> / ${esc(p.name)}</div><div class="who">${monoC(p)}<div><h1>${esc(p.name)}</h1><small>${esc(p.role)}</small>${p.en ? `<small>${esc(p.en)}</small>` : ''}</div></div><p>${esc(p.line)}</p></div><div class="big" aria-hidden="true">${esc(p.mono)}</div></section>
<div class="wrap body" style="--ac:${p.color}">${blocksHTML(blocks, p.name)}${extra || ''}</div>`;
  }
  function yamadaPage() {
    const bl = PB.yamada_profile.concat([['h2', '事務所情報(日本綜合社会保険労務士法人)']], PB.yamada_office);
    return personBlocksPage('yamada', bl, `<div class="cards"><a class="lc" href="#/sr" style="--ac:#2f6f4f"><b>日本綜合社会保険労務士法人</b><small>事務所のページへ →</small></a><a class="lc" href="#/shafuku" style="--ac:#d9684a"><b>社会福祉法人サポートセンター</b><small>社福サポートのページへ →</small></a></div>`);
  }
  function hondaPage() {
    return personBlocksPage('honda', PB.honda_profile, `<div class="cards"><a class="lc" href="#/sr" style="--ac:#2f6f4f"><b>日本綜合社会保険労務士法人</b><small>社労士法人のページへ →</small></a><a class="lc" href="#/shafuku/operator" style="--ac:#d9684a"><b>社福サポート 運営事業者情報</b><small>本田智広税理士事務所が共同運営 →</small></a></div>`);
  }
  function sakashitaPage() {
    const p = PEOPLE.sakashita;
    const career = ['松山商科大学経営学部卒業後、朝日監査法人(現・あずさ監査法人)に入所。', 'その後、監査法人三優会計社(現・三優監査法人)に入所し、社員、大阪事務所長を歴任。', '平成17年に坂下公認会計士事務所を開設。', '公認会計士・税理士・公認不正検査士として、監査、税務、会計、不正調査等に従事。'];
    const tags = ['公認会計士', '税理士', '公認不正検査士'];
    const co = [['公認会計士上原佑介事務所', '#/uehara'], ['上原佑介税理士事務所', '#/uehara'], ['Atrreコンサルティング株式会社', ''], ['日本綜合社会保険労務士法人', '#/sr'], ['本田智広税理士事務所', '#/honda'], ['本田智広行政書士事務所', '#/honda'], ['坂下公認会計士事務所', '']];
    return `<section class="ms-hero" style="--ac:${p.color}"><div class="wrap"><div class="crumb"><a href="#/">ホーム</a> / ${esc(p.name)}</div><span class="kicker" style="color:#fff">パートナー</span><div class="who">${monoC(p)}<div><h1>${esc(p.name)}</h1><small>${esc(p.en)}</small></div></div><div class="chips">${tags.map((t) => `<span class="chip">${t}</span>`).join('')}</div></div><div class="big" aria-hidden="true">藤</div></section>
<div class="wrap body" style="--ac:${p.color}">
<section class="sec" data-reveal><h2>略歴</h2><ul class="tl">${career.map((c, i) => `<li data-reveal style="--d:${i * .08}s">${esc(c)}</li>`).join('')}</ul></section>
<section class="sec" data-reveal><h2>併設事務所</h2><p class="note">公認会計士 上原佑介事務所に所属するパートナーとして、次の事務所・法人と同じ拠点で活動しています。</p><ul class="tag-list">${co.map(([n, h]) => `<li>${h ? `<a href="${h}" style="text-decoration:none">${esc(n)} →</a>` : esc(n)}</li>`).join('')}</ul></section>
<section class="sec" data-reveal><h2>連絡先</h2><div class="duo"><div class="card"><b>神戸</b><br>〒651-0088 神戸市中央区小野柄通3-2-22 AIG神戸ビル7階<br>TEL <a href="tel:0788553700">078-855-3700</a><br><a href="${mapLink('神戸市中央区小野柄通3-2-22 AIG神戸ビル')}" target="_blank" rel="noopener">地図を開く</a></div><div class="card"><b>大阪</b><br>〒530-0001 大阪市北区梅田1-1-3 大阪駅前第3ビル11階14号室<br>TEL <a href="tel:0663441120">06-6344-1120</a><br><a href="${mapLink('大阪市北区梅田1-1-3 大阪駅前第3ビル')}" target="_blank" rel="noopener">地図を開く</a></div></div><p>E-mail: <a href="mailto:${EMAIL.sakashita[1]}">${EMAIL.sakashita[1]}</a></p></section>
${mailForm([EMAIL.sakashita])}${peopleChips(['uehara', 'honda', 'yamada', 'sakaguchi'])}</div>`;
  }

  /* ============ 全ページ一覧 ============ */
  function mapPage() { return `${hero({ color: '#12263f', title: '全ページ一覧', lead: 'このサイトのすべてのページへ、ここから移動できます。', kicker: 'MAP', big: 'MAP' })}<div class="wrap body" style="padding-bottom:50px">${mapHTML()}</div>`; }

  /* ============ ルーティング ============ */
  async function render(path) {
    cleanup.forEach((f) => f()); cleanup = []; Scenes.destroy();
    const parts = path.split('/').filter(Boolean); let html = '', title = '', after = null;
    const [a, b] = parts;
    if (!a || a === 'consult') { html = mainPage(); title = ''; after = () => { mountMain(); if (a === 'consult') setTimeout(() => $('consult').scrollIntoView({ behavior: 'auto' }), 60); }; }
    else if (SITES[a]) { const pg = SITES[a].pages.find((p) => p.id === (b || 'home')); html = sitePage(a, b || 'home'); title = SITES[a].name + (pg && pg.id !== 'home' ? ' ' + pg.label : ''); after = () => { if (a !== 'shafuku' || b !== 'x') bindContact(a, b); }; }
    else if (a === 'sakashita') { html = sakashitaPage(); title = '坂下 藤男'; after = () => bindForm([EMAIL.sakashita]); }
    else if (a === 'honda') { html = hondaPage(); title = '本田 智広'; }
    else if (a === 'yamada') { html = yamadaPage(); title = '山田 抄織'; }
    else if (a === 'sakaguchi') { html = '<div id="s5"></div>'; title = '坂口 誠'; after = () => Sakaguchi.mount($('s5'), { cleanup }); }
    else if (a === 'map') { html = mapPage(); title = '全ページ一覧'; }
    else { html = mainPage(); after = mountMain; }
    view.innerHTML = html; if (after) after();
    document.title = `(工事中) ${title ? title + ' | ' : ''}${BRAND}`;
    setNav('/' + (a === 'consult' ? 'consult' : a || '')); if (!a) setNav('/');
    Scenes.init(view);
  }
  function bindContact(sid, pid) { if (pid === 'contact' && sid !== 'uehara') bindForm([EMAIL.sr]); }
  function mountMain() {
    const fxh = $('hero-fx'); if (fxh) { const c = FX.cubes(fxh, { height: 190 }); c.start(); cleanup.push(() => c.stop()); }
    const dg = $('dg'); if (dg) Consult.mount(dg, { people: PEOPLE, sites: SITES, cleanup });
    const gc = $('go-consult'); if (gc) gc.addEventListener('click', (e) => { e.preventDefault(); $('consult').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
  }
  let first = true, busy = false;
  async function go() {
    if (busy) return; busy = true;
    const path = (location.hash || '#/').slice(1) || '/';
    const w = $('wipe');
    if (first || reduce) { await render(path); window.scrollTo(0, 0); }
    else {
      await w.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 380, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }).finished;
      await render(path); window.scrollTo(0, 0); view.focus({ preventScroll: true });
      await w.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 440, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }).finished;
      w.getAnimations().forEach((x) => x.cancel());
    }
    const wasFirst = first; first = false; busy = false;
    if (wasFirst && (path === '/' || path === '/consult') && Opening.should()) Opening.play();
  }
  async function versionCheck() {
    try {
      const r = await fetch('data/version.json?t=' + Date.now(), { cache: 'no-store' }), j = await r.json();
      if (j.v && j.v !== window.APP_VER) {
        const k = 'sogoRetry'; if (sessionStorage.getItem(k) === j.v) return;
        sessionStorage.setItem(k, j.v); location.replace(location.pathname + '?r=' + j.v + location.hash);
      }
    } catch {}
  }
  async function boot() {
    versionCheck();
    try {
      const [s, p] = await Promise.all([fetch('data/sites.json', { cache: 'no-cache' }).then((r) => r.json()), fetch('data/people_blocks.json', { cache: 'no-cache' }).then((r) => r.json())]);
      SITES = s; PB = p;
    } catch (e) { view.innerHTML = '<div class="wrap" style="padding:60px 20px"><p>データを読み込めませんでした。</p></div>'; return; }
    chrome();
    addEventListener('hashchange', () => { if (!location.hash || location.hash.startsWith('#/')) go(); });
    go();
  }
  boot();
})();
