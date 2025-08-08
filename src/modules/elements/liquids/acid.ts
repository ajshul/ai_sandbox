import Liquid from "./liquid.js";
import WaterMove from "../../behaviours/WaterMove.js";
import Corrode from "../../behaviours/Corrode.js";

class Acid extends Liquid {
  static defaultColor = [60, 200, 60];
  static defaultProbability = 0.5;
  static defaultMaxSpeed = 3;
  static defaultAcceleration = 0.12;
  static defaultDispersion = 6;

  static currentColor = Acid.defaultColor;
  static currentProbability = Acid.defaultProbability;
  static currentMaxSpeed = Acid.defaultMaxSpeed;
  static currentAcceleration = Acid.defaultAcceleration;
  static currentDispersion = Acid.defaultDispersion;

  constructor(index: number) {
    super(index, {
      behaviours: [
        new WaterMove({
          maxSpeed: Acid.currentMaxSpeed,
          acceleration: Acid.currentAcceleration,
          dispersion: Acid.currentDispersion,
        }),
        new Corrode(0.15),
      ],
    });
    this.probability = Acid.currentProbability;
    this.color = Acid.currentColor;
  }

  setColor(newColor: number[]) {
    this.color = newColor;
    Acid.currentColor = newColor;
  }

  setProbability(newProbability: number): void {
    this.probability = newProbability;
    Acid.currentProbability = newProbability;
  }

  setMaxSpeed(newMaxSpeed: number) {
    const mv: WaterMove = this.behavioursLookup["WaterMove"] as WaterMove;
    mv.maxSpeed = newMaxSpeed;
    Acid.currentMaxSpeed = newMaxSpeed;
  }

  setAcceleration(newAcceleration: number) {
    const mv: WaterMove = this.behavioursLookup["WaterMove"] as WaterMove;
    mv.acceleration = newAcceleration;
    Acid.currentAcceleration = newAcceleration;
  }

  setDispersion(newDispersion: number) {
    const mv: WaterMove = this.behavioursLookup["WaterMove"] as WaterMove;
    mv.dispersion = newDispersion;
    Acid.currentDispersion = newDispersion;
  }

  resetDefaults() {
    super.resetDefaults();
    this.setMaxSpeed(Acid.defaultMaxSpeed);
    this.setAcceleration(Acid.defaultAcceleration);
    this.setDispersion(Acid.defaultDispersion);
  }

  toString() {
    return "A";
  }
}

export default Acid;
