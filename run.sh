#!/usr/bin/bash

set -e

function run {
  DIR=$1
  NAME=$2
  shift
  shift

  echo "Running '$DIR/$NAME.dart' benchmark compiled via dart2wasm (args: $@)"
  tools/run_wasm --d8 "$DIR-out/$NAME.dart2wasm.wasm" "$@"
  echo ""
  echo "Running '$DIR/$NAME.dart' benchmark compiled via dart2js (args: $@)"
  tools/run_js --d8 "$DIR-out/$NAME.dart2js.js" "$@"
  echo ""
  echo ""
}

for dir in $(echo benchmarks micro-benchmarks interop-benchmarks); do
  for file in $dir/*.dart; do
    ARGS_EQUALS="$(cat $file | grep "^// ARGS=" || true)"
    ARGS=()
    if [[ "$file" == *"flute"* ]]; then
      ARGS+=("$(date +%s.%N)")
    fi
    if [ -n "$ARGS_EQUALS" ]; then
      ARGS+=("$PWD/${ARGS_EQUALS#// ARGS=}")
    fi
    if [[ $file != *"_helper.dart" ]]; then
      DART_FILE="$(basename "$file")"
      NAME="${DART_FILE%.dart}"
      run "$dir" "$NAME" "${ARGS[@]}"
    fi
  done
done
