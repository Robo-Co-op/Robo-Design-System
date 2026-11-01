---
name: robo-frontend-design
description: Design, build, or restyle production-ready websites, landing pages, product UIs, dashboards, and interactive prototypes for Robo Co-op, Robo Lab, Co-op Lab, or Robo University. Use when an agent must apply existing Robo design tokens and brand identity while avoiding generic AI-generated layouts. Do not use for PowerPoint decks; use the repository Presentation OS for those.
---

# Robo Frontend Design

Create distinctive, usable Robo-branded interfaces. Treat the brand system as the source of truth and Anthropic's frontend-design method as a **design-review process**, not a replacement theme or component library.

## 1. Respect the design-system contract

Read the relevant files before proposing visual changes:

- `BRAND_FOUNDATIONS.md` — typography, semantics, accessibility and logo rules.
- `tokens/core.json` — spacing, type, breakpoints, focus, motion and density.
- `tokens/brands/<brand>.json` — canonical brand palette and light/dark semantic themes.
- `src/css/` — existing styles and reusable components.
- `visual-systems/<brand>.md` and `contracts/brands.json` — brand-specific visual grammar.

If operating outside the design-system checkout, request the relevant exported tokens or reference screenshots; do not invent a new Robo palette.

**Priority:** explicit user brief > approved brand tokens and accessibility requirements > reusable components > aesthetic exploration. A user's explicit brand/theme selection cannot be silently replaced by a fashionable look.

Use semantic CSS variables such as `--rds-color-surface-raised`, `--rds-color-text`, `--rds-color-primary-strong`, and `--rds-color-focus`. Avoid hardcoded approximate brand colors. Preserve Roboto (Latin) and Noto Sans JP (Japanese), unless a specific approved exception is supplied. Use real logos; never recreate them with text or AI imagery.

For web UI, a light Robo Lab brief should use the existing `robo-lab` **light** theme, including ice-blue surfaces and primary blue. Do not infer web themes from the Presentation OS: the presentation variants `robo-lab-core` and `robo-lab-cyber` are both dark.

## 2. Establish the brief before writing code

Record the target brand, user, primary job-to-be-done, real content, required routes/states, device range, technical stack, accessibility needs, and any mandatory references.

If the user already supplied sufficient context, proceed without redundant questions. Mark unresolved details as assumptions. Do not fabricate metrics, customers, screenshots, quotes or features.

For larger tasks, use `references/brief-template.md` as a lightweight working structure.

## 3. Design in two passes

**Pass A — Direction.** Define a compact, brief-specific design plan:

1. Select the approved brand and light/dark semantic theme.
2. Name 4–6 *existing* role-based colors (with token names and resolved hex only if actually verified).
3. Define typography hierarchy from the existing type scale.
4. Choose one meaningful visual signature that belongs to the product and its brand grammar.
5. Sketch an information hierarchy and desktop/mobile layout, including primary action.
6. Choose motion only if it clarifies feedback, state or navigation.

**Pass B — Challenge the default.** Before implementing, inspect the plan for unearned template choices: generic large-number hero, identical cards everywhere, decorative gradients, useless labels/numbers, artificial terminal output, repeated reveal animations, and filler copy. Revise one or more choices so the result expresses this *particular* product. A pattern is not forbidden when the brief genuinely calls for it.

Keep the visual voice coherent. Invest character in one signature element; subordinate decoration elsewhere.

## 4. Build from real components and content

- Prefer existing design-system CSS and semantic tokens over a new theme layer.
- Keep CSS specificity intentional; avoid broad selectors that override component spacing or states.
- Use accessible, responsive semantic HTML/React/Vue as appropriate to the current project; avoid framework migration solely to use this skill.
- Make data, labels and CTA language accurate and understandable; keep action labels and success messages consistent.
- Represent loading, empty, success, error, disabled and keyboard-focus states wherever relevant.
- Use motion sparingly and honor `prefers-reduced-motion`.
- Keep Japanese and English typography/readability appropriate to each language.

Brand signatures, not universal defaults:
- **Robo Co-op:** human ⇄ machine cooperation, connection and calm trust.
- **Robo Lab:** legible systems, traces and measured technical precision; no fictional code or gratuitous neon.
- **Co-op Lab:** shared ownership, constructive experimentation and bold but readable composition.
- **Robo University:** exploration, progress and branching learning journeys, not childish gamification.

## 5. Review the rendered result

Follow `references/qa-checklist.md`. Run relevant existing build and contrast checks (`npm test` in this design-system repo). For each materially changed UI, inspect rendered desktop and mobile screenshots rather than trusting source code alone. Compare the output with the brief, target brand and existing design references. Fix visual regressions before delivery.

Report the chosen brand/theme, the intentional design decision, reused tokens/components, any deviations, tested viewports and remaining limitations. Do not claim visual verification if screenshots were not actually inspected.

## Boundary and attribution

This skill applies to **websites and software UI**. `AGENTS.md`, `contracts/`, and `slides/` govern editable presentation decks. Use the Presentation OS for slide generation; carry over only general critique principles when compatible.

Adapted as an original Robo-specific workflow after review of Anthropic's `frontend-design` skill (Apache-2.0): https://github.com/anthropics/skills/tree/main/skills/frontend-design . See `references/upstream.md` and `LICENSE-ANTHROPIC.txt`.
