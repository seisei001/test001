(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const FXR = window.FX ? window.FX.reduce : true;

  // ---------- 表示された最初: オープニング + ヒーローの転がるキューブ ----------
  const splash = $('splash');
  if (splash && window.FX && !FXR && !document.documentElement.classList.contains('splash-seen')) {
    const sfx = FX.cubes($('splash-fx'), { height: 210 });
    sfx.start();
    document.body.style.overflow = 'hidden';
    let closed = false;
    const closeSplash = () => {
      if (closed) return;
      closed = true;
      try { sessionStorage.setItem('taxPrSplash', '1'); } catch {}
      splash.classList.add('is-out');
      document.body.style.overflow = '';
      setTimeout(() => { sfx.stop(); splash.remove(); }, 700);
    };
    splash.addEventListener('click', closeSplash);
    setTimeout(closeSplash, 2400);
  } else if (splash) {
    splash.remove();
  }
  const heroFx = $('hero-fx');
  if (heroFx && window.FX) {
    const hc = FX.cubes(heroFx, { height: 200 });
    new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? hc.start() : hc.stop()));
    }, { threshold: 0.1 }).observe(heroFx);
  }

  // ---------- 数字カウントアップ(静的な実績バッジは対象外) ----------
  const stats = document.querySelectorAll('.stat:not(.stat--static)');
  if (stats.length) {
    const animateStat = (el) => {
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const numEl = el.querySelector('[data-count]');
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        numEl.textContent = Math.round(target * eased) + (t >= 1 ? suffix : '');
        if (t < 1) requestAnimationFrame(tick); else el.classList.add('is-done');
      }
      requestAnimationFrame(tick);
    };
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach((el) => statObserver.observe(el));
  }

  // ---------- 強み比較タブ ----------
  const compare = document.getElementById('compare');
  if (compare) {
    compare.querySelectorAll('.compare-col--us h3').forEach((h) => {
      h.insertAdjacentHTML('afterbegin', '<svg class="fx-tick" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12"/><path d="M6.5 12.5l4 4 7-8.5"/></svg>');
    });
    const tabs = compare.querySelectorAll('.compare-tab');
    const panels = compare.querySelectorAll('.compare-panel');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach((p) => p.classList.remove('is-active'));
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById(tab.dataset.target).classList.add('is-active');
      });
    });
  }

  // ---------- 経歴タイムライン・専門家カード(スクロール表示) ----------
  const revealItems = document.querySelectorAll('.timeline-item, .team-card');
  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealItems.forEach((el) => revealObserver.observe(el));
  }

  // ---------- 事業再生ステッパー ----------
  const STEPS = [
    {
      title: 'STEP 1. 現状把握・財務分析',
      body: '決算書・試算表・資金繰り表をもとに、現状の財務状態と資金繰りの見通しを整理します。税務上のリスクや未処理の論点もあわせて洗い出します。'
    },
    {
      title: 'STEP 2. 再生計画の策定',
      body: '債務免除益・欠損金の活用など税務面を踏まえながら、実行可能な再生計画(数値計画・スケジュール)を一緒に組み立てます。'
    },
    {
      title: 'STEP 3. 金融機関との調整',
      body: '再生計画の説明資料づくりから、金融機関との交渉の進め方まで伴走します。必要に応じて他の専門家(弁護士等)とも連携します。'
    },
    {
      title: 'STEP 4. 実行支援・モニタリング',
      body: '計画実行後も、月次の状況を確認しながら計画との差異を分析し、必要な軌道修正を継続的にサポートします。'
    }
  ];
  const stepper = document.getElementById('stepper');
  if (stepper) {
    const stepBtns = stepper.querySelectorAll('.step-btn');
    const panel = document.getElementById('stepper-panel');
    let prevStep = 0;
    let goalFx = null;
    function renderStep(i) {
      const s = STEPS[i];
      if (goalFx) { goalFx.stop(); goalFx = null; }
      panel.innerHTML = `<h3>${s.title}</h3><p>${s.body}</p>` + (i === STEPS.length - 1 ? '<div class="fx-goal-host"></div>' : '');
      panel.animate(
        [{ opacity: 0, transform: `translateX(${i >= prevStep ? 24 : -24}px)` }, { opacity: 1, transform: 'none' }],
        { duration: FXR ? 1 : 320, easing: 'cubic-bezier(.2,.8,.3,1)' }
      );
      if (i === STEPS.length - 1 && window.FX) {
        goalFx = FX.goal(panel.querySelector('.fx-goal-host'), { height: 170 });
        goalFx.play();
      }
      prevStep = i;
    }
    stepBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        stepBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderStep(Number(btn.dataset.step));
      });
    });
    renderStep(0);
  }

  // ---------- 税務調査リスク簡易診断 ----------
  const QUESTIONS = [
    {
      text: '税務署への提出書類(申告書・決算書)の作成体制は？',
      options: [
        { label: '顧問税理士に一任し、内容も共有・確認している', score: 0 },
        { label: '自社で作成し、税理士のチェックは受けていない', score: 2 },
        { label: '自己流で作成している', score: 3 }
      ]
    },
    {
      text: '現金での取引(現金商売・経費の現金精算など)の割合は？',
      options: [
        { label: 'ほとんどない', score: 0 },
        { label: '一部ある', score: 1 },
        { label: '多い', score: 2 }
      ]
    },
    {
      text: '直近で税務調査を受けたのはいつ頃ですか？',
      options: [
        { label: '5年以内に受けた', score: 1 },
        { label: '5〜9年前、または一度も受けたことがない(開業5年以上)', score: 2 },
        { label: '10年以上前、または開業から一度も接触がない', score: 3 }
      ]
    },
    {
      text: 'ここ数年の売上・利益の推移は？',
      options: [
        { label: '安定して推移している', score: 0 },
        { label: '大きく増減した年がある', score: 2 }
      ]
    },
    {
      text: '役員報酬の変更や、同族間・関係会社間の取引はありますか？',
      options: [
        { label: '特にない', score: 0 },
        { label: 'ある(役員報酬変更・同族間取引など)', score: 2 }
      ]
    },
    {
      text: 'インボイス制度・消費税の課税事業者選択への対応状況は？',
      options: [
        { label: '税理士と相談のうえ、適切に対応済み', score: 0 },
        { label: '自分で対応したが、あまり自信がない', score: 2 }
      ]
    }
  ];

  const diagApp = document.getElementById('diagnosis-app');
  if (diagApp && window.FX) {
    const qWrap = $('diag-question-wrap');
    const thinkWrap = $('diag-think');
    const resultWrap = $('diag-result');
    const stepsEl = $('dq-steps');
    const N = QUESTIONS.length;
    const MAX = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.score)), 0);
    const CHECK = '<circle cx="12" cy="12" r="12"/><path d="M6.5 12.5l4 4 7-8.5"/>';
    let current = 0;
    let answers = [];
    let busy = false;
    let token = 0;
    let liveFx = null;

    stepsEl.innerHTML = '<div class="dq-line"><i></i></div>' +
      QUESTIONS.map((_, i) => `<div class="dq-dot"><span>${i + 1}</span><svg viewBox="0 0 24 24"><path d="M6.5 12.5l4 4 7-8.5"/></svg></div>`).join('');
    const dots = [...stepsEl.querySelectorAll('.dq-dot')];
    const lineFill = stepsEl.querySelector('.dq-line i');
    function updateSteps(done, now) {
      dots.forEach((d, i) => {
        if (i < done) { if (!d.classList.contains('is-done')) d.classList.add('is-done'); } else d.classList.remove('is-done');
        d.classList.toggle('is-now', i === now);
      });
      lineFill.style.width = `${(Math.min(done, N - 1) / (N - 1)) * 100}%`;
    }

    function stopFx() {
      token++;
      if (liveFx) { liveFx.stop(); liveFx = null; }
    }
    function ripple(btn, e) {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const x = (e && e.clientX ? e.clientX : r.left + r.width / 2) - r.left - size / 2;
      const y = (e && e.clientY ? e.clientY : r.top + r.height / 2) - r.top - size / 2;
      const sp = document.createElement('span');
      sp.className = 'dq-ripple';
      Object.assign(sp.style, { width: size + 'px', height: size + 'px', left: x + 'px', top: y + 'px' });
      btn.appendChild(sp);
      sp.animate([{ transform: 'scale(0)', opacity: 0.6 }, { transform: 'scale(1)', opacity: 0 }], { duration: FXR ? 1 : 550, easing: 'ease-out' }).onfinish = () => sp.remove();
    }

    function renderQuestion(dir) {
      stopFx();
      busy = false;
      qWrap.getAnimations().forEach((a) => a.cancel());
      thinkWrap.hidden = true;
      resultWrap.hidden = true;
      qWrap.hidden = false;
      updateSteps(current, current);
      const q = QUESTIONS[current];
      qWrap.innerHTML = `
        <p class="diag-q-title">質問 ${current + 1} / ${N}</p>
        <p class="diag-q-text">${q.text}</p>
        <div class="diag-options">
          ${q.options.map((o, i) => `<button class="diag-option" type="button" data-index="${i}">${o.label}</button>`).join('')}
        </div>
        ${current > 0 ? '<div class="diag-nav"><button class="diag-back" type="button">← ひとつ前に戻る</button></div>' : ''}
      `;
      if (!FXR) {
        qWrap.querySelectorAll('.diag-q-title, .diag-q-text').forEach((n, i) =>
          n.animate([{ opacity: 0, transform: `translateX(${dir * 30}px)` }, { opacity: 1, transform: 'none' }], { duration: 380, delay: i * 70, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }));
        qWrap.querySelectorAll('.diag-option').forEach((n, i) =>
          n.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 160 + i * 90, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }));
      }
      qWrap.querySelectorAll('.diag-option').forEach((btn) => btn.addEventListener('click', (e) => pick(btn, e)));
      const back = qWrap.querySelector('.diag-back');
      if (back) back.addEventListener('click', () => { if (busy) return; current--; renderQuestion(-1); });
    }

    async function pick(btn, e) {
      if (busy) return;
      busy = true;
      const idx = Number(btn.dataset.index);
      ripple(btn, e);
      qWrap.querySelector('.diag-options').classList.add('is-locked');
      btn.classList.add('is-picked');
      btn.insertAdjacentHTML('beforeend', `<svg class="opt-check" viewBox="0 0 24 24">${CHECK}</svg>`);
      answers[current] = QUESTIONS[current].options[idx].score;
      await wait(FXR ? 50 : 600);
      await qWrap.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-40px)' }], { duration: FXR ? 1 : 220, easing: 'ease-in', fill: 'forwards' }).finished;
      current++;
      if (current < N) renderQuestion(1); else startThinking();
    }

    async function startThinking() {
      stopFx();
      const tk = token;
      qWrap.hidden = true;
      qWrap.getAnimations().forEach((a) => a.cancel());
      updateSteps(N, -1);
      thinkWrap.hidden = false;
      thinkWrap.innerHTML = '<div class="dq-fxhost"></div><p class="dq-think-text"></p><div class="dq-think-bar"><i></i></div>';
      const host = thinkWrap.querySelector('.dq-fxhost');
      const text = thinkWrap.querySelector('.dq-think-text');
      const bar = thinkWrap.querySelector('.dq-think-bar i');
      const phases = [
        { t: '書類の中から、調査官が着目する点を探しています…', ms: 1600, make: () => FX.scan(host, { height: 170 }) },
        { t: '回答を組み合わせて、リスクを整理しています…', ms: 1800, make: () => FX.cubes(host, { height: 190, palette: [[47, 158, 131], [224, 147, 46], [226, 105, 75]] }) }
      ];
      const total = phases.reduce((a, p) => a + (FXR ? 300 : p.ms), 0);
      bar.animate([{ width: '0%' }, { width: '100%' }], { duration: total, easing: 'linear', fill: 'forwards' });
      for (const ph of phases) {
        if (tk !== token) return;
        host.replaceChildren();
        text.textContent = ph.t;
        text.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320 });
        liveFx = ph.make();
        liveFx.start();
        await wait(FXR ? 300 : ph.ms);
        if (tk !== token) return;
        liveFx.stop();
      }
      renderResult();
    }

    function renderResult() {
      stopFx();
      thinkWrap.hidden = true;
      const total = answers.reduce((a, b) => a + b, 0);
      const pct = Math.round((total / MAX) * 100);
      let level, badgeClass, message;
      if (total <= 3) {
        level = 'リスク傾向: 低め'; badgeClass = 'low';
        message = '大きな懸念材料は少なそうです。とはいえ、日頃の記帳・証憑管理を継続することが最大の予防策です。定期的な顧問チェックをおすすめします。';
      } else if (total <= 7) {
        level = 'リスク傾向: 中程度'; badgeClass = 'mid';
        message = 'いくつか、調査官が着目しやすいポイントが見られます。決算前のタイミングで一度、国税局出身の税理士 坂口誠によるセルフチェックを受けておくと安心です。';
      } else {
        level = 'リスク傾向: 高め'; badgeClass = 'high';
        message = '複数の項目で、税務調査時に指摘を受けやすい傾向が見られます。査察(捜査)対応まで経験した坂口誠が、早めの記帳・申告内容の見直しをサポートします。';
      }
      resultWrap.hidden = false;
      resultWrap.innerHTML = `
        <div class="dq-fxhost"></div>
        <span class="diag-result-badge ${badgeClass}">${level}</span>
        <h3>診断結果</h3>
        <div class="dq-gauge-wrap">
          <div class="dq-gauge"><i></i></div>
          <p class="dq-gauge-num">リスク指標 <b>0</b> / ${MAX}</p>
        </div>
        <p class="dq-msg">${message}</p>
        <p class="dq-msg" style="font-size:0.78rem;color:var(--muted)">※ この診断は一般的な傾向をもとにした簡易チェックであり、正式な税務判断・保証ではありません。</p>
        <div class="dq-actions" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
          <a class="btn btn-primary" href="#contact">この結果について相談する</a>
          <button class="diag-restart" type="button" id="diag-restart-btn">もう一度診断する</button>
        </div>
      `;
      const host = resultWrap.querySelector('.dq-fxhost');
      if (badgeClass === 'low') { liveFx = FX.check(host, { height: 160, tone: 'teal' }); liveFx.play(); }
      else { liveFx = FX.scan(host, { height: 150, tint: badgeClass === 'mid' ? '#c07a1a' : '#c14b34' }); liveFx.start(); }
      if (!FXR) {
        const badge = resultWrap.querySelector('.diag-result-badge');
        badge.animate([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1, offset: .6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 520, delay: 900, easing: 'ease-out', fill: 'backwards' });
        resultWrap.querySelectorAll('h3, .dq-gauge-wrap, .dq-msg, .dq-actions').forEach((n, i) =>
          n.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 1000 + i * 120, easing: 'ease-out', fill: 'backwards' }));
      }
      const cover = resultWrap.querySelector('.dq-gauge i');
      cover.animate([{ width: '100%' }, { width: `${100 - pct}%` }], { duration: FXR ? 1 : 1200, delay: FXR ? 0 : 1100, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      const num = resultWrap.querySelector('.dq-gauge-num b');
      const t0 = performance.now() + (FXR ? 0 : 1100);
      const tick = (now) => {
        const p = Math.max(0, Math.min(1, (now - t0) / (FXR ? 1 : 1200)));
        num.textContent = Math.round(total * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      $('diag-restart-btn').addEventListener('click', () => { current = 0; answers = []; renderQuestion(1); });
    }

    renderQuestion(1);
  }

  // ---------- FAQアコーディオン ----------
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- コピー ボタン(電話・メール) ----------
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        /* クリップボードが使えない環境では何もしない */
      }
      btn.classList.add('is-copied');
      const hint = btn.querySelector('.copy-hint');
      const original = hint ? hint.textContent : '';
      if (hint) hint.textContent = 'コピーしました';
      setTimeout(() => {
        btn.classList.remove('is-copied');
        if (hint) hint.textContent = original;
      }, 1500);
    });
  });

  // ---------- お問い合わせフォーム ----------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const topic = data.get('topic') || '';
      const message = data.get('message') || '';
      const to = '【メールアドレス】';
      const subject = encodeURIComponent(`【HP問い合わせ】${topic}`);
      const body = encodeURIComponent(
        `お名前: ${name}\nメールアドレス: ${email}\nご相談内容: ${topic}\n\nメッセージ:\n${message}`
      );
      const url = `mailto:${to}?subject=${subject}&body=${body}`;
      const overlay = $('goal-overlay');
      if (overlay && window.FX) {
        const host = $('goal-host');
        host.replaceChildren();
        const g = FX.goal(host, { height: 170 });
        overlay.hidden = false;
        g.play();
        const close = () => { overlay.hidden = true; g.stop(); };
        $('goal-close').onclick = close;
        overlay.onclick = (ev) => { if (ev.target === overlay) close(); };
        setTimeout(() => { window.location.href = url; }, FXR ? 200 : 1800);
      } else {
        window.location.href = url;
      }
    });
  }
})();
