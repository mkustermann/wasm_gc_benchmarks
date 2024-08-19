
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
_22: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
_23: x0 => new Uint8Array(x0),
_70: (decoder, codeUnits) => decoder.decode(codeUnits),
_71: () => new TextDecoder("utf-8", {fatal: true}),
_72: () => new TextDecoder("utf-8", {fatal: false}),
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
_103: s => JSON.stringify(s),
_104: s => printToConsole(s),
_105: a => a.join(''),
_111: s => s.trim(),
_115: (s, p, i) => s.indexOf(p, i),
_121: (a, i) => a.push(i),
_128: (a, s) => a.join(s),
_132: a => a.length,
_134: (a, i) => a[i],
_135: (a, i, v) => a[i] = v,
_138: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_139: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_140: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_141: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_142: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_143: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_144: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_147: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_148: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_151: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_153: o => o.buffer,
_154: o => o.byteOffset,
_155: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_156: (b, o) => new DataView(b, o),
_158: Function.prototype.call.bind(DataView.prototype.getUint8),
_160: Function.prototype.call.bind(DataView.prototype.getInt8),
_162: Function.prototype.call.bind(DataView.prototype.getUint16),
_164: Function.prototype.call.bind(DataView.prototype.getInt16),
_166: Function.prototype.call.bind(DataView.prototype.getUint32),
_168: Function.prototype.call.bind(DataView.prototype.getInt32),
_174: Function.prototype.call.bind(DataView.prototype.getFloat32),
_176: Function.prototype.call.bind(DataView.prototype.getFloat64),
_204: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_213: o => o === undefined,
_232: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_236: (l, r) => l === r,
_237: o => o,
_238: o => o,
_239: o => o,
_240: b => !!b,
_241: o => o.length,
_244: (o, i) => o[i],
_245: f => f.dartFunction,
_246: l => arrayFromDartList(Int8Array, l),
_247: l => arrayFromDartList(Uint8Array, l),
_248: l => arrayFromDartList(Uint8ClampedArray, l),
_249: l => arrayFromDartList(Int16Array, l),
_250: l => arrayFromDartList(Uint16Array, l),
_251: l => arrayFromDartList(Int32Array, l),
_252: l => arrayFromDartList(Uint32Array, l),
_253: l => arrayFromDartList(Float32Array, l),
_254: l => arrayFromDartList(Float64Array, l),
_255: x0 => new ArrayBuffer(x0),
_256: (data, length) => {
          const getByte = dartInstance.exports.$byteDataGetUint8;
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
            view.setUint8(i, getByte(data, i));
          }
          return view;
        },
_257: l => arrayFromDartList(Array, l),
_258:       (s, length) => {
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
_259:     (s, length) => {
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
_260:     (s) => {
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
_263: l => new Array(l),
_267: (o, p) => o[p],
_271: o => String(o),
_273:   o => {
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
_274: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
          const getByte = dartInstance.exports.$wasmI8ArrayGet;
          for (let i = 0; i < length; i++) {
            jsArray[jsArrayOffset + i] = getByte(wasmArray, wasmArrayOffset + i);
          }
        },
_294: (o, p) => o[p],
_297: x0 => globalThis.JSON.parse(x0),
_299: x0 => globalThis.readFileContentsAsBytes(x0),
_301: v => v.toString()
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

