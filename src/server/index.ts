import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { compileFromText } from "./tools/compileTil.js";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

app.post("/compile", async (req, res) => {
  try {
    const text = (req.body && req.body.text) || "";
    const result = await compileFromText(text);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ ok: false, errors: [e?.message || String(e)] });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => console.log(`Tileo AI server listening on :${port}`));
