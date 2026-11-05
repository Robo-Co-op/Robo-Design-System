#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { loadTheme } from "./lib/theme.mjs";
import { validateDeck } from "./lib/qa.mjs";

const read = (rel) => JSON.parse(fs.readFileSync(new URL(rel, import.meta.url), "utf8"));
const variants = read("../contracts/variants.json");
const layouts = read("../contracts/layouts.json");
const light = loadTheme({ brand: "robo-lab", preset: "robo-lab-light" });
assert.equal(variants.variants.filter(v => v.id === "robo-lab-light").length, 1);
assert.equal(light.brand, "robo-lab");
assert.equal(light.scheme, "light");
assert.equal(light.dark, false);
assert.equal(light.bg, "FFFFFF");
assert.equal(light.terminal, false);
assert.equal(light.scanOpacity, 0);
assert.equal(light.motif, "system-grid");
assert.ok(light.gridOpacity > 0 && light.gridOpacity <= 0.05);
for (const key of ["bg", "surface", "surface2", "text", "muted", "border", "primary", "accent", "accent2", "danger", "success", "warning"]) {
  assert.match(light[key], /^[0-9A-F]{6}$/i, `Invalid Light color ${key}`);
}

function luminance(hex) {
  const c = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}
let pairCount = 0;
for (const foreground of ["text", "muted", "primary"]) {
  for (const background of ["bg", "surface", "surface2"]) {
    const ratio = contrast(light[foreground], light[background]);
    assert.ok(ratio >= 4.5, `${foreground}/${background}: ${ratio.toFixed(2)} < 4.5`);
    pairCount++;
  }
}

assert.equal(loadTheme({}).presetName, "robo-lab-core", "Do not change the existing default");
assert.equal(loadTheme({ preset: "robo-lab-core" }).scheme, "dark");
assert.equal(loadTheme({ preset: "robo-lab-cyber" }).scheme, "dark");
for (const [alias, canonical] of Object.entries(variants.$meta.aliases || {})) {
  assert.equal(loadTheme({ preset: alias }).presetName, canonical);
}
const gallery = {
  meta: { title: "Robo Lab Light layout validation", brand: "robo-lab", preset: "robo-lab-light", language: "en" },
  slides: layouts.layouts.map(layout => structuredClone(layout.example))
};
assert.equal(gallery.slides.length, 7, "Review coverage if the semantic layout registry changes");
assert.deepEqual(validateDeck(gallery).errors, [], "Light must support every registered layout");
assert.ok(validateDeck({ ...gallery, meta: { ...gallery.meta, brand: "robo-coop" } }).errors.length > 0,
  "Brand/variant mismatch must still fail");
assert.deepEqual(validateDeck(read("./examples/robo-lab-light.json")).errors, [], "Light example must pass QA");
console.log(`PASS Robo Lab Light: ${pairCount} contrast pairs, ${gallery.slides.length} layouts, example, aliases, and default compatibility.`);
