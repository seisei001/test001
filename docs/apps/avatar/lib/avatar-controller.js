import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';

// 実際のモーションキャプチャ由来VRMAクリップを組み合わせて自律的に動かす、
// 汎用の行動スケジューラ。特定のアバターやアニメーション素材には依存せず、
// コンストラクタに渡された `manifest` の中身だけを見て動く。
//
// manifestの形式は default-manifest.js の DEFAULT_ANIMATION_MANIFEST を参照。
//
// 単一のスケジューラが、直立アイドルを基点に次の振る舞いをランダムに選んで
// 実行し、終わったらまた直立アイドルへcrossfadeで戻る:
//   - gesture: 直立のまま始まり直立のまま終わる仕草(ワンショット)
//   - walk: 開始→ループ(移動しながら)→停止 の3段階からなる歩行
//   - run: 単純ループの走行(開始/停止クリップが無いため)
//   - sequence: 「入る→ループ→出る」の3点セットが必要な姿勢(座る等)
// VRMAの読み込みに失敗した場合は、手続き型の簡易アイドルモーションに
// フォールバックする。

const BLINK_MIN_INTERVAL_S = 2;
const BLINK_MAX_INTERVAL_S = 6;
const BLINK_DURATION_S = 0.12;

const CROSSFADE_S = 0.35;

const DEFAULT_BEHAVIOR_TIMING = {
  minIntervalSeconds: 4,
  maxIntervalSeconds: 9,
};

const DEFAULT_WALK_CONFIG = {
  radiusMin: 0.3,
  radiusMax: 0.9,
  walkSpeed: 0.8, // m/s
  runSpeed: 0.55, // m/s
  runTimeScale: 0.6,
  arriveDistance: 0.05,
};

// 次に取る行動の重み付き選択テーブル(呼び出し側で上書き可能)
const DEFAULT_BEHAVIOR_WEIGHTS = [
  { type: 'gesture', weight: 42 },
  { type: 'walk', weight: 24 },
  { type: 'run', weight: 8 },
];

function captureBase(bone) {
  return bone ? bone.quaternion.clone() : null;
}

function pickBehavior(weights) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weights) {
    r -= w.weight;
    if (r <= 0) return w.type;
  }
  return weights[0].type;
}

function joinUrl(base, path) {
  if (!base) return path;
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

export default class AvatarController {
  /**
   * @param {import('@pixiv/three-vrm').VRM} vrm
   * @param {object} manifest - default-manifest.js の DEFAULT_ANIMATION_MANIFEST 形式
   * @param {object} [options]
   * @param {string} [options.assetsBaseUrl] - manifest内の全パスの前に付与するプレフィックス
   * @param {Array<{type:string, weight:number}>} [options.behaviorWeights] - 行動選択の重み付け上書き
   * @param {{minIntervalSeconds:number, maxIntervalSeconds:number}} [options.behaviorTiming]
   * @param {object} [options.walkConfig] - DEFAULT_WALK_CONFIGの一部を上書き
   */
  constructor(vrm, manifest, options = {}) {
    this.vrm = vrm;
    this.manifest = manifest;
    this.assetsBaseUrl = options.assetsBaseUrl ?? '';
    this.behaviorWeights = options.behaviorWeights ?? DEFAULT_BEHAVIOR_WEIGHTS;
    this.behaviorTiming = { ...DEFAULT_BEHAVIOR_TIMING, ...options.behaviorTiming };
    this.walkConfig = { ...DEFAULT_WALK_CONFIG, ...options.walkConfig };

    const humanoid = vrm.humanoid;

    this.chest = humanoid.getNormalizedBoneNode('chest') || humanoid.getNormalizedBoneNode('upperChest');
    this.spine = humanoid.getNormalizedBoneNode('spine');
    this.hips = humanoid.getNormalizedBoneNode('hips');
    this.rightUpperArm = humanoid.getNormalizedBoneNode('rightUpperArm');
    this.leftUpperArm = humanoid.getNormalizedBoneNode('leftUpperArm');

    this.base = {
      chest: captureBase(this.chest),
      spine: captureBase(this.spine),
      hips: captureBase(this.hips),
    };

    // VRMのデフォルト姿勢(Tポーズ)のままだと不自然なので、腕を自然に下ろした
    // 「休め」姿勢を基準姿勢として作る(フォールバック時のみ使用)
    const ARM_DOWN_ANGLE = Math.PI / 2 - 0.25;
    const rightRest = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -ARM_DOWN_ANGLE));
    const leftRest = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, ARM_DOWN_ANGLE));
    this.base.rightUpperArm = captureBase(this.rightUpperArm)?.multiply(rightRest) ?? null;
    this.base.leftUpperArm = captureBase(this.leftUpperArm)?.multiply(leftRest) ?? null;

    this.blinkTimer = 0;
    this.nextBlink = this._randomBlinkInterval();

    // モーションキャプチャ再生
    this.mixer = new THREE.AnimationMixer(vrm.scene);
    this.clips = new Map();
    this.actionClipNames = [];
    this.idleAction = null;
    this.walkStartAction = null;
    this.walkLoopAction = null;
    this.walkStopAction = null;
    this.runAction = null;
    this.sequences = new Map(); // id -> { enterAction, loopAction, exitAction, config }
    this.currentAction = null;
    this.animationsReady = false;
    this.onReady = options.onReady ?? null;

    // 状態機械: 'idle' | 'gesture' | 'walk-start' | 'walk-loop' | 'walk-stop'
    //          | 'run' | 'seq-enter:<id>' | 'seq-loop:<id>' | 'seq-exit:<id>'
    this.state = 'idle';
    this.phaseTimer = 0; // 現在のワンショット/ループ区間の残り時間
    this.nextBehaviorTimer = 2 + Math.random() * 2;
    this.walkTarget = new THREE.Vector3();

    // 座っている間など、視覚的な小道具(椅子等)を出す必要がある区間のフラグ。
    // manifest内のシーケンス定義でprop名を指定すると、対応する区間の間だけ
    // このSetにそのprop名が入る(呼び出し側でシーンの小道具表示に使う)。
    this.activeProps = new Set();

    this.elapsed = 0;

    this._loadAnimations();
  }

  /** 後方互換用: 「座る」系propが有効かどうか */
  get isSitting() {
    return this.activeProps.has('stool');
  }

  async _loadAnimations() {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

    const m = this.manifest;
    const entries = [
      ['idle', m.idleAnimation],
      ['walkStart', m.walkAnimations?.start],
      ['walkLoop', m.walkAnimations?.loop],
      ['walkStop', m.walkAnimations?.stop],
      ['run', m.runAnimation],
      ...(m.actionAnimations ?? []).map((url, i) => [`action${i}`, url]),
    ].filter(([, url]) => !!url);

    for (const seq of m.poseSequences ?? []) {
      entries.push([`seqEnter:${seq.id}`, seq.enter], [`seqLoop:${seq.id}`, seq.loop], [`seqExit:${seq.id}`, seq.exit]);
    }

    // 並列で読み込み、idleが読み終わった時点ですぐ再生を開始する
    // (残りはバックグラウンドで読み込みを続ける)
    await Promise.all(entries.map(async ([name, path]) => {
      const url = joinUrl(this.assetsBaseUrl, path);
      try {
        const gltf = await loader.loadAsync(url);
        const vrmAnimation = gltf.userData.vrmAnimations?.[0];
        if (!vrmAnimation) return;
        const clip = createVRMAnimationClip(vrmAnimation, this.vrm);
        this.clips.set(name, clip);

        if (name === 'idle' && !this.idleAction) {
          this.idleAction = this.mixer.clipAction(clip);
          this.idleAction.setLoop(THREE.LoopRepeat, Infinity);
          this.idleAction.play();
          this.currentAction = this.idleAction;
          this.animationsReady = true;
          this.onReady?.();
        } else if (name === 'walkStart') {
          this.walkStartAction = this.mixer.clipAction(clip);
        } else if (name === 'walkLoop') {
          this.walkLoopAction = this.mixer.clipAction(clip);
          this.walkLoopAction.setLoop(THREE.LoopRepeat, Infinity);
        } else if (name === 'walkStop') {
          this.walkStopAction = this.mixer.clipAction(clip);
        } else if (name === 'run') {
          this.runAction = this.mixer.clipAction(clip);
          this.runAction.setLoop(THREE.LoopRepeat, Infinity);
          this.runAction.timeScale = this.walkConfig.runTimeScale;
        } else if (name.startsWith('action')) {
          this.actionClipNames.push(name);
        } else if (name.startsWith('seqEnter:') || name.startsWith('seqLoop:') || name.startsWith('seqExit:')) {
          const [kind, id] = name.split(':');
          const config = (m.poseSequences ?? []).find((s) => s.id === id);
          const seq = this.sequences.get(id) ?? { config };
          const action = this.mixer.clipAction(clip);
          if (kind === 'seqLoop') action.setLoop(THREE.LoopRepeat, Infinity);
          seq[kind === 'seqEnter' ? 'enterAction' : kind === 'seqLoop' ? 'loopAction' : 'exitAction'] = action;
          this.sequences.set(id, seq);
        }
      } catch (err) {
        console.warn(`アニメーション読み込み失敗: ${url}`, err);
      }
    }));

    // enter/loop/exitが全部揃わなかったシーケンスは事故のもとなので使わない
    for (const [id, seq] of [...this.sequences]) {
      if (!seq.enterAction || !seq.loopAction || !seq.exitAction) {
        console.warn(`シーケンス"${id}"は一部のクリップが読み込めなかったため無効化`);
        this.sequences.delete(id);
      }
    }
  }

  _randomBlinkInterval() {
    return BLINK_MIN_INTERVAL_S + Math.random() * (BLINK_MAX_INTERVAL_S - BLINK_MIN_INTERVAL_S);
  }

  _randomBehaviorInterval() {
    const { minIntervalSeconds, maxIntervalSeconds } = this.behaviorTiming;
    return minIntervalSeconds + Math.random() * (maxIntervalSeconds - minIntervalSeconds);
  }

  _applyOffset(bone, base, eulerX, eulerY, eulerZ) {
    if (!bone || !base) return;
    const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(eulerX, eulerY, eulerZ));
    bone.quaternion.copy(base).multiply(offset);
  }

  _crossfadeTo(action, loop) {
    action.reset();
    if (loop) {
      action.setLoop(THREE.LoopRepeat, Infinity);
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }
    action.fadeIn(CROSSFADE_S);
    action.play();
    this.currentAction?.fadeOut(CROSSFADE_S);
    this.currentAction = action;
  }

  _pickNewWalkTarget() {
    const { radiusMin, radiusMax } = this.walkConfig;
    const angle = Math.random() * Math.PI * 2;
    const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
    this.walkTarget.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  }

  _startBehavior() {
    const available = ['gesture'];
    if (this.walkStartAction && this.walkLoopAction && this.walkStopAction) available.push('walk');
    if (this.runAction) available.push('run');
    for (const id of this.sequences.keys()) available.push(`seq:${id}`);

    const weights = this.behaviorWeights.filter((w) => available.includes(w.type));
    const type = pickBehavior(weights.length > 0 ? weights : [{ type: 'gesture', weight: 1 }]);

    if (type === 'gesture') {
      if (this.actionClipNames.length === 0) return;
      const name = this.actionClipNames[Math.floor(Math.random() * this.actionClipNames.length)];
      const clip = this.clips.get(name);
      const action = this.mixer.clipAction(clip);
      this._crossfadeTo(action, false);
      this.state = 'gesture';
      this.phaseTimer = clip.duration + 0.4;
    } else if (type === 'walk') {
      this._pickNewWalkTarget();
      this._crossfadeTo(this.walkStartAction, false);
      this.state = 'walk-start';
      this.phaseTimer = this.walkStartAction.getClip().duration;
    } else if (type === 'run') {
      this._pickNewWalkTarget();
      this._crossfadeTo(this.runAction, true);
      this.state = 'run';
    } else if (type.startsWith('seq:')) {
      const id = type.slice(4);
      const seq = this.sequences.get(id);
      if (!seq) return;
      this._crossfadeTo(seq.enterAction, false);
      this.state = `seq-enter:${id}`;
      this.phaseTimer = seq.enterAction.getClip().duration;
      if (seq.config.prop) this.activeProps.add(seq.config.prop);
    }
  }

  _updateBehavior(delta) {
    if (this.state === 'idle') {
      this.nextBehaviorTimer -= delta;
      if (this.nextBehaviorTimer <= 0) {
        this._startBehavior();
      }
      return;
    }

    if (this.state === 'gesture') {
      this.phaseTimer -= delta;
      if (this.phaseTimer <= 0) {
        this._crossfadeTo(this.idleAction, true);
        this.state = 'idle';
        this.nextBehaviorTimer = this._randomBehaviorInterval();
      }
      return;
    }

    if (this.state === 'walk-start') {
      this.phaseTimer -= delta;
      if (this.phaseTimer <= 0) {
        this._crossfadeTo(this.walkLoopAction, true);
        this.state = 'walk-loop';
      }
      return;
    }

    if (this.state === 'walk-loop' || this.state === 'run') {
      const pos = this.vrm.scene.position;
      const toTarget = new THREE.Vector3(this.walkTarget.x - pos.x, 0, this.walkTarget.z - pos.z);
      const dist = toTarget.length();
      const speed = this.state === 'run' ? this.walkConfig.runSpeed : this.walkConfig.walkSpeed;

      if (dist < this.walkConfig.arriveDistance) {
        if (this.state === 'walk-loop') {
          this._crossfadeTo(this.walkStopAction, false);
          this.state = 'walk-stop';
          this.phaseTimer = this.walkStopAction.getClip().duration;
        } else {
          this._crossfadeTo(this.idleAction, true);
          this.state = 'idle';
          this.nextBehaviorTimer = this._randomBehaviorInterval();
        }
        return;
      }

      const dir = toTarget.normalize();
      pos.x += dir.x * Math.min(dist, speed * delta);
      pos.z += dir.z * Math.min(dist, speed * delta);
      const targetAngle = Math.atan2(dir.x, dir.z);
      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, targetAngle, 0));
      this.vrm.scene.quaternion.slerp(targetQuat, Math.min(1, delta * 6));
      return;
    }

    if (this.state === 'walk-stop') {
      this.phaseTimer -= delta;
      if (this.phaseTimer <= 0) {
        this._crossfadeTo(this.idleAction, true);
        this.state = 'idle';
        this.nextBehaviorTimer = this._randomBehaviorInterval();
      }
      return;
    }

    if (this.state.startsWith('seq-enter:')) {
      this.phaseTimer -= delta;
      if (this.phaseTimer <= 0) {
        const id = this.state.slice('seq-enter:'.length);
        const seq = this.sequences.get(id);
        this._crossfadeTo(seq.loopAction, true);
        this.state = `seq-loop:${id}`;
        this.phaseTimer = seq.config.minLoopSeconds + Math.random() * (seq.config.maxLoopSeconds - seq.config.minLoopSeconds);
      }
      return;
    }

    if (this.state.startsWith('seq-loop:')) {
      this.phaseTimer -= delta;
      if (this.phaseTimer <= 0) {
        const id = this.state.slice('seq-loop:'.length);
        const seq = this.sequences.get(id);
        this._crossfadeTo(seq.exitAction, false);
        this.state = `seq-exit:${id}`;
        this.phaseTimer = seq.exitAction.getClip().duration;
        if (seq.config.prop) this.activeProps.delete(seq.config.prop);
      }
      return;
    }

    if (this.state.startsWith('seq-exit:')) {
      this.phaseTimer -= delta;
      if (this.phaseTimer <= 0) {
        this._crossfadeTo(this.idleAction, true);
        this.state = 'idle';
        this.nextBehaviorTimer = this._randomBehaviorInterval();
      }
      return;
    }
  }

  // 手続き型のフォールバック(VRMA読み込み失敗時のみ使用)
  _updateFallbackIdle() {
    const breath = Math.sin(this.elapsed * 1.1) * 0.02;
    this._applyOffset(this.chest, this.base.chest, breath, 0, 0);
    this._applyOffset(this.spine, this.base.spine, breath * 0.6, 0, 0);
    const sway = Math.sin(this.elapsed * 0.45) * 0.035;
    this._applyOffset(this.hips, this.base.hips, 0, 0, sway);
    this._applyOffset(this.rightUpperArm, this.base.rightUpperArm, 0, 0, 0);
    this._applyOffset(this.leftUpperArm, this.base.leftUpperArm, 0, 0, 0);
  }

  update(delta) {
    this.elapsed += delta;

    // 瞬き: ランダムな間隔で自動的にまばたき(モーション再生中も常時)
    this.blinkTimer += delta;
    if (this.blinkTimer >= this.nextBlink) {
      this.blinkTimer = -BLINK_DURATION_S;
      this.nextBlink = this._randomBlinkInterval();
    }
    const blinkWeight = this.blinkTimer < 0
      ? 1 - Math.abs(this.blinkTimer) / BLINK_DURATION_S
      : 0;

    if (this.animationsReady) {
      this._updateBehavior(delta);
      this.mixer.update(delta);
    } else {
      this._updateFallbackIdle();
    }

    this.vrm.expressionManager?.setValue('blink', Math.max(0, Math.min(1, blinkWeight)));
    this.vrm.update(delta);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.vrm.scene);
  }
}
