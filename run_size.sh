#!/usr/bin/bash
set -e

function optimize {
  DIR=$1
  NAME=$2

  INPUT_WASM="$DIR/$NAME.wasm"
  OUTPUT_WASM="$DIR-out/$NAME.opt.wasm"

  # Binaryen flags are from
  #   <dart-sdk>/pkg/dartdev/lib/src/commands/compile.dart:CompileWasmCommand.binaryenFlags
  third_party/wasm-opt \
      --all-features \
      --closed-world \
      --traps-never-happen \
      --type-unfinalizing \
      -Os \
      --type-ssa \
      --gufa \
      -Os \
      --type-merging \
      -Os \
      --type-finalizing \
      -o "$OUTPUT_WASM" \
      "$INPUT_WASM"

  SIZE="$(stat -c%s  "$OUTPUT_WASM")"
  echo "Optimized $INPUT_WASM -> $OUTPUT_WASM: $SIZE bytes"
}

for file in size-benchmarks/*.wasm; do
  DART_FILE="$(basename "$file")"
  NAME="${DART_FILE%.wasm}"
  optimize "size-benchmarks" "$NAME"
done
