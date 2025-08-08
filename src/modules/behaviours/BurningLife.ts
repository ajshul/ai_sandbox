import Behaviour from "./Behaviour.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";

// BurningLife — reduces life only while element.onFire is true (no color fade)
class BurningLife extends Behaviour {
  life: number;
  reduction: number;
  constructor({ life = 100, reduction = 1 } = {}) {
    super();
    this.life = life;
    this.reduction = reduction;
  }
  onDeath(element: Element, grid: Grid) {
    grid.removeIndex(element.index);
    grid.highlightIndex.add(element.index);
  }
  update(grid: Grid, element: Element) {
    if (!element.onFire) return;
    if (this.life <= 0) {
      this.onDeath(element, grid);
      return;
    }
    this.life -= this.reduction;
  }
}

export default BurningLife;
