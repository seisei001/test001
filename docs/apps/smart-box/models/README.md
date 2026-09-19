# モデル配置について

このフォルダにはONNXモデル本体・トークナイザ・PCA射影行列は**含めない**(サイズが大きく
GitHubリポジトリに不向きなため)。実行時は `configs/system.config.json` の `bertModelUrl` /
`tokenizerUrl`、`configs/rag.config.json` の `pcaMatrixUrl` が指すjsDelivr CDN経由で取得する。

`apps/avatar/` の `autovrm` ライブラリ・アバターモデルが `resources` ブランチから配信されて
いるのと同じ方式で、以下を `resources` ブランチの `models/smart-box/` に配置する想定。

## 必要なファイル(未配置。DESIGN.md 8.3節・8.4節を参照)

| ファイル | 内容 | 状態 |
|---|---|---|
| `bert-base-ja-int8.onnx` | BERT-base-japaneseをint8量子化・ONNX変換したもの(約30MB) | 未取得 |
| `tokenizer.json` | 対応するトークナイザ | 未取得 |
| `pca-projection-768x64.json` | 日本語コーパスからオフラインでfitした768→64次元のPCA射影行列 | 未生成 |

## 次の作業者へ

1. `bert-base-japanese` の公開ONNX変換済みモデル(またはPyTorch版をonnxruntimeでexport)を
   入手し、int8量子化する。
2. JGLUE等の日本語コーパスサンプルをこのモデルに通してembeddingを収集し、PCAをfitして
   768×64の射影行列を得る(scikit-learn等で1回だけ実行するオフライン作業)。
3. 3ファイルを `resources` ブランチの `models/smart-box/` に配置し、
   `docs/apps/smart-box/configs/*.json` のURLが正しく解決することを確認する。
