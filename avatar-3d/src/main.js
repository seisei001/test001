import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createScene } from './scene.js';
import AvatarController from './avatar-controller.js';

const AVATAR_URL = '/models/avatar.vrm';

const canvas = document.getElementById('scene-canvas');
const notice = document.getElementById('missing-avatar-notice');
const { scene, camera, renderer, controls } = createScene(canvas);

function createPlaceholder() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.28, 0.9, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xf3b6c9, roughness: 0.6 })
  );
  body.position.y = 0.95;
  body.castShadow = true;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xffe1c9, roughness: 0.6 })
  );
  head.position.y = 1.65;
  head.castShadow = true;
  group.add(body, head);
  return group;
}

let controller = null;

async function loadAvatar() {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));

  try {
    const headResponse = await fetch(AVATAR_URL, { method: 'HEAD' });
    if (!headResponse.ok) throw new Error('avatar.vrm not found');

    const gltf = await loader.loadAsync(AVATAR_URL);
    const vrm = gltf.userData.vrm;
    VRMUtils.removeUnnecessaryVertices(gltf.scene);
    VRMUtils.combineSkeletons(gltf.scene);
    VRMUtils.rotateVRM0(vrm);

    vrm.scene.traverse((obj) => {
      obj.frustumCulled = false;
      if (obj.isMesh) obj.castShadow = true;
    });

    scene.add(vrm.scene);
    controller = new AvatarController(vrm);
    notice.hidden = true;
  } catch (err) {
    console.warn('avatar.vrm を読み込めませんでした。プレースホルダーを表示します。', err);
    scene.add(createPlaceholder());
    notice.hidden = false;
  }
}

loadAvatar();

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(0.1, clock.getDelta());
  controller?.update(delta);
  controls.update();
  renderer.render(scene, camera);
}
animate();
