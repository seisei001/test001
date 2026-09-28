---
name: wikipedia-integration
description: Wikipedia(日本語版含む)と Claude の連携(Pipeworx の Wikimedia REST コネクタ)の使い方・制限・トラブル対処。Wikipediaの記事を調べる・要約する・全文を読む、記事の画像や出典や編集履歴を見る、Wikipediaで〇〇を調べてと言われた、Wikipediaコネクタがエラーになった、といったときに必ず読むこと。
---

# Wikipedia 連携スキル

ユーザーは iPhone だけで作業している。Wikipedia の取得はすべて Claude がコネクタ経由で行う。

## 接続構成(2026-09-27 時点で確認済み)
| 項目 | 内容 |
|---|---|
| コネクタ名 | `Wikipeaia`(ユーザーが付けた名前。ツール名は `mcp__Wikipeaia__*`。名前が変わったら `ToolSearch` で `page_summary` を検索して探す) |
| URL | `https://gateway.pipeworx.io/wikimedia-rest/mcp`(claude.ai のカスタムコネクタ) |
| 運営 | Pipeworx(民間の中継サービス。Wikimedia 公式ではない)。認証なし・無料 |
| 中身 | Wikimedia REST API v1。`lang` で言語を指定できる |

同じ Pipeworx の `/wikipedia/mcp` は **英語版専用**(`en.wikipedia.org` 固定)なので使わない。

## 基本ルール
- **日本語版を読むときは必ず `lang: "ja"` を付ける。** 省略すると英語版になる。
- `title` は記事名と完全一致が必要(例: `富士山`、`葛飾北斎`)。

## ツールと動作実績(2026-09-27、lang=ja で確認)
| ツール | 用途 | 結果 |
|---|---|---|
| `page_summary` | 冒頭の要約・説明・サムネイル・Wikidata ID(`wikibase_item`) | ✅ `富士山` で成功 |
| `page_html` | 記事全文(HTML) | ✅ `北斎漫画` で成功。ただし結果が数十万文字になりファイルに保存される → 下記の方法でテキスト化して読む |
| `page_metadata` / `page_references` / `page_media` / `page_revisions` | カテゴリ・他言語版 / 出典 / 画像 / 編集履歴 | 未確認 |
| `featured` | その日の秀逸な記事・よく読まれた記事など | 未確認 |
| `onthisday` | 今日は何の日 | ❌ `lang: "ja"` は 404。英語版のみ対応の可能性 |
| `page_related` | 関連記事 | ❌ 403(Wikimedia 側で提供終了した API) |
| `ask_pipeworx` | Pipeworx 全体への自然文の質問 | ❌ 記事検索は「有料機能」と返される |

`page_html` の結果ファイルをテキストにする:
```python
import json, re, html
d = json.load(open(PATH))              # ツール結果に表示されたファイルパス
h = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', d['html'], flags=re.S)
t = html.unescape(re.sub(r'<[^>]+>', '', h))
t = re.sub(r'\n\s*\n+', '\n', t)
```

## 記事名がわからないとき(検索機能はない)
1. まず思い当たる記事名で `page_summary` を試す。曖昧さ回避ページが返ったら、そこに並ぶ候補から選ぶ。
2. Claude のウェブ検索(WebSearch)で「〇〇 wikipedia」を調べて記事名を確定させる。
3. Wikidata コネクタ(`https://wd-mcp.wmcloud.org/mcp/`)が追加されていれば、その検索ツールで探す。

## 注意
- 民間の中継サービスなので、個人情報や秘密の内容を質問に含めない。
- Wikipedia の本文は CC BY-SA。長く引用するときは出典(記事URL)を添える。
- Pipeworx のコネクタには Wikipedia 以外のツール(市場・企業情報など)も大量に出てくるが、この用途では使わない。

## ユーザーへの設定案内(コネクタが無いとき)
1. Safari で https://claude.ai/settings/connectors を開く
2. 「＋追加」→「カスタムコネクタを追加」
3. 名前 `Wikipedia`、URL `https://gateway.pipeworx.io/wikimedia-rest/mcp` を入れて追加(ログイン不要)
