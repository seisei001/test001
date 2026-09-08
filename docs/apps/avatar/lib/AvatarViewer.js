import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createScene } from './scene.js';
import AvatarController from './avatar-controller.js';
import { DEFAULT_ANIMATION_MANIFEST, DEFAULT_PROPS } from './default-manifest.js';

function joinUrl(base, path) {
  if (!base || /^([a-z]+:)?\/\//i.test(path)) return path;
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

function createPlaceholder() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.17, 0.75, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xf3b6c9, roughness: 0.6 })
  );
  body.position.y = 0.78;
  body.castShadow = true;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xffe1c9, roughness: 0.6 })
  );
  head.position.y = 1.48;
  head.castShadow = true;
  group.add(body, head);
  return group;
}

/**
 * 自律的に動くVRM女性アバターを、指定したcanvasに描画・アニメーションさせる
 * 独立したビューア。別アプリへの組み込みを想定して、DOM要素のIDなどには
 * 一切依存しない(コンストラクタに渡されたcanvas要素だけを使う)。
 *
 * 使い方:
 * ```js
 * const viewer = new AvatarViewer(canvasEl, { avatarUrl: '/models/AvatarSample_A.vrm' });
 * viewer.addEventListener('ready', () => console.log('avatar loaded'));
 * viewer.addEventListener('error', (e) => console.error(e.detail));
 * viewer.start();
 * // 不要になったら:
 * viewer.dispose();
 * ```
 *
 * イベント: 'ready'(アバター読み込み完了) / 'error'(detail: Error) /
 *          'statechange'(detail: 現在の行動状態の文字列。仕草の場合は
 *          'gesture:animations/vrmviewer/Surprised.vrma' のように
 *          再生中クリップのmanifest上のパスまで含む)
 */
export default class AvatarViewer extends EventTarget {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} [options]
   * @param {string} [options.avatarUrl] - VRMファイルのURL。省略時はプレースホルダーのみ表示
   * @param {string} [options.assetsBaseUrl=''] - avatarUrl・アニメーションパスすべてに付与するプレフィックス
   * @param {object} [options.animationManifest] - default-manifest.js の形式。省略時は同梱のデフォルト素材を使用
   * @param {object} [options.props] - シーンに用意する小道具の定義。省略時はデフォルト(スツール)
   * @param {Array<{type:string, weight:number}>} [options.behaviorWeights]
   * @param {object} [options.behaviorTiming] - { minIntervalSeconds, maxIntervalSeconds }
   * @param {object} [options.walkConfig]
   * @param {object} [options.sceneOptions] - scene.js の createScene に渡すオプション
   */
  constructor(canvas, options = {}) {
    super();
    this.canvas = canvas;
    this.options = options;
    this.assetsBaseUrl = options.assetsBaseUrl ?? '';
    this.manifest = options.animationManifest ?? DEFAULT_ANIMATION_MANIFEST;
    this.propsDefinition = options.props ?? DEFAULT_PROPS;

    const { scene, camera, renderer, controls, props, resize, dispose } = createScene(canvas, {
      ...options.sceneOptions,
      props: this.propsDefinition,
    });
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.props = props;
    this._sceneResize = resize;
    this._sceneDispose = dispose;

    this.controller = null;
    this.vrm = null;
    this._placeholder = null;
    this._running = false;
    this._rafId = null;
    this._timer = new THREE.Timer();
    this._timer.connect(document);
    this._disposed = false;
    this._lastState = null;

    if (options.avatarUrl) {
      this.setAvatar(options.avatarUrl);
    } else {
      this._placeholder = createPlaceholder();
      this.scene.add(this._placeholder);
    }
  }

  /**
   * アバターを読み込む(差し替え含む)。読み込みに失敗した場合はプレースホルダーを表示し、
   * 'error' イベントを発行する。
   * @param {string} url
   */
  async setAvatar(url) {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    try {
      const response = await fetch(joinUrl(this.assetsBaseUrl, url));
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || contentType.includes('text/html')) {
        throw new Error(`avatar not found: ${url}`);
      }
      const buffer = await response.arrayBuffer();
      const gltf = await loader.parseAsync(buffer, '');
      const vrm = gltf.userData.vrm;
      VRMUtils.removeUnnecessaryVertices(gltf.scene);
      VRMUtils.combineSkeletons(gltf.scene);
      VRMUtils.rotateVRM0(vrm);

      vrm.scene.traverse((obj) => {
        obj.frustumCulled = false;
        if (obj.isMesh) obj.castShadow = true;
      });

      this._removeCurrentAvatar();
      this.scene.add(vrm.scene);
      this.vrm = vrm;
      this.controller = new AvatarController(vrm, this.manifest, {
        assetsBaseUrl: this.assetsBaseUrl,
        behaviorWeights: this.options.behaviorWeights,
        behaviorTiming: this.options.behaviorTiming,
        walkConfig: this.options.walkConfig,
        onReady: () => this.dispatchEvent(new CustomEvent('ready')),
      });
    } catch (err) {
      console.warn('アバターを読み込めませんでした。プレースホルダーを表示します。', err);
      this._removeCurrentAvatar();
      this._placeholder = createPlaceholder();
      this.scene.add(this._placeholder);
      this.dispatchEvent(new CustomEvent('error', { detail: err }));
    }
  }

  _removeCurrentAvatar() {
    if (this._placeholder) {
      this.scene.remove(this._placeholder);
      this._placeholder = null;
    }
    if (this.vrm) {
      this.scene.remove(this.vrm.scene);
      this.controller?.dispose();
      this.controller = null;
      this.vrm = null;
    }
  }

  /** 現在の行動状態(idle / gesture / walk-loop / seq-loop:sit 等)。未読み込み時はnull */
  get currentState() {
    return this.controller?.state ?? null;
  }

  /** 現在、姿勢シーケンス由来の小道具(座る用スツール等)が表示されているか */
  get activeProps() {
    return this.controller?.activeProps ?? new Set();
  }

  _tick() {
    this._rafId = requestAnimationFrame(() => this._tick());
    this._timer.update();
    const delta = Math.min(0.1, this._timer.getDelta());

    this.controller?.update(delta);

    if (this.controller) {
      const avatarPos = this.vrm.scene.position;
      // 歩き回るアバターを視界の中心に保つため、注視点をゆるやかに追従させる
      this.controls.target.x += (avatarPos.x - this.controls.target.x) * Math.min(1, delta * 2);
      this.controls.target.z += (avatarPos.z - this.controls.target.z) * Math.min(1, delta * 2);

      // シーケンス動作中の小道具の表示・位置合わせ
      for (const [id, obj] of Object.entries(this.props)) {
        const active = this.controller.activeProps.has(id);
        obj.visible = active;
        if (active) {
          obj.position.x = avatarPos.x;
          obj.position.z = avatarPos.z;
        }
      }

      if (this.controller.state !== this._lastState) {
        this._lastState = this.controller.state;
        this.dispatchEvent(new CustomEvent('statechange', { detail: this.controller.state }));
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /** 描画・アニメーションループを開始する */
  start() {
    if (this._running || this._disposed) return;
    this._running = true;
    this._tick();
  }

  /** 描画・アニメーションループを停止する(状態は保持されるので再度start()すれば再開できる) */
  stop() {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /** キャンバスのサイズが変わった場合に手動で呼ぶ(通常はwindowのresizeで自動対応) */
  resize() {
    this._sceneResize();
  }

  /** 完全に破棄する。以後このインスタンスは再利用できない */
  dispose() {
    this.stop();
    this._removeCurrentAvatar();
    this._sceneDispose();
    this._disposed = true;
  }
}
