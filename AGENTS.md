<!-- GENERATED from contracts/*.json by scripts/build-agents.mjs — do not edit by hand. -->
# Robo Presentation OS — authoring contract for agents

Create editable Robo presentations from structured deck JSON. Brand identity is part of the content system, not a cosmetic skin.

## Core rules
1. Choose a layout from the question the slide must answer, not from decoration.
2. One slide has one governing message.
3. Titles should state a conclusion or decision whenever evidence supports one.
4. Reading titles alone should reveal the deck argument.
5. Do not force content into a preset layout; use the closest semantic layout and simplify or split the slide.
6. Facts, assumptions, estimates, and recommendations must be distinguishable.
7. Never invent sources, screenshots, numbers, quotes, customer names, or system outputs.

## Story-first workflow
1. **Frame the decision** — Define the audience, decision or action, evidence boundary, and required output before slide design.
2. **Write the governing claim** — State the deck conclusion first, then write one conclusion-oriented headline per slide before drawing.
3. **Build the headline ledger** — For multi-slide decks, verify that headlines form a coherent argument and that peer slides use one consistent split.
4. **Choose intent and archetype** — Select the slide's communication intent first, then select a numbered archetype, then map it to the closest supported semantic layout.
5. **Apply semantic layout and brand grammar** — Use the semantic layout as the rendering contract and the selected Robo brand as the visual grammar.
6. **Measure and verify** — Run structural QA, render the deck, and inspect overflow, collisions, hierarchy, consistency, and evidence traceability.

### Headline rules
- One slide has one governing message.
- Prefer a complete claim with an explicit judgment or implication over a topic label.
- Keep evidence and judgment in the same headline when it remains readable.
- Use sentence-pattern variety across adjacent slides.
- Do not use the headline to count elements; use it to state what the elements mean.
- Move secondary evidence into the body before weakening the claim.

### Storyline rules
- Headlines read alone should reconstruct the core argument.
- Adjacent slides should have an explicit logical bridge such as cause, consequence, contrast, or evidence.
- Sibling slides should share one segmentation logic and comparable granularity.
- Decision decks should identify the questions that require an explicit choice.
- The final decision slide should resolve decisions, owners or timing rather than merely summarize.

### Evidence rules
- Every material number needs a source, a stated calculation basis, or an explicit placeholder.
- Facts, assumptions, estimates, recommendations, and decisions must remain distinguishable.
- Each major clause in a headline should be supported by a visible body element.
- Do not fabricate screenshots, quotes, system output, customer names, or measured results.

## Slide intents
| Intent | Question | Default semantic layouts |
|---|---|---|
| `decide` | What should the audience decide, prioritize, or carry forward? | `cover`, `statement`, `metrics`, `comparison` |
| `decompose` | What creates the total, loss, value, or outcome? | `metrics`, `process`, `architecture` |
| `compare` | How do alternatives differ on a common basis? | `comparison`, `architecture` |
| `change` | What changes while the frame of reference stays stable? | `comparison`, `metrics` |
| `relationship` | Where do entities sit and how are variables or groups related? | `metrics`, `comparison`, `architecture` |
| `time` | How does work, governance, or value move over time? | `process`, `demo`, `architecture` |
| `map` | How is a system, organization, ecosystem, or value chain structured? | `architecture`, `comparison` |

## Archetype registry
Archetypes guide reasoning and composition. They do not replace the renderer contract: `slide.type` remains one of the supported semantic layouts.

| ID | Intent | Archetype | Renderer hints |
|---|---|---|---|
| `01` | `decide` | Section / navigation | `cover`, `statement` |
| `02` | `decide` | Executive decision summary | `statement`, `comparison` |
| `03` | `decide` | Decision close | `statement`, `process` |
| `04` | `decide` | Repeatable catalog | `comparison` |
| `05` | `decide` | KPI timeline | `metrics`, `process` |
| `06` | `decide` | Priority bubble map | `comparison`, `metrics` |
| `07` | `decompose` | Waterfall bridge | `metrics`, `process` |
| `08` | `decompose` | Funnel loss | `process`, `metrics` |
| `09` | `decompose` | Value-chain economics | `process`, `architecture` |
| `10` | `decompose` | Distribution cascade | `process`, `metrics` |
| `11` | `decompose` | Logic tree | `architecture` |
| `12` | `decompose` | Formula driver tree | `architecture`, `metrics` |
| `13` | `decompose` | Active vs waiting band | `metrics`, `comparison` |
| `46` | `decompose` | Vertical issue tree | `architecture` |
| `14` | `compare` | Aligned small multiples | `comparison`, `metrics` |
| `15` | `compare` | Shared-process comparison | `comparison`, `process` |
| `16` | `compare` | Common-scale structure | `comparison` |
| `17` | `compare` | Mirrored flow | `comparison`, `process` |
| `18` | `compare` | Mirrored organization | `comparison`, `architecture` |
| `19` | `compare` | Risk footprint map | `comparison`, `metrics` |
| `45` | `compare` | Evidence-to-implication table | `comparison`, `statement` |
| `20` | `change` | Anchored before / after | `comparison` |
| `21` | `change` | Area recomposition | `comparison`, `metrics` |
| `22` | `change` | Assumption shift table | `comparison`, `statement` |
| `23` | `relationship` | Area-efficiency map | `metrics`, `comparison` |
| `24` | `relationship` | Quantitative area grid | `metrics`, `comparison` |
| `25` | `relationship` | Trajectory scatter | `metrics` |
| `26` | `relationship` | Cycle scatter | `metrics` |
| `27` | `relationship` | Reference-line scatter | `metrics` |
| `28` | `relationship` | Scatter small multiples + table | `metrics`, `comparison` |
| `29` | `relationship` | Interval scatter | `metrics` |
| `30` | `relationship` | Overlap / Venn | `architecture`, `comparison` |
| `31` | `relationship` | Actual-to-forecast stacked area | `metrics` |
| `32` | `relationship` | Decision 2x2 | `comparison` |
| `33` | `relationship` | Lifecycle + policy | `process`, `comparison` |
| `34` | `relationship` | Complementary fit | `comparison`, `architecture` |
| `35` | `time` | Horizon swimlanes | `process` |
| `36` | `time` | Modular plan | `process` |
| `37` | `time` | Phase plan | `process` |
| `38` | `time` | Dual-level plan | `process`, `architecture` |
| `39` | `time` | Governance handoffs | `process`, `architecture` |
| `40` | `time` | Value / cash crossing | `process`, `architecture` |
| `47` | `time` | Role swimlane flow | `process`, `demo` |
| `41` | `map` | Layered ecosystem map | `architecture` |
| `42` | `map` | Value-chain coverage map | `architecture`, `process` |
| `43` | `map` | Organization classification map | `architecture` |
| `44` | `map` | Overview + detail zoom | `architecture`, `comparison` |
| `48` | `map` | Stakeholder network | `architecture` |

## Brand selection
| Brand | Essence | Tension | Signature motif |
|---|---|---|---|
| `robo-coop` | A cooperative operating system where people and machines expand human agency together. | Human warmth × machine precision | `dual-sync` |
| `robo-lab` | An applied systems lab where emerging technology becomes real-world infrastructure and systemic change. | Experimental frontier × production discipline | `system-grid` |
| `coop-lab` | A venture and ownership lab for building companies, governance, and value distribution differently. | Constructive rebellion × credible venture building | `collective-blocks` |
| `robo-university` | A continuous learning system that helps people explore emerging tools, build agency, and keep updating. | Exploration × progression | `learning-path` |

A deck's `meta.brand` must match the selected variant's brand. Do not use one brand's visual grammar as a generic skin for another brand.

## Workflow for generation
1. Define audience, decision, evidence, and output.
2. Choose the correct Robo brand from deck ownership and purpose.
3. Write the governing claim and headline ledger before drawing.
4. For each slide, choose intent → archetype → semantic layout, in that order.
5. Fill only the fields supported by the selected semantic layout.
6. Choose that brand's Core or Expressive variant deliberately.
7. Run structural QA before PPTX generation.
8. Render PPTX to PDF/PNG and run visual grading before delivery.

## Brand-owned variants
| Variant | Brand | Mode | Scheme | Best fit |
|---|---|---|---|---|
| `robo-coop-core` | `robo-coop` | core | light | Corporate, governance, partner, investor, consortium, and organization-wide communication. |
| `robo-coop-dark` | `robo-coop` | expressive | dark | Keynotes, operating-system narratives, human-machine cooperation, and high-contrast event decks. |
| `robo-lab-core` | `robo-lab` | core | dark | AI systems, product architecture, automation, technical strategy, prototypes, and client demos. |
| `robo-lab-cyber` | `robo-lab` | expressive | dark | Flagship AI demos, agent systems, experimental launches, technical keynotes, and future-facing product narratives. |
| `coop-lab-core` | `coop-lab` | core | light | Venture building, entrepreneurship programs, ecosystem partnerships, funding, and cooperative business models. |
| `coop-lab-hack` | `coop-lab` | expressive | dark | Manifestos, startup events, new ownership concepts, experimental venture launches, and provocative strategy. |
| `robo-university-core` | `robo-university` | core | light | Training, curriculum, cohort learning, capability building, learning outcomes, and education partnerships. |
| `robo-university-explore` | `robo-university` | expressive | dark | Learning launches, explorative workshops, future-skills narratives, community learning, and experimental education. |

## Brand grammar
### Robo Co-op
**Tagline:** Support Together — Human⇄Machine Cooperative OS
**Essence:** A cooperative operating system where people and machines expand human agency together.
**Use:** paired rails, sync points, human/machine handoff, black-and-white foundation, cyan signal with amber human accent.
**Principles:** Lead with clarity, dignity, and trust. Use paired or mirrored structures to express cooperation. Use Sync Cyan for connection and Coop Amber sparingly for human agency, care, or decision points. Prefer calm, rigorous composition over futuristic spectacle.
**Avoid:** generic AI neon, robot clip-art, cold enterprise blue everywhere, decorative circuit boards.

### Robo Lab
**Tagline:** Work Together — Pioneering Systemic Lab
**Essence:** An applied systems lab where emerging technology becomes real-world infrastructure and systemic change.
**Use:** system grid, trace lines, module IDs, status notation, blue/cyan signal, measured cyberpunk energy.
**Principles:** Make system structure visible. Use technical notation only when it carries meaning. Core mode is precise and restrained; Cyber mode adds scan, trace, glow-like contrast, and sharper system framing. Cyberpunk is a spice, not a costume: no gratuitous neon or fictional code.
**Avoid:** Kakao imitation, generic hacker green, neon overload, fake terminal text, sci-fi decoration without system meaning.

### Co-op Lab
**Tagline:** Startup Together — Cooperative Entrepreneurship Lab
**Essence:** A venture and ownership lab for building companies, governance, and value distribution differently.
**Use:** offset blocks, shared ownership tiles, manifesto labels, coral/red field, creative purple counterpoint.
**Principles:** Feel entrepreneurial, collective, and slightly insurgent. Use overlap and offset to show shared ownership and distributed power. Core mode stays partner-ready; Hack mode can be more editorial, brutalist, and manifesto-like. Keep the energy sharp without sacrificing readability.
**Avoid:** generic startup gradient, cute community illustrations, corporate-red monotony, chaotic zine styling that obscures the message.

### Robo University
**Tagline:** Learn Together — Explorative Digital Education
**Essence:** A continuous learning system that helps people explore emerging tools, build agency, and keep updating.
**Use:** learning paths, checkpoints, module maps, version/progress notation, lime signal, purple discovery accent, gold achievement cue.
**Principles:** Make progress visible without making learning feel linear or school-like. Use paths, checkpoints, and branching modules as the visual grammar. Fresh Lime is the active learning signal; Energy Purple marks exploration; Achieve Gold marks milestones. Keep the tone optimistic, capable, and exploratory.
**Avoid:** school chalkboard clichés, childish gamification, green-on-white accessibility failures, dense academic-document styling.

## Layouts
| Layout | Question | Best for | Required fields |
|---|---|---|---|
| `cover` | What is this presentation about? | deck opener; major standalone presentation | title |
| `statement` | What is the single idea the audience should remember? | thesis; insight; transition; executive conclusion | title, body |
| `metrics` | What changed numerically or operationally? | KPIs; outcomes; before/after measures; operating scorecard | title, metrics |
| `comparison` | How do the options differ? | options; before/after; maturity stages; vendor or approach comparison | title, columns |
| `process` | How does the work move from start to finish? | workflow; implementation; operating model; roadmap with ordered stages | title, steps |
| `architecture` | What connects to what? | system architecture; agent workflow; data flow; operating stack | title, layers |
| `demo` | What should the audience notice during the demo? | AI demo; agent run; automation walkthrough; product flow | title, steps, screen |

## Components
| Component | Purpose | Constraints |
|---|---|---|
| `code-header` | Machine-readable section context. | Small and subordinate to the title. Never use as the main title. |
| `metric-card` | One metric plus a short interpretation. | Value dominates. One sentence of interpretation maximum. |
| `terminal-window` | Show real agent, API, prompt, command, or system activity. | Never invent decorative code. Highlight at most one line. |
| `system-node` | Represent a human, agent, service, data source, or system in a flow. | Keep labels short. Relationships must be explicit. |
| `evidence-strip` | Show source, assumption, status, or evidence metadata at low visual weight. | Never fabricate evidence metadata. Keep below the main reading hierarchy. |

## Non-negotiable QA
- A PPTX that opens is not automatically a good deck.
- Fail on missing required fields, unsupported layouts, or brand/variant mismatch.
- When intent/archetype metadata is present, validate it against the archetype registry.
- Warn on generic titles, duplicate titles, excess density, repeated layout monotony, and deprecated aliases.
- Verify the headline ledger as an argument, not just slide-by-slide correctness.
- Render every active layout × variant combination to PNG in CI.
- Fail visual grading on broken dimensions, near-blank renders, missing expected slides, or regression drift beyond the accepted threshold.
- Keep evidence metadata truthful and explicit.

## Commands
```bash
npm run slides:contracts:check
npm run slides:qa
npm run slides:gallery
npm run slides:visual
```
