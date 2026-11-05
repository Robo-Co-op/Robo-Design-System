# Visual Grade

The visual grade is the render-and-review loop for the native PowerPoint generator.

## Pipeline

```text
contracts
  ↓
gallery JSON
  ↓
editable PPTX
  ↓ LibreOffice
PDF
  ↓ Poppler
PNG
  ↓
blank / broken / dimensions / visual regression
  ↓
HTML + JSON report
```

The gallery covers every semantic layout across every active presentation variant.
There are now 9 variants and 7 layouts: 63 rendered slides, including 7 for Robo Lab Light.
The original 56 accepted render fingerprints are retained unchanged.

## Run locally

Requires:
- LibreOffice Impress
- Poppler (`pdftoppm`)
- ImageMagick (`identify`, `convert`)
- Roboto + Noto Sans fonts

Then:

```bash
npm install
npm run slides:visual
```

Outputs are generated under `grade/rendered/`, `grade/report.html`, and `grade/report.json`.

## Regression baselines

Accepted fingerprints are stored in two files:

- `grade/baseline.json`: the original eight variants (56 renders).
- `grade/baseline-robo-lab-light.json`: the reviewed Light gallery (7 renders).

`render-gallery.sh` combines them into `grade/rendered/accepted-baseline.json`
before grading. The combiner checks counts, duplicate conflicts, thresholds, and
fingerprint lengths. Each fingerprint represents a 32×18 grayscale image.

This preserves regression checks for the original variants rather than discarding
their baseline because a ninth variant changes the expected count.

CI fails when a render:
- is missing
- is not approximately 16:9
- is suspiciously blank / near-uniform
- drifts beyond the accepted visual fingerprint threshold

## Accept an intentional visual change

Run the gallery and inspect the rendered images and `grade/proposed-baseline.json`.
After review, update only the affected entries in their respective accepted file.
Do not reset unrelated baseline entries or replace them just to make CI pass.
Retain 56 entries in `baseline.json` and 7 in `baseline-robo-lab-light.json` unless
new variants are deliberately added and the coverage contract is updated.

Then rerun `npm run slides:visual` and confirm zero failures and a non-null baseline
in `grade/report.json`. A render pass without a compatible baseline is not a
successful visual regression test.
