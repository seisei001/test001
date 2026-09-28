# Integration tests

複数モジュール連携のテスト(<5秒目安)。DESIGN.md 9節を参照。

想定するテストファイル: `turn-flow.test.js`(TurnController経由でBERT→RAG→
QuestionGeneratorが正しく連携するか)、`feedback-learning.test.js`(Phase 2実装後、
FeedbackProcessor→LoRAForwardの重み更新が意図通り動くか)。
