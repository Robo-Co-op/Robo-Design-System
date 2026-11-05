# Design influences

The Robo Presentation OS adopts proven presentation-engineering practices while keeping its visual identity original to the four Robo brands.

## Presentation systems

We reviewed `carnot-tech/consulting-pptx-skill` as a reference for editorial workflow.

Principles adopted:
- titles carry the storyline
- one slide has one governing message
- archetypes are an idea catalog, not a constraint
- structure precedes styling
- mechanical QA and visual QA are both necessary
- fresh-eye review happens before delivery

We also reviewed machine-readable theme systems such as Tahta for the idea that layout, variant, and agent contracts should be source-controlled and testable.

## Web and application interfaces

Reviewed Anthropic's official [frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) (Apache-2.0) for a stronger frontend workflow: decide an aesthetic direction, challenge default AI layouts, build from real content, then critique rendered screens. We adapted these ideas into [Robo Frontend Design](skills/robo-frontend-design/SKILL.md), with upstream provenance and license. This does not override canonical Robo brand tokens, fonts, logos, or the deck-specific Presentation OS.

## Interactive 3D mechanical explainers

Reviewed [elvarofficial/teardown](https://github.com/elvarofficial/teardown) (MIT; reviewed 2026-11-01) for reference-first geometry, synchronized mechanism state/readouts, inspectable cutaways and frame-by-frame review. We adapted those principles into [Robo 3D Teardown](skills/robo-3d-teardown/SKILL.md) with a portable bridge to resolved Robo web tokens. No upstream JavaScript runtime, models, or audio assets are copied; installing/running upstream code is a separate opt-in step.

## Robo-specific direction

The resulting visual system is not copied from a reference deck or external brand.

- Robo Co-op: synchronization and Human ⇄ Machine cooperation
- Robo Lab: systems, experiments, traces, and measured cyberpunk
- Co-op Lab: collective ownership, venture energy, constructive rebellion
- Robo University: learning paths, checkpoints, exploration, continuous updating

External references inform engineering discipline; the visual grammar belongs to Robo.
