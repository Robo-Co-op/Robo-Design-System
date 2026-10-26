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

The gallery covers every semantic layout across every presentation variant. With 7 layouts and 4 variants, CI renders 28 slides.

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

## Regression baseline

The accepted baseline is `grade/baseline.json`. It stores a compact 32×18 grayscale visual fingerprint per rendered slide instead of committing PNG screenshots.

To accept an intentional visual change:

```bash
node grade/visual-grade.mjs grade/rendered grade/baseline.json --update-baseline
```

CI fails when a render:
- is missing
- is not approximately 16:9
- is suspiciously blank / near-uniform
- drifts beyond the accepted visual fingerprint threshold
