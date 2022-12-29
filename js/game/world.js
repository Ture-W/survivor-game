import { Player } from "/js/game/player.js";
import { Map } from "/js/game/map.js";
import { Apple } from '/js/game/food.js';
import { Manager } from '/js/game/manager.js';


export class World {
  constructor(map_path) {
    this.map = new Map(map_path);
    this.exp = 0;
    this.exp_pos = [];  // Array of [x, y] positions of all exp items on the map
    this.level = 0;
    this.player = new Player(this.map);
    this.enemies = new Array();
    this.food_array = new Array();
    this.dtime = 0;
    this.stepCount = 0;
    this.manager = new Manager();

    this.exp_reach = 35;

    this.reloading = false;
  }

  addFood(food) {
    this.food_array.push(food);
  }
  getFood() {
    return this.food_array;
  }

  getPlayer() {
    return this.player;
  }
  getExp() {
    return [this.exp, this.level];
  }
  getExpPos() {
    return this.exp_pos;
  }
  getMap() {
    return this.map;
  }

  getStep() {
    return this.stepCount;
  }

  getDTime() {
    return this.dtime;
  }
  setDTime(dtime) {
    this.dtime = dtime/10;
  }

  getEnemies() {
    return this.enemies;
  }
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  addEnemies(Enemy, center, cols, rows) {
    const first_enemy = new Enemy(this.map, Math.random(), [0, 0]);

    first_enemy.sprite.onload = function() {

      const psX = first_enemy.sprite.naturalWidth*first_enemy.getScale();
      const psY = first_enemy.sprite.naturalHeight*first_enemy.getScale();
      first_enemy.sprite.width = psX;
      first_enemy.sprite.height = psY;

      const width = cols*psX;
      const height = rows*psY;
      const margin = 15;

      let count = 1;
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const posX = psX*x;
          const posY = psY*y;

          if (x === 0 && y === 0) {
            first_enemy.pos = [center[0]+posX-width/2, center[1]+posY-height/2];
            this.enemies.push(first_enemy);
          } else {
            this.enemies.push(new Enemy(this.map, Math.random(), [center[0]+posX-width/2+margin*x, center[1]+posY-height/2+margin*y]));
            count++;
          }
        }
      }
    }.bind(this);
  }

  async step() {
    
    // Move player
    this.player.move(this);

    // Move enemies
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].move(this, this.player);
    }

    // Check if player is ate food
    for (let i = 0; i < this.food_array.length; i++) {
      if (Math.abs(this.player.getPos()[0]-this.food_array[i].getPos()[0]) < this.player.sprite.width/2 + this.food_array[i].sprite.width/2 &&
          Math.abs(this.player.getPos()[1]-this.food_array[i].getPos()[1]) < this.player.sprite.height/2 + this.food_array[i].sprite.height/2 ) {
            this.food_array[i].use(this.player);
            this.food_array.splice(i, 1);
          }
    }

    // Check if player picked up exp
    for (let i = 0; i < this.exp_pos.length; i++) {
      if (Math.abs(this.player.getPos()[0]-this.exp_pos[i][0]) < this.player.sprite.width/2 + this.exp_reach &&
          Math.abs(this.player.getPos()[1]-this.exp_pos[i][1]) < this.player.sprite.height/2 + this.exp_reach ) {
            this.exp+=50;
            this.exp_pos.splice(i, 1);
          }
    }

    // Use player's weapons
    const weapons = this.player.getWeapons();
    for (let i = 0; i < weapons.length; i++) {
      weapons[i].use(this, this.player);
    }

    // Remove all dead enemies adn add exp and food
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].alive === false) {
        const obstacles = this.map.getObstaclesItems();
        const pos = this.enemies[i].getPos();
        for (let j = 0; j < obstacles.length; j++) {
          if (obstacles[j].constructor.name === this.enemies[i].constructor.name && obstacles[j].getPos() === pos) {
            this.map.obstacles.splice(j, 1);
          }
        }
        this.exp_pos.push(pos);
        if (Math.random() > 0.9) {
          this.food_array.push(new Apple(pos));
        }
        
        this.enemies.splice(i, 1);
      }
    }

    // Use enemies' weapons
    for (let i = 0; i < this.enemies.length; i++) {
      const weapons = this.enemies[i].getWeapons();
      for (let j = 0; j < weapons.length; j++) {
        weapons[j].use(this, this.enemies[i]);
      }
    }

    // Check gameover
    if (!this.player.alive && !this.reloading) {
      this.reloading = true;
      location.reload();
    }

    // Check level up


    // Spawn enemies
    this.manager.manage(this.stepCount, this, this.player);

    
    this.stepCount++;
  }
}