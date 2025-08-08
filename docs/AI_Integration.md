### GPT-5 Integration Plan

This codebase currently validates TIL locally. To integrate GPT-5 tool calling:

1. Use Responses API with tools:

   - Custom tool `compile_til` that returns TIL constrained by a CFG (matching the TIL grammar).
   - Function tools for `world_query`, `register_content` if needed.

2. Server wiring (replace stubs):

   - Implement `src/server/openaiClient.ts` using `openai` SDK.
   - In `src/server/tools/compileTil.ts`, call the Responses API, gating with `allowed_tools` so `compile_til` must be called first. Capture tool output (TIL) then pass to local `validateTIL()`.

3. Security & validation:

   - Treat the model output as untrusted. Always parse+validate with server-side code before applying any patches.
   - Enforce budgets (area, rays, counts) and tag/material whitelists.

4. Client UX
   - The current prompt bar compiles locally. When server endpoints are ready, swap calls to hit `/server/routes/content.ts` (compile), show errors in the status, and only enable Confirm on ok.

References:

- See `ai_docs/FunctionCalling.md`, `ai_docs/StructuredOutputs.md`, and `ai_docs/UsingGPT5.md` for function tools, CFG constraints, and Responses API details.
