

export class Map {
  constructor(path_to_map) {

    this.pixels = [];
    this.path_map;
    this.image_map = {};
    this.tile_size = 50;
    this.obstacles = [];

    this.loaded_images = 0;
    this.background_color;

    const image = new Image();
    image.onload = function() {
      //console.log('Loaded map image');
      
      // Create a canvas element and set its width and height
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Get a drawing context and draw the image onto the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      
      // Get the pixel data from the canvas
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      
      // Create a 2D array of pixels from the image data
      const rs = [];
      const gs = [];
      const bs = [];
      for (let y = 0; y < image.height; y++) {
        const row = [];
        for (let x = 0; x < image.width; x++) {
          const index = (y * image.width + x) * 4;
          const r = imageData.data[index];
          const g = imageData.data[index + 1];
          const b = imageData.data[index + 2];
          rs.push(r);
          gs.push(g);
          bs.push(b);
          row.push([r, g, b]);
        }
        this.pixels.push(row);
      }
      this.background_color = `rgb(${Math.round(rs.reduce((a, b) => a + b) / rs.length)}, ${Math.round(gs.reduce((a, b) => a + b) / gs.length)}, ${Math.round(bs.reduce((a, b) => a + b) / bs.length)})`;
      
      this.loadMapTextures();
    }.bind(this);
    image.src = path_to_map;
  }

  getObstaclesItems() { return this.obstacles; }
  getObstacles(pos, range) {
    const obstacles = new Array();
    for (let i = 0; i < this.obstacles.length; i++) {
      const opos = this.obstacles[i].getObstacle();
      if (Math.abs(opos[0]-pos[0]) < range && Math.abs(opos[1]-pos[1]) < range) {
        obstacles.push(opos);
      }
    }
    return obstacles;
  }
  addObstacle(obstacle) {
    this.obstacles.push(obstacle);
  }

  check_finished_loading() {
    if (this.loaded_images === Object.keys(this.image_map).length) { return true; }
    else { return false; }
  }

  getBackgroundColor() {
    return this.background_color;
  }

  async loadMapTextures() {
    const response = await fetch('resources/textureMap.json');
    this.path_map = await response.json();
    for (let y = 0; y < this.pixels.length; y++) {
      for (let x = 0; x < this.pixels[0].length; x++) {

        const key = `${this.pixels[y][x][0]},${this.pixels[y][x][1]},${this.pixels[y][x][2]}`;
        let path;
        if (key in this.path_map) { path = this.path_map[key]; } else { path = "resources/textures/error-tile.png"; }
        
        if (!(path in this.image_map)) {
          this.image_map[path] = new Image();
          this.image_map[path].onload = function() {
            this.loaded_images++;
          }.bind(this);
          this.image_map[path].src = path;
        }
        if (path.includes("_block")) {
          this.obstacles.push(new Wall((x-this.pixels[0].length/2)*this.tile_size, (y-this.pixels.length/2)*this.tile_size, (x-this.pixels[0].length/2)*this.tile_size+this.tile_size, (y-this.pixels.length/2)*this.tile_size+this.tile_size));
        }
      }
    }
  }

  async draw(ctx, player_pos) {
    //console.log("Drawing Map");
    for (let y = 0; y < this.pixels.length; y++) {
      for (let x = 0; x < this.pixels[0].length; x++) {

        const posX = (x*this.tile_size)+(ctx.canvas.width/2)-player_pos[0];
        const sPosX = posX-(this.pixels[0].length*this.tile_size/2);
        if (sPosX < -2*this.tile_size || sPosX > ctx.canvas.width+2*this.tile_size) { continue; }

        const posY = (y*this.tile_size)+(ctx.canvas.height/2)-player_pos[1];
        const sPosY = posY-(this.pixels.length*this.tile_size/2);
        if (sPosY < -2*this.tile_size || sPosY > ctx.canvas.height+2*this.tile_size) { continue; }

        const key = `${this.pixels[y][x][0]},${this.pixels[y][x][1]},${this.pixels[y][x][2]}`
        let path;
        if (key in this.path_map) { path = this.path_map[key]; } else { path = "resources/textures/error-tile.png"; }
        
        ctx.drawImage(this.image_map[path], posX-(this.pixels[0].length*this.tile_size/2), posY-(this.pixels.length*this.tile_size/2), this.tile_size, this.tile_size);
      }
    }
  }
}

class Wall {
  constructor(left, top, right, bot) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bot = bot;
  }

  getObstacle() {
    return [this.left, this.top, this.right, this.bot, "wall"];
  }
}