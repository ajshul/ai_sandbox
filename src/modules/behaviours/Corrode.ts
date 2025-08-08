import Behaviour from "./Behaviour.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";
import Empty from "../elements/misc/empty.js";
import Fire from "../elements/misc/fire.js";

// Corrode — randomly removes adjacent brittle/wood cells simulating acid corrosion
class Corrode extends Behaviour {
  strength: number;
  constructor(strength = 0.05) {
    super();
    this.strength = strength;
  }
  update(grid: Grid, element: Element) {
    const x = element.index % grid.row;
    const y = Math.floor(element.index / grid.col);
    if (Math.random() > this.strength) return;
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
    const nx = x + dx;
    const ny = y + dy;
    if (!grid.isValidIndex(nx, ny)) return;
    const ni = ny * grid.col + nx;
    const n = grid.get(ni);
    if (
      n.solid &&
      (n.constructor.name === "Wood" ||
        n.constructor.name === "Sand" ||
        n.constructor.name === "Stone")
    ) {
      if (Math.random() < 0.7) {
        grid.setElement(nx, ny, new Empty(ni));
      } else {
        grid.setElement(nx, ny, new Fire(ni));
      }
    }
  }
}

export default Corrode;
