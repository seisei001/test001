## 0. このドキュメントの位置づけ・改訂履歴

「賢い箱」は、ブラウザ内で完結する**極小の生成AI**(量子化済み・LoRA+RAG+プロフィール
メモ)を核とし、ポッドキャストアプリ風の汎用UIをまとった、会話するたびに賢くなる
アシスタントである。外部LLM(ユーザーが任意でAPIキーを設定)を「先生役」として併用でき、
その場合はユーザー・LLM・本体AI自身の三者の会話を使って本体AIを賢くしていく。

このドキュメントは4段階の改訂を経ている:

1. **初版**: Google Drive上の資料(`conversation-rag-app` フォルダ、00〜07)を統合。
   BERT+RAG+LoRAのアーキテクチャのみが決まっていて、ドメイン(何をするアプリか)は
   未決定だった。
2. **第2版**: ドメインを「パーソナル対話日記」と誤って推測し、応答を「過去エントリの
   提示・テンプレート質問・固定確認文」の3類型に限定、生成モデルを排除する設計にした。
   →ユーザーから「勝手に別のアプリになっている」と指摘され誤りと判明。
3. **第3版**: ユーザーとの対話で判明した正しいコンセプトに基づき全面改訂。
   - UI: ポッドキャストアプリ風の汎用デザイン(他アプリにも転用できる見た目)
   - 中身: 本体AI自身が量子化された小さな生成モデル+LoRA+RAGを持ち、会話するたびに
     賢くなる。外部LLM無しでも単体で動作する(自己完結)
   - 任意でLLM API連携: ユーザー・LLM・本体AIの三者の会話を使い、LLMの回答を
     教師信号としてLoRAを更新する(蒸留)
   - **本体AIの生の重みは絶対にファインチューニングしない**。フルファインチューニングは
     データ量的にもモデルが破綻するリスク的にも実用にならないため、常にLoRAアダプタ
     (数千パラメータ)のみを更新する。これはユーザーが明示した核心的な設計原則である。
4. **本版(第4版)**: 「賢くなる仕組み」がLoRAとRAGの2本柱だけでは不足しており、
   ユーザーのプロフィールや質問意図の傾向をAIが継続的にまとめる**プロフィール・意図メモ**
   を3本目の柱として追加する予定だった、というユーザーからの指摘を反映。この情報は
   RAGの検索対象に混ぜると肥大化するだけで非効率なため、RAGとは独立した軽量な
   要約メモとして持つ設計にした(第1.5節・1.6節)。

---

## 1. コンセプト

### 1.1 何を作るか
「賢い箱」は、ポッドキャストアプリのような見た目を持つ、パーソナルな会話AIウィジェット
である。ユーザーが話しかける(テキスト入力)と、ブラウザ内で完結する極小の生成AI
(「本体AI」)が自分の言葉で答える。会話を重ねるほど、本体AIは**LoRA・RAG・プロフィール
メモ**という3つの仕組みで、そのユーザーに合わせて賢くなっていく。

### 1.2 UIデザイン方針: ポッドキャスト風・汎用デザイン
見た目をポッドキャストアプリ風(カード型のエピソード表示、シンプルな再生/入力UI等)に
する理由は音声機能ではなく、**他のWebアプリにも転用できる汎用性の高いデザイン**にする
ためである。test001ハブの他アプリと同様、単一の`index.html`+αで完結するUIコンポーネント
として実装し、将来的に別アプリの「対話パーツ」として使い回せることを意図する。
音声入出力(録音・読み上げ)は現時点のスコープには含まない(将来拡張の余地として
第12節に記載)。

### 1.3 本体AIのアーキテクチャ原則(最重要)
- 本体AIは **1つの小型量子化生成モデル**(base model)を持つ。このモデルは
  「embedding抽出(RAG用)」と「文章生成(回答用)」の両方を兼ねる(BERT encoderと
  生成モデルを別々に持たない構成。「小さな小さな」重みという要望に沿う)。
- **base modelの重みは永久にfreezeし、一切更新しない。** 会話ごとの学習は、常に
  **LoRAアダプタ(数千パラメータ)のみ**に対して行う。
  - 理由(ユーザーの指摘そのもの): 極小モデルを実際の会話データでフルファイン
    チューニングすると、データ量的にもモデルが容易に破綻・崩壊し実用に耐えない。
    LoRAという小さな可逆的な変更に限定することで、システムを実用レベルに保つ。
  - 副次的な利点: LoRA重みは数KB程度なのでIndexedDBへの保存・複数ユーザー間の
    切り替えも軽量にできる。
- RAGは、本体AI自身のembeddingで過去の会話を検索し、生成時のコンテキストとして
  提供する(旧設計のRAG基盤をほぼそのまま流用できる)。

### 1.4 LLM連携: 三者会話による蒸留ループ(任意機能)
ユーザーが外部LLM(例: Claude API)のAPIキーを設定した場合、以下の三者会話ループが
追加で動く:

1. ユーザーがプロンプトを入力する
2. 本体AIが(LoRA適用込みで)自分の回答を生成する
3. 同じプロンプトを外部LLMにも送り、LLMの回答を得る
4. **ユーザーのプロンプト・LLMの回答・本体AI自身の回答**の3つを使い、損失
   (本体AIの回答をLLMの回答に近づける方向の教師あり損失。第5.5節参照)を計算する
5. その損失の勾配で、本体AIの **LoRAアダプタのみ** を1ステップ更新する(base modelは
   触らない。第1.3節の原則)

LLM APIキーが未設定の場合、本体AIは単体で回答を生成するのみで動作する(自己完結)。
この場合の学習信号は、旧設計から引き継いだimplicitフィードバック(質問への反応等)を
使う(第5.5節)。

**出口(画面表示・LLMへの送信)**:
- 本体AIの回答(および、LLM連携時はLLMの回答)をポッドキャスト風の画面に表示する
- LLM連携時は、ユーザーのプロンプト(および必要な文脈)をLLM APIへ送信する

### 1.5 プロフィール・意図メモ(3本目の柱、新規)
「賢くなる仕組み」はLoRA(生成スタイルの重み調整)とRAG(個別の過去ターンの検索)
だけでなく、**ユーザーの人物像(好み・専門性など)と、ユーザーが繰り返し尋ねる質問の
意図・傾向**を、AIが継続的に要約・更新していく**コンパクトなメモ**を3本目の柱として
持つ。

**RAGに含めない理由**: 「このユーザーはコード例を好む」「抽象論より具体例を求める傾向が
ある」といった情報は、特定の過去ターン1件を検索して思い出す類のものではなく、どの
ターンでも常に参照すべき静的な人物像である。これをRAGの検索対象に混ぜると、(a) 検索の
たびに埋め込み類似度計算のノイズになる、(b) 同じ情報が何度も別ターンとして重複保存され
肥大化する、という無駄が生じる。ユーザーの言う通り「ラグ(RAG)よりも効率的」に、
常に一定サイズの固定コンテキストとして直接注入する方が理にかなっている。

**メモの中身(例)**:
```json
{
  "profile": {
    "notes": ["技術的な話題を好む", "簡潔な説明を好み、長い前置きを嫌う", "..."],
    "confidence": { "formality": 0.8, "depth": 0.4, "...": "..." }
  },
  "questionIntentPatterns": [
    "デバッグ・具体的なコード修正についての質問が多い",
    "抽象的な概念より実例を伴う説明を求める傾向"
  ],
  "lastUpdated": "2026-09-19T10:00:00Z",
  "lastLlmConsolidation": "2026-09-19T09:00:00Z | null"
}
```

**更新の仕組み**:
- 毎ターン、本体AI(CoreModel)自身が安価に「今回のやり取りでメモに追記・修正すべき
  点があるか」を短く生成し、メモへ差分反映する(コストの低い軽量な更新)
- LLM連携時は、一定ターン数ごと(`profile.config.json`の`llmConsolidationIntervalTurns`。
  既定20ターン)に、外部LLMを使ってメモ全体を整理・圧縮する「まとめ直し」を行う
  (差分更新で冗長化したメモを、LLMの要約能力で簡潔に保つ)
- メモの各項目には確信度(confidence)を持たせ、確信度が低い項目があれば、
  ユーザーに直接確認する質問を投げかけてメモを育てる(第1.6節)

### 1.6 プロフィール確認の質問(目的を限定した質問機構)
第2版で削除した「質問駆動」の仕組みを、**プロフィール・意図メモの空白を埋める目的に
限定して**復活させる。第2版の汎用的な「深掘り質問」とは異なり、メモの特定の次元
(例: フォーマル度の確信度が低い)がある時にだけ、その次元を埋めるための短い確認質問を
本体AIの回答に添えて発火させる。頻度は`profile.config.json`で制御する(セッションあたり
上限あり)。

---

## 2. システムアーキテクチャ

### 2.1 全体構成
```
CoreModel (量子化された小型生成モデル。embedding抽出+文章生成を兼ねる。base weightsはfreeze)
  + LoRA (数千パラメータのアダプタのみを学習対象とする)
  + RAG (CoreModelのembeddingで過去の会話を検索、64次元に圧縮)
  + ProfileMemo (ユーザー像・質問意図傾向の軽量な要約メモ。検索なしで常時コンテキストに注入)
  + LLMTeacher (任意。外部LLM APIを呼び、蒸留の教師信号 & メモのまとめ直しを提供)
```

### 2.2 ターン処理フロー

```mermaid
flowchart TD
    A[ユーザーがプロンプトを入力] --> B["Step 1: CoreModel.embed()<br/>embedding抽出(768→64次元圧縮)"]
    B --> C["Step 2: RAGSearch<br/>過去の会話を類似検索し文脈として取得"]
    C --> P["Step 2': ProfileMemo.getContext()<br/>検索なしでプロフィール・意図メモを取得"]
    P --> D["Step 3: CoreModel.generate()<br/>RAG文脈+メモ+LoRA適用込みで本体AI自身の回答を生成"]
    D --> E{LLM APIキー<br/>設定済み?}
    E -- Yes --> F["Step 4: LLMTeacher.ask()<br/>同じプロンプトを外部LLMに送信し回答を取得"]
    E -- No --> G[本体AIの回答のみで応答]
    F --> H["Step 5: FeedbackProcessor<br/>本体AIの回答とLLMの回答から蒸留損失を計算"]
    H --> I["LoRAForward 重み更新<br/>(LoRAアダプタのみ。base modelは不変)"]
    G --> J["Step 5': FeedbackProcessor(フォールバック)<br/>ユーザーの反応からimplicit信号を抽出"]
    J --> I
    I --> Q["Step 6: ProfileMemo.update()<br/>本体AIが安価に差分更新(LLM連携時は一定間隔でLLMがまとめ直し)"]
    Q --> K["ポッドキャスト風画面に本体AI(+LLM)の回答を表示<br/>(メモの確信度が低い項目があれば確認質問を添える)"]
    K --> L[会話をIndexedDBに保存]
    L --> M[StructuredLogger / MetricCollector に記録]
```

### 2.3 モジュールと責務(一覧、全面改訂)

| モジュール | 責務 | 入力 | 出力 | 目標コスト |
|---|---|---|---|---|
| CoreModel | embedding抽出 **と** 文章生成の両方(base weightsはfreeze) | text, ragContext, profileContext | embedding(64d), 生成テキスト | 生成 <1500ms(端末依存) |
| RAGSearch | 類似会話検索 | embedding | 類似ターン一覧, confidence | <20ms |
| ProfileMemo | ユーザー像・質問意図傾向の要約メモの保持・差分更新・確信度管理 | turnData, (任意)LLM | プロフィール文脈, 確認質問候補 | 差分更新 <50ms |
| IndexedDBManager | 会話・LoRA重み・LLM設定・ProfileMemoの永続化 | turnData | — | — |
| LLMTeacher | 任意。外部LLM APIの呼び出し(蒸留・メモのまとめ直し) | prompt, apiConfig | LLMの回答text | ネットワーク依存 |
| LoRAForward | CoreModelのquery/value等へのLoRA順伝播 | hiddenState + LoRA重み | 適応後の生成 | <1ms/層 |
| FeedbackProcessor | 蒸留損失(LLM連携時) / engagement信号(単体時)の算出 | own answer, llm answer?, user反応 | 学習ラベル・損失 | <50ms |
| TurnController | 全体オーケストレーション | userPrompt | 本体AI回答(+LLM回答) | 合計端末依存 |
| StructuredLogger | 構造化ログ記録 | turn/event data | ログ永続化(json/csv) | — |
| MetricCollector | メトリクス集計・目標値との比較 | ログ | 集計結果・アラート | — |
| ABTestRunner | バリアント割当・効果測定 | userId | variant, 記録 | — |

---

## 3. リポジトリ内フォルダ構成

```
docs/apps/smart-box/
├── DESIGN.md
├── README.md
├── package.json
├── .gitignore
├── configs/
│   ├── system.config.json
│   ├── rag.config.json
│   ├── profile.config.json    ← 新規: プロフィール・意図メモの更新頻度・確信度閾値等
│   ├── llm.config.json        ← 外部LLM連携設定(APIキーはconfigに書かず、UIから
│   │                              入力しIndexedDB/localStorageにのみ保存する)
│   └── lora.config.json
├── src/
│   ├── modules/
│   │   ├── core-model/CoreModel.js
│   │   ├── rag-search/RAGSearch.js, IndexedDBManager.js
│   │   ├── profile-memo/ProfileMemo.js     ← 新規
│   │   ├── llm-teacher/LLMTeacher.js
│   │   ├── lora-training/LoRAForward.js, FeedbackProcessor.js
│   │   ├── turn-controller/TurnController.js
│   │   ├── logging/StructuredLogger.js, MetricCollector.js
│   │   └── experiments/ABTestRunner.js
│   └── ui/index.html, app.js, styles.css   ← ポッドキャスト風デザイン。Phase 1で実装
├── models/README.md
└── tests/unit/, tests/integration/
```

---

## 4. Config仕様

### 4.1 configs/system.config.json
- モデル: CoreModelの量子化生成モデルへのURL(第8.1節、モデル候補は未確定)
- 実行環境: WebGPU優先、非対応時はwasm CPUにフォールバック
- ストレージ・ロギング・実験設定は旧版を維持

### 4.2 configs/rag.config.json
CoreModelのembeddingを使う(PCA圧縮・topK・閾値等は維持)。ProfileMemoの情報は
含めない(第1.5節の理由により意図的に分離)。

### 4.3 configs/profile.config.json(新規)
```json
{
  "updateEveryTurn": true,
  "llmConsolidationIntervalTurns": 20,
  "confidenceThresholdForClarifyingQuestion": 0.4,
  "maxClarifyingQuestionsPerSession": 3,
  "trackedDimensions": ["formality", "depth", "exampleUsage", "codeInclusion"],
  "note": "profile/questionIntentPatternsの構造は DESIGN.md 1.5節を参照。RAGとは独立した軽量メモとして持つ(RAGに混ぜると検索ノイズ・重複保存で肥大化するため)。"
}
```

### 4.4 configs/llm.config.json
```json
{
  "enabled": false,
  "provider": "anthropic",
  "apiKeyStorage": "indexeddb-local-only",
  "model": "claude-...",
  "note": "APIキーはユーザーがUIから入力し、ブラウザのIndexedDB/localStorageにのみ保存する。configファイル自体にキーを書かない。サーバーには一切送信しない。蒸留(第1.4節)とProfileMemoのまとめ直し(第1.5節)の両方でLLMを使う。"
}
```

### 4.5 configs/lora.config.json
- 3階層(global/topic/style)のLoRA構成を維持
- 適用対象は「CoreModelの生成時のquery/value射影」(本来のLoRAの使い方)
- 学習方式: 第1.4節の蒸留損失、またはengagementベースのimplicit信号。どちらも
  **LoRA行列のみ**を対象に更新する(base modelは不変)
- ProfileMemoの更新はLoRAの学習対象ではない(重みではなくテキスト/構造化データの
  差分更新であり、別の軽量な仕組み。第5.3節参照)

---

## 5. モジュール設計詳細

### 5.1 CoreModel (`src/modules/core-model/CoreModel.js`)
- **責務**: 量子化された小型生成モデルをロードし、(a) embedding抽出、(b) LoRA適用込みの
  文章生成、の両方を行う。base weightsは常にfreeze。
- **主要API**:
  - `async initialize()`
  - `async embed(text): Promise<{embedding: Float32Array(64), rawEmbedding, latencyMs}>`
  - `async generate(prompt, ragContext, profileContext, loraForward): Promise<{text: string, latencyMs}>`
    — RAG文脈とProfileMemoの文脈の両方を入力し、LoRAForwardを注入して生成の各層で
    LoRA補正を適用する
  - `async summarizeForProfile(turnData): Promise<{ profileDelta: object }>` —
    毎ターンの安価な差分更新用に、CoreModel自身で短い要約を生成する(ProfileMemoから
    呼ばれる)
- **モデル候補(未確定・Phase 0で検証要)**: Qwen2.5-0.5B-Instruct級の小型多言語モデルを
  int4量子化し、`transformers.js`(WebGPU対応)または`onnxruntime-web`で実行する案を
  第一候補とする。実機でのロード時間・推論速度・メモリ使用量の検証がPhase 0のタスク。

### 5.2 RAGSearch / IndexedDBManager
- RAGSearchはembedding類似検索(旧版と同じ)
- IndexedDBManagerは会話・LoRA重み・LLM設定に加え、`metadata`ストアに
  ProfileMemoのドキュメント(第1.5節のJSON)も保持する

### 5.3 ProfileMemo (`src/modules/profile-memo/ProfileMemo.js`) — 新規
- **責務**: ユーザーの人物像と質問意図の傾向を要約したメモ(第1.5節)を保持・更新する。
  RAGとは独立した、検索を伴わない常時参照コンテキスト。
- **主要API**:
  - `async getContext(): Promise<string>` — CoreModel.generate()に渡す、現在のメモの
    テキスト表現を返す(固定サイズに収まるよう要約済みであること)
  - `async update(turnData, coreModel): Promise<void>` — 毎ターン、CoreModelの軽量な
    要約(`CoreModel.summarizeForProfile()`)を使ってメモに差分反映する
  - `async consolidateWithLLM(llmTeacher): Promise<void>` —
    `profile.config.json`の`llmConsolidationIntervalTurns`ごとに呼ばれ、外部LLMで
    メモ全体を整理・圧縮する(LLM連携時のみ)
  - `getLowConfidenceDimensions(): string[]` — 確信度が
    `confidenceThresholdForClarifyingQuestion`未満の次元を返す(第1.6節の確認質問の
    発火判定に使う)
- **永続化**: IndexedDBManagerの`metadata`ストアに1ドキュメントとして保存(会話ターンの
  ような増え続けるコレクションではないため専用object storeは持たない)。

### 5.4 LLMTeacher (`src/modules/llm-teacher/LLMTeacher.js`)
- **責務**: `llm.config.json`が`enabled: true`の場合のみ、(a) ユーザーのプロンプトを
  外部LLM APIに送信し回答を取得する(蒸留用)、(b) ProfileMemoのまとめ直しを依頼する、
  の2つの役割を持つ。
- **主要API**:
  - `async ask(prompt, ragContext): Promise<{text: string, latencyMs}>`
  - `async consolidateProfile(currentMemo, recentTurns): Promise<{ consolidatedMemo: object }>`
- **セキュリティ**: APIキーはブラウザのIndexedDB/localStorageにのみ保存し、サーバー
  (存在しない)や第三者には一切送信しない。

### 5.5 LoRAForward / FeedbackProcessor
(第3版から変更なし。CoreModelのquery/value射影へのLoRA適用、蒸留損失/implicit損失の
算出。ProfileMemoの更新とは独立した仕組みである点に注意)

### 5.6 TurnController
第2.2節のフロー(RAG検索とProfileMemo取得を両方行い、生成後にLoRA更新とProfileMemo
更新を両方行う)をオーケストレーションする。

### 5.7〜5.9 StructuredLogger / MetricCollector / ABTestRunner
(第3版から変更なし。ProfileMemoの更新頻度・確認質問の発火率もログ対象に加える)

---

## 6. データフロー: ターンごとの保存形式

```json
{
  "turn_id": "turn_<timestamp>_<random>",
  "timestamp": "2026-09-19T10:30:00Z",
  "input": {
    "user_prompt": "...",
    "embedding": "[64-dim float32]"
  },
  "rag": {
    "retrieved_turns": 3,
    "top_similarities": [0.92, 0.85, 0.78]
  },
  "profile_memo": {
    "context_used": "...(getContext()のスナップショット)",
    "updated_this_turn": true,
    "llm_consolidated_this_turn": false
  },
  "response": {
    "own_answer": "...",
    "llm_answer": "... | null",
    "llm_used": true,
    "clarifying_question": "... | null"
  },
  "learning": {
    "mode": "distillation | implicit",
    "loss_before": 0.45,
    "loss_after": 0.38
  }
}
```

---

## 7. IndexedDBスキーマ
`turns`/`metadata`/`logs`の3ストア構成。`metadata`ストアに以下を保持する:
- LoRA重み(A/B行列、3階層分)
- LLM APIキー・設定
- **ProfileMemoドキュメント(第1.5節のJSON。1ユーザー1件)**

---

## 8. 技術的リスクと対応方針

### 8.1 ブラウザ内生成モデル + LoRA学習の実現可能性(最重要・未検証)
base modelは常にfreezeし、勾配計算・更新対象は**LoRAのA/B行列のみ**に限定する
(第1.3節)。実装には生成モデルのforwardを自動微分できるランタイムが必要で、
**この技術検証はPhase 0で最優先に行うべき未解決事項**である。

### 8.2 モデル選定
Qwen2.5-0.5B-Instruct級モデルのブラウザ内(WebGPU/wasm)実行速度・メモリ・ロード時間の
実機検証がPhase 0のタスク。

### 8.3 LLM APIキーの扱い
ブラウザのIndexedDB/localStorageにのみ保存し、サーバー(存在しない)には送信しない。

### 8.4 蒸留損失の設計
LLMの回答文をteacher-forcingのターゲットにする方式は実装可能だが、学習の安定性は
Phase 1.5で実ログを見ながら調整する。

### 8.5 ProfileMemoの肥大化・陳腐化リスク(新規)
毎ターンの差分更新だけを続けると、メモが冗長化・矛盾を含むようになるおそれがある。
LLM連携時の定期的な「まとめ直し」(第1.5節)はこれを防ぐ主な対策だが、LLM未設定の
単体運用では対策が弱い。Phase 1.5で、CoreModel自身による簡易な重複除去・矛盾検出の
必要性を評価する。

---

## 9〜11節
テスト戦略・開発原則・フェーズロードマップの大枠は第3版を踏襲するが、Phase 1の
スコープに ProfileMemo の基本実装(差分更新のみ、LLMまとめ直しはPhase 2)を追加する。

## 12. 次にやること(直近アクション)

1. **(最優先)** 生成モデル候補(第5.1節)の実機検証
2. **(最優先)** LoRA部分のみを対象にした逆伝播が技術的に実現できるかの検証(第8.1節)
3. `CoreModel.js` の実装(embed + generate + summarizeForProfile)
4. `ProfileMemo.js` の実装(差分更新のみ。LLMまとめ直しはPhase 2)
5. `LLMTeacher.js` の実装(蒸留・ProfileMemoまとめ直し・APIキーのローカル保存UI)
6. `LoRAForward.js` / `FeedbackProcessor.js` の実装(蒸留損失・LoRA更新)
7. ポッドキャスト風UI(`src/ui/`)の実装
8. `TurnController` で結線し、Core loopを動かす
9. `docs/apps.json` への登録

(将来拡張として、音声入出力の追加も検討余地として残す。現時点のスコープ外)
