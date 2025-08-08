// dsl/tilParser.ts — very small hand parser for a subset of TIL v1
// Recognizes a narrow subset sufficient to preview and place footprint stencils

export type TilColor = string;
export type TilMaterial = string;

export type TilRect = {
  type: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
  mat: TilMaterial;
  color?: TilColor;
};
export type TilCircle = {
  type: "circle";
  x: number;
  y: number;
  r: number;
  mat: TilMaterial;
  color?: TilColor;
};
export type TilLine = {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mat: TilMaterial;
  color?: TilColor;
};

export type TilPrefab = {
  name: string;
  props: Record<string, number | string | string[]>;
  footprint: Array<TilRect | TilCircle | TilLine>;
};

export type TilProgram = { prefabs: TilPrefab[] };

const WS = /\s+/y;

function eatWS(input: string, i: number) {
  WS.lastIndex = i;
  const m = WS.exec(input);
  return m ? m.index + m[0].length : i;
}

function match(re: RegExp, input: string, i: number): [string, number] | null {
  re.lastIndex = i;
  const m = re.exec(input);
  if (!m || m.index !== i) return null;
  return [m[0], i + m[0].length];
}

function expect(tok: string, input: string, i: number): number {
  if (input.slice(i, i + tok.length) !== tok)
    throw new Error(`Expected '${tok}' at ${i}`);
  return i + tok.length;
}

const ID = /[A-Za-z_][A-Za-z0-9_]*/y;
const NUM = /-?[0-9]+/y;
const COLOR = /#[0-9A-Fa-f]{6}/y;
const STRING = /"[^"\\]*"/y;

function parseId(input: string, i: number) {
  const m = match(ID, input, i);
  if (!m) throw new Error(`Expected identifier at ${i}`);
  return m;
}

function parseNumber(input: string, i: number) {
  const m = match(NUM, input, i);
  if (!m) throw new Error(`Expected number at ${i}`);
  return [parseInt(m[0], 10), m[1]] as [number, number];
}

function parseString(input: string, i: number) {
  const m = match(STRING, input, i);
  if (!m) throw new Error(`Expected string at ${i}`);
  return [m[0].slice(1, -1), m[1]] as [string, number];
}

function parseListOfStrings(input: string, i: number): [string[], number] {
  i = expect("[", input, i);
  i = eatWS(input, i);
  const arr: string[] = [];
  if (input[i] !== "]") {
    while (true) {
      const [s, j] = parseString(input, i);
      arr.push(s);
      i = eatWS(input, j);
      if (input[i] === ",") {
        i = eatWS(input, i + 1);
        continue;
      }
      break;
    }
  }
  i = eatWS(input, i);
  i = expect("]", input, i);
  return [arr, i];
}

function parseRect(input: string, i: number): [TilRect, number] {
  i = expect("rect", input, i);
  i = eatWS(input, i);
  i = expect("(", input, i);
  i = eatWS(input, i);
  const [x, i1] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i1));
  const [y, i2] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i2));
  const [w, i3] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i3));
  const [h, i4] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i4));
  const [mat, i5] = parseId(input, i);
  i = eatWS(input, i5);
  let color: string | undefined;
  if (input[i] === ",") {
    i = eatWS(input, i + 1);
    const m = match(COLOR, input, i);
    if (!m) throw new Error(`Expected color at ${i}`);
    color = m[0] as TilColor;
    i = eatWS(input, m[1]);
  }
  i = expect(")", input, i);
  return [{ type: "rect", x, y, w, h, mat, color }, i];
}

function parseCircle(input: string, i: number): [TilCircle, number] {
  i = expect("circle", input, i);
  i = eatWS(input, i);
  i = expect("(", input, i);
  i = eatWS(input, i);
  const [x, i1] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i1));
  const [y, i2] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i2));
  const [r, i3] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i3));
  const [mat, i4] = parseId(input, i);
  i = eatWS(input, i4);
  let color: string | undefined;
  if (input[i] === ",") {
    i = eatWS(input, i + 1);
    const m = match(COLOR, input, i);
    if (!m) throw new Error(`Expected color at ${i}`);
    color = m[0] as TilColor;
    i = eatWS(input, m[1]);
  }
  i = expect(")", input, i);
  return [{ type: "circle", x, y, r, mat, color }, i];
}

function parseLine(input: string, i: number): [TilLine, number] {
  i = expect("line", input, i);
  i = eatWS(input, i);
  i = expect("(", input, i);
  i = eatWS(input, i);
  const [x1, i1] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i1));
  const [y1, i2] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i2));
  const [x2, i3] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i3));
  const [y2, i4] = parseNumber(input, i);
  i = eatWS(input, expect(",", input, i4));
  const [mat, i5] = parseId(input, i);
  i = eatWS(input, i5);
  let color: string | undefined;
  if (input[i] === ",") {
    i = eatWS(input, i + 1);
    const m = match(COLOR, input, i);
    if (!m) throw new Error(`Expected color at ${i}`);
    color = m[0] as TilColor;
    i = eatWS(input, m[1]);
  }
  i = expect(")", input, i);
  return [{ type: "line", x1, y1, x2, y2, mat, color }, i];
}

function parseStencil(input: string, i: number) {
  if (input.slice(i, i + 4) === "rect") return parseRect(input, i);
  if (input.slice(i, i + 6) === "circle") return parseCircle(input, i);
  if (input.slice(i, i + 4) === "line") return parseLine(input, i);
  throw new Error(`Expected stencil at ${i}`);
}

function parseFootprint(
  input: string,
  i: number
): [Array<TilRect | TilCircle | TilLine>, number] {
  i = expect("footprint", input, i);
  i = eatWS(input, i);
  i = expect("{", input, i);
  i = eatWS(input, i);
  const stencils: Array<TilRect | TilCircle | TilLine> = [];
  while (input[i] !== "}") {
    const [s, j] = parseStencil(input, i);
    stencils.push(s);
    i = eatWS(input, j);
  }
  i = expect("}", input, i);
  return [stencils, i];
}

function parseProp(
  input: string,
  i: number
): [key: string, value: any, next: number] {
  i = expect("prop", input, i);
  i = eatWS(input, i);
  const [key, i1] = parseId(input, i);
  i = eatWS(input, i1);
  i = expect(":", input, i);
  i = eatWS(input, i);
  // number | string | list of strings
  const n = match(NUM, input, i);
  if (n) return [key, parseInt(n[0], 10), eatWS(input, n[1])];
  const s = match(STRING, input, i);
  if (s) return [key, s[0].slice(1, -1), eatWS(input, s[1])];
  if (input[i] === "[") {
    const [arr, j] = parseListOfStrings(input, i);
    return [key, arr, eatWS(input, j)];
  }
  throw new Error(`Invalid prop at ${i}`);
}

function parsePrefab(input: string, i: number): [TilPrefab, number] {
  i = expect("prefab", input, i);
  i = eatWS(input, i);
  const [name, i1] = parseId(input, i);
  i = eatWS(input, i1);
  i = expect("{", input, i);
  i = eatWS(input, i);
  const props: Record<string, any> = {};
  let footprint: Array<TilRect | TilCircle | TilLine> = [];
  while (input[i] !== "}") {
    if (input.slice(i, i + 9) === "footprint") {
      const [fp, j] = parseFootprint(input, i);
      footprint = fp;
      i = eatWS(input, j);
    } else if (input.slice(i, i + 4) === "prop") {
      const [k, v, j] = parseProp(input, i);
      props[k] = v;
      i = eatWS(input, j);
    } else {
      throw new Error(`Unexpected token in prefab at ${i}`);
    }
  }
  i = expect("}", input, i);
  return [{ name, props, footprint }, i];
}

export function parseProgram(input: string): TilProgram {
  let i = eatWS(input, 0);
  const prefabs: TilPrefab[] = [];
  while (i < input.length) {
    const [pf, j] = parsePrefab(input, i);
    i = eatWS(input, j);
    if (input[i] === ";") i++;
    i = eatWS(input, i);
    prefabs.push(pf);
    if (i >= input.length) break;
  }
  if (prefabs.length === 0) throw new Error("No prefabs parsed");
  return { prefabs };
}
