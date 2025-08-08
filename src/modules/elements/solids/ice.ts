import Solid from "./solid.js";
import { randomColor } from "../../utils.js";
import Melt from "../../behaviours/Melt.js";
import Grid from "../../grid.js";
import Water from "../liquids/water.js";

class Ice extends Solid {
  static defaultColor = [180, 210, 255];
  static defaultProbability = 1;

  static currentColor = Ice.defaultColor;
  static currentProbability = Ice.defaultProbability;

  constructor(index: number) {
    super(index, {
      behaviours: [new Melt()],
    });
    this.probability = Ice.currentProbability;
    this.color = randomColor(Ice.currentColor);
  }

  setColor(newColor: number[]) {
    this.color = newColor;
    Ice.currentColor = newColor;
  }
  setProbability(newProbability: number) {
    this.probability = newProbability;
    Ice.currentProbability = newProbability;
  }

  toString() {
    return "I";
  }

  // Freeze logic: when adjacent to water for a while, convert that water to ice
  update(grid: Grid) {
    super.update(grid);
    const x = this.index % grid.row;
    const y = Math.floor(this.index / grid.col);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx,
          ny = y + dy;
        if (!grid.isValidIndex(nx, ny)) continue;
        const ni = ny * grid.col + nx;
        const n = grid.get(ni);
        if (n instanceof Water && Math.random() < 0.02) {
          grid.setElement(nx, ny, new Ice(ni));
          const replaced = grid.get(ni) as Ice;
          // set per-instance color and force redraw this frame
          replaced.color = randomColor(Ice.currentColor);
          grid.highlightIndex.add(ni);
        }
      }
    }
  }
}

export default Ice;
