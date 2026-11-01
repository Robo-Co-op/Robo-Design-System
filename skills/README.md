# Robo frontend design skill

The project-specific skill is [`robo-frontend-design/SKILL.md`](robo-frontend-design/SKILL.md). It brings the design-planning and anti-template critique approach of Anthropic's frontend-design skill into the existing Robo brand-token system.

It is for websites, landing pages, dashboards and product UI. **Do not substitute it for the presentation system.** Decks continue to use root `AGENTS.md`, `contracts/` and `slides/`.

For compatible coding agents, install or copy the entire `robo-frontend-design` skill folder into that agent's project skills directory, or explicitly tell the agent to read this SKILL.md before designing. Merely storing the skill in GitHub does not ensure every agent automatically loads it.

Example request:

> Build a Robo Lab client-facing landing page using our existing **light** theme; read `skills/robo-frontend-design/SKILL.md` and the existing tokens, produce a short design plan first, then implement and inspect mobile/desktop screenshots.

Upstream inspiration: [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) (Apache-2.0). This integration is Robo-specific and does not overwrite fonts, logos, existing brand tokens or slide variants.
