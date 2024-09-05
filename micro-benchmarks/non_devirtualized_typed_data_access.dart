// Copyright (c) 2024, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'dart:typed_data';
import 'dart:js_interop';
import 'dart:math' as math;

import 'package:benchmark_harness/benchmark_harness.dart';
import 'package:vector_math/vector_math.dart';
import 'package:vector_math/vector_math_64.dart' as vector_math_64;
import 'package:vector_math/vector_math_operations.dart';

// These benchmarks are a subset of the benchmarks from the package:vector_math
// package.
//
// We modify the benchmarks slightly
//
//   * confuse the dart2wasm compiler about which typed data implementation is used
//
//   * ensure certain benchmarks store their result in a global sink to avoid -
//     thereby avoiding the runtime to inline everything and make it a NOP
//

class MatrixMultiplyBenchmark extends BenchmarkBase {
  MatrixMultiplyBenchmark() : super('MatrixMultiply');
  final A = identityFloat32ConfuseCompiler(Float32List(16));
  final B = identityFloat32ConfuseCompiler(Float32List(16));
  final C = identityFloat32ConfuseCompiler(Float32List(16));

  static void main() {
    MatrixMultiplyBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 200; i++) {
      Matrix44Operations.multiply(C, 0, A, 0, B, 0);
      globalSink = C;
    }
  }
}

class VectorTransformBenchmark extends BenchmarkBase {
  VectorTransformBenchmark() : super('VectorTransform');
  final A = identityFloat32ConfuseCompiler(Float32List(16));
  final B = identityFloat32ConfuseCompiler(Float32List(4));
  final C = identityFloat32ConfuseCompiler(Float32List(4));

  static void main() {
    VectorTransformBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 200; i++) {
      Matrix44Operations.transform4(C, 0, A, 0, B, 0);
      globalSink = C;
    }
  }
}

class ViewMatrixBenchmark extends BenchmarkBase {
  ViewMatrixBenchmark() : super('setViewMatrix');

  final M = Matrix4.zero();
  final P = Vector3.zero();
  final F = Vector3.zero();
  final U = Vector3.zero();

  static void main() {
    ViewMatrixBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100; i++) {
      setViewMatrix(M, P, F, U);
      globalSink = M;
    }
  }
}

class Aabb2TransformBenchmark extends BenchmarkBase {
  Aabb2TransformBenchmark() : super('aabb2Transform');

  static final M = Matrix3.rotationZ(math.pi / 4);
  static final P1 = Vector2(10.0, 10.0);
  static final P2 = Vector2(20.0, 30.0);
  static final P3 = Vector2(100.0, 50.0);
  static final B1 = Aabb2.minMax(P1, P2);
  static final B2 = Aabb2.minMax(P1, P3);
  static final B3 = Aabb2.minMax(P2, P3);
  static final temp = Aabb2();

  static void main() {
    Aabb2TransformBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100; i++) {
      temp.copyFrom(B1);
      temp.transform(M);
      temp.copyFrom(B2);
      temp.transform(M);
      temp.copyFrom(B3);
      temp.transform(M);
      globalSink = temp;
    }
  }
}

class Aabb2RotateBenchmark extends BenchmarkBase {
  Aabb2RotateBenchmark() : super('aabb2Rotate');

  static final M = Matrix3.rotationZ(math.pi / 4);
  static final P1 = Vector2(10.0, 10.0);
  static final P2 = Vector2(20.0, 30.0);
  static final P3 = Vector2(100.0, 50.0);
  static final B1 = Aabb2.minMax(P1, P2);
  static final B2 = Aabb2.minMax(P1, P3);
  static final B3 = Aabb2.minMax(P2, P3);
  static final temp = Aabb2();

  static void main() {
    Aabb2RotateBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100; i++) {
      temp.copyFrom(B1);
      temp.rotate(M);
      temp.copyFrom(B2);
      temp.rotate(M);
      temp.copyFrom(B3);
      temp.rotate(M);
      globalSink = temp;
    }
  }
}

class Aabb3TransformBenchmark extends BenchmarkBase {
  Aabb3TransformBenchmark() : super('aabb3Transform');

  static final M = Matrix4.rotationZ(math.pi / 4);
  static final P1 = Vector3(10.0, 10.0, 0.0);
  static final P2 = Vector3(20.0, 30.0, 1.0);
  static final P3 = Vector3(100.0, 50.0, 10.0);
  static final B1 = Aabb3.minMax(P1, P2);
  static final B2 = Aabb3.minMax(P1, P3);
  static final B3 = Aabb3.minMax(P2, P3);
  static final temp = Aabb3();

  static void main() {
    Aabb3TransformBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100; i++) {
      temp.copyFrom(B1);
      temp.transform(M);
      temp.copyFrom(B2);
      temp.transform(M);
      temp.copyFrom(B3);
      temp.transform(M);
      globalSink = temp;
    }
  }
}

class Aabb3RotateBenchmark extends BenchmarkBase {
  Aabb3RotateBenchmark() : super('aabb3Rotate');

  static final M = Matrix4.rotationZ(math.pi / 4);
  static final P1 = Vector3(10.0, 10.0, 0.0);
  static final P2 = Vector3(20.0, 30.0, 1.0);
  static final P3 = Vector3(100.0, 50.0, 10.0);
  static final B1 = Aabb3.minMax(P1, P2);
  static final B2 = Aabb3.minMax(P1, P3);
  static final B3 = Aabb3.minMax(P2, P3);
  static final temp = Aabb3();

  static void main() {
    Aabb3RotateBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100; i++) {
      temp.copyFrom(B1);
      temp.rotate(M);
      temp.copyFrom(B2);
      temp.rotate(M);
      temp.copyFrom(B3);
      temp.rotate(M);
      globalSink = temp;
    }
  }
}

class Matrix3TransformVector3Benchmark extends BenchmarkBase {
  Matrix3TransformVector3Benchmark() : super('Matrix3.transform(Vector3)');

  final MX = Matrix3.rotationX(math.pi / 4);
  final MY = Matrix3.rotationY(math.pi / 4);
  final MZ = Matrix3.rotationZ(math.pi / 4);
  final V1 = Vector3(10.0, 20.0, 1.0);
  final V2 = Vector3(-10.0, 20.0, 1.0);
  final V3 = Vector3(10.0, -20.0, 1.0);

  static void main() {
    Matrix3TransformVector3Benchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 800; i++) {
      globalSink = MX.transform(V1);
      globalSink = MX.transform(V2);
      globalSink = MX.transform(V3);
      globalSink = MY.transform(V1);
      globalSink = MY.transform(V2);
      globalSink = MY.transform(V3);
      globalSink = MZ.transform(V1);
      globalSink = MZ.transform(V2);
      globalSink = MZ.transform(V3);
    }
  }
}

class Matrix3TransformVector2Benchmark extends BenchmarkBase {
  Matrix3TransformVector2Benchmark() : super('Matrix3.transform(Vector2)');

  final MX = Matrix3.rotationX(math.pi / 4);
  final MY = Matrix3.rotationY(math.pi / 4);
  final MZ = Matrix3.rotationZ(math.pi / 4);
  final V1 = Vector2(10.0, 20.0);
  final V2 = Vector2(-10.0, 20.0);
  final V3 = Vector2(10.0, -20.0);

  static void main() {
    Matrix3TransformVector2Benchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 800; i++) {
      globalSink = MX.transform2(V1);
      globalSink = MX.transform2(V2);
      globalSink = MX.transform2(V3);
      globalSink = MY.transform2(V1);
      globalSink = MY.transform2(V2);
      globalSink = MY.transform2(V3);
      globalSink = MZ.transform2(V1);
      globalSink = MZ.transform2(V2);
      globalSink = MZ.transform2(V3);
    }
  }
}

class ConstructorBenchmark extends BenchmarkBase {
  ConstructorBenchmark() : super('Vector2()');

  static void main() {
    ConstructorBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100000; i++) {
      globalSink = Vector2(100, 100);
    }
  }
}

class ConstructorZeroBenchmark extends BenchmarkBase {
  ConstructorZeroBenchmark() : super('Vector2.zero()');

  static void main() {
    ConstructorZeroBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100000; i++) {
      globalSink = Vector2.zero();
    }
  }
}

class ConstructorArrayBenchmark extends BenchmarkBase {
  ConstructorArrayBenchmark() : super('Vector2.array()');

  static void main() {
    ConstructorArrayBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0.0; i < 100000; i++) {
      globalSink = Vector2.array([i, i]);
    }
  }
}

class ConstructorAllBenchmark extends BenchmarkBase {
  ConstructorAllBenchmark() : super('Vector2.all()');

  static void main() {
    ConstructorAllBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0.0; i < 100000; i++) {
      globalSink = Vector2.all(i);
    }
  }
}

class ConstructorCopyBenchmark extends BenchmarkBase {
  ConstructorCopyBenchmark() : super('Vector2.copy()');

  static void main() {
    ConstructorCopyBenchmark().report();
  }

  @override
  void run() {
    final copyFrom = Vector2(1, 1);
    for (var i = 0.0; i < 100000; i++) {
      globalSink = Vector2.copy(copyFrom);
    }
  }
}

class ConstructorFromFloat32ListBenchmark extends BenchmarkBase {
  final list = identityFloat32ConfuseCompiler(Float32List.fromList([0.0, 0.0]));
  ConstructorFromFloat32ListBenchmark() : super('Vector2.fromFloat32List()');

  static void main() {
    ConstructorFromFloat32ListBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0.0; i < 100000; i++) {
      globalSink = Vector2.fromFloat32List(list);
    }
  }
}

class ConstructorFromBufferBenchmark extends BenchmarkBase {
  final buffer = identityByteBufferConfuseCompiler(Uint32List(2).buffer);
  ConstructorFromBufferBenchmark() : super('Vector2.fromBuffer()');

  static void main() {
    ConstructorFromBufferBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0.0; i < 100000; i++) {
      globalSink = Vector2.fromBuffer(buffer, 0);
    }
  }
}

class ConstructorRandomBenchmark extends BenchmarkBase {
  final random = math.Random();
  ConstructorRandomBenchmark() : super('Vector2.random()');

  static void main() {
    ConstructorRandomBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0.0; i < 100000; i++) {
      globalSink = Vector2.random(random);
    }
  }
}

class SetFromBenchmark extends BenchmarkBase {
  SetFromBenchmark() : super('Vector2.setFrom()');
  final Vector2 v1 = Vector2(100, 100);
  final Vector2 v2 = Vector2.zero();

  static void main() {
    SetFromBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100000; i++) {
      v2.setFrom(v1);
      globalSink = v2;
    }
  }
}

class DotProductBenchmark extends BenchmarkBase {
  DotProductBenchmark() : super('Vector2.dot()');
  final Vector2 v1 = Vector2(100, 100);
  final Vector2 v2 = Vector2(100, 200);

  static void main() {
    DotProductBenchmark().report();
  }

  @override
  void run() {
    for (var i = 0; i < 100000; i++) {
      globalSink = v1.dot(v2);
    }
  }
}

mixin TweenSetup on BenchmarkBase {
  final beginTransform = vector_math_64.Matrix4.compose(
    vector_math_64.Vector3(1.0, 1.0, 1.0),
    vector_math_64.Quaternion.euler(0.0, 0.0, 0.0),
    vector_math_64.Vector3(1.0, 1.0, 1.0),
  );

  final endTransform = vector_math_64.Matrix4.compose(
    vector_math_64.Vector3(5.0, 260.0, 1.0),
    vector_math_64.Quaternion.euler(0.0, 1.0, -0.7),
    vector_math_64.Vector3(0.6, 0.6, 0.6),
  );

  @override
  void run() {
    var sum_traces = 0.0;
    for (var i = 0; i <= 1024; i++) {
      final t = i / 1024.0;
      final m1 = lerp(beginTransform, endTransform, t);
      final m2 = lerp(endTransform, beginTransform, t);
      sum_traces += m1.trace();
      sum_traces += m2.trace();
    }
    if (sum_traces < 6320 || sum_traces > 6321) {
      throw StateError('Bad result: $sum_traces');
    }
  }

  vector_math_64.Matrix4 lerp(
      vector_math_64.Matrix4 begin, vector_math_64.Matrix4 end, double t);
}

class Matrix4TweenBenchmark1 extends BenchmarkBase with TweenSetup {
  Matrix4TweenBenchmark1() : super('Matrix4TweenBenchmark1');

  @override
  vector_math_64.Matrix4 lerp(
      vector_math_64.Matrix4 begin, vector_math_64.Matrix4 end, double t) {
    final beginTranslation = vector_math_64.Vector3.zero();
    final endTranslation = vector_math_64.Vector3.zero();
    final beginRotation = vector_math_64.Quaternion.identity();
    final endRotation = vector_math_64.Quaternion.identity();
    final beginScale = vector_math_64.Vector3.zero();
    final endScale = vector_math_64.Vector3.zero();
    begin.decompose(beginTranslation, beginRotation, beginScale);
    end.decompose(endTranslation, endRotation, endScale);
    final lerpTranslation = beginTranslation * (1.0 - t) + endTranslation * t;
    final lerpRotation =
        (beginRotation.scaled(1.0 - t) + endRotation.scaled(t)).normalized();
    final lerpScale = beginScale * (1.0 - t) + endScale * t;
    return vector_math_64.Matrix4.compose(
        lerpTranslation, lerpRotation, lerpScale);
  }
}

class Matrix4TweenBenchmark2 extends BenchmarkBase with TweenSetup {
  Matrix4TweenBenchmark2() : super('Matrix4TweenBenchmark2');

  @override
  vector_math_64.Matrix4 lerp(
      vector_math_64.Matrix4 begin, vector_math_64.Matrix4 end, double t) {
    begin.decompose(beginTranslation, beginRotation, beginScale);
    end.decompose(endTranslation, endRotation, endScale);
    vector_math_64.Vector3.mix(
        beginTranslation, endTranslation, t, lerpTranslation);
    final lerpRotation =
        (beginRotation.scaled(1.0 - t) + endRotation.scaled(t)).normalized();
    vector_math_64.Vector3.mix(beginScale, endScale, t, lerpScale);
    return vector_math_64.Matrix4.compose(
        lerpTranslation, lerpRotation, lerpScale);
  }

  // Pre-allocated vectors.
  static final beginTranslation = vector_math_64.Vector3.zero();
  static final endTranslation = vector_math_64.Vector3.zero();
  static final lerpTranslation = vector_math_64.Vector3.zero();
  static final beginRotation = vector_math_64.Quaternion.identity();
  static final endRotation = vector_math_64.Quaternion.identity();
  static final beginScale = vector_math_64.Vector3.zero();
  static final endScale = vector_math_64.Vector3.zero();
  static final lerpScale = vector_math_64.Vector3.zero();
}

class Matrix4TweenBenchmark3 extends BenchmarkBase with TweenSetup {
  Matrix4TweenBenchmark3() : super('Matrix4TweenBenchmark3');

  @override
  vector_math_64.Matrix4 lerp(
      vector_math_64.Matrix4 begin, vector_math_64.Matrix4 end, double t) {
    begin.decompose(beginTranslation, beginRotation, beginScale);
    end.decompose(endTranslation, endRotation, endScale);
    vector_math_64.Vector3.mix(
        beginTranslation, endTranslation, t, lerpTranslation);
    final lerpRotation =
        (beginRotation.scaled(1.0 - t) + endRotation.scaled(t)).normalized();
    vector_math_64.Vector3.mix(beginScale, endScale, t, lerpScale);
    return vector_math_64.Matrix4.compose(
        lerpTranslation, lerpRotation, lerpScale);
  }

  late final beginTranslation = vector_math_64.Vector3.zero();
  late final endTranslation = vector_math_64.Vector3.zero();
  late final lerpTranslation = vector_math_64.Vector3.zero();
  late final beginRotation = vector_math_64.Quaternion.identity();
  late final endRotation = vector_math_64.Quaternion.identity();
  late final beginScale = vector_math_64.Vector3.zero();
  late final endScale = vector_math_64.Vector3.zero();
  late final lerpScale = vector_math_64.Vector3.zero();
}

@JS('Float32Array')
extension type NewFloat32Array._(JSObject _) {
  external NewFloat32Array(JSNumber length);
}

@JS('Float64Array')
extension type NewFloat64Array._(JSObject _) {
  external NewFloat64Array(JSNumber length);
}

void main() {
  confuseCompiler();

  MatrixMultiplyBenchmark.main();
  VectorTransformBenchmark.main();
  ViewMatrixBenchmark.main();
  Aabb2TransformBenchmark.main();
  Aabb2RotateBenchmark.main();
  Aabb3TransformBenchmark.main();
  Aabb3RotateBenchmark.main();
  Matrix3TransformVector3Benchmark.main();
  Matrix3TransformVector2Benchmark.main();

  ConstructorBenchmark.main();
  ConstructorZeroBenchmark.main();
  ConstructorArrayBenchmark.main();
  ConstructorAllBenchmark.main();
  ConstructorCopyBenchmark.main();
  ConstructorFromFloat32ListBenchmark.main();
  ConstructorFromBufferBenchmark.main();
  ConstructorRandomBenchmark.main();
  SetFromBenchmark.main();
  DotProductBenchmark.main();

  Matrix4TweenBenchmark1().report();
  Matrix4TweenBenchmark2().report();
  Matrix4TweenBenchmark3().report();

  if (int.parse('1') == 0) {
    print(globalSink);
  }
}

// Makes dart2wasm compiler unable to devirtualize typed data accesses in other
// places.
//
// This kind of confusion happens very often in large apps (e.g. simply storing
// a typed data into a `Map` and getting it out again will make us loose
// concrete class information)
void confuseCompiler() {
  Matrix4.fromFloat32List(dartViewMatrix4).hashCode;
  Vector2.fromFloat32List(dartViewVector2).hashCode;
  Vector3.fromFloat32List(dartViewVector3).hashCode;
  vector_math_64.Matrix4.fromFloat64List(dartViewF64Matrix4).hashCode;
  vector_math_64.Vector2.fromFloat64List(dartViewF64Vector2).hashCode;
  vector_math_64.Vector3.fromFloat64List(dartViewF64Vector3).hashCode;
}

// Makes dart2wasm compiler unable to devirtualize typed data accesses in other
// places.
//
// This kind of confusion happens very often in large apps (e.g. simply storing
// a typed data into a `Map` and getting it out again will make us loose
// concrete class information)
Float32List identityFloat32ConfuseCompiler(Float32List list) =>
    kTrue ? list : dartViewVector2;

// Makes dart2wasm compiler unable to devirtualize typed data accesses in other
// places.
//
// This kind of confusion happens very often in large apps (e.g. simply storing
// a typed data into a `Map` and getting it out again will make us loose
// concrete class information)
ByteBuffer identityByteBufferConfuseCompiler(ByteBuffer buffer) =>
    kTrue ? buffer : dartViewVector2.buffer;

Object? globalSink;

final bool kTrue = int.parse('1') == 1;
final Float32List dartViewMatrix4 =
    (NewFloat32Array(16.toJS) as JSFloat32Array).toDart;
final Float32List dartViewVector2 =
    (NewFloat32Array(2.toJS) as JSFloat32Array).toDart;
final Float32List dartViewVector3 =
    (NewFloat32Array(3.toJS) as JSFloat32Array).toDart;
final Float64List dartViewF64Matrix4 =
    (NewFloat64Array(16.toJS) as JSFloat64Array).toDart;
final Float64List dartViewF64Vector2 =
    (NewFloat64Array(2.toJS) as JSFloat64Array).toDart;
final Float64List dartViewF64Vector3 =
    (NewFloat64Array(3.toJS) as JSFloat64Array).toDart;
