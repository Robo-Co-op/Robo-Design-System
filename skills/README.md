# Robo design skills

The project-specific skill is [`robo-frontend-design/SKILL.md`](robo-frontend-design/SKILL.md). It brings the design-planning and anti-template critique approach of Anthropic's frontend-design skill into the existing Robo brand-token system.

It is for websites, landing pages, dashboards and product UI. **Do not substitute it for the presentation system.** Decks continue to use root `AGENTS.md`, `contracts/` and `slides/`.

For compatible coding agents, install or copy the entire `robo-frontend-design` skill folder into that agent's project skills directory, or explicitly tell the agent to read this SKILL.md before designing. Merely storing the skill in GitHub does not ensure every agent automatically loads it.

Example request:

> Build a Robo Lab client-facing landing page using our existing **light** theme; read `skills/robo-frontend-design/SKILL.md` and the existing tokens, produce a short design plan first, then implement and inspect mobile/desktop screenshots.

Upstream inspiration: [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) (Apache-2.0). This integration is Robo-specific and does not overwrite fonts, logos, existing brand tokens or slide variants.

## Robo 3D Teardown

[`robo-3d-teardown/SKILL.md`](robo-3d-teardown/SKILL.md) covers interactive mechanical explainers with branded HUDs, cutaways and part-state-linked gauges. It uses the resolved **web** brand themes (including Robo Lab **light**) without altering the Presentation OS.

Export a theme after `npm run tokens`:

```bash
node skills/robo-3d-teardown/scripts/export-theme.mjs --brand robo-lab --theme light
```

The upstream [elvarofficial/teardown](https://github.com/elvarofficial/teardown) generator is third-party MIT code and is **not vendored**. The Robo-developed [interactive demo](robo-3d-teardown/demo/README.md) is built by obtaining an audited and pinned upstream checkout. `npm run 3d:test` checks mechanism math and theme export; `npm run 3d:build` produces single-file HTML; `npm run 3d:qa` tests desktop/mobile Chrome and writes screenshots. See [upstream and security notes](robo-3d-teardown/references/upstream.md).
