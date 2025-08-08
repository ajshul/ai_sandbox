import Grid from "./grid.js";
import Element from "./elements/element.js";
import { setupControls } from "./controls.js";
import { setupEditor } from "./editor.js";
import {
  DEBUG_MOVEMENT,
  DEBUG_VELOCITY,
  DEBUG_LIFE,
  RENDER_DELAY,
  setupConfig,
} from "./config.js";
import Empty from "./elements/misc/empty.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = (canvas as HTMLCanvasElement | null)?.getContext(
  "2d"
) as CanvasRenderingContext2D;

let w = canvas.width;
let h = canvas.height;
let gridWidth = 80;
let gridSizing = [2, 5, 10, 20, 40, 80, 160];
let row = h / gridWidth;
let col = w / gridWidth;
let grid = new Grid();
let updateOnNextFrame: Set<number> = new Set();
const overlayDrawers: Array<() => void> = [];

let lastFrameTime = performance.now();
let frameTimes: number[] = [];
let maxFrameRate = 0;

export function increaseSize() {
  gridWidth = gridSizing[gridSizing.indexOf(gridWidth) + 1] || gridWidth;
  row = h / gridWidth;
  col = w / gridWidth;
  grid = new Grid();
  grid.initialize(row, col);
}

export function decreaseSize() {
  gridWidth = gridSizing[gridSizing.indexOf(gridWidth) - 1] || gridWidth;
  row = h / gridWidth;
  col = w / gridWidth;
  grid = new Grid();
  grid.initialize(row, col);
}

export function setGridSize(gridSize: number) {
  gridWidth = gridSize;
  row = h / gridWidth;
  col = w / gridWidth;
  grid = new Grid();
  grid.initialize(row, col);
}

export function start() {
  grid.initialize(row, col);
  setupControls();
  setupConfig();
  setupEditor();
  render();
}

export function drawPixel(index: number, element: Element) {
  let colorList = element.color;
  if (DEBUG_MOVEMENT || DEBUG_VELOCITY || DEBUG_LIFE) {
    colorList = element.debugColor;
  }
  ctx.fillStyle = `rgb(${colorList[0]}, ${colorList[1]}, ${colorList[2]})`;
  ctx.fillRect(
    (index % col) * gridWidth,
    Math.floor(index / col) * gridWidth,
    gridWidth,
    gridWidth
  );
}

function calculateFrameRate() {
  const now = performance.now();
  const frameTime = now - lastFrameTime;
  lastFrameTime = now;

  // Keep the last 100 frame times
  if (frameTimes.length > 100) {
    frameTimes.shift();
  }
  frameTimes.push(frameTime);

  // Calculate the average frame time and convert to fps
  const averageFrameTime =
    frameTimes.reduce((a, b) => a + b) / frameTimes.length;
  const frameRate = 1000 / averageFrameTime;

  // Update the frame rate display
  const frameRateElement = document.getElementById("frameRate") as HTMLElement;
  const maxFrameRateElement = document.getElementById(
    "frameRateMax"
  ) as HTMLElement;
  frameRateElement.textContent = `Avg Frame Rate: ${Math.round(frameRate)} fps`;
  if (maxFrameRate < frameRate) {
    maxFrameRate = frameRate;
    maxFrameRateElement.textContent = `Max Frame Rate: ${Math.round(
      maxFrameRate
    )} fps`;
  }
}

function render() {
  grid.draw();
  // overlays
  for (const fn of overlayDrawers) fn();
  calculateFrameRate();
  setTimeout(() => {
    requestAnimationFrame(() => render());
    updateOnNextFrame.clear();
  }, RENDER_DELAY);
}

export function registerOverlayDrawer(fn: () => void) {
  overlayDrawers.push(fn);
}

export { gridWidth, col, row, ctx, grid, updateOnNextFrame };
