"""
DESIGN.md 8.1節の技術検証スパイク。
huggingface.co がこのサンドボックスからネットワーク遮断されているため実際のQwenモデルは
使えないが、CoreModel+LoRAForwardと同じ構造(frozen base + trainable LoRA A/B)を持つ
最小限のダミーONNXモデルで、onnxruntime.training.artifacts.generate_artifacts() が
実際に「LoRAの重みだけをtrainableにした学習用グラフ」を生成できるかを検証する。
"""
import numpy as np
import onnx
from onnx import helper, TensorProto
from onnxruntime.training import artifacts

RAW_DIM = 8   # base modelのhidden dim相当(トイモデルなので小さくする)
RANK = 2      # LoRAのrank相当

def build_toy_model():
    # 入力 x: [1, RAW_DIM]
    x = helper.make_tensor_value_info("x", TensorProto.FLOAT, [1, RAW_DIM])
    target = helper.make_tensor_value_info("target", TensorProto.FLOAT, [1, RAW_DIM])

    # frozen base weight W0 (RAW_DIM x RAW_DIM) -- CoreModelのbase weights相当。凍結する。
    rng = np.random.default_rng(0)
    w0 = helper.make_tensor("W0", TensorProto.FLOAT, [RAW_DIM, RAW_DIM],
                             rng.standard_normal(RAW_DIM * RAW_DIM).astype(np.float32))

    # LoRA A (RAW_DIM x RANK), B (RANK x RAW_DIM) -- trainableにする対象
    lora_a = helper.make_tensor("LoRA_A", TensorProto.FLOAT, [RAW_DIM, RANK],
                                 (rng.standard_normal(RAW_DIM * RANK) * 0.01).astype(np.float32))
    lora_b = helper.make_tensor("LoRA_B", TensorProto.FLOAT, [RANK, RAW_DIM],
                                 np.zeros(RANK * RAW_DIM, dtype=np.float32))  # LoRA標準: Bはゼロ初期化

    # h = x @ W0  (frozen base forward)
    matmul_base = helper.make_node("MatMul", ["x", "W0"], ["h"], name="base_forward")
    # lora_mid = h @ A
    matmul_a = helper.make_node("MatMul", ["h", "LoRA_A"], ["lora_mid"], name="lora_down")
    # lora_delta = lora_mid @ B
    matmul_b = helper.make_node("MatMul", ["lora_mid", "LoRA_B"], ["lora_delta"], name="lora_up")
    # output = h + lora_delta  (DESIGN.md 5.4節: h' = h + (alpha/rank)*B*A*x の簡易版)
    add_node = helper.make_node("Add", ["h", "lora_delta"], ["output"], name="lora_residual")

    output = helper.make_tensor_value_info("output", TensorProto.FLOAT, [1, RAW_DIM])

    graph = helper.make_graph(
        [matmul_base, matmul_a, matmul_b, add_node],
        "toy_core_model_with_lora",
        [x],
        [output],
        initializer=[w0, lora_a, lora_b],
    )
    model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 17)])
    model.ir_version = 8
    onnx.checker.check_model(model)
    return model


def main():
    model = build_toy_model()
    onnx.save(model, "/tmp/toy_core_model.onnx")
    print("Toy ONNX model built and validated: /tmp/toy_core_model.onnx")

    # DESIGN.md 1.3節の核心原則の検証: base weights(W0)はfrozen、
    # LoRAのA/B行列だけをrequires_gradに指定する
    artifacts.generate_artifacts(
        model,
        requires_grad=["LoRA_A", "LoRA_B"],
        frozen_params=["W0"],
        loss=artifacts.LossType.MSELoss,
        optimizer=artifacts.OptimType.AdamW,
        artifact_directory="/tmp/lora_training_artifacts",
    )
    print("generate_artifacts() succeeded. Files:")
    import os
    for f in sorted(os.listdir("/tmp/lora_training_artifacts")):
        size = os.path.getsize(os.path.join("/tmp/lora_training_artifacts", f))
        print(f"  {f}  ({size} bytes)")


if __name__ == "__main__":
    main()
