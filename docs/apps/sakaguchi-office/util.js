/* 共通データ・関数。内容は旧「税理士事務所PRサイト」の記載に基づく(未確定は準備中) */
window.U = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const BRAND = '坂口誠税理士事務所';
  const PEOPLE = { sakaguchi: { id: 'sakaguchi', name: '坂口 誠', mono: '誠', role: '税理士', route: '/', color: '#a8710f' } };
  const tickSvg = '<svg class="tick" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/><path d="M6.5 12.5l4 4 7-8.5"/></svg>';
  return { esc, wait, BRAND, PEOPLE, tickSvg };
})();
