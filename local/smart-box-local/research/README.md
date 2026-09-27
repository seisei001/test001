# LoRA学習グラフのエクスポート検証(Phase 0 スパイク)

DESIGN.md 8.1節の技術検証。「本体AIのbase weightsをfreezeし、LoRAのA/B行列だけを
`onnxruntime.training`でブラウザ学習可能な形にエクスポートできるか」を検証した。

## 制約

このセッションのサンドボックス環境は `huggingface.co` / `cdn.jsdelivr.net` への
ネットワークアクセスが組織ポリシーでブロックされているため、実際のQwen2.5-0.5B-Instruct
モデルはダウンロードできなかった。そのため、CoreModel + LoRAForward と同じ構造
(frozen base forward → LoRA A/B による残差加算)を持つ**最小のダミーONNXモデル**で
メカニズムそのものを検証した。

## 検証内容と結果

`spike_lora_export.py`:
- `frozen base weight (W0)` + `trainable LoRA A/B` を持つトイONNXモデルを構築
- `onnxruntime.training.artifacts.generate_artifacts(model, requires_grad=["LoRA_A","LoRA_B"], frozen_params=["W0"], loss=MSELoss, optimizer=AdamW, ...)` を実行
- → `training_model.onnx` / `eval_model.onnx` / `optimizer_model.onnx` / `checkpoint` の
  4ファイルが生成された(これは`onnxruntime-web`のtraining版がブラウザ内でロードする
  形式と同じ)

`spike_lora_train_step.py`:
- 生成されたartifactを`onnxruntime.training.api`(`CheckpointState`/`Module`/`Optimizer`)で
  ロードし、実際に5ステップの学習ループ(forward→backward→optimizer.step())を実行
- 結果: lossが単調減少(9.611168 → 9.605659)、`LoRA_A`/`LoRA_B`の値は実際に変化
- `W0`(base weights)はそもそも学習グラフのtrainable paramsに含まれないため、
  「更新されようがない」ことがAPIレベルで保証されている(DESIGN.md 1.3節の核心原則が
  アーキテクチャとして機能することを確認)

完全な実行ログは `spike_output.txt` を参照。

## 結論

DESIGN.md 1.3節・8.1節で設計した「base modelをfreezeし、LoRAのA/B行列のみを
`onnxruntime.training`で学習する」というメカニズムは、**実際に動作することを
Pythonでの縮小版で確認した**。残る作業は研究課題ではなくエンジニアリングタスク:

1. 実際のQwen2.5-0.5B-Instruct(またはPhase 0で選定する別モデル)のONNXグラフに対して
   同じ手順を適用する(huggingface.coへのアクセスが必要。このセッションでは未実施)
2. LoRAを実際のtransformerのquery/value射影に挿入した状態でのグラフ構築
   (`transformers.js`でロードするモデルと整合する形にする)
3. `onnxruntime-web`のtraining版でこのartifactをブラウザ内ロードし、同じ検証をJS側でも行う

## 再現方法

```bash
pip install onnx==1.16.1 onnxruntime-training torch
python spike_lora_export.py       # artifactを /tmp/lora_training_artifacts に生成
python spike_lora_train_step.py   # 生成したartifactで実際に学習ループを回す
```

(`onnx==1.16.1`に固定しているのは、最新版のonnxが出力するIR versionに
onnxruntime-training 1.19.2のC++ランタイムが対応していなかったため。実モデルでの
本実装時に、両パッケージの対応バージョンを再確認すること)
