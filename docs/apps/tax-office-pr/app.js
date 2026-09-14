(() => {
  'use strict';

  // ---------- 数字カウントアップ ----------
  const stats = document.querySelectorAll('.stat');
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
        if (t < 1) requestAnimationFrame(tick);
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

  // ---------- 経歴タイムライン(スクロール表示) ----------
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineItems.forEach((el) => tlObserver.observe(el));
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
    function renderStep(i) {
      const s = STEPS[i];
      panel.innerHTML = `<h3>${s.title}</h3><p>${s.body}</p>`;
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
  if (diagApp) {
    const qWrap = document.getElementById('diag-question-wrap');
    const resultWrap = document.getElementById('diag-result');
    const progressBar = document.getElementById('diag-progress-bar');
    let current = 0;
    let answers = [];

    function renderQuestion() {
      resultWrap.hidden = true;
      qWrap.hidden = false;
      progressBar.style.width = `${(current / QUESTIONS.length) * 100}%`;
      const q = QUESTIONS[current];
      qWrap.innerHTML = `
        <p class="diag-q-title">質問 ${current + 1} / ${QUESTIONS.length}</p>
        <p class="diag-q-text">${q.text}</p>
        <div class="diag-options">
          ${q.options.map((o, i) => `<button class="diag-option" data-index="${i}">${o.label}</button>`).join('')}
        </div>
        ${current > 0 ? '<div class="diag-nav"><button class="diag-back" type="button">← ひとつ前に戻る</button></div>' : ''}
      `;
      qWrap.querySelectorAll('.diag-option').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.index);
          answers[current] = q.options[idx].score;
          current++;
          if (current < QUESTIONS.length) {
            renderQuestion();
          } else {
            renderResult();
          }
        });
      });
      const backBtn = qWrap.querySelector('.diag-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          current--;
          renderQuestion();
        });
      }
    }

    function renderResult() {
      qWrap.hidden = true;
      progressBar.style.width = '100%';
      const total = answers.reduce((a, b) => a + b, 0);
      let level, badgeClass, message;
      if (total <= 3) {
        level = 'リスク傾向: 低め';
        badgeClass = 'low';
        message = '大きな懸念材料は少なそうです。とはいえ、日頃の記帳・証憑管理を継続することが最大の予防策です。定期的な顧問チェックをおすすめします。';
      } else if (total <= 7) {
        level = 'リスク傾向: 中程度';
        badgeClass = 'mid';
        message = 'いくつか、調査官が着目しやすいポイントが見られます。決算前のタイミングで一度、専門家によるセルフチェックを受けておくと安心です。';
      } else {
        level = 'リスク傾向: 高め';
        badgeClass = 'high';
        message = '複数の項目で、税務調査時に指摘を受けやすい傾向が見られます。早めに顧問税理士と一緒に、記帳内容や申告内容の見直しをおすすめします。';
      }
      resultWrap.hidden = false;
      resultWrap.innerHTML = `
        <span class="diag-result-badge ${badgeClass}">${level}</span>
        <h3>診断結果</h3>
        <p>${message}</p>
        <p style="font-size:0.78rem;color:var(--muted)">※ この診断は一般的な傾向をもとにした簡易チェックであり、正式な税務判断・保証ではありません。</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
          <a class="btn btn-primary" href="#contact">この結果について相談する</a>
          <button class="diag-restart" type="button" id="diag-restart-btn">もう一度診断する</button>
        </div>
      `;
      document.getElementById('diag-restart-btn').addEventListener('click', () => {
        current = 0;
        answers = [];
        renderQuestion();
      });
    }

    renderQuestion();
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
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();
