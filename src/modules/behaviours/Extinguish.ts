import Behaviour from "./Behaviour.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";
import Fire from "../elements/misc/fire.js";
import Empty from "../elements/misc/empty.js";

// Extinguish — suppresses nearby fire and clears onFire flags
class Extinguish extends Behaviour {
  radius: number;
  constructor(radius = 1) {
    super();
    this.radius = radius;
  }
  update(grid: Grid, element: Element) {
    const x = element.index % grid.row;
    const y = Math.floor(element.index / grid.col);
    for (let dx = -this.radius; dx <= this.radius; dx++) {
      for (let dy = -this.radius; dy <= this.radius; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (!grid.isValidIndex(nx, ny)) continue;
        const ni = ny * grid.col + nx;
        const n = grid.get(ni);
        // If it's a Fire element, remove it
        if (n instanceof Fire) {
          grid.setElement(nx, ny, new Empty(ni));
          continue;
        }
        // Otherwise, clear burning flag if set
        if (n.onFire) {
          n.onFire = false;
        }
      }
    }
  }
}

export default Extinguish;
