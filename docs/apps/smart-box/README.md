# 賢い箱 (smart-box / conversation-rag-app)

**パーソナル対話日記アシスタント**。今日あったこと・考えていることを書き込むと、過去の
関連する記録をそのまま思い出させてくれたり(要約・解釈はしない)、初めての話題なら深掘りする
質問を投げかけてくれたりする。軽量BERT(embedding抽出) + RAG(履歴検索) + LoRA(検索の
再ランキング・質問頻度のパーソナライズ)で構成される、ブラウザ完結型・サーバー不要のアプリ。

**現在の状態**: 設計フェーズ完了。各モジュールはJSDocインターフェースのみのスタブ
(`throw new Error('not implemented')`)で、動作するUIはまだ無い。そのため
`docs/apps.json`(ハブ一覧)には未登録。

詳しくは [`DESIGN.md`](./DESIGN.md) を参照してください。当初はGoogle Drive上の設計資料
(00_README〜07_COWORK_SESSION_HANDOFF)を統合しただけでしたが、2026-09-19のレビューで
「応答生成方式が未定義」「LoRAの適用対象が生成モデル不在と矛盾」という構造的な欠落が
見つかり、ドメインを「パーソナル対話日記」に確定した上で全面的に設計し直しています
(DESIGN.md 付録B参照)。

## クイックスタート(開発時)

```bash
cd docs/apps/smart-box
npm install
npm run test:unit
```

本番の実行はビルド不要(ブラウザネイティブESM + import map)。`npm`は開発時のテスト
実行にのみ使う。

## 次にやること

[`DESIGN.md`](./DESIGN.md) の「12. 次にやること」を参照。優先度順に:

1. PCA射影行列・BERTモデルの配置([`models/README.md`](./models/README.md))
2. 日記UI(`src/ui/`)の実装(テキスト入力→保存→3種類の応答のいずれかを表示)
3. `BERTInference.embed()` → `RAGSearch.search()`(confidence算出込み) →
   `QuestionGenerator` → `TurnController` の順に実装し、Core loop(surface_related /
   question / acknowledge の3分岐)を動かす
4. Core loopが動いたら `docs/apps.json` に登録してハブに公開する

LoRAによるパーソナライズ(検索結果の再ランキング・質問頻度の調整)はPhase 2。
