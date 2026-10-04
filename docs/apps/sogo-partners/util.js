/* 共通データ・関数。内容は①〜④の確定情報(各サイト・名刺)に基づく */
window.U = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const BRAND = '総合パートナーズ';
  const PEOPLE = {
    uehara:    { id: 'uehara',    name: '上原 佑介', mono: '佑', role: '公認会計士・税理士', route: '/uehara',    color: '#1f6a7a', site: '公認会計士 上原佑介事務所', line: '経営者の一番身近な相談相手として、金融機関対応・M&A・事業承継・中小企業の経営管理をサポート' },
    sakashita: { id: 'sakashita', name: '坂下 藤男', mono: '藤', role: '公認会計士・税理士・公認不正検査士', route: '/sakashita', color: '#2b8a9c', site: '坂下公認会計士事務所', en: 'FUJIO SAKASHITA', line: '公認会計士・税理士・公認不正検査士として、監査、税務、会計、不正調査等に従事' },
    sakaguchi: { id: 'sakaguchi', name: '坂口 誠',   mono: '誠', role: '税理士', route: '/sakaguchi', color: '#a8710f', site: '坂口誠税理士事務所', line: '国税局37年のキャリアを活かした、税務調査に強い税理士' },
    honda:     { id: 'honda',     name: '本田 智広', mono: '智', role: '税理士・社会保険労務士・行政書士', route: '/honda', color: '#8a5a12', site: '本田智広税理士事務所', en: 'Tomohiro Honda', line: '企業の難事件、解決します。' },
    yamada:    { id: 'yamada',    name: '山田 抄織', mono: '抄', role: '社会保険労務士', route: '/yamada', color: '#2f6f4f', site: '日本綜合社会保険労務士法人', en: 'Saori Yamada', line: '「応援力」で人と組織を育む。元・日本一のチアリーダー社労士' }
  };
  const KIND = { cpa: ['公認会計士', '#1f6a7a', ['uehara', 'sakashita']], tax: ['税理士', '#a8710f', ['sakaguchi', 'honda']], sr: ['社会保険労務士', '#2f6f4f', ['yamada', 'honda']] };
  const OFFICES = [
    { city: '神戸', zip: '〒651-0088', addr: '神戸市中央区小野柄通3-2-22 AIG神戸ビル7F', tel: [['公認会計士 上原佑介事務所', '078-855-3700'], ['日本綜合社会保険労務士法人・社福サポート', '078-855-8277']], fax: '078-855-3701' },
    { city: '大阪', zip: '〒530-0001', addr: '大阪市北区梅田1-1-3 大阪駅前第3ビル11階14号室', tel: [['', '06-6344-1120']], fax: '06-6676-8000' },
    { city: '沖縄', zip: '〒900-0031', addr: '沖縄県那覇市若狭1丁目3番2号 タカダ若狭ビル102号室', tel: [['', '098-894-5925']] },
    { city: '東京', zip: '〒105-0004', addr: '東京都港区新橋2-16-1 ニュー新橋ビル605号室', tel: [['', '03-6268-8927']], note: '税理士業務については、東京事務所から全国のお客様に対してサービスを提供しています。(上原佑介事務所)' }
  ];
  const mapLink = (a) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a);
  const monoC = (p, cls = '') => `<span class="mono-c ${cls}" style="background:${p.color}" aria-hidden="true">${esc(p.mono)}</span>`;
  const tickSvg = '<svg class="tick" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/><path d="M6.5 12.5l4 4 7-8.5"/></svg>';
  return { esc, wait, BRAND, PEOPLE, KIND, OFFICES, mapLink, monoC, tickSvg };
})();
