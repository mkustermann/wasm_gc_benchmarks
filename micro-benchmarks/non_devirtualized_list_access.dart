// Copyright (c) 2024, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'dart:convert';

import 'package:benchmark_harness/benchmark_harness.dart';

final List<double> arrayOfNumbers = [
  for (int i = 0; i < 1000; ++i) i + 0.5,
];
final double arrayOfNumbersSum = arrayOfNumbers.fold(0.0, (a, b) => a + b);
final String encoded = json.encode(arrayOfNumbers);

class NonDevirtualizedListBenchmark<K> extends BenchmarkBase {
  final List<dynamic> array;

  NonDevirtualizedListBenchmark(this.array) : super('NonDevirtualizedList');

  @override
  void run() {
    double sum = 0.0;
    for (int i = 0; i < array.length; ++i) {
      sum += array[i] as double;
    }
    if (sum != arrayOfNumbersSum) {
      print('$sum vs $arrayOfNumbersSum');
    }
  }
}

void main() {
  // The Dart compiler doesn't know at compile-time which concrete list class
  // this is going to be. So the array/list accesses inside
  // [NonDevirtualizedListBenchmark] use `indirect_call`.
  //
  // Though at runtime it happens to be always the same list class, so a JIT
  // compiler should see that and speculatively inline the list accesses.
  final List<dynamic> jsonDecodedNumbers = json.decode(encoded);

  // This benchmark is measuring time to access numbers from a json array (e.g.
  // the Dart DevTools app gets JSON data from websocket and looks at them).
  NonDevirtualizedListBenchmark(jsonDecodedNumbers).report();
}
