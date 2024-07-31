#!/usr/bin/bash
set -e

function compile {
  DIR=$1
  NAME=$2
  echo "Compiling $DIR/$NAME.dart"
  dart compile wasm -O4 --no-strip-wasm -o "$DIR-out/$NAME.dart2wasm.wasm" "$DIR/$NAME.dart"
  dart compile js -O4 --no-minify -o "$DIR-out/$NAME.dart2js.js" "$DIR/$NAME.dart"
  echo ""
}

for dir in $(echo micro-benchmarks interop-benchmarks); do
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
