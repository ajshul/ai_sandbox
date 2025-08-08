import Life from "./Life.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";

// Fuse — simple countdown that triggers element-specific onFuseComplete(grid)
class Fuse extends Life {
  constructor({ life = 60, reduction = 1 } = {}) {
    super({ life, reduction });
  }

  // Override to avoid color fading of bombs visually
  update(grid: Grid, element: Element) {
    if (this.life <= 0) {
      this.onDeath(element, grid);
      return;
    }
    this.life = this.life - this.reduction;
  }

  onDeath(element: Element, grid: Grid) {
    if (typeof (element as any).onFuseComplete === "function") {
      (element as any).onFuseComplete(grid);
    } else if (typeof (element as any).explode === "function") {
      (element as any).explode(grid);
    } else {
      grid.removeIndex(element.index);
    }
  }
}

export default Fuse;
