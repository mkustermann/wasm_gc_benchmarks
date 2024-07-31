#!/usr/bin/bash
set -e

source tools/_utils.sh

# Re-compile performance benchmarks with (possibly) new wasm-opt
#
# NOTICE: We compile with -g to keep symbols (as performance benchmarks have
# symbols for profiling)
for dir in $(echo benchmarks micro-benchmarks interop-benchmarks); do
  for file in $dir-out/*.unopt.wasm; do
    optimize "$file" "${file%.unopt.wasm}.wasm" -g
  done
done
