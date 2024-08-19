
// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
      const exports = dartInstance.exports;
      const read = exports.$listRead;
      const length = exports.$listLength(list);
      const array = new constructor(length);
      for (let i = 0; i < length; i++) {
        array[i] = read(list, i);
      }
      return array;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {

_12: x0 => x0.length,
_14: (x0,x1) => x0[x1],
_18: (x0,x1,x2) => new DataView(x0,x1,x2),
_21: x0 => new Int8Array(x0),
_22: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
_23: x0 => new Uint8Array(x0),
_31: x0 => new Int32Array(x0),
_35: x0 => new Float32Array(x0),
_37: x0 => new Float64Array(x0),
_39: (o, c) => o instanceof c,
_42: (o,s,v) => o[s] = v,
_69: () => Symbol("jsBoxedDartObjectProperty"),
_70: (decoder, codeUnits) => decoder.decode(codeUnits),
_71: () => new TextDecoder("utf-8", {fatal: true}),
_72: () => new TextDecoder("utf-8", {fatal: false}),
_80: Date.now,
_82: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_83: s => {
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
        return NaN;
      }
      return parseFloat(s);
    },
_84: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_85: () => typeof dartUseDateNowForTicks !== "undefined",
_86: () => 1000 * performance.now(),
_87: () => Date.now(),
_90: () => new WeakMap(),
_91: (map, o) => map.get(o),
_92: (map, o, v) => map.set(o, v),
_103: s => JSON.stringify(s),
_104: s => printToConsole(s),
_105: a => a.join(''),
_108: (s, t) => s.split(t),
_109: s => s.toLowerCase(),
_110: s => s.toUpperCase(),
_111: s => s.trim(),
_112: s => s.trimLeft(),
_113: s => s.trimRight(),
_115: (s, p, i) => s.indexOf(p, i),
_116: (s, p, i) => s.lastIndexOf(p, i),
_118: Object.is,
_119: s => s.toUpperCase(),
_120: s => s.toLowerCase(),
_121: (a, i) => a.push(i),
_125: a => a.pop(),
_126: (a, i) => a.splice(i, 1),
_128: (a, s) => a.join(s),
_129: (a, s, e) => a.slice(s, e),
_132: a => a.length,
_134: (a, i) => a[i],
_135: (a, i, v) => a[i] = v,
_137: (o, offsetInBytes, lengthInBytes) => {
      var dst = new ArrayBuffer(lengthInBytes);
      new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
      return new DataView(dst);
    },
_138: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_139: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_140: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_141: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_142: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_143: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_144: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_146: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
_147: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_148: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_149: (t, s) => t.set(s),
_151: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_153: o => o.buffer,
_154: o => o.byteOffset,
_155: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_156: (b, o) => new DataView(b, o),
_157: (b, o, l) => new DataView(b, o, l),
_158: Function.prototype.call.bind(DataView.prototype.getUint8),
_159: Function.prototype.call.bind(DataView.prototype.setUint8),
_160: Function.prototype.call.bind(DataView.prototype.getInt8),
_161: Function.prototype.call.bind(DataView.prototype.setInt8),
_162: Function.prototype.call.bind(DataView.prototype.getUint16),
_163: Function.prototype.call.bind(DataView.prototype.setUint16),
_164: Function.prototype.call.bind(DataView.prototype.getInt16),
_165: Function.prototype.call.bind(DataView.prototype.setInt16),
_166: Function.prototype.call.bind(DataView.prototype.getUint32),
_167: Function.prototype.call.bind(DataView.prototype.setUint32),
_168: Function.prototype.call.bind(DataView.prototype.getInt32),
_169: Function.prototype.call.bind(DataView.prototype.setInt32),
_172: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_173: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_174: Function.prototype.call.bind(DataView.prototype.getFloat32),
_175: Function.prototype.call.bind(DataView.prototype.setFloat32),
_176: Function.prototype.call.bind(DataView.prototype.getFloat64),
_177: Function.prototype.call.bind(DataView.prototype.setFloat64),
_184: () => globalThis.performance,
_185: () => globalThis.JSON,
_186: x0 => x0.measure,
_187: x0 => x0.mark,
_188: x0 => x0.clearMeasures,
_189: x0 => x0.clearMarks,
_190: (x0,x1,x2,x3) => x0.measure(x1,x2,x3),
_191: (x0,x1,x2) => x0.mark(x1,x2),
_192: x0 => x0.clearMeasures(),
_193: x0 => x0.clearMarks(),
_194: (x0,x1) => x0.parse(x1),
_200: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_201: (handle) => clearTimeout(handle),
_204: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_236: (x0,x1) => x0.matchMedia(x1),
_237: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_238: (x0,x1) => x0.exec(x1),
_239: (x0,x1) => x0.test(x1),
_240: (x0,x1) => x0.exec(x1),
_241: (x0,x1) => x0.exec(x1),
_242: x0 => x0.pop(),
_244: o => o === undefined,
_263: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_266: o => o instanceof RegExp,
_267: (l, r) => l === r,
_268: o => o,
_269: o => o,
_270: o => o,
_271: b => !!b,
_272: o => o.length,
_275: (o, i) => o[i],
_276: f => f.dartFunction,
_277: l => arrayFromDartList(Int8Array, l),
_278: l => arrayFromDartList(Uint8Array, l),
_279: l => arrayFromDartList(Uint8ClampedArray, l),
_280: l => arrayFromDartList(Int16Array, l),
_281: l => arrayFromDartList(Uint16Array, l),
_282: l => arrayFromDartList(Int32Array, l),
_283: l => arrayFromDartList(Uint32Array, l),
_284: l => arrayFromDartList(Float32Array, l),
_285: l => arrayFromDartList(Float64Array, l),
_286: x0 => new ArrayBuffer(x0),
_287: (data, length) => {
          const getByte = dartInstance.exports.$byteDataGetUint8;
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
            view.setUint8(i, getByte(data, i));
          }
          return view;
        },
_288: l => arrayFromDartList(Array, l),
_289:       (s, length) => {
        if (length == 0) return '';

        const read = dartInstance.exports.$stringRead1;
        let result = '';
        let index = 0;
        const chunkLength = Math.min(length - index, 500);
        let array = new Array(chunkLength);
        while (index < length) {
          const newChunkLength = Math.min(length - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(s, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      }
      ,
_290:     (s, length) => {
      if (length == 0) return '';

      const read = dartInstance.exports.$stringRead2;
      let result = '';
      let index = 0;
      const chunkLength = Math.min(length - index, 500);
      let array = new Array(chunkLength);
      while (index < length) {
        const newChunkLength = Math.min(length - index, 500);
        for (let i = 0; i < newChunkLength; i++) {
          array[i] = read(s, index++);
        }
        if (newChunkLength < chunkLength) {
          array = array.slice(0, newChunkLength);
        }
        result += String.fromCharCode(...array);
      }
      return result;
    }
    ,
_291:     (s) => {
      let length = s.length;
      let range = 0;
      for (let i = 0; i < length; i++) {
        range |= s.codePointAt(i);
      }
      const exports = dartInstance.exports;
      if (range < 256) {
        if (length <= 10) {
          if (length == 1) {
            return exports.$stringAllocate1_1(s.codePointAt(0));
          }
          if (length == 2) {
            return exports.$stringAllocate1_2(s.codePointAt(0), s.codePointAt(1));
          }
          if (length == 3) {
            return exports.$stringAllocate1_3(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2));
          }
          if (length == 4) {
            return exports.$stringAllocate1_4(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3));
          }
          if (length == 5) {
            return exports.$stringAllocate1_5(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4));
          }
          if (length == 6) {
            return exports.$stringAllocate1_6(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5));
          }
          if (length == 7) {
            return exports.$stringAllocate1_7(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6));
          }
          if (length == 8) {
            return exports.$stringAllocate1_8(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7));
          }
          if (length == 9) {
            return exports.$stringAllocate1_9(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8));
          }
          if (length == 10) {
            return exports.$stringAllocate1_10(s.codePointAt(0), s.codePointAt(1), s.codePointAt(2), s.codePointAt(3), s.codePointAt(4), s.codePointAt(5), s.codePointAt(6), s.codePointAt(7), s.codePointAt(8), s.codePointAt(9));
          }
        }
        const dartString = exports.$stringAllocate1(length);
        const write = exports.$stringWrite1;
        for (let i = 0; i < length; i++) {
          write(dartString, i, s.codePointAt(i));
        }
        return dartString;
      } else {
        const dartString = exports.$stringAllocate2(length);
        const write = exports.$stringWrite2;
        for (let i = 0; i < length; i++) {
          write(dartString, i, s.charCodeAt(i));
        }
        return dartString;
      }
    }
    ,
_292: () => ({}),
_294: l => new Array(l),
_295: () => globalThis,
_298: (o, p) => o[p],
_302: o => String(o),
_304:   o => {
    if (o === undefined) return 1;
    var type = typeof o;
    if (type === 'boolean') return 2;
    if (type === 'number') return 3;
    if (type === 'string') return 4;
    if (o instanceof Array) return 5;
    if (ArrayBuffer.isView(o)) {
      if (o instanceof Int8Array) return 6;
      if (o instanceof Uint8Array) return 7;
      if (o instanceof Uint8ClampedArray) return 8;
      if (o instanceof Int16Array) return 9;
      if (o instanceof Uint16Array) return 10;
      if (o instanceof Int32Array) return 11;
      if (o instanceof Uint32Array) return 12;
      if (o instanceof Float32Array) return 13;
      if (o instanceof Float64Array) return 14;
      if (o instanceof DataView) return 15;
    }
    if (o instanceof ArrayBuffer) return 16;
    return 17;
  }
  ,
_305: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
          const getByte = dartInstance.exports.$wasmI8ArrayGet;
          for (let i = 0; i < length; i++) {
            jsArray[jsArrayOffset + i] = getByte(wasmArray, wasmArrayOffset + i);
          }
        },
_307: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
          const getByte = dartInstance.exports.$wasmI32ArrayGet;
          for (let i = 0; i < length; i++) {
            jsArray[jsArrayOffset + i] = getByte(wasmArray, wasmArrayOffset + i);
          }
        },
_308: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
          const getByte = dartInstance.exports.$wasmF32ArrayGet;
          for (let i = 0; i < length; i++) {
            jsArray[jsArrayOffset + i] = getByte(wasmArray, wasmArrayOffset + i);
          }
        },
_309: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
          const getByte = dartInstance.exports.$wasmF64ArrayGet;
          for (let i = 0; i < length; i++) {
            jsArray[jsArrayOffset + i] = getByte(wasmArray, wasmArrayOffset + i);
          }
        },
_313: x0 => x0.index,
_316: (x0,x1) => x0.exec(x1),
_318: x0 => x0.flags,
_319: x0 => x0.multiline,
_320: x0 => x0.ignoreCase,
_321: x0 => x0.unicode,
_322: x0 => x0.dotAll,
_323: (x0,x1) => x0.lastIndex = x1,
_325: (o, p) => o[p],
_328: v => v.toString(),
_329: (d, digits) => d.toFixed(digits),
_2131: () => globalThis.window,
_8953: x0 => x0.matches,
_12973: x0 => globalThis.window.flutterCanvasKit = x0
    };

    const baseImports = {
        dart2wasm: dart2wasm,


        Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };

    const jsStringPolyfill = {
        "charCodeAt": (s, i) => s.charCodeAt(i),
        "compare": (s1, s2) => {
            if (s1 < s2) return -1;
            if (s1 > s2) return 1;
            return 0;
        },
        "concat": (s1, s2) => s1 + s2,
        "equals": (s1, s2) => s1 === s2,
        "fromCharCode": (i) => String.fromCharCode(i),
        "length": (s) => s.length,
        "substring": (s, a, b) => s.substring(a, b),
    };

    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
        "wasm:js-string": jsStringPolyfill,
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

