// Copyright (c) 2024, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// This is mostly based on https://github.com/lrhn/jsjson

import 'dart:js_interop';
import 'dart:js_interop_unsafe';

final JSString _jsLengthString = 'length'.toJS;

JsonAny parseJson(JSString jsonSource) {
  return JsonAny._(_jsonParse(jsonSource)!);
}

extension type JsonAny._(JSAny _) {
  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  JsonString get asString => _ as JsonString;

  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  JsonNum get asNum => _ as JsonNum;

  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  JsonBool get asBool => _ as JsonBool;

  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  JsonList get asList => _ as JsonList;

  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  JsonMap get asMap => _ as JsonMap;
}

extension type const JsonString._(JSString _) {
  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  String get value => _.toDart;
}

extension type const JsonBool._(JSBoolean _) {
  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  bool get value => _.toDart;
}

extension type const JsonNum._(JSNumber _) {
  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  int get toInt => _.toDartInt;

  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  double get toDouble => _.toDartDouble;
}

extension type const JsonList._(JSArray<JSAny?> _) {
  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  int get length => _.length;

  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  JsonAny operator [](int index) {
    return JsonAny._(_[index]!);
  }
}

extension type const JsonMap._(JSObject _) {
  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  JsonAny? operator [](JSString key) {
    return _.getProperty<JSAny?>(key) as JsonAny?;
  }
}

extension<T extends JSAny?> on JSArray<T> {
  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  int get length => getProperty<JSNumber>(_jsLengthString).toDartInt;

  @pragma('wasm:prefer-inline')
  @pragma('dart2js:prefer-inline')
  T operator [](int index) => getProperty<T>(index.toJS);
}

@JS('JSON.parse')
external JSAny? _jsonParse(JSString source);
