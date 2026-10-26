#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const renderRoot = path.resolve(process.argv[2] || path.join(ROOT, "grade/rendered"));
const baselinePath = path.resolve(process.argv[3] || path.join(ROOT, "grade/baseline.json"));
const updateBaseline = process.argv.includes("--update-baseline");
const threshold = 0.04;

const layouts = JSON.parse(fs.readFileSync(path.join(ROOT, "contracts/layouts.json"), "utf8"));
const variants = JSON.parse(fs.readFileSync(path.join(ROOT, "contracts/variants.json"), "utf8"));
const activeVariants = variants.variants.filter(v => !v.deprecated);
const expectedCount = layouts.layouts.length * activeVariants.length;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes:true }).flatMap(entry => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : [p];
  });
}

function run(cmd, args, encoding = "utf8") {
  const out = spawnSync(cmd, args, { encoding: encoding === null ? null : encoding, maxBuffer: 20 * 1024 * 1024 });
  if (out.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed: ${String(out.stderr || out.stdout || "").trim()}`);
  }
  return out.stdout;
}

function imageInfo(file) {
  const raw = String(run("identify", ["-format", "%w %h %k", file])).trim().split(/\s+/).map(Number);
  return { width:raw[0], height:raw[1], colors:raw[2] };
}

function fingerprint(file) {
  const buf = run("convert", [file, "-resize", "32x18!", "-colorspace", "Gray", "-depth", "8", "gray:-"], null);
  if (!Buffer.isBuffer(buf) || buf.length !== 32 * 18) {
    throw new Error(`Unexpected fingerprint size for ${file}: ${buf?.length}`);
  }
  return Buffer.from(buf);
}

function distance(a64, b64) {
  const a = Buffer.from(a64, "base64");
  const b = Buffer.from(b64, "base64");
  if (a.length !== b.length || !a.length) return 1;
  let total = 0;
  for (let i=0;i<a.length;i++) total += Math.abs(a[i]-b[i]) / 255;
  return total / a.length;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

const pngs = walk(renderRoot).filter(f => /\.png$/i.test(f)).sort();
const current = {};
const records = [];
let failures = 0;

for (const file of pngs) {
  const key = path.relative(renderRoot, file).replaceAll(path.sep, "/");
  const info = imageInfo(file);
  const fp = fingerprint(file).toString("base64");
  current[key] = fp;
  const ratio = info.width / info.height;
  const issues = [];
  if (info.width < 1000 || info.height < 500) issues.push(`unexpected dimensions ${info.width}×${info.height}`);
  if (Math.abs(ratio - 16/9) > 0.02) issues.push(`aspect ratio ${ratio.toFixed(3)} is not 16:9`);
  if (info.colors < 16) issues.push(`near-uniform render (${info.colors} colors)`);
  records.push({key, file, ...info, issues, regression:null});
}

if (pngs.length !== expectedCount) {
  failures += 1;
  console.error(`FAIL expected ${expectedCount} rendered slides, found ${pngs.length}`);
}

const hasBaseline = fs.existsSync(baselinePath);
let baseline = null;
if (hasBaseline) {
  const candidate = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  if (candidate.expectedCount === expectedCount) baseline = candidate;
  else console.warn(`WARN accepted baseline covers ${candidate.expectedCount} renders; current system expects ${expectedCount}. A new proposed baseline will be generated.`);
}

if (baseline?.renders) {
  const expectedKeys = new Set(Object.keys(baseline.renders));
  for (const r of records) {
    if (!baseline.renders[r.key]) {
      r.issues.push("missing from accepted baseline");
      continue;
    }
    expectedKeys.delete(r.key);
    r.regression = distance(current[r.key], baseline.renders[r.key]);
    if (r.regression > (baseline.threshold ?? threshold)) r.issues.push(`visual drift ${(r.regression*100).toFixed(2)}%`);
  }
  for (const missing of expectedKeys) {
    failures += 1;
    console.error(`FAIL baseline slide missing from render: ${missing}`);
  }
}

for (const r of records) {
  if (r.issues.length) {
    failures += 1;
    console.error(`FAIL ${r.key}: ${r.issues.join("; ")}`);
  } else {
    const suffix = r.regression == null ? "" : ` · drift ${(r.regression*100).toFixed(2)}%`;
    console.log(`PASS ${r.key} · ${r.width}×${r.height} · ${r.colors} colors${suffix}`);
  }
}

const proposed = {
  version:1,
  generatedFrom:"Robo Presentation OS visual fingerprints (32×18 grayscale)",
  threshold,
  expectedCount,
  renders:current
};
const proposedPath = path.join(ROOT, "grade/proposed-baseline.json");
fs.writeFileSync(proposedPath, JSON.stringify(proposed, null, 2) + "\n");
if (updateBaseline) {
  fs.writeFileSync(baselinePath, JSON.stringify(proposed, null, 2) + "\n");
  console.log(`UPDATED ${path.relative(ROOT, baselinePath)}`);
}

const report = {
  generatedAt:new Date().toISOString(),
  expectedCount,
  actualCount:pngs.length,
  threshold:baseline?.threshold ?? threshold,
  baseline:baseline ? path.relative(ROOT, baselinePath) : null,
  failures,
  slides:records.map(r=>({key:r.key,width:r.width,height:r.height,colors:r.colors,regression:r.regression,issues:r.issues}))
};
fs.writeFileSync(path.join(ROOT,"grade/report.json"), JSON.stringify(report,null,2)+"\n");

const cards = records.map(r => {
  const rel = path.relative(path.join(ROOT,"grade"), r.file).replaceAll(path.sep,"/");
  const status = r.issues.length ? "FAIL" : "PASS";
  const drift = r.regression == null ? "no baseline" : `${(r.regression*100).toFixed(2)}% drift`;
  return `<article class="${status.toLowerCase()}"><img src="${esc(rel)}"><h3>${esc(r.key)}</h3><p>${status} · ${r.width}×${r.height} · ${r.colors} colors · ${drift}</p><p>${esc(r.issues.join("; "))}</p></article>`;
}).join("\n");

const html = `<!doctype html><meta charset="utf-8"><title>Robo Presentation Visual Grade</title>
<style>body{font-family:Arial,sans-serif;background:#0b0d10;color:#eef3f7;margin:24px}h1{font-size:24px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px}article{border:1px solid #33404d;padding:12px;background:#141820}article.fail{border-color:#f75326}img{width:100%;display:block;background:#fff}h3{font-size:14px;margin:10px 0 4px}p{font-size:12px;color:#aeb7c2;margin:4px 0}</style>
<h1>Robo Presentation Visual Grade</h1><p>${records.length} renders · ${failures} failures</p><main class="grid">${cards}</main>`;
fs.writeFileSync(path.join(ROOT,"grade/report.html"), html);

if (!baseline) console.warn("WARN no compatible accepted visual baseline yet; proposed baseline written to grade/proposed-baseline.json");
process.exit(failures ? 1 : 0);
