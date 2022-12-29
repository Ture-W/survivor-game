import { Renderer } from '/js/renderer.js';
import { World } from '/js/game/world.js';
import { Bat, Witch, BirdMan } from '/js/game/enemy.js';


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = canvas.offsetWidth;
ctx.canvas.height = canvas.offsetHeight;

const map_path = "/resources/map.png";
const world = new World(map_path);
const renderer = new Renderer(world, ctx);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let settings = null;
async function loadSettings() {
  const response = await fetch('/settings.json');
  const json = await response.json();
  settings = json;
}
loadSettings();

function checkLoaded() {
  if (settings != null && world.getMap().check_finished_loading()) { // && document.hasFocus()
    gameLoop();
  } else {
    window.setTimeout(checkLoaded, 300);
  }
}
checkLoaded();

async function gameLoop() {
  const max_fps = settings["max-fps"];
  
  renderer.drawAll();
  const done = false;
  while (!done) {
    const start = performance.now();
    
    if (document.hasFocus()) {
      await world.step();
      await renderer.drawAll();
    }
    
    const end = performance.now();
    
    const dtime = end - start;
    if (1000/dtime > max_fps) {
      const delay = 1000 / max_fps - dtime % (1000 / max_fps);
      if (delay > 0) {
        await sleep(delay);
      }
    }
    world.setDTime(performance.now()-start);
  }
}

