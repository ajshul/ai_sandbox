### TIL: Tileo Interaction Language (subset)

This project implements a strict subset of the TIL v1 grammar focused on prefabs and footprint stencils. The goal is safe, predictable object creation using only grid cell stencils.

#### Grammar subset (EBNF excerpt)

See `src/dsl/til.grammar.ebnf`. Supported constructs:

- Prefab
  - `prefab NAME { P_BODY } ;`
  - Body may include:
    - `prop` entries (number/string/string-list)
    - `tags: ["..."]`
    - a single `footprint { ... }` block
    - `verb name { setRect(x,y,w,h,MAT,#RRGGBB?); ... }` (simple action demo)
- Stencils inside `footprint {}`
  - `rect(x,y,w,h,MAT, #RRGGBB?)`
  - `circle(x,y,r,MAT, #RRGGBB?)`
  - `line(x1,y1,x2,y2,MAT, #RRGGBB?)`

Unknown tokens or unsupported constructs cause validation errors.

#### Materials

Materials must be known in `src/engine/materials.ts`. Currently: AIR, WOOD, WATER, STEEL, SAND, STONE, SMOKE, FIRE, ACID, OIL, FOAM, ICE, BOMB, METEOR (plus mapped RUBBER/BRICK/RUBBLE).

#### Validation

`validateTIL()` enforces:

- All materials exist
- Footprint area approximations within budget (`footprintArea`)

#### Example

```
prefab TestBlock {
  prop width: 6
  footprint {
    rect(10,10,6,3, STEEL, #C9C940)
    rect(10,13,6,1, WATER)
    line(10,14,15,14, WOOD)
  }
};
```

#### Material examples

```
prefab Reactions {
  footprint {
    rect(2,2,4,2, OIL)
    rect(2,5,4,2, ACID)
    rect(2,8,4,2, FOAM)
  }
};
```

Use Compile → Confirm to place; Fire near OIL will ignite it (and it will burn down), ACID will corrode solids, FOAM will extinguish nearby fire.

Compile in the UI, preview the ghost overlay, then Confirm to place onto the grid.
