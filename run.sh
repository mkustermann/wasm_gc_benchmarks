#!/usr/bin/bash
set -e

function run {
  echo "Running '$1' benchmark compiled via dart2wasm"
  tools/run_wasm --d8 "micro-benchmarks-out/$1.dart2wasm.wasm"
  echo ""
  echo "Running '$1' benchmark compiled via dart2js"
  tools/run_js --d8 "micro-benchmarks-out/$1.dart2js.js"
}

for file in micro-benchmarks/*.dart; do
  DART_FILE="$(basename "$file")"
  NAME="${DART_FILE%.dart}"
  run "$NAME"
  echo ""
done
