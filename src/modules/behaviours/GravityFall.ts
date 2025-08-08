import Movement from "./Movement.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";

// GravityFall — straight down fall without flaming trail (for Bomb)
class GravityFall extends Movement {
  constructor({ maxSpeed = 3, acceleration = 0.2 } = {}) {
    super({ maxSpeed, acceleration });
  }

  // Restrict to vertical falling only (no diagonal spill like granular)
  step(element: Element, grid: Grid, x: number, y: number, nx: number, ny: number) {
    while (ny > y) {
      const moves = super.availableMoves(nx, ny, grid);
      if (moves[0] === 1) {
        grid.swap(y * grid.col + x, ny * grid.col + nx);
        return;
      }
      ny--;
    }
  }
}

export default GravityFall;
