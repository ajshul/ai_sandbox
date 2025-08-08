import Liquid from "../liquids/liquid.js";
import WaterMove from "../../behaviours/WaterMove.js";
import Ignition from "../../behaviours/Ignition.js";
import Life from "../../behaviours/Life.js";

class Oil extends Liquid {
  static defaultColor = [59, 47, 47];
  static defaultProbability = 0.5;
  static defaultMaxSpeed = 2;
  static defaultAcceleration = 0.08;
  static defaultDispersion = 5;

  static currentColor = Oil.defaultColor;
  static currentProbability = Oil.defaultProbability;
  static currentMaxSpeed = Oil.defaultMaxSpeed;
  static currentAcceleration = Oil.defaultAcceleration;
  static currentDispersion = Oil.defaultDispersion;

  constructor(index: number) {
    super(index, {
      behaviours: [
        new WaterMove({
          maxSpeed: Oil.currentMaxSpeed,
          acceleration: Oil.currentAcceleration,
          dispersion: Oil.currentDispersion,
        }),
        new Ignition(),
        // Oil burns away when ignited
        new Life({ life: 120, reduction: 2 }),
      ],
    });
    this.probability = Oil.currentProbability;
    this.color = Oil.currentColor;
  }

  toString() {
    return "o";
  }
}

export default Oil;
