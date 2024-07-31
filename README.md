# Benchmarks for WasmGC

This repository contains benchmarks for WasmGC based on the Dart2Wasm compiler.

## (Optional) Compling the benchmarks

For ease of use, the repository already contains compiled benchmarks under
`benchmarks-out`. So this step is optional.

To compile the benchmarks, ensure you have the Dart SDK installed (see
[dart.dev](https://dart.dev/get-dart)) and available in `PATH`.

Then you can compile them via
```
% ./compile.sh
```
on a linux machine.

## Running the performance benchmarks

The benchmarks can be run via
```
% ./run.sh
```
on a linux machine.

When changing `third_party/wasm-opt` binary one can re-optimize the performance
benchmarks with the new binaryen via
```
% ./reoptimize.sh
...
% ./run.sh
```

(For ease of use and reproducability, we have checked-in command-line versions
of the JS/Wasm runtime (e.g. D8) in repository under `third_party/*`)

## Running size benchmarks

The size benchmarks can be run via
```
% ./run_size.sh
```
on a linux machine.

(For ease of use and reproducability, we have checked-in
`third_party/wasm-opt` binary)
