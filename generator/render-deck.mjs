#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import PptxGenJS from "pptxgenjs";
import { loadTheme } from "./lib/theme.mjs";
import { validateDeck, formatQa } from "./lib/qa.mjs";
import { RENDERERS } from "./lib/renderers.mjs";

const [, , inputArg, outputArg] = process.argv;
if (!inputArg) {
  console.error("Usage: node generator/render-deck.mjs <deck.json> [output.pptx]");
  process.exit(2);
}

const input = path.resolve(inputArg);
const output = path.resolve(outputArg || input.replace(/\.json$/i, ".pptx"));
const deck = JSON.parse(fs.readFileSync(input, "utf8"));
const qa = validateDeck(deck);
console.log(formatQa(qa));
if (qa.errors.length) process.exit(1);

fs.mkdirSync(path.dirname(output), { recursive: true });

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = deck.meta.author || "Robo Co-op";
pptx.company = "Robo Co-op";
pptx.subject = deck.meta.subject || deck.meta.title;
pptx.title = deck.meta.title;
pptx.lang = deck.meta.language === "ja" ? "ja-JP" : "en-US";
pptx.theme = {
  headFontFace: deck.meta.language === "ja" ? "Noto Sans JP" : "Roboto",
  bodyFontFace: deck.meta.language === "ja" ? "Noto Sans JP" : "Roboto",
  lang: pptx.lang
};

const theme = loadTheme(deck.meta);
deck.slides.forEach((spec, index) => {
  const slide = pptx.addSlide();
  const renderer = RENDERERS[spec.type];
  renderer({ pptx, slide, spec, index, theme, meta: deck.meta });
});

await pptx.writeFile({ fileName: output });
console.log(`WROTE ${output}`);
