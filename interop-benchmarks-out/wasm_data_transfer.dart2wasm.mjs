
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

_60: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_61: () => typeof dartUseDateNowForTicks !== "undefined",
_62: () => 1000 * performance.now(),
_63: () => Date.now(),
_79: s => JSON.stringify(s),
_80: s => printToConsole(s),
_81: a => a.join(''),
_91: (s, p, i) => s.indexOf(p, i),
_97: (a, i) => a.push(i),
_108: a => a.length,
_110: (a, i) => a[i],
_111: (a, i, v) => a[i] = v,
_114: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_115: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_116: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_117: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_118: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_119: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_120: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_123: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_124: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_127: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_129: o => o.buffer,
_130: o => o.byteOffset,
_131: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_132: (b, o) => new DataView(b, o),
_134: Function.prototype.call.bind(DataView.prototype.getUint8),
_136: Function.prototype.call.bind(DataView.prototype.getInt8),
_138: Function.prototype.call.bind(DataView.prototype.getUint16),
_140: Function.prototype.call.bind(DataView.prototype.getInt16),
_142: Function.prototype.call.bind(DataView.prototype.getUint32),
_144: Function.prototype.call.bind(DataView.prototype.getInt32),
_150: Function.prototype.call.bind(DataView.prototype.getFloat32),
_152: Function.prototype.call.bind(DataView.prototype.getFloat64),
_176: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_190: o => o === undefined,
_191: o => typeof o === 'boolean',
_192: o => typeof o === 'number',
_194: o => typeof o === 'string',
_197: o => o instanceof Int8Array,
_198: o => o instanceof Uint8Array,
_199: o => o instanceof Uint8ClampedArray,
_200: o => o instanceof Int16Array,
_201: o => o instanceof Uint16Array,
_202: o => o instanceof Int32Array,
_203: o => o instanceof Uint32Array,
_204: o => o instanceof Float32Array,
_205: o => o instanceof Float64Array,
_206: o => o instanceof ArrayBuffer,
_207: o => o instanceof DataView,
_208: o => o instanceof Array,
_209: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_213: (l, r) => l === r,
_214: o => o,
_215: o => o,
_216: o => o,
_217: b => !!b,
_218: o => o.length,
_221: (o, i) => o[i],
_222: f => f.dartFunction,
_223: l => arrayFromDartList(Int8Array, l),
_224: (data, length) => {
          const jsBytes = new Uint8Array(length);
          const getByte = dartInstance.exports.$uint8ListGet;
          for (let i = 0; i < length; i++) {
            jsBytes[i] = getByte(data, i);
          }
          return jsBytes;
        },
_225: l => arrayFromDartList(Uint8ClampedArray, l),
_226: l => arrayFromDartList(Int16Array, l),
_227: l => arrayFromDartList(Uint16Array, l),
_228: l => arrayFromDartList(Int32Array, l),
_229: l => arrayFromDartList(Uint32Array, l),
_230: l => arrayFromDartList(Float32Array, l),
_231: l => arrayFromDartList(Float64Array, l),
_232: (data, length) => {
          const read = dartInstance.exports.$byteDataGetUint8;
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, read(data, i));
          }
          return view;
        },
_233: l => arrayFromDartList(Array, l),
_234:       (s, length) => {
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
_235:     (s, length) => {
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
_236:     (s) => {
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
_239: l => new Array(l),
_243: (o, p) => o[p],
_247: o => String(o),
_269: v => v.toString()
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

