import { CellPatch } from "../../engine/tileoBridge.js";

export type VerbResult = { patches: CellPatch[]; entityUpdates?: any[] };
export type VerbFn = (eid: number, args: any, ctx: any) => VerbResult;

export const verbRegistry: Record<string, VerbFn> = {
  dig: (eid, args, ctx) => ({ patches: [] }),
  spray: (eid, args, ctx) => ({ patches: [] }),
  shoot: (eid, args, ctx) => ({ patches: [] }),
  grapple: (eid, args, ctx) => ({ patches: [] }),
  construct: (eid, args, ctx) => ({ patches: [] }),
};
