# 賢い箱 — パソコンローカル版

これは [`docs/apps/smart-box/`](../../docs/apps/smart-box/)(GitHub Pagesで公開している、
スマホ(iPhone Safari)向けの「賢い箱」)から派生した、**オンデバイス生成AI(本体AI)の
検証を続けるためのパソコンローカル専用フォルダ**です。GitHub Pagesでは配信されません
(`docs/`フォルダの外にあるため)。リポジトリをこのフォルダごと`git pull`して、自分の
パソコンのブラウザで動かして検証してください。

## なぜ分けたか

iPhone 14 Safariでの実機検証(`docs/apps/smart-box/DESIGN.md` 第9版〜第20版)の結果、
生成後にWebAssemblyが確保したメモリを解放できず、会話を続けるたびにメモリが高止まりして
タブが強制リロードされる、という構造的な問題が判明しました。これを受け、公開版
(`docs/apps/smart-box/`)ではオンデバイス生成AIの実機検証を一旦終了し、外部LLM
(OpenRouterの無料枠、またはClaude API)のみに頼る設計に切り替えています。

ただしこれはメモリに厳しいiPhone Safari固有の問題である可能性が高く、**潤沢なRAMを持つ
パソコンであれば同じ制約が当てはまらないかもしれません**。そこでこのフォルダで検証を
継続します。

## セットアップ

Node.js不要、ビルド不要(ブラウザネイティブESM)。ローカルでHTTPサーバーを立てて
`src/ui/index.html`を開くだけです(`file://`で直接開くとESM importが動かないため、
必ずHTTPサーバー経由で開いてください)。

```bash
cd local/smart-box-local
python3 -m http.server 8000
# その後ブラウザで http://localhost:8000/src/ui/index.html を開く
```

(Python以外でも、`npx serve` 等お好みの静的サーバーで構いません。)

初回アクセス時、Hugging Faceからモデルファイル(合計600MB程度、`configs/system.config.json`
の`model`セクション参照)が直接ダウンロードされます。このリポジトリやその配布元は何も
自前ホスティングしていません。2回目以降はブラウザのCache Storage APIでキャッシュされ、
再ダウンロードは発生しません。

## 公開版(`docs/apps/smart-box/`)との違い

| 項目 | 公開版(docs/apps/smart-box/) | ローカル版(このフォルダ) |
|---|---|---|
| 配信 | GitHub Pages(スマホ含む誰でもアクセス可) | 配信しない(git pullしてローカル実行) |
| `mockMode` | `true`(本体AIはダミーテンプレート) | `false`(本体AIが実際に生成AIで応答) |
| 生成モデル | (未使用) | `onnx-community/Qwen2.5-0.5B-Instruct` |
| embeddingモデル | 無効化 | 有効(`multilingual-e5-small`) |
| `runtime.backend` | `wasm`(iPhone Safari向けにWebGPU不使用) | `webgpu`(fallback: `wasm`) |
| 実際にAIらしい回答を得る方法 | 設定(⚙️)から外部LLM連携を有効化 | 何もしなくても本体AIが生成する(外部LLM連携も任意で併用可) |

設定値は自由に調整してください。パソコンのメモリ・GPU状況に応じて、より大きい/小さい
モデルを試したり、`runtime.numThreads`や`max_new_tokens`
(`src/modules/core-model/CoreModel.js`の`generate()`内)を変えたりして構いません。

## 元の設計ドキュメント

このフォルダの [`DESIGN.md`](./DESIGN.md) は `docs/apps/smart-box/DESIGN.md` の
コピーです(第21版時点)。以後の改訂は両者で別々に進める想定です
(公開版はLLM連携まわり、ローカル版はオンデバイス生成AIまわりが主な変更点になる見込み)。
