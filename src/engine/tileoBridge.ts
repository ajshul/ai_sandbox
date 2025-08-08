// engine/tileoBridge.ts — bridge to existing Tileo grid/renderer
//
// Responsibilities:
// - Translate high-level patches {x,y,mat} into Tileo element instances
// - Provide simple grid queries (raycast, AABB) against Tileo’s Grid
// - Avoid hot-loop per-cell rendering by leveraging Grid’s batching

import Grid from "../modules/grid.js";
import { grid } from "../modules/renderer.js";
import { MATERIALS, MaterialId, materialToElementCtor } from "./materials.js";
import Empty from "../modules/elements/misc/empty.js";

export type CellPatch = {
  x: number;
  y: number;
  mat: MaterialId;
  color?: string; // hex
  flags?: number;
};

export function getCell(x: number, y: number) {
  if (!grid.isValidIndex(x, y))
    return { mat: "AIR" as MaterialId, color: undefined, tags: [] as string[] };
  const idx = y * (grid.col as number) + x;
  const el = grid.get(idx);
  if (el instanceof Empty)
    return { mat: "AIR" as MaterialId, color: undefined, tags: [] as string[] };
  // naive mapping based on class name
  const name = el.constructor.name.toUpperCase();
  const mat: MaterialId =
    name === "SAND"
      ? "SAND"
      : name === "WATER"
      ? "WATER"
      : name === "WOOD"
      ? "WOOD"
      : name === "STONE"
      ? "STONE"
      : name === "SMOKE"
      ? "SMOKE"
      : name === "FIRE"
      ? "FIRE"
      : "AIR";
  return { mat, color: undefined, tags: MATERIALS[mat]?.tags ?? [] };
}

export function applyPatches(patches: CellPatch[]) {
  // coalesce by (x,y) uniqueness and just apply via Grid.setElement
  const seen = new Map<string, CellPatch>();
  for (const p of patches) {
    seen.set(`${p.x},${p.y}`, p);
  }
  for (const p of seen.values()) {
    const ctor = materialToElementCtor(p.mat);
    const idx = p.y * (grid.col as number) + p.x;
    const el = new ctor(idx);
    grid.setIndex(idx, el);
    grid.setElement(p.x, p.y, el);
  }
}

export function raycastGrid(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  tagFilter: string[]
) {
  // simple DDA
  let x = ax;
  let y = ay;
  const dx = Math.sign(bx - ax);
  const dy = Math.sign(by - ay);
  while (x !== bx || y !== by) {
    const c = getCell(x, y);
    if (c.tags.some((t) => tagFilter.includes(t))) {
      return { hit: true, x, y, mat: c.mat };
    }
    if (x !== bx) x += dx;
    if (y !== by) y += dy;
  }
  return { hit: false, x: bx, y: by, mat: "AIR" as MaterialId };
}

export function queryAABB(
  ax: number,
  ay: number,
  w: number,
  h: number,
  tags?: string[]
) {
  const out: { x: number; y: number; mat: MaterialId }[] = [];
  for (let y = ay; y < ay + h; y++) {
    for (let x = ax; x < ax + w; x++) {
      if (!grid.isValidIndex(x, y)) continue;
      const cell = getCell(x, y);
      if (!tags || cell.tags.some((t) => tags.includes(t))) {
        out.push({ x, y, mat: cell.mat as MaterialId });
      }
    }
  }
  return out;
}
