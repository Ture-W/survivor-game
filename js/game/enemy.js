import * as weapons from '/survivor-game/js/game/weapon.js';

class Enemy {
  constructor() {
    this.weapons = new Array();
    this.alive = true;
  }

  addWeapon(weapon) {
    this.weapons.push(weapon);
  }
  getWeapons() {
    return this.weapons;
  }

  addHealth(hp) {
    this.health = Math.min(this.health+hp, this.max_health);
  }
  getHealth() {
    return this.health;
  }

  getPos() {
    return this.pos;
  }

  hit(dmg) {
    this.health -= dmg;
    if (this.health <= 0) {
      this.alive = false;
    }
  }

  draw(ctx, player_pos) {
    ctx.drawImage(this.sprite, this.pos[0]-player_pos[0]+ctx.canvas.width/2-this.sprite.width/2, this.pos[1]-player_pos[1]+ctx.canvas.height/2-this.sprite.height/2 , this.sprite.width, this.sprite.height);

    if (this.health < this.max_health) {
      ctx.fillStyle = "rgb(50, 50, 50)";
      ctx.fillRect(this.pos[0]-30+ctx.canvas.width/2-player_pos[0], this.pos[1]+this.sprite.height/2+10+ctx.canvas.height/2-player_pos[1], 60, 3);
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.fillRect(this.pos[0]-30+ctx.canvas.width/2-player_pos[0], this.pos[1]+this.sprite.height/2+10+ctx.canvas.height/2-player_pos[1], Math.max(60*this.health/this.max_health, 0), 3);
    }
  }

  getScale() {
    return this.scale;
  }

  getObstacle() {
    return [this.pos[0]-this.sprite.width/2, this.pos[1]-this.sprite.height/2, this.pos[0]+this.sprite.width/2, this.pos[1]+this.sprite.height/2, this.id];
  }

  getCollisions(world) {
    const collisions = [];
    world.getMap().getObstacles(this.pos, 400).forEach(obstacle => {
      if (obstacle[4] != this.id) {
        
        const top = this.pos[1]-this.sprite.height/2;
        const bot = this.pos[1]+this.sprite.height/2;
        const left = this.pos[0]-this.sprite.width/2;
        const right = this.pos[0]+this.sprite.width/2;
        
        const otop = obstacle[1];
        const obot = obstacle[3];
        const oleft = obstacle[0];
        const oright = obstacle[2];

        if (bot > otop && top < obot && left < oright && right > oleft) {
          collisions.push(obstacle);
        }
      }
    });
    return collisions;
  }
}


export class Bat extends Enemy {
  constructor(map, id, pos) {
    super();
    this.pos = pos;
    this.max_health = 100;
    this.health = this.max_health;
    this.speed = 1.8/2;
    this.id = id;
    map.addObstacle(this);

    this.rand_offset = Math.random()*10000;
    this.sway_speed = 1/10;
    this.sway_amplitude = 1/5;

    this.scale = 1.9;
    this.sprite = new Image();
    this.sprite.onload = function() {
      this.sprite.width = this.sprite.naturalWidth * this.scale;
      this.sprite.height = this.sprite.naturalHeight * this.scale;
    }.bind(this);
    this.sprite.src = "resources/sprites/bat.png";

    this.addWeapon(new weapons.Melee(7));
  }

  move(world, player) {
    return new Promise((resolve, reject) => {

      while (this.getCollisions(world).length > 0) {
        this.pos[1]-=50;
      }

      const step = world.getStep()+this.rand_offset;
      const sway = Math.sin((step*this.sway_speed)%(2*Math.PI))*this.sway_amplitude;

      const player_pos = player.getPos();
      const direction = Math.atan2(this.pos[1] - player_pos[1], player_pos[0] - this.pos[0]) + sway;

      const old_posX = this.pos[0];
      const old_posY = this.pos[1];

      this.pos[0] = this.pos[0]+this.speed*world.getDTime()*Math.cos(direction);
      const collisionsX = this.getCollisions(world);
      if (collisionsX.length > 0) { this.pos[0] = old_posX; }
      
      this.pos[1] = this.pos[1]-this.speed*world.getDTime()*Math.sin(direction);
      const collisionsY = this.getCollisions(world);
      if (collisionsY.length > 0) { this.pos[1] = old_posY; }

      resolve();
    });
  }
}


export class Witch extends Enemy {
  constructor(map, id, pos) {
    super();
    this.pos = pos;
    this.max_health = 230;
    this.health = this.max_health;
    this.speed = 1.3/2;
    this.id = id;
    map.addObstacle(this);

    this.rand_offset = Math.random()*10000;
    this.sway_speed = 1/50;
    this.sway_amplitude = 1/2;

    this.scale = 1.9;
    this.sprite = new Image();
    this.sprite.onload = function() {
      this.sprite.width = this.sprite.naturalWidth * this.scale;
      this.sprite.height = this.sprite.naturalHeight * this.scale;
    }.bind(this);
    this.sprite.src = "resources/sprites/witch.png";

    this.addWeapon(new weapons.Melee(12));
  }

  move(world, player) {
    return new Promise((resolve, reject) => {
      
      while (this.getCollisions(world).length > 0) {
        this.pos[1]-=50;
      }

      const step = world.getStep()+this.rand_offset;
      const sway = Math.sin((step*this.sway_speed)%(2*Math.PI))*this.sway_amplitude;

      const player_pos = player.getPos();
      const direction = Math.atan2(this.pos[1] - player_pos[1], player_pos[0] - this.pos[0]) + sway;

      const old_posX = this.pos[0];
      const old_posY = this.pos[1];

      this.pos[0] = this.pos[0]+this.speed*world.getDTime()*Math.cos(direction);
      const collisionsX = this.getCollisions(world);
      if (collisionsX.length > 0) { this.pos[0] = old_posX; }
      
      this.pos[1] = this.pos[1]-this.speed*world.getDTime()*Math.sin(direction);
      const collisionsY = this.getCollisions(world);
      if (collisionsY.length > 0) { this.pos[1] = old_posY; }

      resolve();
    });
  }
}


export class BirdMan extends Enemy {
  constructor(map, id, pos) {
    super();
    this.pos = pos;
    this.max_health = 600;
    this.health = this.max_health;
    this.speed = 0.8/2;
    this.id = id;
    map.addObstacle(this);

    this.scale = 3.7; //3.7
    this.sprite = new Image();
    this.sprite.onload = function() {
      this.sprite.width = this.sprite.naturalWidth * this.scale;
      this.sprite.height = this.sprite.naturalHeight * this.scale;
    }.bind(this);
    this.sprite.src = "resources/sprites/bird-man.png";

    this.addWeapon(new weapons.Melee(17));
  }

  move(world, player) {
    return new Promise((resolve, reject) => {
      
      while (this.getCollisions(world).length > 0) {
        this.pos[1]-=50;
      }

      const player_pos = player.getPos();
      const direction = Math.atan2(this.pos[1] - player_pos[1], player_pos[0] - this.pos[0]);

      const old_posX = this.pos[0];
      const old_posY = this.pos[1];

      this.pos[0] = this.pos[0]+this.speed*world.getDTime()*Math.cos(direction);
      const collisionsX = this.getCollisions(world);
      if (collisionsX.length > 0) { this.pos[0] = old_posX; }
      
      this.pos[1] = this.pos[1]-this.speed*world.getDTime()*Math.sin(direction);
      const collisionsY = this.getCollisions(world);
      if (collisionsY.length > 0) { this.pos[1] = old_posY; }

      resolve();
    });
  }
}