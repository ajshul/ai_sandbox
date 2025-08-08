import Element from "../element.js";
import MeteorMove from "../../behaviours/MeteorMove.js";
import Burning from "../../behaviours/Burning.js";
import { randomColor } from "../../utils.js";
import Grid from "../../grid.js";
import Fire from "./fire.js";

class Meteor extends Element {
  static defaultColor = [200, 100, 50];
  static defaultProbability = 0.02;
  static defaultMaxSpeed = 5;
  static defaultAcceleration = 0.3;

  static currentColor = Meteor.defaultColor;
  static currentProbability = Meteor.defaultProbability;
  static currentMaxSpeed = Meteor.defaultMaxSpeed;
  static currentAcceleration = Meteor.defaultAcceleration;

  constructor(index: number) {
    super(index, {
      behaviours: [
        new MeteorMove({
          maxSpeed: Meteor.currentMaxSpeed,
          acceleration: Meteor.currentAcceleration,
          bias: Math.random() < 0.5 ? -1 : 1,
          diagonalPreference: 0.7,
        }),
        new Burning({ life: 80, reduction: 1, chanceToSpread: 0.2 }),
      ],
    });
    this.solid = true;
    this.onFire = true;
    this.color = Meteor.currentColor;
    this.probability = Meteor.currentProbability;
  }

  onImpact(grid: Grid) {
    const x = this.index % grid.row;
    const y = Math.floor(this.index / grid.col);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx,
          ny = y + dy;
        if (!grid.isValidIndex(nx, ny)) continue;
        const ni = ny * grid.col + nx;
        grid.setElement(nx, ny, new Fire(ni));
      }
    }
  }
}

export default Meteor;
