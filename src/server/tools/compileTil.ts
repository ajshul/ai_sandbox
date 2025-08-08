import { validateTIL } from "../../dsl/tilValidator.js";

export async function compileFromText(userText: string) {
  // Local mock: trust input is already TIL; in real flow call GPT-5 with tools
  const res = validateTIL(userText);
  return res;
}
