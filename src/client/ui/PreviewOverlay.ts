import {
  ctx,
  gridWidth,
  registerOverlayDrawer,
} from "../../modules/renderer.js";
import { onPreviewStateChange, getPreviewState } from "./PreviewState.js";
import { MATERIALS } from "../../engine/materials.js";

function drawGhostCell(ix: number, iy: number, color: string) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(ix * gridWidth, iy * gridWidth, gridWidth, gridWidth);
  ctx.globalAlpha = 1;
}

export function drawPreviewOverlay() {
  const s = getPreviewState();
  if (!s || !s.visible) return;
  const p = s.prefab;
  for (const st of p.footprint) {
    const mat = MATERIALS[st.mat as keyof typeof MATERIALS];
    const colr = st.color || (mat?.color as string) || "#FFFFFF";
    if (st.type === "rect") {
      for (let y = st.y; y < st.y + st.h; y++) {
        for (let x = st.x; x < st.x + st.w; x++) {
          drawGhostCell(x, y, colr);
        }
      }
    } else if (st.type === "line") {
      const dx = Math.sign(st.x2 - st.x1);
      const dy = Math.sign(st.y2 - st.y1);
      let x = st.x1,
        y = st.y1;
      while (x !== st.x2 || y !== st.y2) {
        drawGhostCell(x, y, colr);
        if (x !== st.x2) x += dx;
        if (y !== st.y2) y += dy;
      }
      drawGhostCell(st.x2, st.y2, colr);
    } else if (st.type === "circle") {
      const r = st.r;
      for (let yy = -r; yy <= r; yy++) {
        for (let xx = -r; xx <= r; xx++) {
          if (xx * xx + yy * yy <= r * r)
            drawGhostCell(st.x + xx, st.y + yy, colr);
        }
      }
    }
  }
}

export function initPreviewOverlay() {
  registerOverlayDrawer(drawPreviewOverlay);
}
