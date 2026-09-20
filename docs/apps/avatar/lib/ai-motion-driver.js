import * as THREE from 'three';
import { FilesetResolver, PoseLandmarker, FaceLandmarker } from '@mediapipe/tasks-vision';

// Webカメラの映像から、量子化済み(float16)のMediaPipeモデルで人物の姿勢・表情を
// リアルタイム推定し、その結果(=AIモデルのweightsによる出力)をKalidokitで
// VRMアバターのボーン回転・表情ブレンドシェイプへリターゲットするドライバ。
//
// 使う技術と出典・ライセンス:
// - MediaPipe Tasks Vision (Pose Landmarker / Face Landmarker): Google, Apache-2.0。
//   floatモデルは公式配布時点で量子化(float16)済み。
// - Kalidokit(yeemachine/kalidokit): MIT。MediaPipeのランドマークをVRM/Live2D向けの
//   ボーン回転・表情値に変換するソルバー(UMD配布のためscriptタグで動的読み込みする)。
//
// このドライバはAvatarController(仕草・歩行等を自動再生するスケジューラ)とは独立して
// 動作する。使う側は、start()の前後でcontroller.setExternalControl(true/false)を
// 呼んで自律行動と衝突しないようにすること。

const TASKS_VISION_VERSION = '0.10.14';
const WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;
const POSE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const FACE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const KALIDOKIT_CDN_URL = 'https://cdn.jsdelivr.net/npm/kalidokit@1.1/dist/kalidokit.umd.js';

let kalidokitPromise = null;

/** KalidokitはUMD配布のみのため、scriptタグを動的挿入してwindow.Kalidokitを得る */
function loadKalidokit() {
  if (typeof window !== 'undefined' && window.Kalidokit) {
    return Promise.resolve(window.Kalidokit);
  }
  if (!kalidokitPromise) {
    kalidokitPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = KALIDOKIT_CDN_URL;
      script.onload = () => {
        if (window.Kalidokit) resolve(window.Kalidokit);
        else reject(new Error('Kalidokitの読み込み後もwindow.Kalidokitが見つかりません'));
      };
      script.onerror = () => reject(new Error('Kalidokitの読み込みに失敗しました'));
      document.head.appendChild(script);
    });
  }
  return kalidokitPromise;
}

async function createLandmarker(Ctor, vision, modelAssetPath, extraOptions) {
  // GPUデリゲートが端末・ブラウザによって使えないことがあるため、失敗時はCPUで再試行する
  try {
    return await Ctor.createFromOptions(vision, {
      baseOptions: { modelAssetPath, delegate: 'GPU' },
      runningMode: 'VIDEO',
      ...extraOptions,
    });
  } catch (err) {
    console.warn('GPUデリゲートでの初期化に失敗、CPUで再試行します', err);
    return await Ctor.createFromOptions(vision, {
      baseOptions: { modelAssetPath, delegate: 'CPU' },
      runningMode: 'VIDEO',
      ...extraOptions,
    });
  }
}

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function rigRotation(vrm, boneName, rotation, dampener = 1, lerpAmount = 0.3) {
  if (!rotation) return;
  const bone = vrm.humanoid?.getNormalizedBoneNode(boneName);
  if (!bone) return;
  const euler = new THREE.Euler(
    (rotation.x ?? 0) * dampener,
    (rotation.y ?? 0) * dampener,
    (rotation.z ?? 0) * dampener,
    rotation.rotationOrder || 'XYZ'
  );
  bone.quaternion.slerp(new THREE.Quaternion().setFromEuler(euler), lerpAmount);
}

function rigPosition(vrm, boneName, position, dampener = 1, lerpAmount = 0.3) {
  if (!position) return;
  const bone = vrm.humanoid?.getNormalizedBoneNode(boneName);
  if (!bone) return;
  const vector = new THREE.Vector3(
    (position.x ?? 0) * dampener,
    (position.y ?? 0) * dampener,
    (position.z ?? 0) * dampener
  );
  bone.position.lerp(vector, lerpAmount);
}

/** Kalidokit.Face.solve()の結果を、頭の向き・まばたき・口の形(母音)に反映する */
function applyFace(vrm, riggedFace) {
  if (!riggedFace) return;
  rigRotation(vrm, 'neck', riggedFace.head, 0.7, 0.4);

  const em = vrm.expressionManager;
  if (!em || !riggedFace.eye || !riggedFace.mouth?.shape) return;

  em.setValue('blinkLeft', clamp(1 - riggedFace.eye.l, 0, 1));
  em.setValue('blinkRight', clamp(1 - riggedFace.eye.r, 0, 1));

  em.setValue('aa', riggedFace.mouth.shape.A ?? 0);
  em.setValue('ih', riggedFace.mouth.shape.I ?? 0);
  em.setValue('ou', riggedFace.mouth.shape.U ?? 0);
  em.setValue('ee', riggedFace.mouth.shape.E ?? 0);
  em.setValue('oh', riggedFace.mouth.shape.O ?? 0);
}

/** Kalidokit.Pose.solve()の結果を、上半身・腕・脚のボーン回転に反映する */
function applyPose(vrm, riggedPose) {
  if (!riggedPose) return;

  if (riggedPose.Hips) {
    rigRotation(vrm, 'hips', riggedPose.Hips.rotation, 0.7, 0.3);
    if (riggedPose.Hips.position) {
      rigPosition(
        vrm,
        'hips',
        {
          x: -riggedPose.Hips.position.x,
          y: riggedPose.Hips.position.y + 1,
          z: -riggedPose.Hips.position.z,
        },
        1,
        0.07
      );
    }
  }

  rigRotation(vrm, 'chest', riggedPose.Spine, 0.25, 0.3);
  rigRotation(vrm, 'spine', riggedPose.Spine, 0.45, 0.3);

  rigRotation(vrm, 'rightUpperArm', riggedPose.RightUpperArm, 1, 0.3);
  rigRotation(vrm, 'rightLowerArm', riggedPose.RightLowerArm, 1, 0.3);
  rigRotation(vrm, 'leftUpperArm', riggedPose.LeftUpperArm, 1, 0.3);
  rigRotation(vrm, 'leftLowerArm', riggedPose.LeftLowerArm, 1, 0.3);

  rigRotation(vrm, 'rightUpperLeg', riggedPose.RightUpperLeg, 1, 0.3);
  rigRotation(vrm, 'rightLowerLeg', riggedPose.RightLowerLeg, 1, 0.3);
  rigRotation(vrm, 'leftUpperLeg', riggedPose.LeftUpperLeg, 1, 0.3);
  rigRotation(vrm, 'leftLowerLeg', riggedPose.LeftLowerLeg, 1, 0.3);
}

export default class AIMotionDriver {
  /**
   * @param {import('@pixiv/three-vrm').VRM} vrm - 操作対象のVRMインスタンス
   * @param {HTMLVideoElement} videoEl - カメラ映像を流し込むvideo要素(非表示でも可)
   */
  constructor(vrm, videoEl) {
    this.vrm = vrm;
    this.video = videoEl;
    this.poseLandmarker = null;
    this.faceLandmarker = null;
    this.kalidokit = null;
    this._stream = null;
    this._running = false;
    this._rafId = null;
  }

  /** モデルの読み込み(カメラ起動前に一度だけ呼ぶ)。数MB〜十数MBの通信が発生する */
  async init() {
    const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
    const [poseLandmarker, faceLandmarker, kalidokit] = await Promise.all([
      createLandmarker(PoseLandmarker, vision, POSE_MODEL_URL, { numPoses: 1 }),
      createLandmarker(FaceLandmarker, vision, FACE_MODEL_URL, {
        outputFaceBlendshapes: true,
        numFaces: 1,
      }),
      loadKalidokit(),
    ]);
    this.poseLandmarker = poseLandmarker;
    this.faceLandmarker = faceLandmarker;
    this.kalidokit = kalidokit;
  }

  /** フロントカメラを起動し、内部のvideo要素に流し込む(ユーザー操作の中から呼ぶこと) */
  async startCamera() {
    this._stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    this.video.srcObject = this._stream;
    await this.video.play();
  }

  /** 推定ループを開始する(init()・startCamera()の後に呼ぶ) */
  start() {
    if (this._running) return;
    this._running = true;
    this._tick();
  }

  /** 推定ループを止め、カメラも解放する(モデル自体は再利用できるよう保持したまま) */
  stop() {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._stream) {
      for (const track of this._stream.getTracks()) track.stop();
      this._stream = null;
    }
    if (this.video) this.video.srcObject = null;
  }

  /** 完全に破棄する。以後このインスタンスは再利用できない */
  dispose() {
    this.stop();
    this.poseLandmarker?.close();
    this.faceLandmarker?.close();
  }

  _tick() {
    if (!this._running) return;
    this._rafId = requestAnimationFrame(() => this._tick());
    if (!this.video || this.video.readyState < 2) return;

    const nowMs = performance.now();
    let poseResult, faceResult;
    try {
      poseResult = this.poseLandmarker.detectForVideo(this.video, nowMs);
      faceResult = this.faceLandmarker.detectForVideo(this.video, nowMs);
    } catch (err) {
      console.warn('AIモーション推定に失敗したフレームをスキップしました', err);
      return;
    }

    const Kalidokit = this.kalidokit;

    if (faceResult?.faceLandmarks?.[0]) {
      const riggedFace = Kalidokit.Face.solve(faceResult.faceLandmarks[0], {
        runtime: 'mediapipe',
        video: this.video,
        imageSize: { width: this.video.videoWidth, height: this.video.videoHeight },
      });
      applyFace(this.vrm, riggedFace);
    }

    if (poseResult?.worldLandmarks?.[0] && poseResult?.landmarks?.[0]) {
      const riggedPose = Kalidokit.Pose.solve(poseResult.worldLandmarks[0], poseResult.landmarks[0], {
        runtime: 'mediapipe',
        video: this.video,
      });
      applyPose(this.vrm, riggedPose);
    }
  }
}
