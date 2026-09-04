import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdce9f5);
  scene.fog = new THREE.Fog(0xdce9f5, 8, 20);

  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(0, 1.35, 3.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.0, 0);
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 6;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;
  controls.update();

  // 見た人がドラッグしたら少しの間だけ自動回転を止め、離すとまた自動で回り出す
  let resumeAutoRotateTimer = null;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(resumeAutoRotateTimer);
  });
  controls.addEventListener('end', () => {
    resumeAutoRotateTimer = setTimeout(() => { controls.autoRotate = true; }, 4000);
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
    new THREE.CircleGeometry(4, 48),
    new THREE.MeshStandardMaterial({ color: 0xeef3f8, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  function resize() {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / (innerHeight * 0.92);
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight * 0.92);
  }
  window.addEventListener('resize', resize);
  resize();

  return { scene, camera, renderer, controls };
}
