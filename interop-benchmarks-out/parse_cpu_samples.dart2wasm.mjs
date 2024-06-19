let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

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
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
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

_46: (decoder, codeUnits) => decoder.decode(codeUnits),
_47: () => new TextDecoder("utf-8", {fatal: true}),
_48: () => new TextDecoder("utf-8", {fatal: false}),
_49: v => stringToDartString(v.toString()),
_64: s => {
      const jsSource = stringFromDartString(s);
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(jsSource)) {
        return NaN;
      }
      return parseFloat(jsSource);
    },
_65: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_66: () => typeof dartUseDateNowForTicks !== "undefined",
_67: () => 1000 * performance.now(),
_68: () => Date.now(),
_85: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_86: s => printToConsole(stringFromDartString(s)),
_89: (a, i) => a.push(i),
_96: (a, s) => a.join(s),
_100: a => a.length,
_102: (a, i) => a[i],
_103: (a, i, v) => a[i] = v,
_105: a => a.join(''),
_111: s => s.trim(),
_115: (s, p, i) => s.indexOf(p, i),
_118: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_119: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_120: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_121: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_122: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_123: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_124: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_127: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_128: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_133: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_135: o => o.buffer,
_136: o => o.byteOffset,
_137: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_138: (b, o) => new DataView(b, o),
_140: Function.prototype.call.bind(DataView.prototype.getUint8),
_142: Function.prototype.call.bind(DataView.prototype.getInt8),
_144: Function.prototype.call.bind(DataView.prototype.getUint16),
_146: Function.prototype.call.bind(DataView.prototype.getInt16),
_148: Function.prototype.call.bind(DataView.prototype.getUint32),
_150: Function.prototype.call.bind(DataView.prototype.getInt32),
_156: Function.prototype.call.bind(DataView.prototype.getFloat32),
_158: Function.prototype.call.bind(DataView.prototype.getFloat64),
_182: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_184: x0 => globalThis.readFileContentsAsBytes(x0),
_198: o => o === undefined,
_199: o => typeof o === 'boolean',
_200: o => typeof o === 'number',
_202: o => typeof o === 'string',
_205: o => o instanceof Int8Array,
_206: o => o instanceof Uint8Array,
_207: o => o instanceof Uint8ClampedArray,
_208: o => o instanceof Int16Array,
_209: o => o instanceof Uint16Array,
_210: o => o instanceof Int32Array,
_211: o => o instanceof Uint32Array,
_212: o => o instanceof Float32Array,
_213: o => o instanceof Float64Array,
_214: o => o instanceof ArrayBuffer,
_215: o => o instanceof DataView,
_216: o => o instanceof Array,
_217: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_221: (l, r) => l === r,
_222: o => o,
_223: o => o,
_224: o => o,
_225: b => !!b,
_226: o => o.length,
_229: (o, i) => o[i],
_230: f => f.dartFunction,
_231: l => arrayFromDartList(Int8Array, l),
_232: l => arrayFromDartList(Uint8Array, l),
_233: l => arrayFromDartList(Uint8ClampedArray, l),
_234: l => arrayFromDartList(Int16Array, l),
_235: l => arrayFromDartList(Uint16Array, l),
_236: l => arrayFromDartList(Int32Array, l),
_237: l => arrayFromDartList(Uint32Array, l),
_238: l => arrayFromDartList(Float32Array, l),
_239: l => arrayFromDartList(Float64Array, l),
_240: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_241: l => arrayFromDartList(Array, l),
_242: stringFromDartString,
_243: stringToDartString,
_246: l => new Array(l),
_250: (o, p) => o[p],
_254: o => String(o),
_274: (o, p) => o[p],
_277: x0 => globalThis.JSON.parse(x0)
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
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}

