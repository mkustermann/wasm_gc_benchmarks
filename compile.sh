#!/usr/bin/bash
set -e


function compile {
  echo "Compiling benchmarks/$1.dart"
  dart compile wasm -O4 --no-strip-wasm -o "benchmarks-out/$1.dart2wasm.wasm" "benchmarks/$1.dart"
  dart compile js -O4 --no-minify -o "benchmarks-out/$1.dart2js.js" "benchmarks/$1.dart"
  echo ""
}

for file in benchmarks/*.dart; do
  DART_FILE="$(basename "$file")"
  NAME="${DART_FILE%.dart}"
  compile "$NAME"
  echo ""
done
