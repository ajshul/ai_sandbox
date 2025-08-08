import Movement from "./Movement.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";

// GravityFall — straight down fall without flaming trail (for Bomb)
class GravityFall extends Movement {
  constructor({ maxSpeed = 3, acceleration = 0.2 } = {}) {
    super({ maxSpeed, acceleration });
  }
}

export default GravityFall;
