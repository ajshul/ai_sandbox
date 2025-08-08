// engine/materials.ts
// Minimal material registry mapping to existing Tileo elements
//
// This registry enumerates materials exposed to TIL and maps them to
// existing Tileo element constructors so footprints can be placed.

import {
  Sand,
  Water,
  Wood,
  Stone,
  Smoke,
  Fire,
  Empty,
  Acid,
  Foam,
  Oil,
} from "../modules/elements/ElementIndex.js";

export type MaterialId =
  | "AIR"
  | "WOOD"
  | "WATER"
  | "STEEL"
  | "SAND"
  | "STONE"
  | "SMOKE"
  | "FIRE"
  | "ACID"
  | "FOAM"
  | "OIL";

export interface Material {
  id: MaterialId;
  color?: `#${string}`;
  tags: (
    | "solid"
    | "liquid"
    | "gas"
    | "flammable"
    | "brittle"
    | "metallic"
    | "conductive"
    | "organic"
    | "granular"
    | "corrosive"
    | "extinguishing"
    | "viscous"
    | "inert"
    | "fire"
    | "ductile"
  )[];
}

export const MATERIALS: Record<MaterialId, Material> = {
  AIR: { id: "AIR", tags: [] },
  WOOD: { id: "WOOD", tags: ["solid", "flammable", "organic", "brittle"] },
  WATER: { id: "WATER", tags: ["liquid", "extinguishing"] },
  STEEL: { id: "STEEL", tags: ["solid", "metallic", "conductive", "ductile"] },
  SAND: { id: "SAND", tags: ["solid", "granular", "brittle"] },
  STONE: { id: "STONE", tags: ["solid", "brittle"] },
  SMOKE: { id: "SMOKE", tags: ["gas", "inert"] },
  FIRE: { id: "FIRE", tags: ["gas", "fire"] },
  ACID: { id: "ACID", tags: ["liquid", "corrosive"] },
  FOAM: { id: "FOAM", tags: ["liquid", "extinguishing", "viscous"] },
  OIL: { id: "OIL", tags: ["liquid", "flammable", "viscous"] },
};

export type ElementCtor = new (index: number) => any;

export function materialToElementCtor(material: MaterialId): ElementCtor {
  switch (material) {
    case "AIR":
      return Empty as unknown as ElementCtor;
    case "WOOD":
      return Wood as unknown as ElementCtor;
    case "WATER":
      return Water as unknown as ElementCtor;
    case "STEEL":
      return Stone as unknown as ElementCtor; // map STEEL to Stone visual
    case "SAND":
      return Sand as unknown as ElementCtor;
    case "STONE":
      return Stone as unknown as ElementCtor;
    case "SMOKE":
      return Smoke as unknown as ElementCtor;
    case "FIRE":
      return Fire as unknown as ElementCtor;
    case "ACID":
      return Acid as unknown as ElementCtor;
    case "FOAM":
      return Foam as unknown as ElementCtor;
    case "OIL":
      return Oil as unknown as ElementCtor;
    default:
      return Empty as unknown as ElementCtor;
  }
}
