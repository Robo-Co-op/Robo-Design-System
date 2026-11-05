#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT="${1:-$ROOT/grade/rendered}"
rm -rf "$OUT"
mkdir -p "$OUT"

# Keep the original eight-variant baseline intact. Add the seven reviewed Light
# fingerprints without disabling regression checks when the gallery count grows.
BASELINE="$OUT/accepted-baseline.json"
node grade/combine-baselines.mjs "$BASELINE" \
  "$ROOT/grade/baseline.json" "$ROOT/grade/baseline-robo-lab-light.json"

node generator/build-gallery.mjs

for pptx in generator/output/gallery/*.pptx; do
  name="$(basename "$pptx" .pptx)"
  work="$OUT/$name"
  mkdir -p "$work"

  libreoffice --headless --convert-to pdf --outdir "$work" "$pptx" >/tmp/robo-lo.txt 2>&1 || {
    cat /tmp/robo-lo.txt
    exit 1
  }

  pdf="$work/$name.pdf"
  test -s "$pdf"
  pdftoppm -png -r 96 "$pdf" "$work/slide" >/dev/null 2>&1
done

node grade/visual-grade.mjs "$OUT" "$BASELINE"
