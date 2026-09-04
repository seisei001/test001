import * as THREE from 'three';

// VRMヒューマノイドボーンを直接動かして、呼吸・重心の揺れ・首の向き・瞬きを
// 完全に自律的(乱数+サイン波ベース)に再生するコントローラ。
// 外部モーションファイルは使わず、three-vrmのボーン/表情APIのみで完結させている。

const LOOK_RETARGET_MIN_S = 2.5;
const LOOK_RETARGET_MAX_S = 5.5;
const LOOK_MAX_YAW = THREE.MathUtils.degToRad(28);
const LOOK_MAX_PITCH = THREE.MathUtils.degToRad(10);

const BLINK_MIN_INTERVAL_S = 2;
const BLINK_MAX_INTERVAL_S = 6;
const BLINK_DURATION_S = 0.12;

const GESTURE_MIN_INTERVAL_S = 6;
const GESTURE_MAX_INTERVAL_S = 12;

function captureBase(bone) {
  return bone ? bone.quaternion.clone() : null;
}

export default class AvatarController {
  constructor(vrm) {
    this.vrm = vrm;
    const humanoid = vrm.humanoid;

    this.head = humanoid.getNormalizedBoneNode('head');
    this.neck = humanoid.getNormalizedBoneNode('neck');
    this.chest = humanoid.getNormalizedBoneNode('chest') || humanoid.getNormalizedBoneNode('upperChest');
    this.spine = humanoid.getNormalizedBoneNode('spine');
    this.hips = humanoid.getNormalizedBoneNode('hips');
    this.rightUpperArm = humanoid.getNormalizedBoneNode('rightUpperArm');
    this.leftUpperArm = humanoid.getNormalizedBoneNode('leftUpperArm');

    this.base = {
      head: captureBase(this.head),
      neck: captureBase(this.neck),
      chest: captureBase(this.chest),
      spine: captureBase(this.spine),
      hips: captureBase(this.hips),
      rightUpperArm: captureBase(this.rightUpperArm),
      leftUpperArm: captureBase(this.leftUpperArm),
    };

    this.lookYaw = 0;
    this.lookPitch = 0;
    this.lookTargetYaw = 0;
    this.lookTargetPitch = 0;
    this.nextLookRetarget = 0;

    this.blinkTimer = 0;
    this.nextBlink = this._randomBlinkInterval();

    this.gestureWeight = 0;
    this.gestureTarget = 0;
    this.nextGesture = this._randomGestureInterval();

    this.elapsed = 0;
  }

  _randomBlinkInterval() {
    return BLINK_MIN_INTERVAL_S + Math.random() * (BLINK_MAX_INTERVAL_S - BLINK_MIN_INTERVAL_S);
  }

  _randomGestureInterval() {
    return GESTURE_MIN_INTERVAL_S + Math.random() * (GESTURE_MAX_INTERVAL_S - GESTURE_MIN_INTERVAL_S);
  }

  _applyOffset(bone, base, eulerX, eulerY, eulerZ) {
    if (!bone || !base) return;
    const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(eulerX, eulerY, eulerZ));
    bone.quaternion.copy(base).multiply(offset);
  }

  update(delta) {
    this.elapsed += delta;

    // 呼吸: 胸・背骨をゆっくり前後に傾ける
    const breath = Math.sin(this.elapsed * 1.1) * 0.02;
    this._applyOffset(this.chest, this.base.chest, breath, 0, 0);
    this._applyOffset(this.spine, this.base.spine, breath * 0.6, 0, 0);

    // 重心の揺れ: 腰をゆっくり左右にスウェイ
    const sway = Math.sin(this.elapsed * 0.45) * 0.035;
    this._applyOffset(this.hips, this.base.hips, 0, 0, sway);

    // 首・頭の向き: 数秒おきにランダムな方向をゆるやかに見る
    this.nextLookRetarget -= delta;
    if (this.nextLookRetarget <= 0) {
      this.lookTargetYaw = (Math.random() * 2 - 1) * LOOK_MAX_YAW;
      this.lookTargetPitch = (Math.random() * 2 - 1) * LOOK_MAX_PITCH;
      this.nextLookRetarget = LOOK_RETARGET_MIN_S + Math.random() * (LOOK_RETARGET_MAX_S - LOOK_RETARGET_MIN_S);
    }
    this.lookYaw += (this.lookTargetYaw - this.lookYaw) * Math.min(1, delta * 1.2);
    this.lookPitch += (this.lookTargetPitch - this.lookPitch) * Math.min(1, delta * 1.2);
    this._applyOffset(this.neck, this.base.neck, this.lookPitch * 0.3, this.lookYaw * 0.4, 0);
    this._applyOffset(this.head, this.base.head, this.lookPitch * 0.7, this.lookYaw * 0.6, 0);

    // 瞬き: ランダムな間隔で自動的にまばたき
    this.blinkTimer += delta;
    if (this.blinkTimer >= this.nextBlink) {
      this.blinkTimer = -BLINK_DURATION_S;
      this.nextBlink = this._randomBlinkInterval();
    }
    const blinkWeight = this.blinkTimer < 0
      ? 1 - Math.abs(this.blinkTimer) / BLINK_DURATION_S
      : 0;
    this.vrm.expressionManager?.setValue('blink', Math.max(0, Math.min(1, blinkWeight)));

    // 仕草: 数秒おきに軽く腕を上げ下げする(小さなジェスチャー)
    this.nextGesture -= delta;
    if (this.nextGesture <= 0 && this.gestureTarget === 0) {
      this.gestureTarget = 1;
    }
    const gestureSpeed = delta * 1.5;
    if (this.gestureTarget === 1) {
      this.gestureWeight = Math.min(1, this.gestureWeight + gestureSpeed);
      if (this.gestureWeight >= 1) this.gestureTarget = 2;
    } else if (this.gestureTarget === 2) {
      this.gestureWeight = Math.min(1, this.gestureWeight + gestureSpeed);
      if (this.gestureWeight >= 1) {
        // 保持後に戻す
        this.gestureTarget = 3;
        this.gestureHoldTimer = 0.6;
      }
    } else if (this.gestureTarget === 3) {
      this.gestureHoldTimer -= delta;
      if (this.gestureHoldTimer <= 0) this.gestureTarget = 4;
    } else if (this.gestureTarget === 4) {
      this.gestureWeight = Math.max(0, this.gestureWeight - gestureSpeed);
      if (this.gestureWeight <= 0) {
        this.gestureTarget = 0;
        this.nextGesture = this._randomGestureInterval();
      }
    }
    const armLift = this.gestureWeight * 0.35;
    this._applyOffset(this.rightUpperArm, this.base.rightUpperArm, 0, 0, -armLift);

    this.vrm.update(delta);
  }
}
