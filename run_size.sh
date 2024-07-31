#!/usr/bin/bash
set -e

source tools/_utils.sh

for file in size-benchmarks/*.wasm; do
  DART_FILE="$(basename "$file")"
  NAME="${DART_FILE%.wasm}"

  optimize  "size-benchmarks/$NAME.wasm" "size-benchmarks-out/$NAME.opt.wasm"
done
