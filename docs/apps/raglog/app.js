const STORAGE_KEY = "raglogApp.settings.v1";

const DEFAULTS = {
  workerUrl: "",
  appSecret: "",
  hfKey: "",
  geminiKey: "",
  anthropicKey: "",
  openaiKey: "",
  provider: "gemini",
  level: "normal",
  geminiModel: "gemini-2.0-flash",
  claudeModel: "claude-opus-5",
  openaiModel: "gpt-5.5",
};

const PRIVACY_NOTICE = `ℹ️ お知らせ

情報を「AIが理解しやすい形」に変換する処理は、Hugging Faceの無料の
サービスを使っています。蓄積するデータ(URLの内容・会話ログ)は、
登録する・質問するたびに毎回Hugging Face側に送信されます。

さらに、「質問する」タブで実際に質問し、回答を作ってもらう時には、
下で選んだAI(Google/Claude/ChatGPT)にも質問と参考情報が送信されます。

無料枠で使う場合、送信した内容がサービス改善に使われることがあります
(各社の利用規約に基づく正当な取り扱いです)。気になる場合は、
有料のキーへの切り替えをご検討ください。

⚠️ このページのAPIキーはお使いのブラウザだけに保存されます(外部の
サーバーには送られません)。ただし、質問箱を動かす仲介役(Worker)に
通信する際は毎回このキーが渡されます。信頼できる自分の端末でのみ
ご利用ください。`;

function $(id) {
  return document.getElementById(id);
}

function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorageが使えない環境では保存をあきらめる
  }
}

function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === name);
  });
  document.querySelectorAll(".tab").forEach((section) => {
    section.hidden = section.id !== `tab-${name}`;
  });
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

async function callWorker(path, body) {
  const settings = loadSettings();
  if (!settings.workerUrl) {
    throw new Error("設定画面でWorkerのURLを入力してください。");
  }
  const response = await fetch(settings.workerUrl.replace(/\/$/, "") + path, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      "X-App-Secret": settings.appSecret,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "エラーが発生しました");
  }
  return data;
}

// ---- 設定タブ ----

function renderSettingsForm() {
  const s = loadSettings();
  $("privacy-notice").textContent = PRIVACY_NOTICE;
  $("worker-url").value = s.workerUrl;
  $("app-secret").value = s.appSecret;
  $("hf-key").value = s.hfKey;
  $("gemini-key").value = s.geminiKey;
  $("anthropic-key").value = s.anthropicKey;
  $("openai-key").value = s.openaiKey;
  $("provider").value = s.provider;
  $("level").value = s.level;
  $("gemini-model").value = s.geminiModel;
  $("claude-model").value = s.claudeModel;
  $("openai-model").value = s.openaiModel;
}

async function refreshStats() {
  try {
    const data = await callWorker("/api/stats");
    const bySource = Object.entries(data.by_source)
      .map(([k, v]) => `${k}: ${v}件`)
      .join(" / ");
    $("stats").innerHTML = `
      <p>合計: ${data.total}件 (良い評価: ${data.good}件 / 悪い評価: ${data.bad}件)</p>
      <p class="muted">${bySource || "まだデータがありません"}</p>
    `;
  } catch (err) {
    $("stats").innerHTML = `<p class="muted">${err.message}</p>`;
  }
}

$("save-settings").addEventListener("click", () => {
  const s = {
    workerUrl: $("worker-url").value.trim(),
    appSecret: $("app-secret").value.trim(),
    hfKey: $("hf-key").value.trim(),
    geminiKey: $("gemini-key").value.trim(),
    anthropicKey: $("anthropic-key").value.trim(),
    openaiKey: $("openai-key").value.trim(),
    provider: $("provider").value,
    level: $("level").value,
    geminiModel: $("gemini-model").value.trim() || DEFAULTS.geminiModel,
    claudeModel: $("claude-model").value.trim() || DEFAULTS.claudeModel,
    openaiModel: $("openai-model").value.trim() || DEFAULTS.openaiModel,
  };
  saveSettings(s);
  $("settings-status").textContent = "保存しました。";
  refreshStats();
});

// ---- 質問タブ ----

function addBubble(text, kind) {
  const div = document.createElement("div");
  div.className = `bubble ${kind}`;
  div.textContent = text;
  $("chat-log").appendChild(div);
  return div;
}

function providerKeyFor(settings) {
  if (settings.provider === "claude") return settings.anthropicKey;
  if (settings.provider === "openai") return settings.openaiKey;
  return settings.geminiKey;
}

function providerModelFor(settings) {
  if (settings.provider === "claude") return settings.claudeModel;
  if (settings.provider === "openai") return settings.openaiModel;
  return settings.geminiModel;
}

$("ask-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = $("question-input");
  const question = input.value.trim();
  if (!question) return;

  const settings = loadSettings();
  addBubble(question, "question");
  input.value = "";
  const thinking = addBubble("考え中...", "answer");

  try {
    const data = await callWorker("/api/ask", {
      question,
      level: $("level").value,
      hf_token: settings.hfKey,
      provider: settings.provider,
      provider_key: providerKeyFor(settings),
      provider_model: providerModelFor(settings),
    });
    thinking.textContent = data.answer;

    if (data.used.length > 0) {
      const info = document.createElement("div");
      info.className = "used-info";
      info.textContent = `(参考にした過去の情報: ${data.used.length}件)`;
      thinking.after(info);
    }

    const rateRow = document.createElement("div");
    rateRow.className = "rate-row";
    rateRow.innerHTML = `
      <input type="text" placeholder="メモ(任意)">
      <button class="good" type="button">👍 覚えさせる</button>
      <button class="bad" type="button">👎 忘れさせる</button>
    `;
    thinking.after(rateRow);

    const noteInput = rateRow.querySelector("input");
    const rate = async (rating) => {
      rateRow.querySelectorAll("button").forEach((b) => (b.disabled = true));
      try {
        await callWorker("/api/rate_answer", {
          question,
          answer: data.answer,
          rating,
          note: noteInput.value.trim(),
          hf_token: settings.hfKey,
        });
        rateRow.textContent = rating === "good" ? "✓ 覚えました" : "✓ 記録しました(検索には使いません)";
        refreshStats();
      } catch (err) {
        rateRow.textContent = `エラー: ${err.message}`;
      }
    };
    rateRow.querySelector(".good").addEventListener("click", () => rate("good"));
    rateRow.querySelector(".bad").addEventListener("click", () => rate("bad"));
  } catch (err) {
    thinking.textContent = `エラー: ${err.message}`;
  }
});

// ---- URL登録タブ ----

let lastPreviewedUrl = null;

$("url-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = $("url-input").value.trim();
  if (!url) return;

  $("url-preview").hidden = true;
  $("url-save-status").textContent = "";

  try {
    const data = await callWorker("/api/preview_url", { url });
    lastPreviewedUrl = url;
    $("url-preview-text").textContent = data.preview + "...";
    $("url-chunk-info").textContent = `${data.chunk_count}件のかたまりに分けて登録されます。`;
    $("url-preview").hidden = false;
  } catch (err) {
    alert(`エラー: ${err.message}`);
  }
});

async function saveUrl(rating) {
  if (!lastPreviewedUrl) return;
  const settings = loadSettings();
  const note = $("url-note").value.trim();
  $("url-save-status").textContent = "保存中...";
  try {
    const data = await callWorker("/api/save_url", {
      url: lastPreviewedUrl,
      rating,
      note,
      hf_token: settings.hfKey,
    });
    $("url-save-status").textContent = `✓ ${data.saved}件登録しました`;
    $("url-note").value = "";
    refreshStats();
  } catch (err) {
    $("url-save-status").textContent = `エラー: ${err.message}`;
  }
}

$("url-good").addEventListener("click", () => saveUrl("good"));
$("url-bad").addEventListener("click", () => saveUrl("bad"));

// ---- 初期化 ----

renderSettingsForm();
refreshStats();
