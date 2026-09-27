/**
 * 育てる質問箱 - Cloudflare Worker
 *
 * ブラウザ(静的ページ)から呼ばれる仲介役。CORSをここで解決し、
 * Hugging Face / Gemini / Claude / ChatGPT への問い合わせと、
 * D1データベース(entriesテーブル)への保存・検索をまとめて行う。
 *
 * デプロイ手順は README.md を参照してください。
 * 必要な設定(Cloudflareダッシュボードで行う):
 *   - D1バインディング: 変数名 "DB" を raglog-db に紐付ける
 *   - シークレット変数: APP_SECRET (このアプリ専用の合言葉。自分で決めてよい)
 */

const EMBEDDING_MODEL = "intfloat/multilingual-e5-small";
const CHUNK_TARGET_CHARS = 400;
const CHUNK_MAX_CHARS = 600;

const GEMINI_DEFAULT_MODEL = "gemini-2.0-flash";
const CLAUDE_DEFAULT_MODEL = "claude-opus-5";
const OPENAI_DEFAULT_MODEL = "gpt-5.5";

const RETRIEVAL_LEVELS = {
  light: { topK: 1, threshold: 0.82 },
  normal: { topK: 3, threshold: 0.75 },
  sage: { topK: 10, threshold: 0.6 },
};

// ---- CORS ----

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-App-Secret, X-Hf-Token",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

// ---- チャンク分割(日本語の句点区切り) ----

function chunkText(text, targetChars = CHUNK_TARGET_CHARS, maxChars = CHUNK_MAX_CHARS) {
  text = text.trim();
  if (!text) return [];

  const sentences = text.split(/(?<=[。！？])/).filter((s) => s.trim());
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if (sentence.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      for (let i = 0; i < sentence.length; i += maxChars) {
        chunks.push(sentence.slice(i, i + maxChars));
      }
      continue;
    }
    if (current && current.length + sentence.length > targetChars) {
      chunks.push(current);
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// ---- URL本文抽出(HTMLRewriterでスクリプト等を除去してテキスト化) ----

async function fetchPageText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; raglog/1.0)" },
  });
  if (!response.ok) {
    throw new Error(`ページの取得に失敗しました(HTTP ${response.status})`);
  }

  let text = "";
  let skipDepth = 0;
  const skipTags = new Set(["script", "style", "nav", "header", "footer", "noscript", "svg", "form"]);

  const rewriter = new HTMLRewriter()
    .on("*", {
      element(el) {
        if (skipTags.has(el.tagName)) {
          skipDepth++;
          if (!el.selfClosing) {
            el.onEndTag(() => {
              skipDepth = Math.max(0, skipDepth - 1);
            });
          } else {
            skipDepth = Math.max(0, skipDepth - 1);
          }
        }
      },
      text(chunk) {
        if (skipDepth === 0) {
          text += chunk.text;
          if (chunk.lastInTextNode) text += "\n";
        }
      },
    });

  const rewritten = rewriter.transform(response);
  await rewritten.arrayBuffer(); // ストリームを最後まで消費させる

  text = text.replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
  return text;
}

// ---- コサイン類似度 ----

function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ---- embedding(Hugging Face Inference API) ----

async function embed(text, hfToken, kind) {
  if (!hfToken) {
    throw new Error("Hugging FaceのAPIキーが設定されていません。設定画面から入力してください。");
  }
  const prefixed = kind === "query" ? `query: ${text}` : `passage: ${text}`;

  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${EMBEDDING_MODEL}/pipeline/feature-extraction`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prefixed, normalize: true }),
    }
  );
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Hugging Faceへの問い合わせに失敗しました: ${response.status} ${errText.slice(0, 200)}`);
  }
  const result = await response.json();
  // レスポンスは [[...]] (入力1件につき1本のベクトル配列)
  const vector = Array.isArray(result[0]) ? result[0] : result;
  return vector;
}

// ---- 回答生成(Gemini / Claude / ChatGPT) ----

function buildContextBlock(similar) {
  if (!similar.length) return "";
  const lines = ["以下は、あなたが持っている過去の知識です。関連する場合のみ参考にしてください。"];
  for (const { score, entry } of similar) {
    const source = entry.source_ref ? `(出典: ${entry.source_ref})` : "(過去の会話より)";
    lines.push(`- ${entry.text} ${source}`);
    if (entry.note) lines.push(`  信頼性メモ: ${entry.note}`);
    lines.push(`  (類似度: ${score.toFixed(2)})`);
  }
  return lines.join("\n");
}

async function generateAnswer(question, similar, provider, apiKey, model) {
  if (!apiKey) {
    throw new Error(`${provider} のAPIキーが設定されていません。設定画面から入力してください。`);
  }
  const contextBlock = buildContextBlock(similar);
  let systemPrompt = "あなたは、蓄積された知識を参考にしながら質問に答えるアシスタントです。";
  if (contextBlock) systemPrompt += "\n\n" + contextBlock;

  if (provider === "claude") return askClaude(question, systemPrompt, apiKey, model || CLAUDE_DEFAULT_MODEL);
  if (provider === "gemini") return askGemini(question, systemPrompt, apiKey, model || GEMINI_DEFAULT_MODEL);
  if (provider === "openai") return askOpenAI(question, systemPrompt, apiKey, model || OPENAI_DEFAULT_MODEL);
  throw new Error(`未知のプロバイダーです: ${provider}`);
}

async function askClaude(question, systemPrompt, apiKey, model) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 404) {
      throw new Error(`Claudeのモデル「${model}」が見つかりませんでした。設定画面の「詳細設定」でモデル名を確認・変更してください。`);
    }
    throw new Error(`Claudeへの問い合わせに失敗しました: ${response.status} ${errText.slice(0, 200)}`);
  }
  const data = await response.json();
  const textBlock = (data.content || []).find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}

async function askGemini(question, systemPrompt, apiKey, model) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    }
  );
  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 404) {
      throw new Error(`Geminiのモデル「${model}」が見つかりませんでした。設定画面の「詳細設定」でモデル名を確認・変更してください。`);
    }
    throw new Error(`Geminiへの問い合わせに失敗しました: ${response.status} ${errText.slice(0, 200)}`);
  }
  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("");
}

async function askOpenAI(question, systemPrompt, apiKey, model) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 404) {
      throw new Error(`ChatGPTのモデル「${model}」が見つかりませんでした。設定画面の「詳細設定」でモデル名を確認・変更してください。`);
    }
    throw new Error(`ChatGPTへの問い合わせに失敗しました: ${response.status} ${errText.slice(0, 200)}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ---- D1操作 ----

async function insertEntry(db, entry) {
  const result = await db
    .prepare(
      `INSERT INTO entries (text, embedding, source_type, source_ref, question, rating, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      entry.text,
      JSON.stringify(entry.embedding),
      entry.source_type,
      entry.source_ref || null,
      entry.question || null,
      entry.rating,
      entry.note || null,
      new Date().toISOString()
    )
    .run();
  return result.meta.last_row_id;
}

async function fetchGoodEntries(db) {
  const { results } = await db
    .prepare(`SELECT id, text, embedding, source_type, source_ref, note FROM entries WHERE rating = 'good'`)
    .all();
  return results.map((row) => ({ ...row, embedding: JSON.parse(row.embedding) }));
}

async function getStats(db) {
  const total = await db.prepare(`SELECT COUNT(*) AS c FROM entries`).first("c");
  const good = await db.prepare(`SELECT COUNT(*) AS c FROM entries WHERE rating = 'good'`).first("c");
  const bad = await db.prepare(`SELECT COUNT(*) AS c FROM entries WHERE rating = 'bad'`).first("c");
  const { results } = await db
    .prepare(`SELECT source_type, COUNT(*) AS c FROM entries GROUP BY source_type`)
    .all();
  const bySource = {};
  for (const row of results) bySource[row.source_type] = row.c;
  return { total, good, bad, by_source: bySource };
}

// ---- ルーティング ----

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    // 認証(合言葉チェック)
    const providedSecret = request.headers.get("X-App-Secret");
    if (!env.APP_SECRET || providedSecret !== env.APP_SECRET) {
      return json({ error: "認証に失敗しました。設定画面のキーを確認してください。" }, 401, origin);
    }

    try {
      if (url.pathname === "/api/stats" && request.method === "GET") {
        return json(await getStats(env.DB), 200, origin);
      }

      if (url.pathname === "/api/ask" && request.method === "POST") {
        const body = await request.json();
        const question = (body.question || "").trim();
        if (!question) return json({ error: "質問を入力してください。" }, 400, origin);

        const queryEmbedding = await embed(question, body.hf_token, "query");
        const entries = await fetchGoodEntries(env.DB);
        const preset = RETRIEVAL_LEVELS[body.level] || RETRIEVAL_LEVELS.normal;
        const scored = entries
          .map((entry) => ({ score: cosineSimilarity(queryEmbedding, entry.embedding), entry }))
          .filter((s) => s.score >= preset.threshold)
          .sort((a, b) => b.score - a.score)
          .slice(0, preset.topK);

        const answer = await generateAnswer(question, scored, body.provider, body.provider_key, body.provider_model);
        const used = scored.map((s) => ({ text: s.entry.text, score: Math.round(s.score * 1000) / 1000, source_ref: s.entry.source_ref }));
        return json({ question, answer, used }, 200, origin);
      }

      if (url.pathname === "/api/rate_answer" && request.method === "POST") {
        const body = await request.json();
        const question = (body.question || "").trim();
        const answer = (body.answer || "").trim();
        if (!question || !answer) return json({ error: "question と answer が必要です。" }, 400, origin);
        if (!["good", "bad"].includes(body.rating)) return json({ error: "rating は good か bad を指定してください。" }, 400, origin);

        const combinedText = `Q: ${question}\nA: ${answer}`;
        const vector = await embed(combinedText, body.hf_token, "passage");
        const id = await insertEntry(env.DB, {
          text: combinedText,
          embedding: vector,
          source_type: "chat_answer",
          rating: body.rating,
          question,
          note: body.note || null,
        });
        return json({ id, stats: await getStats(env.DB) }, 200, origin);
      }

      if (url.pathname === "/api/preview_url" && request.method === "POST") {
        const body = await request.json();
        const targetUrl = (body.url || "").trim();
        if (!targetUrl) return json({ error: "URLを入力してください。" }, 400, origin);

        const pageText = await fetchPageText(targetUrl);
        const chunks = chunkText(pageText);
        if (!chunks.length) return json({ error: "本文を抽出できませんでした。" }, 400, origin);

        return json({ url: targetUrl, chunk_count: chunks.length, preview: chunks[0].slice(0, 300) }, 200, origin);
      }

      if (url.pathname === "/api/save_url" && request.method === "POST") {
        const body = await request.json();
        const targetUrl = (body.url || "").trim();
        if (!targetUrl) return json({ error: "URLを入力してください。" }, 400, origin);
        if (!["good", "bad"].includes(body.rating)) return json({ error: "rating は good か bad を指定してください。" }, 400, origin);

        const pageText = await fetchPageText(targetUrl);
        const chunks = chunkText(pageText);
        if (!chunks.length) return json({ error: "本文を抽出できませんでした。" }, 400, origin);

        let saved = 0;
        for (const chunk of chunks) {
          const vector = await embed(chunk, body.hf_token, "passage");
          await insertEntry(env.DB, {
            text: chunk,
            embedding: vector,
            source_type: "url",
            source_ref: targetUrl,
            rating: body.rating,
            note: body.note || null,
          });
          saved++;
        }
        return json({ saved, stats: await getStats(env.DB) }, 200, origin);
      }

      return json({ error: "not found" }, 404, origin);
    } catch (err) {
      return json({ error: err.message || String(err) }, 400, origin);
    }
  },
};
