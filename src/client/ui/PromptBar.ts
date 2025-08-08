// Lightweight DOM prompt bar injected into existing index.html
import { compileFromText } from "../../server/tools/compileTil.js";
import {
  PreviewState,
  setPreviewState,
  getPreviewState,
} from "./PreviewState.js";
import { footprintToPatches } from "../../engine/footprintToPatches.js";
import { applyPatches } from "../../engine/tileoBridge.js";

export function mountPromptBar(container: HTMLElement) {
  const bar = document.createElement("div");
  bar.style.display = "flex";
  bar.style.marginTop = "6px";
  bar.style.gap = "6px";
  bar.style.maxWidth = "1000px";
  bar.style.width = "100%";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Describe an object, or paste TIL...";
  input.style.flex = "1";

  const btnCompile = document.createElement("button");
  btnCompile.textContent = "Compile";

  const btnConfirm = document.createElement("button");
  btnConfirm.textContent = "Confirm";
  const btnCancel = document.createElement("button");
  btnCancel.textContent = "Cancel";

  const btnSample = document.createElement("button");
  btnSample.textContent = "Sample";

  const status = document.createElement("div");
  status.style.color = "white";
  status.style.marginLeft = "8px";

  btnCompile.onclick = async () => {
    status.textContent = "Compiling...";
    const text = input.value.trim();
    if (!text) return;
    const res = await compileFromText(text);
    if (!res.ok || !res.program) {
      status.textContent = `Error: ${(res.errors || []).join(", ")}`;
      setPreviewState(null);
      return;
    }
    // Take first prefab for preview
    const prefab = res.program.prefabs[0];
    const preview: PreviewState = { prefab, visible: true };
    setPreviewState(preview);
    status.textContent = `OK: ${prefab.name}`;
  };

  btnConfirm.onclick = () => {
    const state = getPreviewState();
    if (!state) return;
    const patches = footprintToPatches(state.prefab);
    applyPatches(patches);
    setPreviewState(null);
    status.textContent = `Placed`;
  };

  btnCancel.onclick = () => {
    setPreviewState(null);
    status.textContent = "Cancelled";
  };

  btnSample.onclick = () => {
    input.value = `prefab TestBlock {\n  prop width: 6\n  footprint {\n    rect(10,10,6,3, STEEL, #C9C940)\n    rect(10,13,6,1, WATER)\n    line(10,14,15,14, WOOD)\n  }\n};`;
    status.textContent = "Sample loaded";
  };

  bar.appendChild(input);
  bar.appendChild(btnCompile);
  bar.appendChild(btnConfirm);
  bar.appendChild(btnCancel);
  bar.appendChild(btnSample);
  bar.appendChild(status);
  container.appendChild(bar);
}
