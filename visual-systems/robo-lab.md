# Robo Lab Visual System

**Work Together — Pioneering Systemic Lab**

Robo Lab makes systems, experiments, and traces visible.

## Light — `robo-lab-light`

The recommended white-background option for SME sales decks, enterprise proposals,
and training / CoE operating models. Select it explicitly; existing decks do not
change theme automatically.

- White canvas, light Ice Blue surfaces, Midnight Blue text, and restrained blue accents.
- Meaningful code-style section labels and a faint system grid; no scan lines,
  cyber corner brackets, glow, or dark terminal panels.
- Use the same story-first process and 48-archetype registry as other variants.
  A light theme is not a reason to put every idea in a box. Choose logic trees,
  decision matrices, timelines, or flow diagrams when they express the argument.
- Keep text, diagrams, and charts editable. Do not replace a slide with one image.

```json
{
  "meta": {
    "title": "Your presentation title",
    "brand": "robo-lab",
    "preset": "robo-lab-light",
    "language": "en"
  }
}
```

### Palette provenance and readability

The palette is adapted from `tokens/brands/robo-lab.json` (`theme.light`). The
foundation tokens are unchanged. The presentation contract uses a pure white
canvas, `F8FCFE` and `EAF5FD` Ice Blue tints, and `20305B` Midnight Blue text.
The brand's exact `007DD1` blue is retained as the accent. The shared renderer uses
`primary` for small labels as well as rules, so Light uses the darker `006FB8`
there. Together with `52627F` muted text, all three text roles meet 4.5:1 on the
canvas and both surfaces. `7187A3` is the presentation border color.
Orange, teal, and yellow remain supporting signals, not small body-text colors;
never rely on color alone for status.

## Core — `robo-lab-core`

Dark navy, Electric Cyan, precise grids, module IDs, status notation, system diagrams.
The existing default and the `robo-lab-tech` alias remain unchanged.

## Cyber — `robo-lab-cyber`

Blacker surfaces, denser grid, corner brackets, trace cues, cyan signal, Tech Orange interruption.

Cyberpunk is a spice, not a costume. No fake code, gratuitous neon, or borrowed Kakao styling.
