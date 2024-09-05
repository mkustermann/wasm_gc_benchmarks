#!/usr/bin/bash

set -e

RUN_WASM=1
RUN_JS=0
SHELL_ARG=--d8
while [ $# -gt 0 ]; do
  case "$1" in
    # Whether to run JS or Wasm benchmarks
    --js)
      RUN_WASM=0
      RUN_JS=1
      shift
      ;;
    --wasm)
      RUN_WASM=1
      RUN_JS=0
      shift
      ;;

    # Which shell to use
    --d8)
      SHELL_ARG=--d8
      shift
      ;;

    --jsc)
      SHELL_ARG=--jsc
      shift
      ;;

    --jsshell)
      SHELL_ARG=--jsshell
      shift
      ;;

    *)
      echo "Ignoring argument $1"
      shift
      ;;
  esac
done

function run {
  DIR=$1
  NAME=$2
  shift
  shift

  if [ $RUN_WASM -eq 1 ]; then
    echo "Running '$DIR/$NAME.dart' benchmark compiled via dart2wasm (args: $@)"
    tools/run_wasm $SHELL_ARG "$DIR-out/$NAME.dart2wasm.wasm" "$@"
    echo ""
  fi
  if [ $RUN_JS -eq 1 ]; then
    echo "Running '$DIR/$NAME.dart' benchmark compiled via dart2js (args: $@)"
    tools/run_js $SHELL_ARG "$DIR-out/$NAME.dart2js.js" "$@"
    echo ""
  fi
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
