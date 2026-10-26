# Robo Slide Generator v0.3

Generate editable PowerPoint decks from structured JSON using the Robo Presentation OS.

## Pipeline

```
deck.json
  ↓
brand + variant contract
  ↓
story / field QA
  ↓
semantic layout renderer
  ↓
editable .pptx
  ↓
PDF / PNG render
  ↓
visual regression
```

## Brand variants

Every new deck must choose a matching `meta.brand` and brand-owned `meta.preset`.

- Robo Co-op: `robo-coop-core`, `robo-coop-dark`
- Robo Lab: `robo-lab-core`, `robo-lab-cyber`
- Co-op Lab: `coop-lab-core`, `coop-lab-hack`
- Robo University: `robo-university-core`, `robo-university-explore`

Legacy variant names remain aliases for compatibility only.

## Run the included example

```bash
npm install
npm run slides:qa
npm run slides:build:example
```

Output: `generator/output/ai-demo-deck.pptx`

## Supported slide types

`cover`, `statement`, `metrics`, `comparison`, `process`, `architecture`, `demo`.

## Quality gates

```bash
npm run slides:contracts:check
npm run slides:qa
npm run slides:visual
```

The visual test renders every active layout × brand variant combination and compares it with the accepted fingerprint baseline.

The generated PPTX remains editable: text, cards, rules, diagrams, and brand motifs are native PowerPoint objects.
