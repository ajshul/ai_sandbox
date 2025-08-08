// Lightweight local-only handlers (not mounted) to mirror guide API shapes
import { compileFromText } from "../tools/compileTil.js";

export async function compile(text: string) {
  return compileFromText(text);
}
