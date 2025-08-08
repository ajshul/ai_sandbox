import Element from "../element.js";
import WaterMove from "../../behaviours/WaterMove.js";
import Extinguish from "../../behaviours/Extinguish.js";

// Foam — slow-moving, extinguishes fire via Burning with low reduction and no ignition
class Foam extends Element {
  static defaultColor = [220, 230, 245];
  static defaultProbability = 0.6;
  static defaultMaxSpeed = 1;
  static defaultAcceleration = 0.05;
  static defaultDispersion = 3;

  static currentColor = Foam.defaultColor;
  static currentProbability = Foam.defaultProbability;
  static currentMaxSpeed = Foam.defaultMaxSpeed;
  static currentAcceleration = Foam.defaultAcceleration;
  static currentDispersion = Foam.defaultDispersion;

  constructor(index: number) {
    super(index, {
      behaviours: [
        new WaterMove({
          maxSpeed: Foam.currentMaxSpeed,
          acceleration: Foam.currentAcceleration,
          dispersion: Foam.currentDispersion,
        }),
        // Actively clear nearby fire cells and burning flags
        new Extinguish(1),
      ],
    });
    this.liquid = true;
    this.probability = Foam.currentProbability;
    this.color = Foam.currentColor;
  }

  toString() {
    return "f";
  }
}

export default Foam;
