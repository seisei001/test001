---
name: hf-integration
description: Hugging Face と Claude の連携(MCPコネクタ)の使い方・設定・トラブル対処。Hugging Face のモデル/データセット/Space/論文を探す・読む、Space上のAI(画像生成・画像編集・OCR・音声合成・動画生成など)を実行する、HFコネクタの設定を変える、「gradio=none」エラーが出た、HFで何ができるか聞かれた、といったときに必ず読むこと。
---

# Hugging Face 連携スキル

ユーザーはPCを持たず iPhone だけで作業している。HFの操作はすべて Claude がコネクタ経由で行う。
ユーザーに HF のサイトを操作させるのは「設定変更が必要なときだけ」にする。

## 接続構成(2026-09-26 時点で確認済み)
コネクタは2つある。**実行系は必ず `HF_Spaces` 側を使う。**

| コネクタ名 | 追加方法 | URL | できること |
|---|---|---|---|
| `Hugging_Face`(公式) | claude.ai の公式コネクタ | (公式) | 検索・閲覧のみ。`gradio=none` が組み込まれており **Space の実行は不可** |
| `HF_Spaces`(カスタム) | claude.ai 設定 → コネクタ → 追加 → カスタムコネクタ | `https://huggingface.co/mcp?login` | 検索・閲覧 + **Space 実行が可能** |

- HFアカウント: `seisei0088`(無料プラン、カード未登録)
- カスタムコネクタは claude.ai のチャットにも Claude Code(web) セッションにも出てくる。
- OAuth で付与した権限: リポジトリ読み取り / このアプリが作るリポジトリの作成・管理 / Inference Providers / Jobs。

## ツール(`mcp__HF_Spaces__*`)
| ツール | 用途 |
|---|---|
| `hf_fs` | Hub をファイルシステムのように扱う。`search hf://models QUERY`、`ls hf://models/trending`、`ls hf://papers/daily/latest`、`cat hf://models/OWNER/NAME/README.md` など |
| `hub_repo_search` | モデル/データセット/Space の条件検索(作者・タグ・並び順) |
| `hub_repo_details` | リポジトリ詳細。データセットは `dataset_structure` → `dataset_preview` の順で中身を見る |
| `hf_whoami` | ログイン中のアカウント確認 |
| `dynamic_space` | Space 上のAIを実行。`discover`(一覧)→ `view_parameters`(引数確認)→ `invoke`(実行) |
| `gr1_*` など | HF の MCP 設定「スペースツール」に登録した Space の専用ツール(例: `gr1_z_image_turbo_generate`) |

ツールはセッション開始時は遅延ロード。`ToolSearch` で `select:mcp__HF_Spaces__<name>` を読み込んでから呼ぶ。

## Space 実行の手順
1. `dynamic_space` の `discover` で使える Space を確認(画像生成・画像編集・背景除去・OCR・音声合成・動画生成など十数件)。
2. `view_parameters` で引数を確認してから `invoke`。`parameters` は **JSON文字列**で渡す。
3. 画像などの入力ファイルは **公開URL** で渡す。以前の実行結果のURLも使える。
4. 出力ファイルはツール結果の `source:` パスに保存される。ユーザーに見せるときは scratchpad にコピーして `SendUserFile` で送る。

実績(2026-09-26):
- 成功: `gr1_z_image_turbo_generate`、`dynamic_space` → `evalstate/flux1_schnell`
- 失敗: `not-lain/background-removal`(`Error POSTing to endpoint: Not Found`)。Space 側の不調のことがあるので、同じカテゴリの別 Space を試す。

## 制限・注意
- 無料プランの ZeroGPU は **1日数分**。枠切れならその日は実行できない。試し打ちを連発しない。
- 2026年から、無料アカウントでは Docker/Gradio Space の新規作成に PRO が必要との情報あり(Space を「作る」提案は慎重に)。
- 保存容量: 非公開リポジトリで約100GBまで無料。ただしコネクタにアップロード用ツールはなく、Claude Code のコンテナからは huggingface.co への直接通信がプロキシで遮断されている(ネットワーク設定を広げれば可能)。

## トラブル対処
- **`The invoke operation is disabled because gradio=none is set`**
  公式 `Hugging_Face` コネクタを使っている。`HF_Spaces` 側のツールで実行し直す。
  `HF_Spaces` が見当たらなければ、ユーザーに以下を案内する:
  1. Safari で https://claude.ai/settings/connectors を開く(アプリではなくブラウザ)
  2. 「＋追加」→「カスタムコネクタを追加」、URL `https://huggingface.co/mcp?login`
  3. HF の許可画面で「Authorize」
- **使いたい Space が一覧にない**:ユーザーに https://huggingface.co/settings/mcp の「スペースツール」へ追加してもらう(「ダイナミック・スペース」はオンのままにする)。
- HF の設定画面(huggingface.co/settings/…)と Claude の設定画面(claude.ai/settings/…)をユーザーが取り違えやすい。スクリーンショットのドメインで確認して案内する。
