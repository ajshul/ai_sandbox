// OpenAI client wrapper. Reads API key from environment (set via .env when served under a real server)
// IMPORTANT: Do not import this file from browser code. It's server-only.
import OpenAI from "openai";

let apiKey: string | undefined = undefined;
try {
  // @ts-ignore process may exist in your bundler/server env
  apiKey =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.OPENAI_API_KEY) ||
    undefined;
} catch {}

export const oai = apiKey ? new OpenAI({ apiKey }) : ({} as any);
