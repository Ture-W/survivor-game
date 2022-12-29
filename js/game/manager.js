import * as enemy from '/survivor-game/js/game/enemy.js';

export class Manager {

  manage(step, world, player) {
    const ppos = player.getPos();

    const pdirRaw = player.controller.getDirection();
    
    const left = ppos[0]-800;
    const top = ppos[1]-600;
    const right = ppos[0]+800;
    const bot = ppos[1]+600;

    let pdir = [0, bot];
    if (pdirRaw != null) { pdir = [ppos[0]+800*Math.cos(pdirRaw*(Math.PI/180)), ppos[1]-800*Math.sin(pdirRaw*(Math.PI/180))] }

    if (step >= 0 && step < 2500 && step%700 === 0) {
      world.addEnemies(enemy.Bat, [ppos[0], top], 2, 2);
      world.addEnemies(enemy.Bat, [right, ppos[1]], 2, 2);
      world.addEnemies(enemy.Bat, [ppos[0], bot], 2, 2);
      world.addEnemies(enemy.Bat, [left, ppos[1]], 2, 2);
      world.addEnemies(enemy.Bat, pdir, 3, 3);
    }

    if (step === 2500) {
      world.addEnemies(enemy.Bat, [right, ppos[1]-300], 3, 3);
      world.addEnemies(enemy.Bat, [ppos[0], ppos[1]+600], 3, 3);
      world.addEnemies(enemy.Witch, [ppos[0], top], 1, 1);
      world.addEnemies(enemy.Witch, [left, ppos[1]+300], 1, 1);
      world.addEnemies(enemy.Witch, pdir, 2, 2);
    }
    if (step >= 2501 && step < 7500 && step%1500 === 0) {
      world.addEnemies(enemy.Bat, [right, ppos[1]-300], 1, 2);
      world.addEnemies(enemy.Bat, [ppos[0], ppos[1]+600], 2, 1);
      world.addEnemies(enemy.Witch, [ppos[0], top], 5, 1);
      world.addEnemies(enemy.Witch, [ppos[0], bot], 5, 1);
      world.addEnemies(enemy.Witch, pdir, 2, 2);
    }

    if (step === 7500) {      
      world.addEnemies(enemy.BirdMan, [left, ppos[1]], 1, 6);
      world.addEnemies(enemy.BirdMan, [ppos[0], top], 6, 1);
      world.addEnemies(enemy.BirdMan, [right, ppos[1]], 1, 6);
      world.addEnemies(enemy.BirdMan, [ppos[0], bot], 6, 1);

      world.addEnemies(enemy.BirdMan, [left, top], 1, 1);
      world.addEnemies(enemy.BirdMan, [right, top], 1, 1);
      world.addEnemies(enemy.BirdMan, [left, bot], 1, 1);
      world.addEnemies(enemy.BirdMan, [right, bot], 1, 1);
    }
  }
}