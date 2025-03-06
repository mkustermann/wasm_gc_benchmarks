#!/usr/bin/bash
set -e

function compile {
  DIR=$1
  NAME=$2
  echo "Compiling $DIR/$NAME.dart"
  # NOTE: Once JSC supports `js-string` builtin we want to enable
  # `--extra-compiler-option=--require-js-string-builtin` here.
  dart compile wasm -O2 --no-strip-wasm -o "$DIR-out/$NAME.dart2wasm.wasm" "$DIR/$NAME.dart"
  dart compile js -O4 --no-minify -o "$DIR-out/$NAME.dart2js.js" "$DIR/$NAME.dart"
  echo ""
}

for dir in $(echo benchmarks micro-benchmarks interop-benchmarks); do
  cd $dir
  dart pub get
  cd ..
  for file in $dir/*.dart; do
    if [[ $file != *"_helper.dart" ]]; then
      DART_FILE="$(basename "$file")"
      NAME="${DART_FILE%.dart}"
      compile $dir "$NAME"
    fi
  done
done
