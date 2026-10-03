# 引き継ぎメモ: アニメGIFギャラリー (gif-gallery)

作業ブランチ: `claude/gif-gallery`(まだ `docs` には入っていない=未公開)

## ユーザーの依頼(原文の要旨)
- ゲーム系の無料・商用利用OKの3D風アニメGIFを、5人のサブエージェントでテーマ別に20個ずつ集める
- それを Googleドライブ にも置く
- 実際に動きを見るソフト(ビューア)をハブアプリに入れる
- 方針: 「クリックしたら3D画像が動き出す」体験。将来は税理士事務所PRサイト(docs/apps/tax-office-pr)の演出にも使う想定(連番画像のパラパラ方式)

## 完了していること
- ビューア `docs/apps/gif-gallery/index.html`
  - カテゴリ別タブ、サムネイルをタップで再生/停止、「表示中をすべて動かす/止める」
  - 「コマ送りで見る」: ImageDecoder で GIF を分解し、再生/停止・1コマ送り・コマのスライダー・速さ(0.25〜3x)。非対応ブラウザは通常再生
  - ヘッドレスChromiumで動作確認済み(カード表示・コマ送りOK、エラーなし)
- 素材 `docs/apps/gif-gallery/gifs/<cat>/` と `gifs/manifest.json`(file/poster/title/author/license/source/note/cat)
  - chara 20 / item 20 / effect 20 / vehicle 20 (+ world は最終的に集まった分。下記)
  - ライセンスは CC0 / CC-BY / CC-BY-SA / BSD / NASA(Public Domain)。NC・ND は除外済み
  - 注意: Flare / Endless Sky 由来は CC-BY-SA(継承条件あり)。concept-car-turn は CC-BY-4.0(作者表記必須)。NASA素材はロゴ使用・推奨表示の禁止に注意。es-nuke-flash は作者が2候補(meta に記載)

## 残りの作業
1. `docs/apps.json` の末尾に追加:
   `{"id":"gif-gallery","name":"アニメGIFギャラリー","description":"商用利用OKのゲーム素材アニメをタップで動かし、コマ送りでも見られるギャラリー","path":"apps/gif-gallery/","icon":"🎞️"}`
2. `.claude/skills/webapp-hub/SKILL.md` の収録アプリ表と `README.md` の「収録アプリ」に追記
3. ハブ規約チェック(meta 6種・戻るリンク・ダークモード・44px・16px)→ `docs` へマージして公開(PR経由 or 直接push。スキル参照)
4. Googleドライブ: 新しいフォルダ(例「アニメGIF素材」)を作り、manifest.json を元にした一覧表(題名・カテゴリ・作者・ライセンス・出典・GIFの公開URL)をスプレッドシート(CSVを text/csv でアップロード→自動変換)で置く。
   - GIF本体のアップロードは、Drive コネクタが base64 を手で渡す方式のため100件は現実的でない。一覧表+GitHub/公開URLで代替することはユーザーに説明済み
   - 公開URL形式: `https://seisei001.github.io/test001/apps/gif-gallery/gifs/<cat>/<file>`
5. ユーザーへ報告(説明は概要を短く、レベル1から。ユーザー設定参照)

## 環境メモ
- 外部接続は github.com(git clone)と raw.githubusercontent.com、npm/PyPI くらいしか通らない(opengameart/itch/kenney.nl/HF などは403)
- 関連: 税理士事務所PRの単独版は Googleドライブ「税理士事務所PRサイト(単独版)」フォルダ(id: 1y4lkhVIHdEYB97S0kpQ1Ap1qM7yh6Mef)に置いてある。ハブ側 tax-office-pr はまだ「上原祐介」表記のまま(正しくは「上原佑介」)
