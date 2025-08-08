import Behaviour from "./Behaviour.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";
import Water from "../elements/liquids/water.js";

// Melt — transforms this element into Water when adjacent to fire/ignition
class Melt extends Behaviour {
  update(grid: Grid, element: Element) {
    const x = element.index % grid.row;
    const y = Math.floor(element.index / grid.col);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx,
          ny = y + dy;
        if (!grid.isValidIndex(nx, ny)) continue;
        const ni = ny * grid.col + nx;
        const n = grid.get(ni);
        if (n.onFire || n.constructor.name === "Fire") {
          const idx = element.index;
          const ex = idx % grid.row;
          const ey = Math.floor(idx / grid.col);
          grid.setElement(ex, ey, new Water(idx));
          return;
        }
      }
    }
  }
}

export default Melt;
