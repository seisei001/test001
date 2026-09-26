---
name: integrations
description: 外部サービス連携(MCPコネクタ・API)の目次と、新しい連携をスキルとして登録する手順。どの外部サービスが使えるか・どう繋ぐか聞かれたとき、新しいサービスを連携したいと言われたとき、連携をスキルにしてと頼まれたとき、コネクタがうまく動かないときに必ず読むこと。
---

# 外部サービス連携 目次

ユーザーは PC を持たず iPhone だけで作業している。条件は「無料・カード不要・iPhoneだけで設定できる」こと。

## 前提(2026-09-26 時点で確認済み)
- **コネクタ(MCP)は Anthropic 側のサーバー経由**で動くので、Claude Code コンテナのネットワーク制限を受けない。連携はまずコネクタで考える。
- Claude Code コンテナから直接通信できるのは GitHub・Google API・npm・PyPI 程度。huggingface.co、Cloudflare API、Wikipedia などはプロキシで遮断される(環境の Network access 設定で変更可能)。
- カスタムコネクタの追加は、iPhone の Safari で https://claude.ai/settings/connectors →「＋追加」→「カスタムコネクタを追加」。追加すると次の Claude Code セッションにも出てくる。

## 連携一覧
状態: ✅=動作確認済み / 🟡=接続済みだが一部未確認 / ⬜=未接続(候補)

| 分野 | サービス | 状態 | 詳細スキル / メモ |
|---|---|---|---|
| AI実行 | Hugging Face(`HF_Spaces` カスタムコネクタ) | ✅ | `hf-integration` |
| AI実行 | Cloudflare Workers AI | ⬜ | 公式 MCP `https://mcp.cloudflare.com/mcp` を追加すれば使える見込み。無料 1日10,000ニューロン |
| AI実行 | Gemini API | ⬜ | コンテナから到達可。APIキーを環境シークレットに入れれば curl で呼べる |
| データサーバー | Cloudflare D1 / KV(`Cloudflare_Developer_Platform`) | ✅ | 一覧取得を確認(0件)。作成・クエリのツールあり |
| データサーバー | Supabase | ⬜ | 公式コネクタ `https://mcp.supabase.com/mcp`。無料 DB 500MB。7日放置で一時停止 |
| 情報DB | Wikidata | ⬜ | `https://wd-mcp.wmcloud.org/mcp/`(公式・認証不要) |
| 情報DB | e-Stat など行政データ | ⬜ | `https://mcp.n-3.ai/mcp?tools=...`(民間運営) |
| サーバー | Cloudflare Workers | 🟡 | 閲覧のみ。デプロイは GitHub 連携(Workers Builds)で push 時に自動 |
| サーバー | GitHub Actions / Pages | ✅ | WEBアプリハブで利用中(`webapp-hub`) |
| ストレージ | Google Drive | ✅ | 15GB。ファイル一覧取得を確認 |
| ストレージ | Cloudflare R2 | ❌ | 有効化に Cloudflare ダッシュボードでの登録が必要(カード要との情報) |

## 新しい連携をスキルにする手順
1. **実際に動かして確かめる**。読み取り系の操作で接続を確認し、主要な操作を1回は成功させる。失敗した操作もエラー文ごと記録する。
2. `seisei001/test001` の `.claude/skills/<サービス名>-integration/SKILL.md` を作る。
   - frontmatter の `description` に「いつ読むか」を具体的に書く(サービス名、やりたいこと、よくあるエラー文)。
   - 本文の構成: 接続構成(コネクタ名・URL・アカウント)/ ツール一覧 / 基本手順 / 動作実績(日付つき)/ 制限・無料枠 / トラブル対処 / ユーザーへの設定案内。
   - ユーザーはiPhoneだけで作業しているので、ユーザーに頼む操作は「どの画面のどのボタンか」まで書く。
3. この目次の「連携一覧」の行を更新する(状態と詳細スキル名)。
4. 作業ブランチに commit・push する。
