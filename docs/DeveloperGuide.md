### Developer Guide

#### Setup

- Node.js and TypeScript installed. Python (for a quick static server) helpful.
- Build: `npx tsc -p .` to generate `dist/`.

#### Run

- Serve from project root via any static server:
  - `python3 -m http.server 5173`
  - Open `http://127.0.0.1:5173/src/index.html`

#### Using the app

- Left panel: canvas. Right panel: element buttons and settings.
- Drawing: select Sand/Water/etc./Acid/Oil/Foam, click-drag to paint.
- Prompt bar: paste TIL, click Compile to preview, Confirm to place.

#### Code tour (key files)

- `src/modules/renderer.ts`: render loop, overlay registration, metrics.
- `src/modules/grid.ts`: grid state, draw/update passes, brush painting.
- `src/client/ui/PromptBar.ts`: compile/preview/confirm controls (DOM-based).
- `src/client/ui/PreviewOverlay.ts`: per-frame overlay drawing of ghost footprints.
- `src/dsl/tilParser.ts`: TIL subset parser (rect/circle/line + props).
- `src/dsl/tilValidator.ts`: validation and budgets.
- `src/engine/materials.ts`: materials registry and element mapping.
- `src/engine/tileoBridge.ts`: `getCell`, `applyPatches`, `raycastGrid`, `queryAABB` against Tileo grid.
- `src/engine/footprintToPatches.ts`: convert footprint to cell patches.
- `src/server/tools/compileTil.ts`: local compile stub (replace with GPT-5 tool call).

#### Common pitfalls

- ES6 classes must be constructed with `new`. Avoid calling element classes like functions (`ClassName()`); use `new ClassName(index)`.
- If the prompt bar mount isn’t in the DOM, a fixed footer fallback is added automatically.

#### Extending

- Add materials: update `materials.ts` (tags + mapping) and create an element class with behaviours.
- Add stencils: parser + validator + overlay + footprint conversion.
- Hook GPT-5: see `docs/AI_Integration.md`.
