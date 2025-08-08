import Element from "../element.js";
import Fuse from "../../behaviours/Fuse.js";
import GravityFall from "../../behaviours/GravityFall.js";
import { randomColor } from "../../utils.js";
import Fire from "./fire.js";
import Grid from "../../grid.js";

class Bomb extends Element {
  static defaultColor = [60, 60, 60];
  static defaultProbability = 0.05;

  static currentColor = Bomb.defaultColor;
  static currentProbability = Bomb.defaultProbability;

  // Falls straight down and explodes when fuse completes
  constructor(index: number) {
    super(index, {
      behaviours: [
        new GravityFall({ maxSpeed: 3, acceleration: 0.2 }),
        new Fuse({ life: 50, reduction: 1 }),
      ],
    });
    this.solid = true;
    this.color = Bomb.currentColor;
    this.probability = Bomb.currentProbability;
  }

  explode(grid: Grid) {
    const x = this.index % grid.row;
    const y = Math.floor(this.index / grid.col);
    const r = 3;
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
  }

  onFuseComplete(grid: Grid) {
    this.explode(grid);
  }
}

export default Bomb;
