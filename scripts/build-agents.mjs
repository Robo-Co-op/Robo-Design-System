#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const layouts = read("contracts/layouts.json");
const components = read("contracts/components.json");
const variants = read("contracts/variants.json");
const brands = read("contracts/brands.json");
const storytelling = read("contracts/storytelling.json");
const archetypes = read("contracts/archetypes.json");

function generate() {
  const lines = [
    "<!-- GENERATED from contracts/*.json by scripts/build-agents.mjs — do not edit by hand. -->",
    "# Robo Presentation OS — authoring contract for agents",
    "",
    "Create editable Robo presentations from structured deck JSON. Brand identity is part of the content system, not a cosmetic skin.",
    "",
    "## Core rules",
    ...layouts.rules.map((r,i)=>`${i+1}. ${r}`),
    "",
    "## Story-first workflow",
    ...storytelling.workflow.map((s,i)=>`${i+1}. **${s.label}** — ${s.rule}`),
    "",
    "### Headline rules",
    ...storytelling.headline.rules.map(r=>`- ${r}`),
    "",
    "### Storyline rules",
    ...storytelling.storyline.rules.map(r=>`- ${r}`),
    "",
    "### Evidence rules",
    ...storytelling.evidence.rules.map(r=>`- ${r}`),
    "",
    "## Slide intents",
    "| Intent | Question | Default semantic layouts |",
    "|---|---|---|",
    ...archetypes.intents.map(i=>`| \`${i.id}\` | ${i.question} | ${i.defaultSemanticLayouts.map(x=>`\`${x}\``).join(", ")} |`),
    "",
    "## Archetype registry",
    "Archetypes guide reasoning and composition. They do not replace the renderer contract: `slide.type` remains one of the supported semantic layouts.",
    "",
    "| ID | Intent | Archetype | Renderer hints |",
    "|---|---|---|---|",
    ...archetypes.archetypes.map(a=>`| \`${a.id}\` | \`${a.intent}\` | ${a.label} | ${a.rendererHints.map(x=>`\`${x}\``).join(", ")} |`),
    "",
    "## Brand selection",
    "| Brand | Essence | Tension | Signature motif |",
    "|---|---|---|---|",
    ...brands.brands.map(b=>`| \`${b.id}\` | ${b.essence} | ${b.tension} | \`${b.motif}\` |`),
    "",
    "A deck's `meta.brand` must match the selected variant's brand. Do not use one brand's visual grammar as a generic skin for another brand.",
    "",
    "## Workflow for generation",
    "1. Define audience, decision, evidence, and output.",
    "2. Choose the correct Robo brand from deck ownership and purpose.",
    "3. Write the governing claim and headline ledger before drawing.",
    "4. For each slide, choose intent → archetype → semantic layout, in that order.",
    "5. Fill only the fields supported by the selected semantic layout.",
    "6. Choose that brand's Core or Expressive variant deliberately.",
    "7. Run structural QA before PPTX generation.",
    "8. Render PPTX to PDF/PNG and run visual grading before delivery.",
    "",
    "## Brand-owned variants",
    "| Variant | Brand | Mode | Scheme | Best fit |",
    "|---|---|---|---|---|",
    ...variants.variants.map(v=>`| \`${v.id}\` | \`${v.brand}\` | ${v.mode} | ${v.scheme} | ${v.fit} |`),
    "",
    "## Brand grammar",
    ...brands.brands.flatMap(b=>[
      `### ${b.name}`,
      `**Tagline:** ${b.tagline}`,
      `**Essence:** ${b.essence}`,
      `**Use:** ${b.signature.join(", ")}.`,
      `**Principles:** ${b.principles.join(" ")}`,
      `**Avoid:** ${b.avoid.join(", ")}.`,
      ""
    ]),
    "## Layouts",
    "| Layout | Question | Best for | Required fields |",
    "|---|---|---|---|",
    ...layouts.layouts.map(l=>{
      const req=Object.entries(l.fields).filter(([,v])=>v.required).map(([k])=>k).join(", ");
      return `| \`${l.id}\` | ${l.answers} | ${l.bestFor.join("; ")} | ${req} |`;
    }),
    "",
    "## Components",
    "| Component | Purpose | Constraints |",
    "|---|---|---|",
    ...components.components.map(c=>`| \`${c.id}\` | ${c.purpose} | ${c.constraints.join(" ")} |`),
    "",
    "## Non-negotiable QA",
    "- A PPTX that opens is not automatically a good deck.",
    "- Fail on missing required fields, unsupported layouts, or brand/variant mismatch.",
    "- When intent/archetype metadata is present, validate it against the archetype registry.",
    "- Warn on generic titles, duplicate titles, excess density, repeated layout monotony, and deprecated aliases.",
    "- Verify the headline ledger as an argument, not just slide-by-slide correctness.",
    "- Render every active layout × variant combination to PNG in CI.",
    "- Fail visual grading on broken dimensions, near-blank renders, missing expected slides, or regression drift beyond the accepted threshold.",
    "- Keep evidence metadata truthful and explicit.",
    "",
    "## Commands",
    "```bash",
    "npm run slides:contracts:check",
    "npm run slides:qa",
    "npm run slides:gallery",
    "npm run slides:visual",
    "```",
    ""
  ];
  return lines.join("\n");
}

const output = generate();
const target = path.join(ROOT, "AGENTS.md");
if (process.argv.includes("--check")) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (current !== output) {
    console.error("AGENTS.md is out of date. Run: node scripts/build-agents.mjs");
    process.exit(1);
  }
  console.log("AGENTS.md is up to date.");
} else {
  fs.writeFileSync(target, output);
  console.log("WROTE AGENTS.md");
}
