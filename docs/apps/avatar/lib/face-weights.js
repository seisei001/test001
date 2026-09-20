// 「weights(表情の動きAIの推論結果)とアバターとの連携」の本体。
//
// MediaPipe Face Landmarker(`outputFaceBlendshapes: true`)は、顔の映像を
// 推論した結果として、ARKit互換52種のブレンドシェイプスコア(0〜1のweights)
// を返す。この関数は、その推論結果(weights)をそのまま受け取り、VRMアバター
// が持つ表情ブレンドシェイプ(vrm.expressionManager経由のaa/ih/ou/ee/oh、
// blink/blinkLeft/blinkRight、happy/angry/sad/surprised等)に変換して適用する。
//
// 入力(weightsをどう得るか = カメラ映像か、静止画か、他の手段か)には一切
// 依存しない。呼び出し側がMediaPipeの推論結果(またはそれと同じ形の
// {categoryName, score}の配列 / {名前: score}のオブジェクト)を渡しさえすれば
// 動く、純粋な「weights → アバター」コネクタとして独立させてある。
//
// 注意: ARKitの52種は「顔の筋肉の動き」単位であり、VRMのhappy/angry/sad/
// surprisedのような「感情」単位ではない。そのため感情プリセットへの変換は
// 正確な感情分類ではなく、広く使われている単純な近似(口角が上がっていれば
// happy、眉が下がっていればangry、等)であることを明記しておく。

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/**
 * MediaPipeの `faceBlendshapes[0].categories`(`[{categoryName, score}, ...]`)、
 * または `{名前: score}` 形式のプレーンオブジェクトを、名前引きしやすい
 * Mapに正規化する。
 * @param {Array<{categoryName?:string, name?:string, score?:number}> | Record<string, number>} blendshapes
 * @returns {Map<string, number>}
 */
function toScoreMap(blendshapes) {
  if (Array.isArray(blendshapes)) {
    const map = new Map();
    for (const b of blendshapes) {
      const name = b?.categoryName ?? b?.name;
      if (name) map.set(name, b.score ?? 0);
    }
    return map;
  }
  return new Map(Object.entries(blendshapes ?? {}));
}

function avg(map, ...names) {
  const vals = names.map((n) => map.get(n) ?? 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * 表情AIモデルの推論結果(weights)を、VRMアバターの表情weightsへ変換して適用する。
 *
 * @param {import('@pixiv/three-vrm').VRM} vrm - 適用先のVRMインスタンス
 * @param {Array<{categoryName?:string, name?:string, score?:number}> | Record<string, number>} blendshapes
 *   MediaPipe Face LandmarkerのARKit互換ブレンドシェイプ推論結果(weights)
 * @returns {boolean} 適用できたか(vrmにexpressionManagerが無ければfalse)
 */
export function applyFaceBlendshapeWeights(vrm, blendshapes) {
  const em = vrm?.expressionManager;
  if (!em) return false;
  const s = toScoreMap(blendshapes);

  // まばたき: ARKitのeyeBlinkLeft/Rightをそのままweightとして使う
  em.setValue('blinkLeft', clamp01(s.get('eyeBlinkLeft') ?? 0));
  em.setValue('blinkRight', clamp01(s.get('eyeBlinkRight') ?? 0));

  // 口の開き(母音「あ」に近い形): jawOpenをそのまま使う
  em.setValue('aa', clamp01(s.get('jawOpen') ?? 0));

  // 感情(近似): 単一〜少数のARKitブレンドシェイプの組み合わせによる簡易マッピング
  em.setValue('happy', clamp01(avg(s, 'mouthSmileLeft', 'mouthSmileRight')));
  em.setValue('sad', clamp01(avg(s, 'mouthFrownLeft', 'mouthFrownRight')));
  em.setValue('angry', clamp01(avg(s, 'browDownLeft', 'browDownRight')));
  em.setValue('surprised', clamp01(s.get('browInnerUp') ?? 0));

  return true;
}
