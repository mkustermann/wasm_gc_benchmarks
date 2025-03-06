// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  async instantiate(additionalImports, {loadDeferredWasm, loadDynamicModule} = {}) {
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
            _20: (x0,x1,x2) => new DataView(x0,x1,x2),
      _23: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _24: x0 => new Uint8Array(x0),
      _81: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _82: () => typeof dartUseDateNowForTicks !== "undefined",
      _83: () => 1000 * performance.now(),
      _84: () => Date.now(),
      _109: s => JSON.stringify(s),
      _111: s => printToConsole(s),
      _119: (string, times) => string.repeat(times),
      _120: Function.prototype.call.bind(String.prototype.indexOf),
      _124: (a, i) => a.push(i),
      _134: a => a.length,
      _136: (a, i) => a[i],
      _140: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _141: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _142: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _143: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _144: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _145: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _146: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _149: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _150: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _153: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _155: o => o.buffer,
      _156: o => o.byteOffset,
      _157: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _158: (b, o) => new DataView(b, o),
      _160: Function.prototype.call.bind(DataView.prototype.getUint8),
      _162: Function.prototype.call.bind(DataView.prototype.getInt8),
      _164: Function.prototype.call.bind(DataView.prototype.getUint16),
      _166: Function.prototype.call.bind(DataView.prototype.getInt16),
      _168: Function.prototype.call.bind(DataView.prototype.getUint32),
      _170: Function.prototype.call.bind(DataView.prototype.getInt32),
      _176: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _178: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _205: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _214: o => o === undefined,
      _233: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _237: (l, r) => l === r,
      _238: o => o,
      _239: o => o,
      _240: o => o,
      _241: b => !!b,
      _242: o => o.length,
      _245: (o, i) => o[i],
      _246: f => f.dartFunction,
      _247: l => arrayFromDartList(Int8Array, l),
      _248: l => arrayFromDartList(Uint8Array, l),
      _249: l => arrayFromDartList(Uint8ClampedArray, l),
      _250: l => arrayFromDartList(Int16Array, l),
      _251: l => arrayFromDartList(Uint16Array, l),
      _252: l => arrayFromDartList(Int32Array, l),
      _253: l => arrayFromDartList(Uint32Array, l),
      _254: l => arrayFromDartList(Float32Array, l),
      _255: l => arrayFromDartList(Float64Array, l),
      _256: x0 => new ArrayBuffer(x0),
      _257: (data, length) => {
        const getValue = dartInstance.exports.$byteDataGetUint8;
        const view = new DataView(new ArrayBuffer(length));
        for (let i = 0; i < length; i++) {
          view.setUint8(i, getValue(data, i));
        }
        return view;
      },
      _258: l => arrayFromDartList(Array, l),
      _265: (o, p) => o[p],
      _269: o => String(o),
      _271: o => {
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
      },
      _272: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _273: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _300: x0 => x0.random(),
      _301: x0 => x0.random(),
      _305: () => globalThis.Math,
      _307: Function.prototype.call.bind(Number.prototype.toString),
      _308: Function.prototype.call.bind(BigInt.prototype.toString),
      _309: Function.prototype.call.bind(Number.prototype.toString),

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
            s: [
        "Too few arguments passed. Expected 1 or more, got ",
"Infinity or NaN toInt",
" instead.",
"null",
"",
" (",
")",
": ",
"Instance of '",
"'",
"Object?",
"Object",
"dynamic",
"void",
"Invalid top type kind",
"minified:Class",
"<",
", ",
">",
"?",
"Attempt to execute code removed by Dart AOT compiler (TFA)",
"T",
"Invalid argument",
"(s)",
"0.0",
"-0.0",
"1.0",
"-1.0",
"NaN",
"-Infinity",
"Infinity",
"e",
".0",
"RangeError (details omitted due to --minify)",
"Unsupported operation: ",
"true",
"false",
"Division resulted in non-finite value",
"IntegerDivisionByZeroException",
"Type '",
"' is not a subtype of type '",
" in type cast",
"Null",
"Never",
"X",
" extends ",
"(",
"[",
"]",
"{",
"}",
" => ",
"Closure: ",
"...",
"Runtime type check failed (details omitted due to --minify)",
"Type argument substitution not supported for ",
"Type parameter should have been substituted already.",
" ",
"FutureOr",
"required ",
"IndexError (details omitted due to --minify)",
"Concurrent modification during iteration: ",
".",
"Unhandled dartifyRaw type case: ",
"{...}",
"Function?",
"Function",
"buffer",
"Null check operator used on a null value",
"Too few arguments passed. Expected 2 or more, got ",
"Expected integer value, but was not integer.",
"Too few arguments passed. Expected 0 or more, got ",
"Cannot add to a fixed-length list",
"Could not call main",
"JavaScriptError",
"a",
"10",
"1KB",
"1MB",
"WasmDataTransfer.ToBrowserBytes.",
"WasmDataTransfer.ToBrowserString.",
"WasmDataTransfer.FromBrowserBytes.",
"(RunTime): ",
" us.",
"1",
"Positive input exceeds the limit of integer",
"Negative input exceeds the limit of integer",
"Invalid number",
"Invalid radix-",
" number",
"FormatException",
"\n",
" (at line ",
", character ",
")\n",
" (at character ",
"^\n",
"byteOffset",
"Too few elements",
"Bad state: ",
"Value was negative (details omitted due to --minify)",
" in ",
" iterations",
"WasmDataTransfer.FromBrowserString.",
"start",
"Invalid value",
": Not greater than or equal to ",
": Not in inclusive range ",
"..",
": Valid value range is empty",
": Only valid value is ",
"RangeError",
"The implementation cannot handle very large operands (was: ",
").",
"Exception: ",
"Cannot add to an unmodifiable list"
      ],

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
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s == '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
    };


    const loadModuleFromBytes = async (bytes) => {
        const module = await WebAssembly.compile(bytes, this.builtins);
        return await WebAssembly.instantiate(module, {
          ...baseImports,
          ...additionalImports,
          "wasm:js-string": jsStringPolyfill,
          "module0": dartInstance.exports,
        });
    }

    const loadModule = async (loader, loaderArgument) => {
        const source = await Promise.resolve(loader(loaderArgument));
        const module = await ((source instanceof Response)
            ? WebAssembly.compileStreaming(source, this.builtins)
            : WebAssembly.compile(source, this.builtins));
        return await WebAssembly.instantiate(module, {
          ...baseImports,
          ...additionalImports,
          "wasm:js-string": jsStringPolyfill,
          "module0": dartInstance.exports,
        });
    }

    const deferredLibraryHelper = {
      "loadModule": async (moduleName) => {
        if (!loadDeferredWasm) {
          throw "No implementation of loadDeferredWasm provided.";
        }
        return await loadModule(loadDeferredWasm, moduleName);
      },
      "loadDynamicModuleFromUri": async (uri) => {
        if (!loadDynamicModule) {
          throw "No implementation of loadDynamicModule provided.";
        }
        const loadedModule = await loadModule(loadDynamicModule, uri);
        return loadedModule.exports.$invokeEntryPoint;
      },
      "loadDynamicModuleFromBytes": async (bytes) => {
        const loadedModule = await loadModuleFromBytes(loadDynamicModule, uri);
        return loadedModule.exports.$invokeEntryPoint;
      },
    };

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      "deferredLibraryHelper": deferredLibraryHelper,
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
