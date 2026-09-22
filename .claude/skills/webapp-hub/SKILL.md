---
name: webapp-hub
description: seisei001/test001 の「WEBアプリハブ」(GitHub Pagesで公開するミニアプリ集)の運用手順と実装規約。ハブに新しいアプリを追加する・既存アプリ(hello, url-viewer, avatar, workmap, neon-dash, tax-office-pr, smart-box, text-avatar)を修正する・apps.jsonを編集する・公開URLへの反映方法を確認する、といった作業の前に必ず読むこと。
---

# WEBアプリハブ 運用スキル

## リポジトリと公開
- GitHub: `seisei001/test001`
- デフォルトブランチ: `docs`(=公開ブランチ)
- 公開URL: https://seisei001.github.io/test001/
- GitHub Pages: **設定済み・変更不要**(Source: Deploy from a branch / Branch: `docs` / Folder: `/docs`)
- `resources` ブランチ: 再利用可能なコード資産置き場(例: `autovrm/`)。ハブ公開とは無関係。

## 構成
```
docs/
  index.html            … ハブページ。apps.json を fetch してカードを自動描画(編集不要)
  apps.json             … アプリ一覧マニフェスト(配列。並び順=ハブの表示順)
  apps/<id>/index.html  … 各ミニアプリ本体(必要なら app.js / style.css / lib/ 等を同じフォルダに)
server.js, package.json … url-viewer のローカル動作用(Pages公開には無関係)
sample-urls.txt         … url-viewer の動作確認用URLリスト
```

## 収録アプリ(docs/apps.json の現状)
| id | 名前 | path | 概要・備考 |
|---|---|---|---|
| hello | 📝 ひとことメモ | apps/hello/ | localStorage保存の簡易メモ。単一ファイル構成の見本 |
| url-viewer | 🔗 URLリンク内容ビューア | apps/url-viewer/ | URLを順に開いて内容を確認・編集・保存。Pages上は公開CORSプロキシ経由、ローカルは `npm start`(server.js)で `/api/fetch` を使用 |
| avatar | 🧍‍♀️ VRMアバター | apps/avatar/ | 自律行動するVRMアバター。`lib/` は `resources` ブランチの `autovrm` のコピー。ライブラリ修正は先に `resources` 側で行ってから反映 |
| workmap | 🗺️ WorkMap | apps/workmap/ | タスク分解ツリー+ガントチャート |
| neon-dash | ⚡ ネオン・ダッシュ | apps/neon-dash/ | 1タップのミニゲーム。ダーク固定デザイン(例外、後述) |
| tax-office-pr | ⚖️ 税理士事務所PRサイト | apps/tax-office-pr/ | 診断コンテンツ付きPRサイト |
| smart-box | 🎙️ 賢い箱 | apps/smart-box/src/ui/ | 開発中の会話AI。本体は `src/ui/` 配下のため path と戻るリンクの階層が他と異なる(`../../../../`) |
| text-avatar | 📖 テキストアバター | apps/text-avatar/ | テキストをClaudeで解析しVRMアバターに朗読・演技させる。ユーザー自身のAnthropic APIキー(localStorage保存)が必要 |

アプリを追加・削除・改名したら、この表と `README.md` の「収録アプリ」も更新すること。

## 新しいアプリを追加する手順
1. `docs/apps/<新アプリid>/index.html` を作成する。
   - 基本は単一ファイルで完結する自己完結型(JS/CSSはインラインでよい)。大きくなれば `app.js` / `style.css` に分割してよい。
   - ビルド工程は使わない。外部ライブラリが必要なら import map 等でCDN(jsdelivr 等)から読み込む(avatar / text-avatar が例)。
   - id は英小文字とハイフン(例: `neon-dash`)。
2. `docs/apps.json` の配列末尾に1件追加する(JSONとして正しいことを確認):
   ```json
   {
     "id": "アプリid",
     "name": "アプリ名",
     "description": "簡単な説明",
     "path": "apps/アプリid/",
     "icon": "絵文字アイコン"
   }
   ```
   `path` は `docs/` からの相対パスで、末尾は `/`。index.html がサブフォルダにある場合はそこまで書く(smart-box 参照)。
3. このスキルの「収録アプリ」表と `README.md` の「収録アプリ」に追記する。
4. コミットして push する。
   - セッションで作業ブランチが指定されている場合はそのブランチに push し、PR → `docs` へマージで公開。
   - 指定が無ければ `docs` に直接 push してもよい。
5. `docs` に入ってから数分で公開URLのハブに自動反映される。**Pages の設定変更は一切不要。**

## 既存アプリを修正する手順
- 該当する `docs/apps/<アプリid>/` の中身を直接編集して push するだけ(反映の流れは上記4〜5と同じ)。
- 名前・説明・アイコンを変えるときは `docs/apps.json` の該当エントリも直す。
- avatar の `lib/` / `animations/` は `resources` ブランチの `autovrm` が正。ライブラリ自体の修正はまず `resources` 側で行う。

## アプリ実装時の規約(新規アプリは必須)
1. `<head>` に以下を含める(モバイル対応・ホーム画面追加対応)。`<html lang="ja">` と `<meta charset="UTF-8">` も付ける。
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
   <meta name="theme-color" content="#2563eb">
   <meta name="mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="default">
   <meta name="apple-mobile-web-app-title" content="アプリ名">
   ```
   `theme-color` の既定はハブと同じ `#2563eb`。アプリ固有の配色がある場合はそのアプリの主色に合わせてよい(avatar, neon-dash, tax-office-pr, smart-box, text-avatar が該当)。
2. ヘッダーに `<a class="back-link" href="../../">← ハブに戻る</a>` を置く(階層が深い場合は相対パスを調整)。
3. ダークモード対応: `:root { color-scheme: light dark; }` と `@media (prefers-color-scheme: dark)` で配色を切り替える。配色はCSS変数(`--bg`, `--panel-bg`, `--border`, `--text`, `--muted`, `--accent`)で定義するとハブと揃う。
   - 例外: ゲーム等で意図的にダーク固定にする場合のみ `color-scheme: dark` 可(neon-dash)。
4. データ保存は `localStorage` を使いサーバー不要で完結させる。`localStorage` は使えない環境があるので読み書きは `try { ... } catch {}` で囲む。
5. ボタン等のタップ領域は最低 44px(`min-height: 44px`)。
6. `input` / `textarea` / `select` の `font-size` は 16px 以上(iOS Safari の自動ズーム防止)。
7. `body` に `env(safe-area-inset-*)` の padding を入れ、ノッチ付き端末で表示が欠けないようにする(ハブ・hello 参照)。

雛形が必要なら `docs/apps/hello/index.html` をコピーして始めるのが最短。

## push 前チェックリスト
- [ ] `docs/apps.json` が正しいJSON(`python3 -m json.tool docs/apps.json` 等で確認)で、`path` のフォルダに `index.html` が存在する
- [ ] 上記「アプリ実装時の規約」を満たしている(meta 6種・戻るリンク・ダークモード・44px・16px)
- [ ] 相対パスのみ使用(`/` 始まりの絶対パスは Pages のサブパス `/test001/` で壊れる)
- [ ] 収録アプリ表(このスキル)と README.md を更新した

## 制約・注意点
- このセッションの GitHub 連携には**新規リポジトリ作成権限が無い**(403)。新しいアプリは必ず既存の `test001` に追加する。
- GitHub Pages 設定(Settings → Pages)の変更はリポジトリ管理者権限が必要で API から触れない。設定済みなので通常は再設定不要。
- APIキー等の秘密情報をリポジトリにコミットしない。必要ならユーザーに入力させ localStorage に保存する(text-avatar 方式)。
