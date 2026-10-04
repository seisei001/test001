/* ⑤ 坂口誠税理士事務所(ハブの「税理士事務所PRサイト」の内容を、演出つきで作り直したもの。未確定の部分は「準備中」) */
window.Sakaguchi = (() => {
  'use strict';
  const { esc, PEOPLE } = U;
  const reduce = FX.reduce;
  const P = '#a8710f';
  const CORE = [
    ['🏛️', '国税の内部構造を理解している税理士', '調査官の思考パターン、勘定科目の着眼点、資料の評価基準を熟知。国税内部のシステム・データ構造についても深い理解を持つ。'],
    ['🔍', '調査に強い税理士', '調査官が疑うポイントを事前に予測。証憑 → 仕訳 → 税務判断を一気通貫で構造化し、調査対応を型にする。'],
    ['🤖', 'AIを税務実務に統合できる技術者', 'Transformerや重み行列などAIの構造を研究者レベルで理解。現在、複数のAIプロバイダを横断利用できる会話ログ×RAG基盤「raglog」(開発中・コンセプト)を構築している。将来的には条文ベースのRAGなど、税務実務への応用を目指している。']
  ];
  const CMP = [
    ['🔍', '税務調査対応', '調査の連絡が来てから資料をそろえ、当日は調査官の質問に受け身で対応することが多い。', '国税局で税務調査官・国際税務調査・査察部国際専門官などを歴任。税理士登録後、通常の税務調査は対応した案件すべてが申告是認。査察部による捜査(査察)を受けた案件では、不起訴という形で立件を阻止した実績もある。'],
    ['🤖', 'システム・AI活用', '紙の資料や手作業でのチェックが中心で、システムやAIの活用相談までは踏み込みにくい。', '国税局の大型コンピュータのプログラマー・システムエンジニアを経験し、システム監査手法を用いた大規模法人の調査も担当。近年はTransformerや重み行列などAIの構造についても研究者レベルの理解を深め、Gemini・Claude・ChatGPTを横断利用できるRAG基盤「raglog」を開発中。'],
    ['📈', '事業再生', '申告業務が中心で、金融機関との交渉や再生計画づくりは専門外としていることが多い。', '商工会議所等からの依頼を中心に、事業再生を専門に手がける公認会計士 上原佑介がパートナーとして在籍。再生計画の策定から実行まで伴走する。'],
    ['🏢', '公益法人対応', '公益法人特有の会計基準や認定事務に対応できる事務所は限られている。', '国税局在籍時には消費税における「固有法人」(公益法人等)の申告実務に携わり、税理士登録後は公益法人の申請承認・新会計基準への移行に関する事務にも対応。一般企業とは異なる会計処理にも対応可能。']
  ];
  const TL = [
    ['🏛️', '昭和61年(1986年)4月1日', '大阪国税局に入庁', 'その後4年間、中小企業の税務調査を担当。'],
    ['🖥️', '在職中', '国税局の大型コンピュータのプログラマー・システムエンジニアに', 'その後、システム監査手法を用いた大規模法人の税務調査を担当。'],
    ['🌏', '在職中', '国際税務調査、査察部国際専門官などを歴任', 'あわせて、消費税における「固有法人」(公益法人等)の申告実務にも携わる。'],
    ['📇', '令和5年(2023年)7月10日', '大阪国税局を退職、税理士登録', '37年3ヶ月の国税局でのキャリアを経て退職し、税理士として活動を開始。'],
    ['✅', '税理士登録後の実績', '査察(捜査)対応で不起訴、通常の税務調査は全件申告是認', '査察部による捜査を受けた案件に対応し、不起訴という形で立件を阻止。あわせて他二社の税務調査にも対応し、通常の税務調査はすべて申告是認となっている。公益法人の申請承認・新会計基準への移行に関する事務にも従事。中小企業の設立支援(記帳〜決算書〜申告書まで一貫対応)、相続税申告(数件)、個人所得税申告(数十件)、法人税申告(数十件)も担当。'],
    ['🤖', '現在', 'AIを活用した業務効率化にも取り組む', 'Transformerや重み行列などAIの構造について研究者レベルの理解を持ち、Gemini・Claude・ChatGPTを横断利用できる会話ログ×RAG基盤「raglog」(開発中)を構築。将来的には条文ベースのRAGなど、税務実務への応用も目指している。'],
    ['🏢', '令和8年(2026年)10月1日', '兵庫県神戸市に「坂口誠税理士事務所」を開業', '上原佑介公認会計士事務所・上原佑介税理士事務所とパートナーとして、同じ事務所で活動をスタート。']
  ];
  const STEPS = [
    ['STEP 1. 現状把握・財務分析', '決算書・試算表・資金繰り表をもとに、現状の財務状態と資金繰りの見通しを整理します。税務上のリスクや未処理の論点もあわせて洗い出します。'],
    ['STEP 2. 再生計画の策定', '債務免除益・欠損金の活用など税務面を踏まえながら、実行可能な再生計画(数値計画・スケジュール)を一緒に組み立てます。'],
    ['STEP 3. 金融機関との調整', '再生計画の説明資料づくりから、金融機関との交渉の進め方まで伴走します。必要に応じて他の専門家(弁護士等)とも連携します。'],
    ['STEP 4. 実行支援・モニタリング', '計画実行後も、月次の状況を確認しながら計画との差異を分析し、必要な軌道修正を継続的にサポートします。']
  ];
  const FAQ = [
    ['顧問料はどのくらいですか?', '会社の規模や依頼内容によって異なります。まずは無料相談でお気軽にお問い合わせください。(料金体系は準備中です)'],
    ['対応エリアはどこですか?', 'オンライン面談を中心に全国対応しています。(対応エリアは準備中です)'],
    ['事業再生の相談も初回無料ですか?', 'はい、初回のご相談は無料で承っています。現状をお伺いしたうえで、上原佑介より支援内容をご提案します。'],
    ['個人の確定申告も依頼できますか?', '対応可能です。相続税申告・個人の所得税申告の実績もございます。']
  ];
  const RISK = {
    title: '簡易・税務調査リスク診断', partner: 'tax',
    intro: '6つの質問に答えると、調査対象になりやすい傾向を簡易チェックできます。あくまで参考情報であり、正式な税務判断ではありません。',
    disclaimer: '※ この診断は一般的な傾向をもとにした簡易チェックであり、正式な税務判断・保証ではありません。',
    questions: [
      ['税務署への提出書類(申告書・決算書)の作成体制は?', [['顧問税理士に一任し、内容も共有・確認している', 0], ['自社で作成し、税理士のチェックは受けていない', 2], ['自己流で作成している', 3]]],
      ['現金での取引(現金商売・経費の現金精算など)の割合は?', [['ほとんどない', 0], ['一部ある', 1], ['多い', 2]]],
      ['直近で税務調査を受けたのはいつ頃ですか?', [['5年以内に受けた', 1], ['5〜9年前、または一度も受けたことがない(開業5年以上)', 2], ['10年以上前、または開業から一度も接触がない', 3]]],
      ['ここ数年の売上・利益の推移は?', [['安定して推移している', 0], ['大きく増減した年がある', 2]]],
      ['役員報酬の変更や、同族間・関係会社間の取引はありますか?', [['特にない', 0], ['ある(役員報酬変更・同族間取引など)', 2]]],
      ['インボイス制度・消費税の課税事業者選択への対応状況は?', [['税理士と相談のうえ、適切に対応済み', 0], ['自分で対応したが、あまり自信がない', 2]]]
    ].map(([text, os]) => ({ text, synergy: false, options: os.map(([label, score]) => ({ label, score, tags: ['tax'] })) })),
    results: [
      { min: 0, max: 3, level: 'リスク傾向: 低め', message: '大きな懸念材料は少なそうです。とはいえ、日頃の記帳・証憑管理を継続することが最大の予防策です。定期的な顧問チェックをおすすめします。', next_action: 'ご相談は、このページ下部のお問い合わせからどうぞ。' },
      { min: 4, max: 7, level: 'リスク傾向: 中程度', message: 'いくつか、調査官が着目しやすいポイントが見られます。決算前のタイミングで一度、国税局出身の税理士 坂口誠によるセルフチェックを受けておくと安心です。', next_action: 'ご相談は、このページ下部のお問い合わせからどうぞ。' },
      { min: 8, max: 99, level: 'リスク傾向: 高め', message: '複数の項目で、税務調査時に指摘を受けやすい傾向が見られます。査察(捜査)対応まで経験した坂口誠が、早めの記帳・申告内容の見直しをサポートします。', next_action: 'ご相談は、このページ下部のお問い合わせからどうぞ。' }
    ]
  };

  function mount(el, ctx) {
    el.innerHTML = `
<section class="s5-hero"><div class="wrap">
  <div class="crumb" style="font-size:.78rem;opacity:.85"><a href="#/" style="color:#fff">ホーム</a> / 坂口 誠</div>
  <span class="s5-badge">2026年10月1日 兵庫県神戸市に開業</span>
  <h1>税務調査への「備え」も、<br>事業の「立て直し」も。<br>ふたりの専門家が力になります。</h1>
  <p class="lead">国際税務調査・査察部国際専門官を歴任した税理士 坂口誠と、商工会議所等からの依頼で事業再生に取り組む公認会計士 上原佑介。ひとつの事務所で、経営者の「守り」と「立て直し」の両方を支えます。</p>
  <p><a class="btn gold" href="#risk" id="to-risk">無料の税務調査リスク診断を試す</a></p>
  <div class="stats" id="s5stats">
    <div class="stat"><span class="ic">🏛️</span><b data-count="37" data-suffix="年">0</b><span class="l">国税局でのキャリア(調査官・SE・国際専門官等)</span></div>
    <div class="stat"><span class="ic">📄</span><b data-count="100" data-suffix="%">0</b><span class="l">税理士登録後に対応した税務調査の申告是認率</span></div>
    <div class="stat"><span class="ic">🛡️</span><b>不起訴</b><span class="l">査察部による捜査(査察)にも対応し、立件を阻止した実績</span></div>
  </div></div></section>
<div class="wrap body" style="--ac:${P}">
  <section class="sec" data-reveal><span class="kicker">CORE</span><h2>坂口誠の専門性</h2><p>「国税の内部構造」「AI」「税務調査対応」。3つが重なるところに、この事務所ならではの価値があります。</p>
    <div class="duo">${CORE.map(([i, t, d]) => `<div class="card" data-reveal><p style="font-size:1.6rem;margin:0">${i}</p><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
    <h3>ご提供できること</h3><ul><li>条文・通達・実務を統合した「根拠ある税務判断」</li><li>調査対応の構造化(論点予測・資料整理・一貫性)</li><li>中小企業の経営を長期的に支える顧問サービス</li></ul></section>
  <section class="sec" data-reveal><span class="kicker">STRENGTH</span><h2>この事務所ならではの強み</h2><p>タブを切り替えて、違いを確認してください。</p>
    <div class="tabs2" id="cmp-tabs">${CMP.map((c, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}">${c[0]} ${esc(c[1])}</button>`).join('')}</div><div id="cmp-body"></div></section>
  <section class="sec" data-reveal><span class="kicker">HISTORY</span><h2>坂口誠の経歴</h2><p>「調査する側」としての37年間が、今の税務顧問業務のベースになっています。</p>
    <ul class="tl">${TL.map(([i, w, t, d], k) => `<li data-reveal style="--d:${k % 3 * .06}s"><small class="note">${i} ${esc(w)}</small><h3 style="margin:2px 0;color:var(--fg)">${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul></section>
  <section class="sec" data-reveal><span class="kicker">CLIENTS</span><h2>こんな方をサポートしています</h2>
    <div class="duo"><div class="card"><h3>🏢 中小企業の経営者の方</h3><ul><li>税務調査で指摘を受けないか不安がある</li><li>顧問税理士に相談しても、申告書の作成以上のことをしてくれない</li><li>システムや記帳の仕組みから見直したい</li><li>AIやシステムを活用した業務効率化を相談したい</li></ul><p class="note">担当:税理士 坂口誠</p></div>
    <div class="card"><h3>📈 事業再生に取り組む企業の方</h3><ul><li>資金繰りが厳しく、金融機関との交渉方法が分からない</li><li>商工会議所等から再生支援の専門家を紹介してほしいと言われた</li><li>再生計画の策定から実行まで一緒に伴走してほしい</li></ul><p class="note">担当:公認会計士 上原佑介 <a href="#/uehara">上原のページ →</a></p></div></div></section>
  <section class="sec" data-reveal><span class="kicker">REVIVAL</span><h2>事業再生支援の進め方</h2><p>公認会計士 上原佑介を中心に進める、事業再生支援の流れです。ステップを選ぶと詳しい内容が確認できます。</p>
    <div class="stp" id="stp">${STEPS.map((s, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}">${i + 1}. ${esc(s[0].replace(/^STEP \d\. /, ''))}</button>`).join('')}</div><div class="stp-panel" id="stp-panel"></div></section>
  <section class="sec" id="risk" data-reveal><span class="kicker">CHECK</span><h2>簡易・税務調査リスク診断</h2><div class="dg" id="s5dg" style="margin:0;max-width:none;border:0;padding:0;background:transparent"></div></section>
  <section class="sec" data-reveal><span class="kicker">FAQ</span><h2>よくあるご質問</h2>${FAQ.map(([q, a]) => `<details class="card"><summary style="font-weight:900;cursor:pointer;min-height:32px">${esc(q)}</summary><p style="margin-top:8px">${esc(a)}</p></details>`).join('')}</section>
  <section class="sec" data-reveal><span class="kicker">CONTACT</span><h2>お問い合わせ</h2><p>まずは無料相談から。お問い合わせ先(電話・メール)は準備中です。事業再生のご相談は、公認会計士 上原佑介のページからもお受けしています。</p><p><a class="btn" href="#/uehara/contact">上原佑介事務所のお問い合わせへ</a></p></section>
  <div class="people">${['uehara', 'honda', 'sakashita', 'yamada'].map((id) => { const p = PEOPLE[id]; return `<a class="pp" href="#${p.route}">${U.monoC(p)}<span><b>${esc(p.name)}</b><small>${esc(p.role)}</small></span></a>`; }).join('')}</div>
</div>`;
    // 比較タブ
    const cb = el.querySelector('#cmp-body'), tabs = [...el.querySelectorAll('#cmp-tabs button')];
    const showCmp = (i) => { const c = CMP[i]; cb.innerHTML = `<div class="cmp"><div class="card g"><h3>一般的な税理士事務所</h3><p>${esc(c[2])}</p></div><div class="card u"><h3>${U.tickSvg.replace('class="tick"', 'class="tick" style="position:static;display:inline-block;vertical-align:-5px;margin-right:6px"')}${i === 2 ? '上原佑介公認会計士事務所' : '坂口誠税理士事務所'}</h3><p>${esc(c[3])}</p></div></div>`; };
    tabs.forEach((b) => b.addEventListener('click', () => { tabs.forEach((x) => x.classList.toggle('on', x === b)); showCmp(Number(b.dataset.i)); }));
    showCmp(0);
    // ステッパー(STEP4でGOAL)
    const sb = [...el.querySelectorAll('#stp button')], sp = el.querySelector('#stp-panel'); let goal = null, prev = 0;
    const showStep = (i) => {
      if (goal) { goal.stop(); goal = null; }
      sp.innerHTML = `<h3 style="color:var(--green)">${esc(STEPS[i][0])}</h3><p>${esc(STEPS[i][1])}</p>${i === STEPS.length - 1 ? '<div id="s5goal"></div>' : ''}`;
      if (!reduce) sp.animate([{ opacity: 0, transform: `translateX(${i >= prev ? 24 : -24}px)` }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.3,1)' });
      if (i === STEPS.length - 1) { goal = FX.goal(sp.querySelector('#s5goal'), { height: 170 }); goal.play(); }
      prev = i;
    };
    sb.forEach((b) => b.addEventListener('click', () => { sb.forEach((x) => x.classList.toggle('on', x === b)); showStep(Number(b.dataset.i)); }));
    showStep(0); ctx.cleanup.push(() => { if (goal) goal.stop(); });
    // 診断
    Consult.mount(el.querySelector('#s5dg'), { people: PEOPLE, sites: null, cleanup: ctx.cleanup }, RISK);
    el.querySelector('#to-risk').addEventListener('click', (e) => { e.preventDefault(); el.querySelector('#risk').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
  }
  return { mount };
})();
