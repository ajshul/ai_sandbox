import Behaviour from "./Behaviour.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";
import Fire from "../elements/misc/fire.js";
import { randomColor } from "../utils.js";

// Ignition — sets element.onFire=true if adjacent to fire or burning element
class Ignition extends Behaviour {
  update(grid: Grid, element: Element) {
    if (element.onFire) return;
    const x = element.index % grid.row;
    const y = Math.floor(element.index / grid.col);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (!grid.isValidIndex(nx, ny)) continue;
        const ni = ny * grid.col + nx;
        const n = grid.get(ni);
        if (n.constructor.name === "Fire" || n.onFire) {
          element.onFire = true;
          element.color = randomColor(Fire.currentColor);
          return;
        }
      }
    }
  }
}

export default Ignition;
