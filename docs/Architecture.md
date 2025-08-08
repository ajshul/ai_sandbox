### Architecture overview

This project extends the original Tileo sandbox (grid-based falling sand) with a grid-first creation pipeline inspired by Scribblenauts. Users paste or generate TIL (Tileo Interaction Language) that declares prefab footprints made of cells, preview them as a ghost overlay, and place them onto the existing Tileo grid.

#### Layers and responsibilities

- Engine (grid bridge + materials)

  - `src/engine/tileoBridge.ts`: Safe read/write helpers that adapt batch patch writes to Tileo's `Grid` API. Provides `getCell`, `applyPatches`, `raycastGrid`, `queryAABB`.
  - `src/engine/materials.ts`: Material registry (AIR, WOOD, WATER, STEEL, SAND, STONE, SMOKE, FIRE, ACID, OIL, FOAM), rich tags (e.g., corrosive, extinguishing, viscous, brittle, metallic, organic…), and mapping to Tileo element classes.
  - `src/engine/footprintToPatches.ts`: Converts TIL footprint stencils (rect/circle/line) into concrete cell patches.

- DSL (compile + validate)

  - `src/dsl/tilParser.ts`: Tiny, hand-rolled parser for a strict subset of TIL v1 focused on footprints and props (no verbs/rules yet).
  - `src/dsl/tilValidator.ts`: Static validation and budgets (e.g., maximum footprint area, known materials).
  - `src/dsl/til.grammar.ebnf`: Human-readable EBNF reference for the footprint subset.

- Client UI (no React)

  - `src/client/ui/PromptBar.ts`: DOM prompt bar mounted into the page (fallback fixed footer). Lets you paste TIL, compile, preview, and confirm/cancel placement.
  - `src/client/ui/PreviewState.ts`: Central store for the current preview.
  - `src/client/ui/PreviewOverlay.ts`: Ghost-draws the stencil preview on the canvas each frame.

- Server (stubs for GPT-5 integration)

  - `src/server/tools/compileTil.ts`: Placeholder that currently calls the local validator; later replaced with a GPT-5 tool call to produce CFG-constrained TIL.
  - `src/server/openaiClient.ts`: Placeholder export to align with guide examples.
  - `src/server/routes/content.ts`: Minimal shape-compatible helpers for compile/register endpoints.

- Tileo core (existing)
  - `src/modules/renderer.ts`: Frame loop, metrics, overlay hooks.
  - `src/modules/grid.ts`: Source of truth for the world’s cells; draw/update mechanics; brush placement for interactive drawing.
  - `src/modules/controls.ts`, `src/modules/editor.ts`: Input and element parameter editing.

#### Data flow

1. Paste TIL → PromptBar calls `compileFromText()` (local validator for now).
2. On success, PreviewState holds the first prefab; PreviewOverlay ghost-draws its footprint.
3. Confirm → `footprintToPatches()` → `applyPatches()` writes cells via `Grid.setElement` in batches.

#### Why this design

- Keeps Tileo as the authoritative grid simulator and renderer.
- Constrains creation to cell stencils with budget checks before any writes.
- Clean surface to replace the local validator with GPT-5 custom tool calling when desired.

#### Current limitations

- Only footprint stencils (rect, circle, line) are supported in the parser.
- Verbs, rules, ECS systems are stubbed/not operational yet.
- Materials currently include core set plus ACID, OIL, FOAM; more can be added via `materials.ts`.

#### New materials and behaviours

- Materials: ACID (corrosive), OIL (flammable, viscous), FOAM (extinguishing, viscous). Tags enable behaviour targeting.
- Behaviours:
  - `Ignition`: sets `onFire` when near fire/burning elements (used by OIL).
  - `Extinguish`: clears fire cells and resets `onFire` in a small radius (used by FOAM).
  - `Corrode`: removes/marks adjacent brittle solids (used by ACID) without uncontrolled multiplication.

#### Extending

- Add more materials in `materials.ts` and map to Tileo element classes.
- Add new stencils (e.g., poly, pattern) to the parser and validator, then overlay and patch conversion.
- Integrate GPT-5 per `docs/AI_Integration.md` to compile natural language into TIL.
