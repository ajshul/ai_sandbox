import { validateTIL } from "../../dsl/tilValidator.js";
import { oai } from "../openaiClient.js";

// If OPENAI_API_KEY is present, use GPT-5 custom tool calling to compile NL -> TIL.
// Otherwise, fall back to local validation expecting raw TIL input.
export async function compileFromText(userText: string) {
  if (!oai || !oai.responses) {
    return validateTIL(userText);
  }

  try {
    const tools = [
      {
        type: "custom",
        name: "compile_til",
        description: "Compile NL into TIL v1 (must match CFG).",
        format: {
          type: "grammar",
          syntax: "lark",
          definition: `
start: (prefab ";")+
prefab: "prefab" ID "{" body "}"
body: (prop|tags|footprint|verb)*
prop: "prop" ID ":" value
tags: "tags" ":" list
footprint: "footprint" "{" stencils "}"
stencils: stencil+
stencil: rect | circle | line
rect: "rect" "(" INT "," INT "," INT "," INT "," ID ("," COLOR)? ")"
circle: "circle" "(" INT "," INT "," INT "," ID ("," COLOR)? ")"
line: "line" "(" INT "," INT "," INT "," INT "," ID ("," COLOR)? ")"
verb: "verb" ID "{" actions "}"
actions: (setrect ";")+
setrect: "setRect" "(" INT "," INT "," INT "," INT "," ID ("," COLOR)? ")"

list: "[" (STRING ("," STRING)*)? "]"
value: INT | STRING | list

ID: /[A-Za-z_][A-Za-z0-9_]*/
INT: /-?[0-9]+/
STRING: /"[^"\\]*"/
COLOR: /#[0-9A-Fa-f]{6}/
          `,
        },
      },
    ];

    const res = await oai.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content:
            "You are a content compiler for a grid physics sandbox. Output only TIL via compile_til for the given request.",
        },
        { role: "user", content: userText },
      ],
      tools,
      tool_choice: {
        type: "allowed_tools",
        mode: "required",
        tools: [{ name: "compile_til" }],
      },
      reasoning: { effort: "minimal" },
      text: { verbosity: "low" },
    });

    // Find the custom tool call and extract TIL text input
    let til: string | null = null;
    for (const item of res.output || []) {
      if (
        item.type === "custom_tool_call" &&
        item.name === "compile_til" &&
        typeof item.input === "string"
      ) {
        til = item.input;
        break;
      }
    }
    if (!til) {
      return { ok: false, errors: ["No TIL produced by compile_til"] };
    }
    return validateTIL(til);
  } catch (e: any) {
    return { ok: false, errors: [e?.message || String(e)] };
  }
}
