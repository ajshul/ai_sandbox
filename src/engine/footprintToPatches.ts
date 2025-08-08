import { TilPrefab } from "../dsl/tilParser.js";
import { CellPatch } from "./tileoBridge.js";
import { MaterialId } from "./materials.js";

// Converts each stencil in a prefab footprint into concrete {x,y,mat} cell patches
// The overlay will preview these; Confirm applies them to the grid via tileoBridge
export function footprintToPatches(prefab: TilPrefab): CellPatch[] {
  const patches: CellPatch[] = [];
  for (const s of prefab.footprint) {
    const mat = s.mat as string as MaterialId;
    if (s.type === "rect") {
      for (let y = s.y; y < s.y + s.h; y++) {
        for (let x = s.x; x < s.x + s.w; x++) {
          patches.push({ x, y, mat });
        }
      }
    } else if (s.type === "line") {
      const dx = Math.sign(s.x2 - s.x1);
      const dy = Math.sign(s.y2 - s.y1);
      let x = s.x1,
        y = s.y1;
      while (x !== s.x2 || y !== s.y2) {
        patches.push({ x, y, mat });
        if (x !== s.x2) x += dx;
        if (y !== s.y2) y += dy;
      }
      patches.push({ x: s.x2, y: s.y2, mat });
    } else if (s.type === "circle") {
      const r = s.r;
      for (let yy = -r; yy <= r; yy++) {
        for (let xx = -r; xx <= r; xx++) {
          if (xx * xx + yy * yy <= r * r)
            patches.push({ x: s.x + xx, y: s.y + yy, mat });
        }
      }
    }
  }
  return patches;
}
