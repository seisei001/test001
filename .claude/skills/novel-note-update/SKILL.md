---
name: novel-note-update
description: 「小説設定ノート」(docs/apps/novel-note)のデータ更新の手順と、あらすじ・固有名詞辞書・伏線を作るときの定型の指示。アプリの「データ更新を依頼」でコピーされた依頼文(先頭に novel-note-update スキルの名前がある)を受け取ったとき、小説の次の話を追加するとき、本文の修正をデータに反映するとき、作者の修正データを取り込むとき、小説設定ノートのアプリやデータ形式を直すときに必ず読むこと。
---

# 小説設定ノート データ更新スキル

利用者(作者)がアプリで作った依頼文を Claude Code などに貼り付けると、このスキルの手順でデータを更新する。
ハブのアプリ全般の規約(meta・ダークモード・PR の流れなど)は `webapp-hub` スキルに従う。

## 全体像

| もの | 置き場所 | 公開 | 説明 |
|---|---|---|---|
| アプリ本体 | `docs/apps/novel-note/`(index.html / app.js / style.css) | 公開 | ハブのミニアプリ |
| 暗号化した正本データ | `docs/apps/novel-note/data/<作品id>.enc.json` | 公開(暗号化) | アプリ用とAI作業用の2つの鍵で開ける |
| 作品一覧 | `docs/apps/novel-note/data/index.json` | 公開 | 更新日時。アプリはこれを見て自動更新する |
| 利用者の鍵 | `docs/apps/novel-note/data/keys.json` | 公開 | 公開鍵+パスワードで暗号化した秘密鍵(アプリの初回設定で作成) |
| 本文ハッシュ | `docs/apps/novel-note/data/<作品id>.hashes.json` | 公開 | 前回データ作成時の各話の本文の指紋。変更チェック用 |
| マスターキー | Google Drive「shousrtsu」の `novel-note-master-key.json` | **非公開** | AI が正本データを取り出すための鍵。**リポジトリに入れない** |
| 小説の本文 | Google Drive「shousrtsu」の `N6924DF.txt`(なろうの投稿済み作品テキストダウンロード。ZIP の中身) | **非公開** | 作者が改稿したら取り直して置く |
| 処理スクリプト | `tools/novel-note-*.mjs` | 公開 | Node 18 以降。追加パッケージ不要 |

- Google Drive は `sakatano01@gmail.com`。フォルダ「shousrtsu」の ID は `1HUGOMdKgsD1wIq1KMgVBCWviCpFPhh3x`。
- 平文の小説データ・本文・マスターキーは、リポジトリにもチャットの公開場所にも置かない。作業ファイルはスクラッチ(一時)フォルダに置く。
- 作品: 「欠陥だらけの天才魔術師」作品ID `n6924df`(なろう N6924DF、全412話)。他の作品も同じ形式で追加できる(作品ごとに `<作品id>.enc.json`)。

## 依頼文の形

アプリの「データ更新を依頼」でコピーされる。例:

```
novel-note-update スキルで、小説設定ノートのデータを更新してください。
作品: 欠陥だらけの天才魔術師(作品ID: n6924df)
今の収録: 第1〜20話 / 全412話
今回の作業:
- 本文の変更チェック: …
- 作者の修正を反映(下の「修正データ」3件)…
- 次の話を追加: 第21〜40話
- 最後に暗号化してハブに置き、PR を作ってマージする
修正データ:
```json
{"format":"novel-note-edits","version":2,"workId":"n6924df","episodes":{…},"terms":{…},"threads":{…}}
```
```

チェックが外れている作業はしない。修正データは平文の小説情報なので、一時フォルダの `edits.json` に保存して使う(コミットしない)。

## 手順

作業フォルダを `W`(スクラッチフォルダ)とする。

1. **ブランチ**: セッションで指定された作業ブランチを `origin/docs` から作り直す(`git fetch origin docs && git checkout -B <ブランチ> origin/docs`)。
2. **マスターキーを取る**: Drive の shousrtsu から `novel-note-master-key.json` を探して(`search_files` で title と parentId)ダウンロードし、`W/mk.json` に保存。Drive が使えない環境なら利用者に貼ってもらう。
3. **正本データを取り出す**:
   `node tools/novel-note-encrypt.mjs decrypt <作品id> W/mk.json W/base.json`
4. **本文を用意する**: shousrtsu の最新の `N6924DF.txt`(同名が複数あれば modifiedTime が新しいもの。ZIP しかなければ展開)をダウンロードして `W/src.txt` に保存し、話ごとに分ける:
   `node tools/novel-note-split.mjs W/src.txt W/eps`
5. **本文の変更チェック**(依頼にある場合):
   `node tools/novel-note-diff.mjs W/eps/meta.json <作品id>` → `changed` が直す話。`removed` があれば利用者に確認する。
6. **作者の修正を先に取り込む**(依頼にある場合):
   `node tools/novel-note-merge.mjs --base W/base.json --texts W/eps --edits W/edits.json --out W/base.json`
   ここで直された項目には `authorEdited` が付き、以後のパッチでは変わらない。
7. **AI の作業**: 対象の話(変更された話+追加する話)を読み、下の「パッチの書き方」に従って `W/patch.json` を作る。
   - 読む前に `node tools/novel-note-context.mjs W/base.json <話数…>` で、その話の今のデータ・未回収の伏線・固有名詞の一覧を確認する。
   - 本文は `W/eps/NNN.txt`。20話ずつ、順番に読む(多い場合は20話ごとにパッチを分けて 8 を繰り返してよい)。
8. **取り込み**:
   `node tools/novel-note-merge.mjs --base W/base.json --texts W/eps --patch W/patch.json --out W/new.json`
   エラーが出たらパッチを直してやり直す。「注意」に出た内容(作者の修正を守った項目、本文に見つからない固有名詞など)は最後の報告に書く。
   このとき `docs/apps/novel-note/data/<作品id>.hashes.json` も更新される。
9. **暗号化してハブに置く**:
   `node tools/novel-note-encrypt.mjs data W/new.json W/mk.json`(`<作品id>.enc.json` と `index.json` が更新される)
   確認: `node tools/novel-note-encrypt.mjs decrypt <作品id> W/mk.json W/check.json` で取り出せること。`grep` で enc/hashes/index に本文の言葉が含まれていないこと。
10. **PR**: 変更されるのは `docs/apps/novel-note/data/` の3ファイル(enc / index / hashes)だけのはず。コミット → push → PR 作成 → マージ(依頼文に「マージする」とある場合)。
11. **報告**: 利用者に、追加・更新した話数、新しい固有名詞と伏線の数、回収済みにした伏線、「要確認」を付けた項目、merge の注意を伝える。アプリは開き直せば自動で最新になる。

## パッチの書き方(形式)

```json
{
  "format": "novel-note-patch", "version": 1, "workId": "n6924df",
  "episodes": [ { "no": 21, "summary": "…" } ],
  "terms": [
    { "id": "mero", "historyAdd": [ { "ep": 23, "note": "…" } ] },
    { "id": "new_id", "name": "…", "reading": "", "aliases": [], "category": "person", "description": "…", "history": [ { "ep": 21, "note": "…" } ] }
  ],
  "threads": [
    { "id": "f001", "status": "resolved", "payoff": [7, 33], "resolution": "第33話で…と明かされる" },
    { "id": "f028", "title": "…", "summary": "…", "kind": "mystery", "status": "open", "setup": [21], "payoff": [], "resolution": "", "tags": ["…"], "related": ["f001"] }
  ],
  "removeTerms": [], "removeThreads": []
}
```

- 既存の項目は id(話は no)で指定し、変える項目だけ書く。新しい項目は全項目を書く。
- 話のタイトル・章・字数・固有名詞の登場話(`episodes`)は merge が本文から自動で付ける。パッチに書かない。
- `history` を書くと置き換え、`historyAdd` は追記。
- `authorEdited` にある項目は変えない(変えようとしても merge が無視する)。
- id の付け方: 固有名詞は英小文字とアンダースコア(例 `goblin_king`)、伏線は `f` + 3桁の連番、食い違い候補は `c` + 3桁の連番(既存の最大番号の次から)。既存の id は変えない。

## 作成の定型指示(毎回この基準で作る)

### あらすじ(episodes.summary)
- 100字前後(80〜120字)。その話で起きた出来事を、主語をはっきりさせて時系列で書く。
- 新しく登場した重要人物・場所・能力の名前は入れる。感想や評価は書かない。
- 設定資料回(博覧誌・人物紹介など)も本編と同じ扱いで、何を解説している回かを書く。前書き・後書きの設定補足も対象にする。

### 固有名詞(terms)
- 種類(category): `person`(人物・神・天使・精霊以外の人格)/ `place`(地名・国・世界・施設)/ `magic`(魔法・スキル・職業・技)/ `thing`(アイテム・組織・種族・魔物・精霊・通貨など)。
- 物語に2回以上出るか、物語上意味のある名前を載せる。一般名詞(剣・宿など)は載せない。
- `description` は1〜3文。その時点までに本文で分かっていることだけを書く(後の話のネタバレを先取りしない。ただし博覧誌など作者の設定資料に書かれた内容は書いてよい)。
- 表記ゆれ・別名・読みは `aliases` に入れる(登場話の数え上げに使われる)。カタカナ名はフルネームと呼び名の両方を入れる。
- 話ごとに変化があれば `historyAdd` に `{ep, note}` を足す(クラスチェンジ、正体の判明、レベル、職業、所属の変化など)。主要人物は必ず、それ以外は大きな変化だけ。

### 伏線(threads)
- 種類(kind): `mystery`(伏線・謎: 意味ありげな描写、明かされていない正体や過去、「いずれ分かる」と書かれたもの)/ `promise`(約束・予告・目標: 「いつか…する」、次の目的地、誓い、予言)/ `inconsistency`(設定の食い違い候補: 名前・数値・日数・設定の不一致、表記ゆれ)。
- 状態(status): `open`(未回収)/ `partial`(一部回収)/ `resolved`(回収済)/ `contradiction`(矛盾あり)/ `check`(要確認)/ `ok`(問題なし)。食い違い候補は必ず `check` で作り、判断は作者に任せる。`contradiction` と `ok` は作者が付ける。
- `setup` は張られた話、`payoff` は回収された話・関係する話。`resolution` には「第N話で…」と回収のされ方を書く(未回収なら空か現状)。
- 新しい話を読んだら、未回収・一部回収・要確認の既存の伏線(context の `openThreads`)が回収・進展していないか必ず確認し、該当すれば status / payoff / resolution を更新する。
- 似た伏線・関係する伏線は `related` でつなぎ、`tags` に人物名・テーマを入れる(アプリの「似ている伏線」と検索に使われる)。
- 本文の変更で消えた描写に基づく伏線は、削除せず `check` にして resolution に「第N話の改稿で描写が変わった」と書く。

### 本文を修正した話の扱い
- あらすじを最新の本文で書き直す(作者が直したあらすじは変えない)。
- その話を setup / payoff に含む伏線、その話の history を見直す。食い違い候補が改稿で解消していれば status を `resolved` にし、resolution に「第N話の改稿で解消」と書く。

## 最後のチェック
- merge がエラーなく通る(収録範囲に抜けがない・id の重複がない・関連先が存在する)。
- 新しく追加した固有名詞が本文に見つかる(見つからない警告が出たら aliases を直す)。
- decrypt で取り出した内容が new.json と同じ。
- リポジトリに平文データ・本文・マスターキー・修正データが入っていない(`git status` と `git diff --stat` で確認)。

## アプリ側を直すとき
- `docs/apps/novel-note/` を直したら、index.html の `?v=` を上げてキャッシュを避ける。
- データ形式を変えるときは、`tools/novel-note-merge.mjs`・アプリ・このスキルをそろえて直す。
- 編集できる項目は `EDIT_FIELDS`(app.js と tools/novel-note-lib.mjs の両方)で決まっている。
- アプリの鍵をなくした(利用者がパスワードを忘れた)ときは、利用者がアプリで「鍵を作り直す」→新しい鍵のJSONを受け取り `node tools/novel-note-encrypt.mjs keys <json>` → 正本を decrypt して `data` で暗号化し直す。
