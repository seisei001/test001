const path = require('path');
const express = require('express');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const FETCH_TIMEOUT_MS = 15000;

app.use(express.static(path.join(__dirname, 'public')));

// ページ本文を改行を保ったまま抽出する
function extractText($) {
  $('script, style, noscript, iframe, svg, template').remove();

  const blockTags = new Set([
    'p', 'div', 'br', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'tr', 'blockquote', 'section', 'article', 'pre', 'ul', 'ol', 'table'
  ]);

  const parts = [];
  function walk(el) {
    $(el).contents().each((_, node) => {
      if (node.type === 'text') {
        const text = node.data.replace(/\s+/g, ' ').trim();
        if (text) parts.push(text);
      } else if (node.type === 'tag') {
        walk(node);
        if (blockTags.has(node.name)) parts.push('\n');
      }
    });
  }

  const body = $('body').get(0);
  if (body) walk(body);

  return parts
    .join(' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

app.get('/api/fetch', async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: 'url パラメータが必要です' });
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return res.status(200).json({ url: target, error: '不正なURLです' });
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return res.status(200).json({ url: parsed.toString(), error: 'http または https のURLのみ対応しています' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(parsed.toString(), {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URLLinkContentViewer/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
      return res.json({ url: parsed.toString(), error: `取得に失敗しました (HTTP ${response.status})` });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('html') && !contentType.includes('text')) {
      return res.json({ url: parsed.toString(), error: `HTML以外のコンテンツのため表示できません (${contentType || '不明な形式'})` });
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const title = $('title').first().text().trim() || parsed.toString();
    const text = extractText($);

    res.json({ url: parsed.toString(), title, text });
  } catch (err) {
    const message = err.name === 'AbortError' ? 'タイムアウトしました' : `取得エラー: ${err.message}`;
    res.json({ url: parsed.toString(), error: message });
  } finally {
    clearTimeout(timer);
  }
});

app.listen(PORT, () => {
  console.log(`URL Link Content Viewer running at http://localhost:${PORT}`);
});
