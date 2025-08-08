import { TilPrefab } from "../../dsl/tilParser.js";

export type PreviewState = { prefab: TilPrefab; visible: boolean };

let previewState: PreviewState | null = null;
const listeners: Array<(s: PreviewState | null) => void> = [];

export function setPreviewState(s: PreviewState | null) {
  previewState = s;
  for (const l of listeners) l(s);
}

export function onPreviewStateChange(cb: (s: PreviewState | null) => void) {
  listeners.push(cb);
}

export function getPreviewState() {
  return previewState;
}
