import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';

// テキスト(AIの解析結果)から外部指示で動かす、シンプルなVRMコントローラ。
// `avatar`アプリの AvatarController(ランダムに自律行動する状態機械)とは違い、
// こちらは「いつ・どの仕草を・どの表情で」再生するかを呼び出し側(AIの解析結果)
// が逐一指示する、受動的なプレイヤーとして実装している。

const CROSSFADE_S = 0.3;
const BLINK_MIN_INTERVAL_S = 2;
const BLINK_MAX_INTERVAL_S = 6;
const BLINK_DURATION_S = 0.12;
const EXPRESSION_FADE_RATE = 6;

function joinUrl(base, path) {
  if (!base) return path;
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

export default class TextAvatarController {
  /**
   * @param {import('@pixiv/three-vrm').VRM} vrm
   * @param {Record<string,string>} gestureManifest - 仕草名 -> VRMAファイルパス
   * @param {object} [options]
   * @param {string} [options.assetsBaseUrl] - idlePath・gestureManifest内の全パスに付与するプレフィックス
   * @param {string} [options.idlePath] - 待機ループ用VRMAのパス(省略可)
   */
  constructor(vrm, gestureManifest, options = {}) {
    this.vrm = vrm;
    this.assetsBaseUrl = options.assetsBaseUrl ?? '';
    this.mixer = new THREE.AnimationMixer(vrm.scene);
    this.idleAction = null;
    this.gestureClips = new Map();
    this.currentAction = null;
    this.ready = false;

    this.blinkTimer = 0;
    this.nextBlink = this._randomBlinkInterval();

    this._exprName = null; // 現在フェード中/表示中の表情プリセット名
    this._exprWeight = 0;
    this._exprTarget = 0;

    this._loadAnimations(options.idlePath, gestureManifest);
  }

  _randomBlinkInterval() {
    return BLINK_MIN_INTERVAL_S + Math.random() * (BLINK_MAX_INTERVAL_S - BLINK_MIN_INTERVAL_S);
  }

  async _loadAnimations(idlePath, gestureManifest) {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

    const loadOne = async (path) => {
      const url = joinUrl(this.assetsBaseUrl, path);
      const gltf = await loader.loadAsync(url);
      const vrmAnimation = gltf.userData.vrmAnimations?.[0];
      if (!vrmAnimation) return null;
      return createVRMAnimationClip(vrmAnimation, this.vrm);
    };

    if (idlePath) {
      try {
        const clip = await loadOne(idlePath);
        if (clip) {
          this.idleAction = this.mixer.clipAction(clip);
          this.idleAction.setLoop(THREE.LoopRepeat, Infinity);
          this.idleAction.play();
          this.currentAction = this.idleAction;
        }
      } catch (err) {
        console.warn('待機アニメーションの読み込みに失敗しました', err);
      }
    }

    await Promise.all(
      Object.entries(gestureManifest).map(async ([name, path]) => {
        try {
          const clip = await loadOne(path);
          if (clip) this.gestureClips.set(name, clip);
        } catch (err) {
          console.warn(`仕草アニメーション「${name}」の読み込みに失敗しました`, err);
        }
      })
    );

    this.ready = true;
  }

  /** 指定した名前の仕草を1回再生し、終わったら待機ループへcrossfadeで戻る */
  playGesture(name) {
    const clip = this.gestureClips.get(name);
    if (!clip) return false;

    const action = this.mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.fadeIn(CROSSFADE_S);
    action.play();
    this.currentAction?.fadeOut(CROSSFADE_S);
    this.currentAction = action;

    const onFinished = (e) => {
      if (e.action !== action) return;
      this.mixer.removeEventListener('finished', onFinished);
      if (this.idleAction && this.currentAction === action) {
        this.idleAction.reset().fadeIn(CROSSFADE_S).play();
        this.currentAction = this.idleAction;
      }
    };
    this.mixer.addEventListener('finished', onFinished);
    return true;
  }

  /**
   * VRM表情プリセット名を設定する。'neutral'または未指定で表情を解除(0へフェード)。
   * @param {string} [name] - happy/angry/sad/relaxed/surprised等
   */
  setExpression(name) {
    const next = name && name !== 'neutral' ? name : null;
    if (next !== this._exprName) {
      if (this._exprName) this.vrm.expressionManager?.setValue(this._exprName, 0);
      this._exprName = next;
      this._exprWeight = 0;
    }
    this._exprTarget = next ? 1 : 0;
  }

  update(delta) {
    this.blinkTimer += delta;
    if (this.blinkTimer >= this.nextBlink) {
      this.blinkTimer = -BLINK_DURATION_S;
      this.nextBlink = this._randomBlinkInterval();
    }
    const blinkWeight = this.blinkTimer < 0 ? 1 - Math.abs(this.blinkTimer) / BLINK_DURATION_S : 0;

    this.mixer.update(delta);

    if (this._exprName) {
      this._exprWeight += (this._exprTarget - this._exprWeight) * Math.min(1, delta * EXPRESSION_FADE_RATE);
      this.vrm.expressionManager?.setValue(this._exprName, Math.max(0, Math.min(1, this._exprWeight)));
      if (this._exprTarget === 0 && this._exprWeight < 0.01) {
        this.vrm.expressionManager?.setValue(this._exprName, 0);
        this._exprName = null;
        this._exprWeight = 0;
      }
    }

    this.vrm.expressionManager?.setValue('blink', Math.max(0, Math.min(1, blinkWeight)));
    this.vrm.update(delta);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.vrm.scene);
  }
}
