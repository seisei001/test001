---
name: webapp-hub
description: seisei001/test001 の「WEBアプリハブ」(GitHub Pagesで公開するミニアプリ集)の運用手順と実装規約。ハブに新しいアプリを追加する・既存アプリ(hello, url-viewer, avatar, workmap, neon-dash, tax-office-pr, smart-box, text-avatar, novel-note, gif-gallery)を修正する・apps.jsonを編集する・公開URLへの反映方法を確認する、といった作業の前に必ず読むこと。
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
| url-viewer | 🔗 URLリンク内容ビューア | apps/url-viewer/ | URLを順に開いて内容を確認・編集・保存。Pages上は公開CORSプロキシ経由、ローカルは `npm start`(server.js)で `/api/fetch` を使用。「内容を保管」はWeb Share APIで共有シートを開き(非対応環境はダウンロード)、ファイル名はURL末尾番号→本文1行目「第N話」の順で `001.txt` 形式を自動入力(手修正可)。保存内容はエディタの本文のみ。本文欄上の「📋 貼り付け」は `navigator.clipboard.readText()` で本文を置き換え(不可時は長押し貼り付けを案内)、「クリア」あり。本文欄は画面の約1/4(22dvh、最小120px) |
| avatar | 🧍‍♀️ VRMアバター | apps/avatar/ | 自律行動するVRMアバター。`lib/` は `resources` ブランチの `autovrm` のコピー。ライブラリ修正は先に `resources` 側で行ってから反映 |
| workmap | 🗺️ WorkMap | apps/workmap/ | タスク分解ツリー+ガントチャート |
| neon-dash | ⚡ ネオン・ダッシュ | apps/neon-dash/ | 1タップのミニゲーム。ダーク固定デザイン(例外、後述) |
| tax-office-pr | ⚖️ 税理士事務所PRサイト | apps/tax-office-pr/ | 診断コンテンツ付きPRサイト。演出は自作の共通部品 `fx.js`(FX.check / FX.scan / FX.cubes / FX.goal)と `fx.css` に集約し、開幕のオープニング・ヒーロー・診断(質問の遷移、探す→考える→結果)・ステップ4・お問い合わせ送信後のGOAL演出で使用。外部素材なし |
| smart-box | 🎙️ 賢い箱 | apps/smart-box/src/ui/ | 開発中の会話AI。本体は `src/ui/` 配下のため path と戻るリンクの階層が他と異なる(`../../../../`) |
| text-avatar | 📖 テキストアバター | apps/text-avatar/ | テキストをClaudeで解析しVRMアバターに朗読・演技させる。ユーザー自身のAnthropic APIキー(localStorage保存)が必要 |
| novel-note | 📚 小説設定ノート | apps/novel-note/ | あらすじ・固有名詞辞書・伏線管理。**データ更新・データ形式・暗号化の手順は `novel-note-update` スキルに従う**。小説データは平文でリポジトリに置かず、`data/` に暗号化して置く(アプリ用の利用者の鍵+AI作業用のマスターキー。マスターキーは利用者の Google Drive にだけある)。アプリで作者が直した内容は端末に保存し、「データ更新を依頼」で依頼文(スキル名・作業・修正データ)としてコピーされる |
| sakaguchi-office | ⚖️ 坂口誠税理士事務所 | apps/sakaguchi-office/ | 坂口誠個人のサイト(統合サイトは没。顔出しなし・他の専門家は出さず、上原佑介はフッターに「パートナー」と小さく1行のみ)。**総合パートナーズ版の演出をそのまま流用**(`opening.js`=四角→円筒→球→GOAL→円筒、`scenes.js`=重なる面/横スクロール/球体/窓/扉、`fx.js/fx.css`、`mode.js`)。総合版と同じハッシュルーター+ワイプ遷移(`#/`=演出のトップ、`#/strength` `#/consult` `#/faq` `#/contact`)。`app.js`=ページ本体、`sakaguchi.js`=比較タブ・FAQ・リスク診断データ(RISK)、`consult.js`=診断UI(単独モード)。**演出部品は勝手に作り直さず、sogo-partners側と同期して使う**。連絡先・料金は準備中。更新時は `index.html` の `?v=`・`APP_VER` と `data/version.json` をそろえる |
| key-journal | ⌨️ キー仕訳(試作) | apps/key-journal/ | キーボード特化の仕訳入力(単一ファイル)。F2=仕訳日記帳(1行・金額は反対側へ自動入力)、F3=振替伝票(複数行・借貸合計と差引表示・空の金額欄で「+」=差額入力)。科目はコード/ローマ字/ひらがな/名称で検索(`ACCOUNTS` 配列、読み付き)。保存は localStorage(`journal`)、CSV出力あり。弥生の画面・名称は模倣せず独自デザイン |
| pdf-editor | 📄 PDFエディタ | apps/pdf-editor/ | **改善作業の手順・構造・ハマりどころは `PDFアプリ` スキル(`.claude/skills/pdf-app/`)に従う。** pdf-lib+PDF.js(jsdelivr CDN)でブラウザ内完結。新規/開く/結合/分割/回転/削除/並べ替え/空白追加、元に戻す、ダウンロード。**文字・画像はページ上をドラッグして範囲を指定→その場で入力**(DOMオーバーレイの部品。選択して訂正・移動(✥)・サイズ変更(⇲)・削除、「文字として(M PLUS 1pを非subsetで確定時に1回だけ埋め込み)/画像として(canvas画像で見た目固定)」を部品ごとに切替)。**「🔍 画像の文字を認識」モード=OCR**(tesseract.js 5.1.1 をjsdelivrから使うときだけ動的に読み込み、認識データは `@tesseract.js-data/jpn|eng@1.0.0/4.0.0_best_int`(日本語約2MB)。範囲(またはページ全体ボタン)を `renderRegion` で2.5〜4倍に描画→認識→語単位の run に変換(行の文字サイズは語ごとの幅÷文字数の中央値、隠す範囲は語の実bbox)→既存の `buildBlocks`/`newFix` で編集できる部品に。画像内の縦線は画素から検出して `seps.v` に追加。**OCRは文字の塊ごと**(画像解析で塊に分け、塊ごとに最適倍率で認識し、塊ごとに文字サイズ・行間・揃いを推定、ページ全体で近いサイズをそろえる)。文字揃い(左/中央/右)対応。背景に模様があるときだけ認識前に背景を消す。「📐 歪み補正」(一括=四隅の台形補正/部分=範囲指定+4辺のベジェ曲線、プレビューつき。補正したページは画像になる)。隠す色は枠の外側の一周の中央値。部品は常にページ内に収める(`clampToPage`)。元の画像の文字は背景色の矩形で隠して重ねる)。**「✋ 選択・訂正」モード(初期)**(PDF上の文字をタップ/ドラッグすると編集できる部品になる。文字のない所をドラッグすると新規の文字枠、文字のない所のタップは選択解除。「＋文字」はPDFの文字の上でも新規枠を作る。別モードだった「PDFの文字を直す」は統合済み)(範囲選択・タップは `buildBlocks` でまとまりに分ける。**横**: 文字サイズが同じ(±15%)なら1つの枠(離れた文字の間は元の間隔に近い数の空白で再現)。分けるのは「大きな空白(初期=文字サイズの10倍以上、`fxGap`で調整)」「間に縦線・点線(PDFの描画命令を `getOperatorList` で読んで検出=`loadSeps`)」「点線代わりの文字列(....や―)」。**縦**: 行間1.7倍以内で左揃い/重なりかつサイズ近似なら同じ段落、間に横線があれば分ける。チェックで範囲内を全部1つの枠にまとめることも可。選択前の点線ガイドも、実際に選ばれる単位(`blockOf` のまとまり)で描く。確定時は全セルの「隠す四角」を先に描いてから文字を描く。訂正・加筆は枠内で編集、削除は「元のPDFの文字を消す」ボタン=cover矩形のみ描いて文字は置かない)はPDF.jsのgetTextContentで文字位置を取り、タップ/ドラッグで選んだ範囲を背景色の矩形で隠して新しい文字を重ねる方式(元の文字データは内部に残る=黒塗り用途には不可)。横書きのみ。文字サイズは初期値10.5pt。**範囲選択した文字だけ**サイズ変更でき(部品に `size`(基準)と `sz[]`(1文字ごとのサイズ、nullは基準)を持つ。枠は `contenteditable` で、spanの `data-s` ⇄ `sz[]` を `buildText`/`serialize` で相互変換。Enterは `<br>` に統一)、枠の右クリックメニューやパネルで変更(選択なしなら枠全体)。折り返しは**単語の区切りのみ**(`word-break:keep-all`+`<wbr>`。日本語は `Intl.Segmenter("ja")` で単語に分け、句読点・閉じ括弧は前の語に付ける=`breakSet`)。確定時の行分けも、非表示DOMで実際の折り返しを測る(`measureHost`/`layoutText`)ので入力中と必ず一致する。枠が足りなければ自動で広げる(`growToFit`: 単語が枠より長ければ幅、行数が多ければ高さ。入力・サイズ変更・確定時)。枠の右下⇲をドラッグすると、枠に収まる最大の文字サイズへ自動調整(`fitSize`: 二分探索で `layoutText` の高さ ≤ 枠の高さ、0.5pt刻みの切り捨て、`sz[]`は相対比を保って倍率適用、チェックボックスでOFF可)。確定・ページ操作・保存時にまとめてPDFへ反映(行ごとに最大サイズでベースラインを決める `layoutText`)。入力中の枠と確定後を一致させるため、枠のフォントはFontFaceでM PLUS 1pを読み込み(「画像として」は端末フォント)、1行目のベースライン位置は枠と出力で同じ計算(baseOff)を使う。pdf-lib+fontkitのsubset埋め込みは日本語で欠字するため使わない |

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
