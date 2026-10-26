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
- Robo Lab: `robo-lab-light` (white), `robo-lab-core` (navy), `robo-lab-cyber` (expressive dark)
- Co-op Lab: `coop-lab-core`, `coop-lab-hack`
- Robo University: `robo-university-core`, `robo-university-explore`

Legacy variant names remain aliases for compatibility only. The existing default
and `robo-lab-tech` alias still select the navy `robo-lab-core`; they are not renamed
or silently redirected to Light.

### White-background Robo Lab decks

Use `meta.brand: "robo-lab"` and `meta.preset: "robo-lab-light"` for SME sales decks,
enterprise proposals, and training / CoE operating models. Keep the story-first
chart selection rules; changing the theme must not flatten diagrams into cards.

```bash
node generator/qa-deck.mjs generator/examples/robo-lab-light.json
node generator/render-deck.mjs generator/examples/robo-lab-light.json generator/output/robo-lab-light.pptx
```

See [Robo Lab's visual system](../visual-systems/robo-lab.md) for palette provenance,
contrast adjustments, and the difference between Light, Core, and Cyber.

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

`slides:qa` also checks Light theme selection, text contrast, legacy aliases,
brand/variant mismatch rejection, and all seven layout examples.
The visual test renders every active layout × brand variant combination and
compares it with the accepted fingerprint baseline.

The generated PPTX remains editable: text, cards, rules, diagrams, and brand motifs are native PowerPoint objects.
