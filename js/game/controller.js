
export class Controller {
  constructor() {
    this.keys = [0,0,0,0]

    document.addEventListener("keydown", event => {
      if (event.key === "w") {
        this.keys[0] = 1;
      } else if (event.key === "a") {
        this.keys[1] = 1;
      } else if (event.key === "s") {
        this.keys[2] = 1;
      } else if (event.key === "d") {
        this.keys[3] = 1;
      }
    });
    document.addEventListener("keyup", event => {
      if (event.key === "w") {
        this.keys[0] = 0;
      } else if (event.key === "a") {
        this.keys[1] = 0;
      } else if (event.key === "s") {
        this.keys[2] = 0;
      } else if (event.key === "d") {
        this.keys[3] = 0;
      }
    });
  }

  getDirection() {
    if (this.keys[0] === 1 && this.keys[3]) {  // w and d
      return 45;
    } else if (this.keys[0] === 1 && this.keys[1]) {  // w and a
      return 135;
    } else if (this.keys[2] === 1 && this.keys[3]) {  // s and d
      return -45;
    } else if (this.keys[2] === 1 && this.keys[1]) {  // s and a
      return -135;
    } else if (this.keys[0] === 1) {  // w
      return 90;
    } else if (this.keys[1] === 1) {  // a
      return 180;
    } else if (this.keys[2] === 1) {  // s
      return -90;
    } else if (this.keys[3] === 1) {  // d
      return 0;
    } else {
      return null;
    }
  }
}