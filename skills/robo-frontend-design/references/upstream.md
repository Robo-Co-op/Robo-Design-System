# Upstream design-method provenance

- Project: Anthropic official `frontend-design` skill
- Source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- Source file: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- Reviewed: 2026-11-01
- Reviewed source blob SHA: `a5333457c414d20d625f307df945842c0952ecc3`
- License: Apache License 2.0; a copy is preserved as `../LICENSE-ANTHROPIC.txt`.

## What this project adapts

- Design direction before implementation.
- A self-critical pass that challenges generic AI-layout habits.
- Purposeful typography, composition, motion and interface copy.
- Visual QA, accessibility and explicit acknowledgment of untested states.

## What remains Robo-specific

- Robo palette, fonts, semantic CSS tokens, logos and 4 brand identities remain authoritative.
- Both light and dark Robo Lab web themes are available even though its presentation variants are dark.
- Existing shared CSS and component behavior take precedence over invented one-off styling.
- The frontend workflow does not override the slide-oriented Presentation OS.

The Robo SKILL.md is a rewritten, purpose-specific synthesis, not a verbatim copy of the upstream instructions. Future upstream updates should be reviewed and selectively ported rather than auto-replacing brand rules.
