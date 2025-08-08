import SolidMove from "./SolidMove.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";
import Fire from "../elements/misc/fire.js";
import Smoke from "../elements/gases/smoke.js";

class MeteorMove extends SolidMove {
  bias: -1 | 1;
  diagonalPreference: number;
  stuckFrames: number;

  constructor({
    maxSpeed = 5,
    acceleration = 0.3,
    bias = 1 as -1 | 1,
    diagonalPreference = 0.6,
  } = {}) {
    super({ maxSpeed, acceleration });
    this.bias = bias;
    this.diagonalPreference = diagonalPreference;
    this.stuckFrames = 0;
  }

  private explode(grid: Grid, element: Element) {
    const x = element.index % grid.row;
    const y = Math.floor(element.index / grid.col);
    const r = 2;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          const nx = x + dx,
            ny = y + dy;
          if (!grid.isValidIndex(nx, ny)) continue;
          const ni = ny * grid.col + nx;
          grid.setElement(nx, ny, new Fire(ni));
        }
      }
    }
    // leave smoke at the impact point
    grid.setElement(x, y, new Smoke(y * grid.col + x));
    grid.removeIndex(element.index);
  }

  // Override step to bias diagonals
  step(
    element: Element,
    grid: Grid,
    x: number,
    y: number,
    nx: number,
    ny: number
  ) {
    while (ny > y) {
      const moves = super.availableMoves(nx, ny, grid); // [down, down-left, down-right]
      const preferLeft = this.bias === -1;
      // choose order
      const order: number[] = [];
      if (Math.random() < this.diagonalPreference) {
        order.push(preferLeft ? 1 : 2);
        order.push(preferLeft ? 2 : 1);
        order.push(0);
      } else {
        order.push(0, preferLeft ? 1 : 2, preferLeft ? 2 : 1);
      }
      let moved = false;
      for (const choice of order) {
        if (moves[choice] === 1) {
          if (choice === 0) {
            grid.swap(y * grid.col + x, ny * grid.col + nx);
          } else if (choice === 1) {
            grid.swap(y * grid.col + x, ny * grid.col + nx - 1);
          } else if (choice === 2) {
            grid.swap(y * grid.col + x, ny * grid.col + nx + 1);
          }
          moved = true;
          // leave smoke trail occasionally
          if (Math.random() < 0.3) {
            const trailIndex = y * grid.col + x;
            const tx = trailIndex % grid.row;
            const ty = Math.floor(trailIndex / grid.col);
            grid.setElement(tx, ty, new Smoke(trailIndex));
          }
          break;
        }
      }
      if (moved) return;
      ny--;
    }
    // If we couldn't move, count stuck and explode
    if (this.previousPosition === element.index) this.stuckFrames++;
    else this.stuckFrames = 0;
    if (this.stuckFrames >= 2) this.explode(grid, element);
  }
}

export default MeteorMove;
