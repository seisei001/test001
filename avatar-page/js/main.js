import Avatar from './avatar.js';
import { initSceneObjects } from './scene-objects.js';

const scene = document.getElementById('scene');
const avatarEl = document.getElementById('avatar');
const NUDGE_PX = 60;

const avatar = new Avatar(avatarEl, scene);
initSceneObjects(scene);

document.getElementById('btn-left').addEventListener('click', () => avatar.nudge(-NUDGE_PX));
document.getElementById('btn-right').addEventListener('click', () => avatar.nudge(NUDGE_PX));
document.getElementById('btn-jump').addEventListener('click', () => avatar.jump());

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') avatar.nudge(-NUDGE_PX);
  else if (e.key === 'ArrowRight') avatar.nudge(NUDGE_PX);
  else if (e.key === ' ') { e.preventDefault(); avatar.jump(); }
});
