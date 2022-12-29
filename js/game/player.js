import { Controller } from "js/game/controller.js";
import * as weapons from 'js/game/weapon.js';

export class Player {
  constructor(map) {
    this.max_health = 1000;
    this.health = this.max_health;
    this.weapons = new Array();
    this.controller = new Controller();
    this.pos = [0, 0];
    this.speed = 2.5/2;

    this.alive = true;
    this.godmode = false;

    this.scale = 1;
    this.sprite = new Image();
    this.sprite.onload = function() {
      this.sprite.width = this.sprite.naturalWidth * this.scale;
      this.sprite.height = this.sprite.naturalHeight * this.scale;
    }.bind(this);
    this.sprite.src = "resources/sprites/avatar.png";

    map.addObstacle(this);
    this.addWeapon(new weapons.SawBlades());
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

  getCollisions(world) {
    const collisions = [];
    world.getMap().getObstacles(this.pos, 400).forEach(obstacle => {
      if (obstacle[4] != "player") {
        
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

  async move(world) {
    
    while (this.getCollisions(world).length > 0) {
      this.pos[1]-=50;
    }

    const direction = this.controller.getDirection();
    if (direction != null) {
      const old_posX = this.pos[0];
      const old_posY = this.pos[1];
      
      this.pos[0] = this.pos[0]+this.speed*world.getDTime()*Math.cos(direction*(Math.PI/180));
      const collisionsX = this.getCollisions(world);
      if (collisionsX.length > 0) { this.pos[0] = old_posX; }
      
      this.pos[1] = this.pos[1]-this.speed*world.getDTime()*Math.sin((direction)*(Math.PI/180));
      const collisionsY = this.getCollisions(world);
      if (collisionsY.length > 0) { this.pos[1] = old_posY; }
    }
  }

  hit(dmg) {
    if (!this.godmode) {
      this.health -= dmg;

      if (this.health <= 0) {
        this.alive = false;
      }
    }
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, ctx.canvas.width/2-this.sprite.width/2, ctx.canvas.height/2-this.sprite.height/2, this.sprite.width, this.sprite.height);

    if (this.health < this.max_health) {
      ctx.fillStyle = "rgb(50, 50, 50)";
      ctx.fillRect(-30+ctx.canvas.width/2, this.sprite.height/2+10+ctx.canvas.height/2, 60, 3);
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.fillRect(-30+ctx.canvas.width/2, this.sprite.height/2+10+ctx.canvas.height/2, Math.max(60*this.health/this.max_health, 0), 3);
    }
  }

  getObstacle() {
    return [this.pos[0]-this.sprite.width/2, this.pos[1]-this.sprite.height/2, this.pos[0]+this.sprite.width/2, this.pos[1]+this.sprite.height/2, "player"];
  }
}