import Avatar from './avatar.js';
import { initSceneObjects } from './scene-objects.js';

const sceneEl = document.getElementById('scene');
const avatarEl = document.getElementById('avatar');

new Avatar(avatarEl, sceneEl);
initSceneObjects(sceneEl);
