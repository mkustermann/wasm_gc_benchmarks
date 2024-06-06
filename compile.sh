#!/usr/bin/bash
set -e


function compile {
  echo "Compiling micro-benchmarks/$1.dart"
  dart compile wasm -O4 --no-strip-wasm -o "micro-benchmarks-out/$1.dart2wasm.wasm" "micro-benchmarks/$1.dart"
  dart compile js -O4 --no-minify -o "micro-benchmarks-out/$1.dart2js.js" "micro-benchmarks/$1.dart"
  echo ""
}

cd micro-benchmarks
dart pub get
cd ..

for file in micro-benchmarks/*.dart; do
  DART_FILE="$(basename "$file")"
  NAME="${DART_FILE%.dart}"
  compile "$NAME"
  echo ""
done
