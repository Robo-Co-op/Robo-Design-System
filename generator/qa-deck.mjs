#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { validateDeck, formatQa } from "./lib/qa.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node generator/qa-deck.mjs <deck.json>");
  process.exit(2);
}
const deck = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
const result = validateDeck(deck);
console.log(formatQa(result));
process.exit(result.errors.length ? 1 : 0);
