#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [output, ...inputs] = process.argv.slice(2);
if (!output || inputs.length < 1) {
  console.error('Usage: node grade/combine-baselines.mjs <output.json> <baseline.json> [addition.json ...]');
  process.exit(2);
}
const renders = {};
let threshold;
for (const input of inputs) {
  const data = JSON.parse(fs.readFileSync(input, 'utf8'));
  if (data.version !== 1 || !data.renders || typeof data.renders !== 'object' || Array.isArray(data.renders))
    throw new Error(`Invalid baseline: ${input}`);
  if (data.expectedCount !== Object.keys(data.renders).length)
    throw new Error(`Baseline count mismatch: ${input}`);
  if (typeof data.threshold !== 'number' || !Number.isFinite(data.threshold) || data.threshold <= 0 || data.threshold >= 1)
    throw new Error(`Invalid threshold: ${input}`);
  if (threshold !== undefined && threshold !== data.threshold)
    throw new Error(`Inconsistent thresholds: ${input}`);
  threshold = data.threshold;
  for (const [key, fingerprint] of Object.entries(data.renders)) {
    if (!/^[a-z0-9-]+\/slide-\d+\.png$/.test(key) || typeof fingerprint !== 'string')
      throw new Error(`Invalid baseline entry: ${input}: ${key}`);
    const bytes = Buffer.from(fingerprint, 'base64');
    if (bytes.length !== 32 * 18 || bytes.toString('base64') !== fingerprint)
      throw new Error(`Invalid fingerprint: ${input}: ${key} (${bytes.length} bytes)`);
    if (Object.hasOwn(renders, key) && renders[key] !== fingerprint)
      throw new Error(`Conflicting baseline entry: ${key}`);
    renders[key] = fingerprint;
  }
}
const result = { version: 1, generatedFrom: 'Combined accepted presentation baselines', threshold, expectedCount: Object.keys(renders).length, renders };
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Combined ${inputs.length} accepted baselines: ${result.expectedCount} renders.`);
