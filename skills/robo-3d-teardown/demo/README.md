# Robo 3D Teardown — Interactive slider-crank demonstration

A **real offline Three.js HTML** built through the MIT-licensed upstream [elvarofficial/teardown](https://github.com/elvarofficial/teardown) build/runtime, pinned to `a91262ac1109051e014662d42ecb0b7bc1f113b1`. The source and its physical model live in this repository. The upstream engine is fetched to a temporary directory for an authorized build; no unreviewed install script runs on the app itself.

## Why this sample

This intentionally illustrative slider-crank mechanism demonstrates synchronized part geometry, piston displacement readouts, selected-parts highlighting, cutaway, exploded state, camera orbit and mobile controls. It is **not** a measured product or manufacturing specification.

Illustrative constants: 18 mm crank radius, 57 mm rod length, 28 mm piston diameter, 36 mm nominal stroke. Both animation and gauges call `pose(angle)` from `model.js`.

## Build

From the repository root, with Node 24 or newer:

```bash
npm install
npm run tokens
git clone https://github.com/elvarofficial/teardown.git /tmp/robo-teardown
git -C /tmp/robo-teardown checkout a91262ac1109051e014662d42ecb0b7bc1f113b1
(cd /tmp/robo-teardown && npm ci --ignore-scripts)
TEARDOWN_DIR=/tmp/robo-teardown npm run 3d:build
```

Open `build/3d/dist/robo-slider-crank.html` directly (no web server necessary). The generator bundles Three.js and the upstream runtime into the single HTML file, adds a real Robo Lab logo and retains the MIT notice.

`npm run 3d:test` checks the pure mechanism and theme bridge. For browser QA, install Playwright Chromium in the upstream directory, then run `TEARDOWN_DIR=/tmp/robo-teardown npm run 3d:qa`. CI automates all steps and uploads the HTML plus desktop/mobile screenshots.

## Source boundaries

- `model.js`: deterministic motion with mm constants; no Three.js dependency.
- `main.js`: scene, UI, interaction, the upstream `runSim()` runtime hook.
- `style.css`: controls, responsive layout, brand semantic variables.
- `../scripts/build-demo.mjs`: export canonical tokens, build through pinned external kit, embed real logo + license.
- `../scripts/qa-demo.mjs`: browser interaction, WebGL and responsive smoke tests.

The 3D material values and lighting are illustrative, not a simulation of a real material or tolerances. The upstream generator is an optional tool used to produce the build; this repository stays useful without its executable dependencies.
