import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * @param {HTMLCanvasElement} canvas
 * @param {object} [options]
 * @param {number} [options.backgroundColor=0xdce9f5]
 * @param {number} [options.cameraDistance=3.2]
 * @param {number} [options.cameraHeight=1.35]
 * @param {number} [options.targetHeight=1.0] - 注視点の高さ
 * @param {boolean} [options.autoRotate=true]
 * @param {number} [options.autoRotateSpeed=1.4]
 * @param {number} [options.groundRadius=4]
 * @param {number} [options.groundColor=0xeef3f8]
 * @param {Record<string, {radiusTop:number, radiusBottom:number, height:number, color:number}>} [options.props]
 *   シーンに用意しておく小道具(円柱)の定義。キーがprop ID。初期状態は非表示。
 */
export function createScene(canvas, options = {}) {
  const {
    backgroundColor = 0xdce9f5,
    cameraDistance = 3.2,
    cameraHeight = 1.35,
    targetHeight = 1.0,
    autoRotate = true,
    autoRotateSpeed = 1.4,
    groundRadius = 4,
    groundColor = 0xeef3f8,
    props = {},
  } = options;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);
  scene.fog = new THREE.Fog(backgroundColor, 8, 20);

  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(0, cameraHeight, cameraDistance);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, targetHeight, 0);
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 6;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.update();

  // 見た人がドラッグしたら少しの間だけ自動回転を止め、離すとまた自動で回り出す
  let resumeAutoRotateTimer = null;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(resumeAutoRotateTimer);
  });
  controls.addEventListener('end', () => {
    if (autoRotate) {
      resumeAutoRotateTimer = setTimeout(() => { controls.autoRotate = true; }, 4000);
    }
  });

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.1);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff2e0, 1.6);
  keyLight.position.set(1.5, 3, 2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xbcd4ff, 0.5);
  rimLight.position.set(-2, 1.5, -2);
  scene.add(rimLight);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(groundRadius, 48),
    new THREE.MeshStandardMaterial({ color: groundColor, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // シーケンス動作(座る等)の間だけ表示する小道具を、指定された分だけ用意しておく
  const propObjects = {};
  for (const [id, def] of Object.entries(props)) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(def.radiusTop, def.radiusBottom, def.height, 24),
      new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.8 })
    );
    mesh.position.y = def.height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.visible = false;
    scene.add(mesh);
    propObjects[id] = mesh;
  }

  function resize() {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / (innerHeight * 0.92);
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight * 0.92);
  }
  window.addEventListener('resize', resize);
  resize();

  function dispose() {
    window.removeEventListener('resize', resize);
    clearTimeout(resumeAutoRotateTimer);
    controls.dispose();
    renderer.dispose();
  }

  return { scene, camera, renderer, controls, props: propObjects, resize, dispose };
}
