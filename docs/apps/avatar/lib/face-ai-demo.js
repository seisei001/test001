import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { applyFaceBlendshapeWeights } from './face-weights.js';

// 表情AI(MediaPipe Face Landmarker、量子化済みfloat16モデル)に、あらかじめ
// リポジトリに同梱したサンプル動画(同一オリジン配信のためCORS不要、カメラも
// 不要)を解析させ、その推論結果(weights = ARKit互換52種のブレンドシェイプ
// スコア)を face-weights.js の applyFaceBlendshapeWeights 経由でVRMアバターの
// 表情に反映するデモドライバ。
//
// 「weights(表情AIの推論結果)とアバターが実際に連携できるか」を確かめる
// ための、入力元を固定した最小構成。将来カメラや別の入力に差し替える場合は
// このクラスの videoUrl / video要素を差し替えるだけでよい。

const TASKS_VISION_VERSION = '0.10.14';
const WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;
const FACE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export default class FaceAIDemo {
  /**
   * @param {import('@pixiv/three-vrm').VRM} vrm - 表情を反映する対象のVRM
   * @param {HTMLVideoElement} videoEl - サンプル動画を再生するvideo要素(非表示でも可)
   * @param {string} videoUrl - 同一オリジンで配信しているサンプル動画のURL
   */
  constructor(vrm, videoEl, videoUrl) {
    this.vrm = vrm;
    this.video = videoEl;
    this.videoUrl = videoUrl;
    this.faceLandmarker = null;
    this._running = false;
    this._rafId = null;
  }

  /** モデルの読み込み(数MB程度の通信が発生する)。再生開始前に一度だけ呼ぶ */
  async init() {
    const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
    const options = {
      baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      outputFaceBlendshapes: true,
      numFaces: 1,
    };
    try {
      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, options);
    } catch (err) {
      // GPUデリゲートが端末・ブラウザによって使えないことがあるため、CPUで再試行する
      console.warn('GPUデリゲートでの初期化に失敗、CPUで再試行します', err);
      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        ...options,
        baseOptions: { ...options.baseOptions, delegate: 'CPU' },
      });
    }
  }

  /** サンプル動画の再生と推論ループを開始する(init()の後に呼ぶこと) */
  async start() {
    if (this._running) return;
    this.video.src = this.videoUrl;
    this.video.loop = true;
    this.video.muted = true;
    this.video.playsInline = true;
    await this.video.play();
    this._running = true;
    this._tick();
  }

  /** 再生・推論ループを止める(表情weightsのリセットは呼び出し側の責務) */
  stop() {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this.video.pause();
  }

  /** 完全に破棄する。以後このインスタンスは再利用できない */
  dispose() {
    this.stop();
    this.faceLandmarker?.close();
  }

  _tick() {
    if (!this._running) return;
    this._rafId = requestAnimationFrame(() => this._tick());
    if (this.video.readyState < 2) return;

    const nowMs = performance.now();
    let result;
    try {
      result = this.faceLandmarker.detectForVideo(this.video, nowMs);
    } catch (err) {
      console.warn('表情AI推論に失敗したフレームをスキップしました', err);
      return;
    }

    const blendshapes = result?.faceBlendshapes?.[0]?.categories;
    if (blendshapes) applyFaceBlendshapeWeights(this.vrm, blendshapes);
  }
}
