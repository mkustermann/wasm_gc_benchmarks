// Copyright (c) 2024, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// ARGS=data/devtools_cpu_samples.json.gz

import 'dart:js_interop';
import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive_io.dart';
import 'package:benchmark_harness/benchmark_harness.dart';

import 'parse_cpu_samples_helper.dart';

// Runs a series of benchmarks that correspond to something in real live: Dart
// DevTools app obtaining messages from a WebSocket. The messages are json
// data structures.
void main(List<String> args) {
  if (args.length != 1) {
    throw 'One commandline argument required (namely the json file to parse), '
        'got: [${args.join(', ')}])';
  }
  final filename = args.single;
  final JSUint8Array jsBytes = Uint8List.fromList(GZipDecoder()
          .decodeBytes(readFileContentsAsBytes(filename.toJS).toDart))
      .toJS;
  final JSString jsString = (utf8.decode(jsBytes.toDart).toJS);

  // Option a) Performance if we keep data in JavaScript and operate on the
  // json-decoded JavaScript data structures.
  ParseCpuSamplesFromBrowserStringViaBrowserJson(jsString).report();

  // Option b) Performance if we keep data as JS string in JavaScript and use
  // Dart's json decoder.
  ParseCpuSamplesFromBrowserString(confuseCompiler(jsString.toDart, ''))
      .report();

  // Option c) Performance if we keep data as bytes in JavaScript and use
  // Dart's utf-8 decoder & json decoder.
  ParseCpuSamplesFromBrowserBytes(
          confuseCompiler(jsBytes.toDart, Uint8List(10)))
      .report();

  // Option d) Performance if data is in Dart already in the form of bytes and
  // we use Dart's utf-8 decoder & json decoder.
  ParseCpuSamplesFromDartBytes(
          confuseCompiler(Uint8List.fromList(jsBytes.toDart), Uint8List(10)))
      .report();

  // Option e) Performance if we had the string in Dart and used Dart's json decoder.
  // NOTE: We use string interpolation which will trick us to copy JS string over to
  // Dart string.
  ParseCpuSamplesFromDartString(
          confuseCompiler('a${jsString.toDart}'.substring(1), ''))
      .report();
}

abstract class Benchmark extends BenchmarkBase {
  Benchmark(super.name);

  @override
  void exercise() {
    // To avoid using the super class's implementation which runs for 10
    // iterations thereby making the measured time off by 10x.
    run();
  }
}

class ParseCpuSamplesFromBrowserStringViaBrowserJson extends Benchmark {
  final JSString jsonString;

  ParseCpuSamplesFromBrowserStringViaBrowserJson(this.jsonString)
      : super('ParseCpuSamples.FromBrowserStringViaBrowserJson');

  @override
  void run() {
    final tree = parseJson(jsonString) as JsonMap;
    final result = tree[kResult]!.asMap;

    // Read functions
    final functions = result[kFunctions]!.asList;
    final functionCount = functions.length;
    final dartFunctions = <DartFunction>[];
    for (int i = 0; i < functionCount; ++i) {
      final entry = functions[i].asMap;
      final function = entry[kFunction]!.asMap;
      final resolvedUri = entry[kResolvedUrl]!.asString.value;
      final kind = function[kKind]!.asString.value;
      final name = function[kName]!.asString.value;
      dartFunctions.add(DartFunction(kind, resolvedUri, name));
    }

    // Read codes
    final codes = result[kCodes]!.asList;
    final codeCount = codes.length;
    final dartCodes = <DartCode>[];
    for (int i = 0; i < codeCount; ++i) {
      final code = codes[i].asMap[kCode]!.asMap;
      dartCodes.add(DartCode(code[kName]!.asString.value));
    }

    // Read CPU samples
    final samples = result[kSamples]!.asList;
    final sampleCount = samples.length;
    final dartStacks = <Stack>[];
    for (int i = 0; i < sampleCount; ++i) {
      final sample = samples[i]!.asMap;
      final stack = sample[kStack]!.asList;
      final stackCount = stack.length;
      final dartFrames = <DartFunction>[];
      for (int j = 0; j < stackCount; ++j) {
        final function = dartFunctions[stack[j].asNum.toInt];
        dartFrames.add(function);
      }

      final cstack = sample[kCodeStack]!.asList;
      final cstackCount = cstack.length;
      final codeFrames = <DartCode>[];
      for (int j = 0; j < cstackCount; ++j) {
        final code = dartCodes[cstack[j].asNum.toInt];
        codeFrames.add(code);
      }

      final tid = sample[kTid]!.asNum.toInt;
      final timestamp = sample[kTimestamp]!.asNum.toInt;

      dartStacks.add(Stack(tid, timestamp, dartFrames, codeFrames));
    }

    useDartStacks(dartStacks);
  }
}

class ParseCpuSamplesFromBrowserString extends Benchmark {
  final String jsonString;

  ParseCpuSamplesFromBrowserString(this.jsonString)
      : super('ParseCpuSamples.FromBrowserString');

  @override
  void run() {
    final tree = json.decode(jsonString) as Map;
    final result = tree['result'] as Map;

    // Read functions
    final functions = result['functions'] as List;
    final functionCount = functions.length;
    final dartFunctions = <DartFunction>[];
    for (int i = 0; i < functionCount; ++i) {
      final entry = functions[i] as Map;
      final function = entry['function'] as Map;
      final resolvedUri = entry['resolvedUrl'] as String;
      final kind = function['_kind'] as String;
      final name = function['name'] as String;
      dartFunctions.add(DartFunction(kind, resolvedUri, name));
    }

    // Read codes
    final codes = result['_codes'] as List;
    final codeCount = codes.length;
    final dartCodes = <DartCode>[];
    for (int i = 0; i < codeCount; ++i) {
      final code = (codes[i] as Map)['code'] as Map;
      dartCodes.add(DartCode(code['name'] as String));
    }

    // Read CPU samples
    final samples = result['samples'] as List;
    final sampleCount = samples.length;
    final dartStacks = <Stack>[];
    for (int i = 0; i < sampleCount; ++i) {
      final sample = samples[i] as Map;
      final stack = sample['stack'] as List;
      final stackCount = stack.length;
      final dartFrames = <DartFunction>[];
      for (int j = 0; j < stackCount; ++j) {
        final function = dartFunctions[stack[j] as int];
        dartFrames.add(function);
      }

      final cstack = sample['_codeStack'] as List;
      final cstackCount = cstack.length;
      final codeFrames = <DartCode>[];
      for (int j = 0; j < cstackCount; ++j) {
        final code = dartCodes[cstack[j] as int];
        codeFrames.add(code);
      }

      final tid = sample['tid'] as int;
      final timestamp = sample['timestamp'] as int;

      dartStacks.add(Stack(tid, timestamp, dartFrames, codeFrames));
    }

    useDartStacks(dartStacks);
  }
}

class ParseCpuSamplesFromDartString extends Benchmark {
  final String jsonString;

  ParseCpuSamplesFromDartString(this.jsonString)
      : super('ParseCpuSamples.FromDartString');

  @override
  void run() {
    final tree = json.decode(jsonString) as Map;
    final result = tree['result'] as Map;

    // Read functions
    final functions = result['functions'] as List;
    final functionCount = functions.length;
    final dartFunctions = <DartFunction>[];
    for (int i = 0; i < functionCount; ++i) {
      final entry = functions[i] as Map;
      final function = entry['function'] as Map;
      final resolvedUri = entry['resolvedUrl'] as String;
      final kind = function['_kind'] as String;
      final name = function['name'] as String;
      dartFunctions.add(DartFunction(kind, resolvedUri, name));
    }

    // Read codes
    final codes = result['_codes'] as List;
    final codeCount = codes.length;
    final dartCodes = <DartCode>[];
    for (int i = 0; i < codeCount; ++i) {
      final code = (codes[i] as Map)['code'] as Map;
      dartCodes.add(DartCode(code['name'] as String));
    }

    // Read CPU samples
    final samples = result['samples'] as List;
    final sampleCount = samples.length;
    final dartStacks = <Stack>[];
    for (int i = 0; i < sampleCount; ++i) {
      final sample = samples[i] as Map;
      final stack = sample['stack'] as List;
      final stackCount = stack.length;
      final dartFrames = <DartFunction>[];
      for (int j = 0; j < stackCount; ++j) {
        final function = dartFunctions[stack[j] as int];
        dartFrames.add(function);
      }

      final cstack = sample['_codeStack'] as List;
      final cstackCount = cstack.length;
      final codeFrames = <DartCode>[];
      for (int j = 0; j < cstackCount; ++j) {
        final code = dartCodes[cstack[j] as int];
        codeFrames.add(code);
      }

      final tid = sample['tid'] as int;
      final timestamp = sample['timestamp'] as int;

      dartStacks.add(Stack(tid, timestamp, dartFrames, codeFrames));
    }

    useDartStacks(dartStacks);
  }
}

abstract class ParseCpuSamplesFromBytesBase extends Benchmark {
  final Uint8List bytes;

  ParseCpuSamplesFromBytesBase(this.bytes, String name) : super(name);

  @override
  void run() {
    final tree = json.fuse(utf8).decode(bytes) as Map;
    final result = tree['result'] as Map;

    // Read functions
    final functions = result['functions'] as List;
    final functionCount = functions.length;
    final dartFunctions = <DartFunction>[];
    for (int i = 0; i < functionCount; ++i) {
      final entry = functions[i] as Map;
      final function = entry['function'] as Map;
      final resolvedUri = entry['resolvedUrl'] as String;
      final kind = function['_kind'] as String;
      final name = function['name'] as String;
      dartFunctions.add(DartFunction(kind, resolvedUri, name));
    }

    // Read codes
    final codes = result['_codes'] as List;
    final codeCount = codes.length;
    final dartCodes = <DartCode>[];
    for (int i = 0; i < codeCount; ++i) {
      final code = (codes[i] as Map)['code'] as Map;
      dartCodes.add(DartCode(code['name'] as String));
    }

    // Read CPU samples
    final samples = result['samples'] as List;
    final sampleCount = samples.length;
    final dartStacks = <Stack>[];
    for (int i = 0; i < sampleCount; ++i) {
      final sample = samples[i] as Map;
      final stack = sample['stack'] as List;
      final stackCount = stack.length;
      final dartFrames = <DartFunction>[];
      for (int j = 0; j < stackCount; ++j) {
        final function = dartFunctions[stack[j] as int];
        dartFrames.add(function);
      }

      final cstack = sample['_codeStack'] as List;
      final cstackCount = cstack.length;
      final codeFrames = <DartCode>[];
      for (int j = 0; j < cstackCount; ++j) {
        final code = dartCodes[cstack[j] as int];
        codeFrames.add(code);
      }

      final tid = sample['tid'] as int;
      final timestamp = sample['timestamp'] as int;

      dartStacks.add(Stack(tid, timestamp, dartFrames, codeFrames));
    }

    useDartStacks(dartStacks);
  }
}

void useDartStacks(List<Stack> stacks) {
  if (kFalse) {
    int maxTid = -1;
    int maxTimestamp = -1;
    final fstats = <DartFunction, int>{};
    final cstats = <DartCode, int>{};
    for (final stack in stacks) {
      final function = stack.dartFrames.first;
      fstats[function] = (fstats[function] ?? 0) + 1;
      final code = stack.codeFrames.first;
      cstats[code] = (cstats[code] ?? 0) + 1;
      maxTid = maxTid < stack.tid ? stack.tid : maxTid;
      maxTimestamp =
          maxTimestamp < stack.timestamp ? stack.timestamp : maxTimestamp;
    }

    final topFunctions = fstats.keys.toList();
    topFunctions.sort((a, b) => -fstats[a]!.compareTo(fstats[b]!));
    for (final function in topFunctions.take(10)) {
      print('${function}: ${fstats[function]}');
    }
    final topCodes = fstats.keys.toList();
    topCodes.sort((a, b) => -fstats[a]!.compareTo(fstats[b]!));
    for (final code in topCodes.take(10)) {
      print('${code}: ${cstats[code]}');
    }
    print('maxTid: $maxTid');
    print('maxTimestamp: $maxTimestamp');
  }
}

class ParseCpuSamplesFromBrowserBytes extends ParseCpuSamplesFromBytesBase {
  ParseCpuSamplesFromBrowserBytes(Uint8List bytes)
      : super(bytes, 'ParseCpuSamples.FromBrowserBytes');
}

class ParseCpuSamplesFromDartBytes extends ParseCpuSamplesFromBytesBase {
  ParseCpuSamplesFromDartBytes(Uint8List bytes)
      : super(bytes, 'ParseCpuSamples.FromDartBytes');
}

class Stack {
  final int tid;
  final int timestamp;
  final List<DartFunction> dartFrames;
  final List<DartCode> codeFrames;

  Stack(this.tid, this.timestamp, this.dartFrames, this.codeFrames);

  String toString() => 'Stack($tid, $timestamp)';
}

class DartFunction {
  final String kind;
  final String resolvedUri;
  final String name;
  DartFunction(this.kind, this.resolvedUri, this.name);

  String toString() => 'DartFunction($kind, $resolvedUri, $name)';
}

class DartCode {
  final String name;
  DartCode(this.name);

  String toString() => 'DartCode($name)';
}

T confuseCompiler<T>(T a, T b) => kTrue ? a : b;

// We cache those, which is beneficial for dart2wasm but not for dart2js atm.
// See
//   - https://dartbug.com/56045
//   - https://dartbug.com/56046
// to make this unnecesary & fast in both dart2js & dart2wasm.
final JSString kResult = 'result'.toJS;
final JSString kSamples = 'samples'.toJS;
final JSString kStack = 'stack'.toJS;
final JSString kCodeStack = '_codeStack'.toJS;
final JSString kFunctions = 'functions'.toJS;
final JSString kFunction = 'function'.toJS;
final JSString kCodes = '_codes'.toJS;
final JSString kCode = 'code'.toJS;
final JSString kName = 'name'.toJS;
final JSString kTid = 'tid'.toJS;
final JSString kTimestamp = 'timestamp'.toJS;
final JSString kResolvedUrl = 'resolvedUrl'.toJS;
final JSString kKind = '_kind'.toJS;

@JS()
external JSUint8Array readFileContentsAsBytes(JSString filename);

final kTrue = int.parse('1') == 1;
final kFalse = !kTrue;
