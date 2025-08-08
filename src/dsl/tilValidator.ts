// dsl/tilValidator.ts — simple static validator for footprints
// Ensures materials exist and footprint size budgets are respected

import { parseProgram, TilProgram } from "./tilParser.js";
import { MATERIALS } from "../engine/materials.js";

export const LIMITS = {
  footprintArea: 128,
  maxRayLen: 64,
  maxPatchesPerTick: 256,
  maxPlaceArea: 256,
  maxFloodFill: 512,
};

export type ValidationResult = {
  ok: boolean;
  errors?: string[];
  program?: TilProgram;
};

export function validateTIL(til: string): ValidationResult {
  try {
    const program = parseProgram(til);
    const errors: string[] = [];
    for (const pf of program.prefabs) {
      if (pf.tags) {
        // Basic tag sanity: ensure tags are strings and length is reasonable
        if (
          !Array.isArray(pf.tags) ||
          pf.tags.some((t) => typeof t !== "string")
        ) {
          errors.push("Invalid tags list");
        }
        if ((pf.tags || []).length > 16) {
          errors.push("Too many tags on prefab (max 16)");
        }
      }
      let area = 0;
      for (const s of pf.footprint) {
        if (s.type === "rect") {
          area += Math.max(0, s.w) * Math.max(0, s.h);
          if (!MATERIALS[s.mat as keyof typeof MATERIALS])
            errors.push(`Unknown material ${s.mat}`);
        } else if (s.type === "circle") {
          area += Math.PI * s.r * s.r * 0.785; // coarse estimate
          if (!MATERIALS[s.mat as keyof typeof MATERIALS])
            errors.push(`Unknown material ${s.mat}`);
        } else if (s.type === "line") {
          // treat as 1xN
          area += Math.max(Math.abs(s.x2 - s.x1), Math.abs(s.y2 - s.y1));
          if (!MATERIALS[s.mat as keyof typeof MATERIALS])
            errors.push(`Unknown material ${s.mat}`);
        }
      }
      // verbs budget: only count setRect for now
      const verbs = (pf as any).verbs as any[] | undefined;
      if (verbs) {
        let actions = 0;
        for (const v of verbs) {
          actions += (v.actions || []).length;
        }
        if (actions > 32) errors.push("Too many verb actions (max 32)");
      }
      if (area > LIMITS.footprintArea)
        errors.push(
          `Footprint too large: ~${Math.floor(area)} > ${LIMITS.footprintArea}`
        );
    }
    return {
      ok: errors.length === 0,
      errors: errors.length ? errors : undefined,
      program,
    };
  } catch (e: any) {
    return { ok: false, errors: [e.message ?? String(e)] };
  }
}
