/* スマホ / パソコン の表示切り替え。最初の画面で選び、画面上部のスイッチでいつでも切り替えられる。
   選んだ内容は端末に保存する。URLに ?mode=pc または ?mode=phone を付けると、その表示で開く。 */
window.Mode = (() => {
  'use strict';
  const KEY = 'sogoMode';
  const VP = { pc: 'width=1280, viewport-fit=cover', phone: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' };
  let mode = 'phone', onChange = () => {}, resolveReady;
  const ready = new Promise((r) => { resolveReady = r; });
  const detect = () => (innerWidth >= 900 && matchMedia('(pointer: fine)').matches ? 'pc' : 'phone');
  const load = () => { try { const v = localStorage.getItem(KEY); return v === 'pc' || v === 'phone' ? v : null; } catch { return null; } };
  const save = (m) => { try { localStorage.setItem(KEY, m); } catch {} };

  function apply(m) {
    mode = m; document.body.classList.toggle('mode-pc', m === 'pc'); document.body.classList.toggle('mode-phone', m !== 'pc');
    const vp = document.querySelector('meta[name=viewport]'); if (vp) vp.setAttribute('content', VP[m]);
    document.querySelectorAll('.modesw button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
  }
  function set(m) { if (m === mode) return; save(m); apply(m); onChange(m); }

  function chooser() {
    const rec = detect(), ov = document.createElement('div'); ov.className = 'modesel'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', '表示の選択');
    const card = (m, ic, t, d) => `<button type="button" class="mcard" data-m="${m}"><span class="mic">${ic}</span><b>${t}</b><small>${d}</small>${rec === m ? '<em>この端末におすすめ</em>' : ''}</button>`;
    ov.innerHTML = `<div class="mwrap"><p class="mk">DISPLAY</p><h2>表示を選んでください</h2><p class="md">あとから、画面上部のスイッチでいつでも切り替えられます。</p><div class="mcards">${card('phone', '📱', 'スマホで見る', '縦長の画面。指で操作します。')}${card('pc', '🖥', 'パソコンで見る', '広い画面。左にページ一覧が出ます。')}</div></div>`;
    document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    ov.querySelectorAll('.mcard').forEach((b) => b.addEventListener('click', () => {
      const m = b.dataset.m; save(m); apply(m);
      ov.classList.add('out'); document.body.style.overflow = '';
      setTimeout(() => { ov.remove(); onChange(m); resolveReady(); }, 380);
    }));
  }

  function init() {
    const q = new URLSearchParams(location.search).get('mode');
    if (q === 'pc' || q === 'phone') { save(q); apply(q); resolveReady(); return; }
    const st = load();
    if (st) { apply(st); resolveReady(); return; }
    apply(detect()); chooser();
  }
  return { init, set, apply, ready, get mode() { return mode; }, set onChange(f) { onChange = f; } };
})();
