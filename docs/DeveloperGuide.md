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

#### Create a new behaviour

1. Add a file under `src/modules/behaviours/`, export a class extending `Behaviour` or an existing subclass (e.g., `Movement`, `Life`).

```ts
// src/modules/behaviours/Repel.ts
import Behaviour from "./Behaviour.js";
import Grid from "../grid.js";
import Element from "../elements/element.js";

class Repel extends Behaviour {
  radius: number;
  constructor(radius = 1) {
    super();
    this.radius = radius;
  }
  update(grid: Grid, element: Element) {
    const x = element.index % grid.row;
    const y = Math.floor(element.index / grid.col);
    for (let dx = -this.radius; dx <= this.radius; dx++)
      for (let dy = -this.radius; dy <= this.radius; dy++) {
        const nx = x + dx,
          ny = y + dy;
        if (!grid.isValidIndex(nx, ny)) continue;
        // Custom logic here (e.g., push liquids away)
      }
  }
}
export default Repel;
```

2. Attach the behaviour to an element (see below) via its constructor.

#### Create a new material/element

1. Create a class under `src/modules/elements/` (choose `solids/`, `liquids/`, or `misc/`) that extends `Solid`, `Liquid`, `Gas`, or `Element`.

```ts
// src/modules/elements/solids/rubber.ts
import Solid from "./solid.js";
import { randomColor } from "../../utils.js";
import Repel from "../../behaviours/Repel.js";

class Rubber extends Solid {
  static defaultColor = [20, 20, 20];
  static defaultProbability = 1;
  static currentColor = Rubber.defaultColor;
  static currentProbability = Rubber.defaultProbability;

  constructor(index: number) {
    super(index, { behaviours: [new Repel(1)] });
    this.color = randomColor(Rubber.currentColor);
    this.probability = Rubber.currentProbability;
  }
}
export default Rubber;
```

2. Export it from `src/modules/elements/ElementIndex.ts`.

```ts
export { default as Rubber } from "./solids/rubber.js";
```

3. Register the material in `src/engine/materials.ts`:

- Add to `MaterialId` union
- Add entry to `MATERIALS` with tags
- Map the material id to the element class in `materialToElementCtor`

4. Add a button in `src/index.html` and wire it in `src/modules/controls.ts`:

```html
<button id="rubber">Rubber</button>
```

```ts
import { Rubber } from "./elements/ElementIndex.js";
const controls = { /* ... */ rubber: () => new Rubber(0) };
```

5. Ensure `Grid.setElement(...)` has a case for your class (like the others) to create a new instance when painting.

6. (Optional) Allow in TIL by ensuring the material id exists in `MATERIALS` so `validateTIL` accepts it.

#### GPT-5 compile server

- Server entry: `src/server/index.ts` exposes `POST /compile` and calls `compileFromText()`.
- OpenAI client reads `OPENAI_API_KEY` from the environment (`.env` in your server shell).
- The PromptBar calls this endpoint to compile NL → TIL using a CFG-constrained custom tool (`compile_til`).

Run server:

```
npx tsc -p .
node dist/server/index.js
```

#### Debugging tips

- Use the Behaviour debug view in the UI to inspect movement/life visuals.
- If a new element doesn’t draw, confirm it’s added to `ElementIndex.ts`, `Grid.setElement(...)`, and `controls.ts`.
- For TIL errors, check `validateTIL()` messages; ensure materials are declared in `MATERIALS` and footprint area is within limits.

#### Common pitfalls

- ES6 classes must be constructed with `new`. Avoid calling element classes like functions (`ClassName()`); use `new ClassName(index)`.
- If the prompt bar mount isn’t in the DOM, a fixed footer fallback is added automatically.

#### Extending

- Add materials: update `materials.ts` (tags + mapping) and create an element class with behaviours.
- Add stencils: parser + validator + overlay + footprint conversion.
- Hook GPT-5: see `docs/AI_Integration.md`.
