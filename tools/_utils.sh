set -e

function optimize {
  INPUT_WASM="$1"
  shift
  OUTPUT_WASM="$1"
  shift

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
      $@ -o "$OUTPUT_WASM" "$INPUT_WASM"

  SIZE="$(stat -c%s  "$OUTPUT_WASM")"
  echo "Optimized $INPUT_WASM -> $OUTPUT_WASM: $SIZE bytes"
}
