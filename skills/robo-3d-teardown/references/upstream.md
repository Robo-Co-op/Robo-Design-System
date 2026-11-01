# Upstream provenance and safe setup

- Project: [elvarofficial/teardown](https://github.com/elvarofficial/teardown)
- Reviewed: 2026-11-01
- Reviewed upstream HEAD: `a91262ac1109051e014662d42ecb0b7bc1f113b1`
- License: MIT (`LICENSE` names elvarofficial and whaleyxbt). Sample audio attribution is documented upstream in `sfx/samples/SOURCES.md` and listed as CC0. When copying any upstream code, retain its license and copyright notices.
- Runtime at review: Three.js `0.186.1`, Playwright `1.58.2`, Node package `teardown` version `1.0.0`. These are **reviewed** dependency declarations, not approval of future releases.
- Source is a third-party Claude Code Skill, not an official Robo component or a dependency of `@robo-coop/design-system`.

## Optional installation in an authorized development environment

Review `SKILL.md`, `package.json`, `package-lock.json`, and install hooks before execution. Once approved, follow upstream instructions in a separate project directory, preferably pinned to a reviewed source commit. As documented by upstream:

```bash
npx skills add https://github.com/elvarofficial/teardown --skill teardown
# In the installed skill directory, after review:
npm install
npx playwright install chromium
```

The `npx` command above fetches and executes external code; do **not** run it automatically in a client environment. Record exact installed revision, hash and third-party dependency versions. Building the 3D HTML and recording video are separate steps; the latter also needs ffmpeg and Python.

## What was imported into Robo Design System

A Robo-developed interactive slider-crank example (`demo/`), reference-independent mechanical tests, a pinned-upstream build script and a Playwright browser QA workflow were added. The example **uses** upstream's `teardown-kit/runtime.js` and pinned bundler during build, but does not vendor them.

Only the *workflow concepts* were adapted: reference-first geometry, single-driver model, inspectable parts, linked gauges, frame-by-frame visual QA, live/film consistency. No upstream source, example mesh, JavaScript package, audio, generated 3D file or trademark was vendored into the Robo repository. Generated offline HTML embeds third-party runtime code and includes its MIT notice.

## Accuracy, safety and licensing constraints

- One image is insufficient to verify occluded components, internal linkage, material properties or tolerances. Label inferred details as illustrative.
- Validate safety-critical mechanisms with engineering documentation before making claims about safe operation.
- Do not assume a standalone HTML will be under 1 MB or run smoothly on low-powered devices; measure output.
- Treat photos and drawings as licensed inputs and confirm usage rights before publishing derived examples.
- Keep source credit in published documentation when using the external tool; retain the MIT notice if bundling its code.
