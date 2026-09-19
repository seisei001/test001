# 賢い箱 (smart-box / conversation-rag-app)

ユーザーとの会話を通じて、その人固有の好みを学習していくブラウザ完結型の会話AIアシスタント。
軽量BERT(意図分類・embedding) + 質問駆動型RAG(会話履歴検索) + 多次元LoRA(オンライン
パーソナライズ)で構成される。

**現在の状態**: 設計フェーズ完了。各モジュールはJSDocインターフェースのみのスタブ
(`throw new Error('not implemented')`)で、動作するUIはまだ無い。そのため
`docs/apps.json`(ハブ一覧)には未登録。

詳しくは [`DESIGN.md`](./DESIGN.md) を参照してください。設計はGoogle Drive上の
`conversation-rag-app` フォルダにある8本の資料(00_README〜07_COWORK_SESSION_HANDOFF)を
統合したもので、config数値は直近(07)の決定を正としています。

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
2. チャットUI(`src/ui/`)の実装
3. `BERTInference` → `RAGSearch` → `QuestionGenerator` → `TurnController` の順に実装し、
   Core loop(質問 or 直接応答)を動かす
4. Core loopが動いたら `docs/apps.json` に登録してハブに公開する
