

class Weapon {
  constructor() {

  }
}

export class SawBlades extends Weapon {
  constructor() {
    super();
    this.scale = 1.3;
    this.sprite = new Image();
    this.sprite.onload = function() {
      this.sprite.width = this.sprite.naturalWidth * this.scale;
      this.sprite.height = this.sprite.naturalHeight * this.scale;
    }.bind(this);
    this.sprite.src = "/survivor-game/resources/sprites/saw-blade.png";

    this.damage = 6.5; //6.5
    this.radius = 120;
    this.speed = 1/50 // 1/50
    this.pos = [[0, this.radius], [0, -this.radius]]
  }

  use(world, owner) {
    return new Promise((resolve, reject) => {
      const step = world.getStep()*this.speed;

      this.pos[0][0] = Math.sin(step%(2*Math.PI))*this.radius + owner.getPos()[0];
      this.pos[0][1] = Math.cos(step%(2*Math.PI))*this.radius + owner.getPos()[1];
      this.pos[1][0] = -Math.sin(step%(2*Math.PI))*this.radius + owner.getPos()[0];
      this.pos[1][1] = -Math.cos(step%(2*Math.PI))*this.radius + owner.getPos()[1];

      const obstacles = world.getEnemies();
      for (let k = 0; k < 2; k++) {
        for (let i = -1; i < obstacles.length; i++) {
          let obstacle;
          if (i === -1) { obstacle = world.getPlayer().getObstacle(); }
          else { obstacle = obstacles[i].getObstacle(); }
          if (obstacle[4] != owner.id) {
            
            const top = this.pos[k][1]-this.sprite.height/2;
            const bot = this.pos[k][1]+this.sprite.height/2;
            const left = this.pos[k][0]-this.sprite.width/2;
            const right = this.pos[k][0]+this.sprite.width/2;
            
            const otop = obstacle[1];
            const obot = obstacle[3];
            const oleft = obstacle[0];
            const oright = obstacle[2];

            if (bot > otop && top < obot && left < oright && right > oleft) {
              obstacles[i].hit(this.damage);
            }
          }
        }
      }
      resolve();
    });
  }

  draw(ctx, player_pos) {
    ctx.drawImage(this.sprite, this.pos[0][0]+ctx.canvas.width/2-this.sprite.width/2-player_pos[0], this.pos[0][1]+ctx.canvas.height/2-this.sprite.height/2-player_pos[1], this.sprite.width, this.sprite.height);

    ctx.drawImage(this.sprite, this.pos[1][0]+ctx.canvas.width/2-this.sprite.width/2-player_pos[0], this.pos[1][1]+ctx.canvas.height/2-this.sprite.height/2-player_pos[1], this.sprite.width, this.sprite.height);
  }
}

export class Melee extends Weapon {
  constructor(dmg) {
    super();
    this.damage = dmg;
    this.margin = 5;
  }

  use(world, owner) {
    return new Promise((resolve, reject) => {
      const player = world.getPlayer();
      const psize = [player.sprite.width, player.sprite.height];
      const ppos = player.getPos();

      const pos = owner.getPos();
      const size = [owner.sprite.width, owner.sprite.height];

      if (Math.abs(ppos[0] - pos[0]) < psize[0]/2 + size[0]/2 + this.margin &&
          Math.abs(ppos[1] - pos[1]) < psize[1]/2 + size[1]/2 + this.margin) {
            player.hit(this.damage);
          }

      resolve();
    });
  }

  draw(ctx, player_pos) {
    return;
  }
}