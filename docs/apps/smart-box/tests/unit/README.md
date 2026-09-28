# Unit tests

各モジュール単独のテスト(<50ms/件目安)。DESIGN.md 9節を参照。

例(実装済みになったら追加): `bert-inference.test.js`, `rag-search.test.js`,
`question-generator.test.js`, `lora-forward.test.js` など。現時点ではモジュールが
全てスタブ(`throw new Error('not implemented')`)のため、テストファイルはまだ無い。
各モジュールの実装と同時にテストを追加すること(DESIGN.md 10節「Testability First」)。
