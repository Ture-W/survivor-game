import { World } from "/js/game/world.js";


export class Renderer {
  constructor(world, ctx) {
    this.world = world;
    this.player = world.getPlayer();
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    this.scale = 1;
    this.exp_sprite = new Image();
    this.exp_sprite.onload = function() {
      this.exp_sprite.width = this.exp_sprite.naturalWidth * this.scale;
      this.exp_sprite.height = this.exp_sprite.naturalHeight * this.scale;
    }.bind(this);
    this.exp_sprite.src = "resources/sprites/exp-orb.png";

    this.render_obstacles = false;
  }

  async drawAll() {
    const player_pos = this.player.getPos();

    // Clear screen
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = this.world.getMap().getBackgroundColor();
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Draw the map
    this.world.getMap().draw(this.ctx, player_pos);

    // Draw exp orbs
    const exp_pos = this.world.getExpPos();
    for (let i = 0; i < exp_pos.length; i++) {
      this.ctx.drawImage(this.exp_sprite, exp_pos[i][0]-player_pos[0]+this.ctx.canvas.width/2-this.exp_sprite.width/2, exp_pos[i][1]-player_pos[1]+this.ctx.canvas.height/2-this.exp_sprite.height/2, this.exp_sprite.width, this.exp_sprite.height);
    }

    // Draw food
    this.world.getFood().forEach(food => {
      food.draw(this.ctx, player_pos);
    });

    // Draw player
    this.player.draw(this.ctx);

    // Draw enemies
    this.world.getEnemies().forEach(enemy => {
      enemy.draw(this.ctx, player_pos)
    });


    // Draw enemies' weapons
    const enemies = this.world.getEnemies();
    for (let i = 0; i < enemies.length; i++) {
      const weapons = enemies[i].getWeapons();
      for (let j = 0; j < weapons.length; j++) {
        weapons[j].draw(this.ctx, player_pos);
      }
    }


    // Draw player's weapons
    const weapons = this.player.getWeapons();
    for (let i = 0; i < weapons.length; i++) {
      weapons[i].draw(this.ctx, player_pos);
    }

    if (this.render_obstacles) {
      const obstacles = this.world.getMap().getObstacles(player_pos, 1000);
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        this.ctx.fillRect(obstacle[0]+this.ctx.canvas.width/2-player_pos[0], obstacle[1]+this.ctx.canvas.height/2-player_pos[1], obstacle[2]-obstacle[0], obstacle[3]-obstacle[1]);
      }
    }

    // Draw GUI
  }
}