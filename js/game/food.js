
class Food {
  constructor() {
    // No constructor needed
  }

  getPos() {
    return this.pos;
  }

  use(player) {
    player.addHealth(this.healthiness);
  }

  draw(ctx, player_pos) {
    ctx.drawImage(this.sprite, this.pos[0]-player_pos[0]+ctx.canvas.width/2-this.sprite.width/2, this.pos[1]-player_pos[1]+ctx.canvas.height/2-this.sprite.height/2, this.sprite.width, this.sprite.height);
  }
}


export class Apple extends Food {
  constructor(pos) {
    super();
    this.pos = pos;
    this.healthiness = 200;

    this.scale = 2;
    this.sprite = new Image();
    this.sprite.onload = function() {
      this.sprite.width = this.sprite.naturalWidth * this.scale;
      this.sprite.height = this.sprite.naturalHeight * this.scale;
    }.bind(this);
    this.sprite.src = "/survivor-game/resources/sprites/apple.png";
  }
}