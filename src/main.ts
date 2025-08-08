import { start } from "./modules/renderer.js";
import { mountPromptBar } from "./client/ui/PromptBar.js";
import { initPreviewOverlay } from "./client/ui/PreviewOverlay.js";

window.onload = () => {
  start();
  let mount = document.getElementById("promptBarMount");
  if (!mount) {
    // fallback: create a fixed footer mount so the prompt is always visible
    mount = document.createElement("div");
    mount.id = "promptFooter";
    Object.assign(mount.style, {
      position: "fixed",
      left: "0",
      right: "0",
      bottom: "0",
      padding: "10px",
      background: "rgba(50,50,56,0.95)",
      borderTop: "1px solid darkgray",
      display: "flex",
      justifyContent: "center",
      zIndex: "1000",
    } as CSSStyleDeclaration);
    document.body.appendChild(mount);
  }
  mountPromptBar(mount);
  initPreviewOverlay();
};
