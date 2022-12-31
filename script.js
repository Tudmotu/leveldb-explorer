(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/js-sha3/src/sha3.js
  var require_sha3 = __commonJS({
    "node_modules/js-sha3/src/sha3.js"(exports, module) {
      (function() {
        "use strict";
        var INPUT_ERROR = "input is invalid type";
        var FINALIZE_ERROR = "finalize already called";
        var WINDOW = typeof window === "object";
        var root = WINDOW ? window : {};
        if (root.JS_SHA3_NO_WINDOW) {
          WINDOW = false;
        }
        var WEB_WORKER = !WINDOW && typeof self === "object";
        var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
        if (NODE_JS) {
          root = global;
        } else if (WEB_WORKER) {
          root = self;
        }
        var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === "object" && module.exports;
        var AMD = typeof define === "function" && define.amd;
        var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
        var HEX_CHARS = "0123456789abcdef".split("");
        var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
        var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
        var KECCAK_PADDING = [1, 256, 65536, 16777216];
        var PADDING = [6, 1536, 393216, 100663296];
        var SHIFT = [0, 8, 16, 24];
        var RC = [
          1,
          0,
          32898,
          0,
          32906,
          2147483648,
          2147516416,
          2147483648,
          32907,
          0,
          2147483649,
          0,
          2147516545,
          2147483648,
          32777,
          2147483648,
          138,
          0,
          136,
          0,
          2147516425,
          0,
          2147483658,
          0,
          2147516555,
          0,
          139,
          2147483648,
          32905,
          2147483648,
          32771,
          2147483648,
          32770,
          2147483648,
          128,
          2147483648,
          32778,
          0,
          2147483658,
          2147483648,
          2147516545,
          2147483648,
          32896,
          2147483648,
          2147483649,
          0,
          2147516424,
          2147483648
        ];
        var BITS = [224, 256, 384, 512];
        var SHAKE_BITS = [128, 256];
        var OUTPUT_TYPES = ["hex", "buffer", "arrayBuffer", "array", "digest"];
        var CSHAKE_BYTEPAD = {
          "128": 168,
          "256": 136
        };
        if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
          Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
          };
        }
        if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
          ArrayBuffer.isView = function(obj) {
            return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
          };
        }
        var createOutputMethod = function(bits2, padding, outputType) {
          return function(message) {
            return new Keccak(bits2, padding, bits2).update(message)[outputType]();
          };
        };
        var createShakeOutputMethod = function(bits2, padding, outputType) {
          return function(message, outputBits) {
            return new Keccak(bits2, padding, outputBits).update(message)[outputType]();
          };
        };
        var createCshakeOutputMethod = function(bits2, padding, outputType) {
          return function(message, outputBits, n, s) {
            return methods["cshake" + bits2].update(message, outputBits, n, s)[outputType]();
          };
        };
        var createKmacOutputMethod = function(bits2, padding, outputType) {
          return function(key, message, outputBits, s) {
            return methods["kmac" + bits2].update(key, message, outputBits, s)[outputType]();
          };
        };
        var createOutputMethods = function(method, createMethod2, bits2, padding) {
          for (var i2 = 0; i2 < OUTPUT_TYPES.length; ++i2) {
            var type = OUTPUT_TYPES[i2];
            method[type] = createMethod2(bits2, padding, type);
          }
          return method;
        };
        var createMethod = function(bits2, padding) {
          var method = createOutputMethod(bits2, padding, "hex");
          method.create = function() {
            return new Keccak(bits2, padding, bits2);
          };
          method.update = function(message) {
            return method.create().update(message);
          };
          return createOutputMethods(method, createOutputMethod, bits2, padding);
        };
        var createShakeMethod = function(bits2, padding) {
          var method = createShakeOutputMethod(bits2, padding, "hex");
          method.create = function(outputBits) {
            return new Keccak(bits2, padding, outputBits);
          };
          method.update = function(message, outputBits) {
            return method.create(outputBits).update(message);
          };
          return createOutputMethods(method, createShakeOutputMethod, bits2, padding);
        };
        var createCshakeMethod = function(bits2, padding) {
          var w = CSHAKE_BYTEPAD[bits2];
          var method = createCshakeOutputMethod(bits2, padding, "hex");
          method.create = function(outputBits, n, s) {
            if (!n && !s) {
              return methods["shake" + bits2].create(outputBits);
            } else {
              return new Keccak(bits2, padding, outputBits).bytepad([n, s], w);
            }
          };
          method.update = function(message, outputBits, n, s) {
            return method.create(outputBits, n, s).update(message);
          };
          return createOutputMethods(method, createCshakeOutputMethod, bits2, padding);
        };
        var createKmacMethod = function(bits2, padding) {
          var w = CSHAKE_BYTEPAD[bits2];
          var method = createKmacOutputMethod(bits2, padding, "hex");
          method.create = function(key, outputBits, s) {
            return new Kmac(bits2, padding, outputBits).bytepad(["KMAC", s], w).bytepad([key], w);
          };
          method.update = function(key, message, outputBits, s) {
            return method.create(key, outputBits, s).update(message);
          };
          return createOutputMethods(method, createKmacOutputMethod, bits2, padding);
        };
        var algorithms = [
          { name: "keccak", padding: KECCAK_PADDING, bits: BITS, createMethod },
          { name: "sha3", padding: PADDING, bits: BITS, createMethod },
          { name: "shake", padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
          { name: "cshake", padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
          { name: "kmac", padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
        ];
        var methods = {}, methodNames = [];
        for (var i = 0; i < algorithms.length; ++i) {
          var algorithm = algorithms[i];
          var bits = algorithm.bits;
          for (var j = 0; j < bits.length; ++j) {
            var methodName = algorithm.name + "_" + bits[j];
            methodNames.push(methodName);
            methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
            if (algorithm.name !== "sha3") {
              var newMethodName = algorithm.name + bits[j];
              methodNames.push(newMethodName);
              methods[newMethodName] = methods[methodName];
            }
          }
        }
        function Keccak(bits2, padding, outputBits) {
          this.blocks = [];
          this.s = [];
          this.padding = padding;
          this.outputBits = outputBits;
          this.reset = true;
          this.finalized = false;
          this.block = 0;
          this.start = 0;
          this.blockCount = 1600 - (bits2 << 1) >> 5;
          this.byteCount = this.blockCount << 2;
          this.outputBlocks = outputBits >> 5;
          this.extraBytes = (outputBits & 31) >> 3;
          for (var i2 = 0; i2 < 50; ++i2) {
            this.s[i2] = 0;
          }
        }
        Keccak.prototype.update = function(message) {
          if (this.finalized) {
            throw new Error(FINALIZE_ERROR);
          }
          var notString, type = typeof message;
          if (type !== "string") {
            if (type === "object") {
              if (message === null) {
                throw new Error(INPUT_ERROR);
              } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              } else if (!Array.isArray(message)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                  throw new Error(INPUT_ERROR);
                }
              }
            } else {
              throw new Error(INPUT_ERROR);
            }
            notString = true;
          }
          var blocks = this.blocks, byteCount = this.byteCount, length = message.length, blockCount = this.blockCount, index = 0, s = this.s, i2, code;
          while (index < length) {
            if (this.reset) {
              this.reset = false;
              blocks[0] = this.block;
              for (i2 = 1; i2 < blockCount + 1; ++i2) {
                blocks[i2] = 0;
              }
            }
            if (notString) {
              for (i2 = this.start; index < length && i2 < byteCount; ++index) {
                blocks[i2 >> 2] |= message[index] << SHIFT[i2++ & 3];
              }
            } else {
              for (i2 = this.start; index < length && i2 < byteCount; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  blocks[i2 >> 2] |= code << SHIFT[i2++ & 3];
                } else if (code < 2048) {
                  blocks[i2 >> 2] |= (192 | code >> 6) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks[i2 >> 2] |= (224 | code >> 12) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  blocks[i2 >> 2] |= (240 | code >> 18) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code >> 12 & 63) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
                }
              }
            }
            this.lastByteIndex = i2;
            if (i2 >= byteCount) {
              this.start = i2 - byteCount;
              this.block = blocks[blockCount];
              for (i2 = 0; i2 < blockCount; ++i2) {
                s[i2] ^= blocks[i2];
              }
              f(s);
              this.reset = true;
            } else {
              this.start = i2;
            }
          }
          return this;
        };
        Keccak.prototype.encode = function(x, right) {
          var o = x & 255, n = 1;
          var bytes = [o];
          x = x >> 8;
          o = x & 255;
          while (o > 0) {
            bytes.unshift(o);
            x = x >> 8;
            o = x & 255;
            ++n;
          }
          if (right) {
            bytes.push(n);
          } else {
            bytes.unshift(n);
          }
          this.update(bytes);
          return bytes.length;
        };
        Keccak.prototype.encodeString = function(str) {
          var notString, type = typeof str;
          if (type !== "string") {
            if (type === "object") {
              if (str === null) {
                throw new Error(INPUT_ERROR);
              } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
                str = new Uint8Array(str);
              } else if (!Array.isArray(str)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
                  throw new Error(INPUT_ERROR);
                }
              }
            } else {
              throw new Error(INPUT_ERROR);
            }
            notString = true;
          }
          var bytes = 0, length = str.length;
          if (notString) {
            bytes = length;
          } else {
            for (var i2 = 0; i2 < str.length; ++i2) {
              var code = str.charCodeAt(i2);
              if (code < 128) {
                bytes += 1;
              } else if (code < 2048) {
                bytes += 2;
              } else if (code < 55296 || code >= 57344) {
                bytes += 3;
              } else {
                code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++i2) & 1023);
                bytes += 4;
              }
            }
          }
          bytes += this.encode(bytes * 8);
          this.update(str);
          return bytes;
        };
        Keccak.prototype.bytepad = function(strs, w) {
          var bytes = this.encode(w);
          for (var i2 = 0; i2 < strs.length; ++i2) {
            bytes += this.encodeString(strs[i2]);
          }
          var paddingBytes = w - bytes % w;
          var zeros = [];
          zeros.length = paddingBytes;
          this.update(zeros);
          return this;
        };
        Keccak.prototype.finalize = function() {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          var blocks = this.blocks, i2 = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
          blocks[i2 >> 2] |= this.padding[i2 & 3];
          if (this.lastByteIndex === this.byteCount) {
            blocks[0] = blocks[blockCount];
            for (i2 = 1; i2 < blockCount + 1; ++i2) {
              blocks[i2] = 0;
            }
          }
          blocks[blockCount - 1] |= 2147483648;
          for (i2 = 0; i2 < blockCount; ++i2) {
            s[i2] ^= blocks[i2];
          }
          f(s);
        };
        Keccak.prototype.toString = Keccak.prototype.hex = function() {
          this.finalize();
          var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
          var hex = "", block;
          while (j2 < outputBlocks) {
            for (i2 = 0; i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
              block = s[i2];
              hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15] + HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15] + HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15] + HEX_CHARS[block >> 28 & 15] + HEX_CHARS[block >> 24 & 15];
            }
            if (j2 % blockCount === 0) {
              f(s);
              i2 = 0;
            }
          }
          if (extraBytes) {
            block = s[i2];
            hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15];
            if (extraBytes > 1) {
              hex += HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15];
            }
            if (extraBytes > 2) {
              hex += HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15];
            }
          }
          return hex;
        };
        Keccak.prototype.arrayBuffer = function() {
          this.finalize();
          var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
          var bytes = this.outputBits >> 3;
          var buffer;
          if (extraBytes) {
            buffer = new ArrayBuffer(outputBlocks + 1 << 2);
          } else {
            buffer = new ArrayBuffer(bytes);
          }
          var array = new Uint32Array(buffer);
          while (j2 < outputBlocks) {
            for (i2 = 0; i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
              array[j2] = s[i2];
            }
            if (j2 % blockCount === 0) {
              f(s);
            }
          }
          if (extraBytes) {
            array[i2] = s[i2];
            buffer = buffer.slice(0, bytes);
          }
          return buffer;
        };
        Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;
        Keccak.prototype.digest = Keccak.prototype.array = function() {
          this.finalize();
          var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
          var array = [], offset, block;
          while (j2 < outputBlocks) {
            for (i2 = 0; i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
              offset = j2 << 2;
              block = s[i2];
              array[offset] = block & 255;
              array[offset + 1] = block >> 8 & 255;
              array[offset + 2] = block >> 16 & 255;
              array[offset + 3] = block >> 24 & 255;
            }
            if (j2 % blockCount === 0) {
              f(s);
            }
          }
          if (extraBytes) {
            offset = j2 << 2;
            block = s[i2];
            array[offset] = block & 255;
            if (extraBytes > 1) {
              array[offset + 1] = block >> 8 & 255;
            }
            if (extraBytes > 2) {
              array[offset + 2] = block >> 16 & 255;
            }
          }
          return array;
        };
        function Kmac(bits2, padding, outputBits) {
          Keccak.call(this, bits2, padding, outputBits);
        }
        Kmac.prototype = new Keccak();
        Kmac.prototype.finalize = function() {
          this.encode(this.outputBits, true);
          return Keccak.prototype.finalize.call(this);
        };
        var f = function(s) {
          var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
          for (n = 0; n < 48; n += 2) {
            c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
            c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
            c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
            c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
            c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
            c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
            c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
            c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
            c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
            c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
            h = c8 ^ (c2 << 1 | c3 >>> 31);
            l = c9 ^ (c3 << 1 | c2 >>> 31);
            s[0] ^= h;
            s[1] ^= l;
            s[10] ^= h;
            s[11] ^= l;
            s[20] ^= h;
            s[21] ^= l;
            s[30] ^= h;
            s[31] ^= l;
            s[40] ^= h;
            s[41] ^= l;
            h = c0 ^ (c4 << 1 | c5 >>> 31);
            l = c1 ^ (c5 << 1 | c4 >>> 31);
            s[2] ^= h;
            s[3] ^= l;
            s[12] ^= h;
            s[13] ^= l;
            s[22] ^= h;
            s[23] ^= l;
            s[32] ^= h;
            s[33] ^= l;
            s[42] ^= h;
            s[43] ^= l;
            h = c2 ^ (c6 << 1 | c7 >>> 31);
            l = c3 ^ (c7 << 1 | c6 >>> 31);
            s[4] ^= h;
            s[5] ^= l;
            s[14] ^= h;
            s[15] ^= l;
            s[24] ^= h;
            s[25] ^= l;
            s[34] ^= h;
            s[35] ^= l;
            s[44] ^= h;
            s[45] ^= l;
            h = c4 ^ (c8 << 1 | c9 >>> 31);
            l = c5 ^ (c9 << 1 | c8 >>> 31);
            s[6] ^= h;
            s[7] ^= l;
            s[16] ^= h;
            s[17] ^= l;
            s[26] ^= h;
            s[27] ^= l;
            s[36] ^= h;
            s[37] ^= l;
            s[46] ^= h;
            s[47] ^= l;
            h = c6 ^ (c0 << 1 | c1 >>> 31);
            l = c7 ^ (c1 << 1 | c0 >>> 31);
            s[8] ^= h;
            s[9] ^= l;
            s[18] ^= h;
            s[19] ^= l;
            s[28] ^= h;
            s[29] ^= l;
            s[38] ^= h;
            s[39] ^= l;
            s[48] ^= h;
            s[49] ^= l;
            b0 = s[0];
            b1 = s[1];
            b32 = s[11] << 4 | s[10] >>> 28;
            b33 = s[10] << 4 | s[11] >>> 28;
            b14 = s[20] << 3 | s[21] >>> 29;
            b15 = s[21] << 3 | s[20] >>> 29;
            b46 = s[31] << 9 | s[30] >>> 23;
            b47 = s[30] << 9 | s[31] >>> 23;
            b28 = s[40] << 18 | s[41] >>> 14;
            b29 = s[41] << 18 | s[40] >>> 14;
            b20 = s[2] << 1 | s[3] >>> 31;
            b21 = s[3] << 1 | s[2] >>> 31;
            b2 = s[13] << 12 | s[12] >>> 20;
            b3 = s[12] << 12 | s[13] >>> 20;
            b34 = s[22] << 10 | s[23] >>> 22;
            b35 = s[23] << 10 | s[22] >>> 22;
            b16 = s[33] << 13 | s[32] >>> 19;
            b17 = s[32] << 13 | s[33] >>> 19;
            b48 = s[42] << 2 | s[43] >>> 30;
            b49 = s[43] << 2 | s[42] >>> 30;
            b40 = s[5] << 30 | s[4] >>> 2;
            b41 = s[4] << 30 | s[5] >>> 2;
            b22 = s[14] << 6 | s[15] >>> 26;
            b23 = s[15] << 6 | s[14] >>> 26;
            b4 = s[25] << 11 | s[24] >>> 21;
            b5 = s[24] << 11 | s[25] >>> 21;
            b36 = s[34] << 15 | s[35] >>> 17;
            b37 = s[35] << 15 | s[34] >>> 17;
            b18 = s[45] << 29 | s[44] >>> 3;
            b19 = s[44] << 29 | s[45] >>> 3;
            b10 = s[6] << 28 | s[7] >>> 4;
            b11 = s[7] << 28 | s[6] >>> 4;
            b42 = s[17] << 23 | s[16] >>> 9;
            b43 = s[16] << 23 | s[17] >>> 9;
            b24 = s[26] << 25 | s[27] >>> 7;
            b25 = s[27] << 25 | s[26] >>> 7;
            b6 = s[36] << 21 | s[37] >>> 11;
            b7 = s[37] << 21 | s[36] >>> 11;
            b38 = s[47] << 24 | s[46] >>> 8;
            b39 = s[46] << 24 | s[47] >>> 8;
            b30 = s[8] << 27 | s[9] >>> 5;
            b31 = s[9] << 27 | s[8] >>> 5;
            b12 = s[18] << 20 | s[19] >>> 12;
            b13 = s[19] << 20 | s[18] >>> 12;
            b44 = s[29] << 7 | s[28] >>> 25;
            b45 = s[28] << 7 | s[29] >>> 25;
            b26 = s[38] << 8 | s[39] >>> 24;
            b27 = s[39] << 8 | s[38] >>> 24;
            b8 = s[48] << 14 | s[49] >>> 18;
            b9 = s[49] << 14 | s[48] >>> 18;
            s[0] = b0 ^ ~b2 & b4;
            s[1] = b1 ^ ~b3 & b5;
            s[10] = b10 ^ ~b12 & b14;
            s[11] = b11 ^ ~b13 & b15;
            s[20] = b20 ^ ~b22 & b24;
            s[21] = b21 ^ ~b23 & b25;
            s[30] = b30 ^ ~b32 & b34;
            s[31] = b31 ^ ~b33 & b35;
            s[40] = b40 ^ ~b42 & b44;
            s[41] = b41 ^ ~b43 & b45;
            s[2] = b2 ^ ~b4 & b6;
            s[3] = b3 ^ ~b5 & b7;
            s[12] = b12 ^ ~b14 & b16;
            s[13] = b13 ^ ~b15 & b17;
            s[22] = b22 ^ ~b24 & b26;
            s[23] = b23 ^ ~b25 & b27;
            s[32] = b32 ^ ~b34 & b36;
            s[33] = b33 ^ ~b35 & b37;
            s[42] = b42 ^ ~b44 & b46;
            s[43] = b43 ^ ~b45 & b47;
            s[4] = b4 ^ ~b6 & b8;
            s[5] = b5 ^ ~b7 & b9;
            s[14] = b14 ^ ~b16 & b18;
            s[15] = b15 ^ ~b17 & b19;
            s[24] = b24 ^ ~b26 & b28;
            s[25] = b25 ^ ~b27 & b29;
            s[34] = b34 ^ ~b36 & b38;
            s[35] = b35 ^ ~b37 & b39;
            s[44] = b44 ^ ~b46 & b48;
            s[45] = b45 ^ ~b47 & b49;
            s[6] = b6 ^ ~b8 & b0;
            s[7] = b7 ^ ~b9 & b1;
            s[16] = b16 ^ ~b18 & b10;
            s[17] = b17 ^ ~b19 & b11;
            s[26] = b26 ^ ~b28 & b20;
            s[27] = b27 ^ ~b29 & b21;
            s[36] = b36 ^ ~b38 & b30;
            s[37] = b37 ^ ~b39 & b31;
            s[46] = b46 ^ ~b48 & b40;
            s[47] = b47 ^ ~b49 & b41;
            s[8] = b8 ^ ~b0 & b2;
            s[9] = b9 ^ ~b1 & b3;
            s[18] = b18 ^ ~b10 & b12;
            s[19] = b19 ^ ~b11 & b13;
            s[28] = b28 ^ ~b20 & b22;
            s[29] = b29 ^ ~b21 & b23;
            s[38] = b38 ^ ~b30 & b32;
            s[39] = b39 ^ ~b31 & b33;
            s[48] = b48 ^ ~b40 & b42;
            s[49] = b49 ^ ~b41 & b43;
            s[0] ^= RC[n];
            s[1] ^= RC[n + 1];
          }
        };
        if (COMMON_JS) {
          module.exports = methods;
        } else {
          for (i = 0; i < methodNames.length; ++i) {
            root[methodNames[i]] = methods[methodNames[i]];
          }
          if (AMD) {
            define(function() {
              return methods;
            });
          }
        }
      })();
    }
  });

  // node_modules/rlp/dist/index.js
  var require_dist = __commonJS({
    "node_modules/rlp/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.utils = exports.decode = exports.encode = void 0;
      function encode(input) {
        if (Array.isArray(input)) {
          const output = [];
          for (let i = 0; i < input.length; i++) {
            output.push(encode(input[i]));
          }
          const buf = concatBytes(...output);
          return concatBytes(encodeLength(buf.length, 192), buf);
        }
        const inputBuf = toBytes(input);
        if (inputBuf.length === 1 && inputBuf[0] < 128) {
          return inputBuf;
        }
        return concatBytes(encodeLength(inputBuf.length, 128), inputBuf);
      }
      exports.encode = encode;
      function safeSlice(input, start, end) {
        if (end > input.length) {
          throw new Error("invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds");
        }
        return input.slice(start, end);
      }
      function decodeLength(v) {
        if (v[0] === 0) {
          throw new Error("invalid RLP: extra zeros");
        }
        return parseHexByte(bytesToHex(v));
      }
      function encodeLength(len, offset) {
        if (len < 56) {
          return Uint8Array.from([len + offset]);
        }
        const hexLength = numberToHex(len);
        const lLength = hexLength.length / 2;
        const firstByte = numberToHex(offset + 55 + lLength);
        return Uint8Array.from(hexToBytes(firstByte + hexLength));
      }
      function decode(input, stream = false) {
        if (!input || input.length === 0) {
          return Uint8Array.from([]);
        }
        const inputBytes = toBytes(input);
        const decoded = _decode(inputBytes);
        if (stream) {
          return decoded;
        }
        if (decoded.remainder.length !== 0) {
          throw new Error("invalid RLP: remainder must be zero");
        }
        return decoded.data;
      }
      exports.decode = decode;
      function _decode(input) {
        let length, llength, data, innerRemainder, d;
        const decoded = [];
        const firstByte = input[0];
        if (firstByte <= 127) {
          return {
            data: input.slice(0, 1),
            remainder: input.slice(1)
          };
        } else if (firstByte <= 183) {
          length = firstByte - 127;
          if (firstByte === 128) {
            data = Uint8Array.from([]);
          } else {
            data = safeSlice(input, 1, length);
          }
          if (length === 2 && data[0] < 128) {
            throw new Error("invalid RLP encoding: invalid prefix, single byte < 0x80 are not prefixed");
          }
          return {
            data,
            remainder: input.slice(length)
          };
        } else if (firstByte <= 191) {
          llength = firstByte - 182;
          if (input.length - 1 < llength) {
            throw new Error("invalid RLP: not enough bytes for string length");
          }
          length = decodeLength(safeSlice(input, 1, llength));
          if (length <= 55) {
            throw new Error("invalid RLP: expected string length to be greater than 55");
          }
          data = safeSlice(input, llength, length + llength);
          return {
            data,
            remainder: input.slice(length + llength)
          };
        } else if (firstByte <= 247) {
          length = firstByte - 191;
          innerRemainder = safeSlice(input, 1, length);
          while (innerRemainder.length) {
            d = _decode(innerRemainder);
            decoded.push(d.data);
            innerRemainder = d.remainder;
          }
          return {
            data: decoded,
            remainder: input.slice(length)
          };
        } else {
          llength = firstByte - 246;
          length = decodeLength(safeSlice(input, 1, llength));
          if (length < 56) {
            throw new Error("invalid RLP: encoded list too short");
          }
          const totalLength = llength + length;
          if (totalLength > input.length) {
            throw new Error("invalid RLP: total length is larger than the data");
          }
          innerRemainder = safeSlice(input, llength, totalLength);
          while (innerRemainder.length) {
            d = _decode(innerRemainder);
            decoded.push(d.data);
            innerRemainder = d.remainder;
          }
          return {
            data: decoded,
            remainder: input.slice(totalLength)
          };
        }
      }
      var cachedHexes = Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex(uint8a) {
        let hex = "";
        for (let i = 0; i < uint8a.length; i++) {
          hex += cachedHexes[uint8a[i]];
        }
        return hex;
      }
      function parseHexByte(hexByte) {
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte))
          throw new Error("Invalid byte sequence");
        return byte;
      }
      function hexToBytes(hex) {
        if (typeof hex !== "string") {
          throw new TypeError("hexToBytes: expected string, got " + typeof hex);
        }
        if (hex.length % 2)
          throw new Error("hexToBytes: received invalid unpadded hex");
        const array = new Uint8Array(hex.length / 2);
        for (let i = 0; i < array.length; i++) {
          const j = i * 2;
          array[i] = parseHexByte(hex.slice(j, j + 2));
        }
        return array;
      }
      function concatBytes(...arrays) {
        if (arrays.length === 1)
          return arrays[0];
        const length = arrays.reduce((a, arr) => a + arr.length, 0);
        const result = new Uint8Array(length);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const arr = arrays[i];
          result.set(arr, pad);
          pad += arr.length;
        }
        return result;
      }
      function utf8ToBytes(utf) {
        return new TextEncoder().encode(utf);
      }
      function numberToHex(integer) {
        if (integer < 0) {
          throw new Error("Invalid integer as argument, must be unsigned!");
        }
        const hex = integer.toString(16);
        return hex.length % 2 ? `0${hex}` : hex;
      }
      function padToEven(a) {
        return a.length % 2 ? `0${a}` : a;
      }
      function isHexPrefixed(str) {
        return str.length >= 2 && str[0] === "0" && str[1] === "x";
      }
      function stripHexPrefix(str) {
        if (typeof str !== "string") {
          return str;
        }
        return isHexPrefixed(str) ? str.slice(2) : str;
      }
      function toBytes(v) {
        if (v instanceof Uint8Array) {
          return v;
        }
        if (typeof v === "string") {
          if (isHexPrefixed(v)) {
            return hexToBytes(padToEven(stripHexPrefix(v)));
          }
          return utf8ToBytes(v);
        }
        if (typeof v === "number" || typeof v === "bigint") {
          if (!v) {
            return Uint8Array.from([]);
          }
          return hexToBytes(numberToHex(v));
        }
        if (v === null || v === void 0) {
          return Uint8Array.from([]);
        }
        throw new Error("toBytes: received unsupported type " + typeof v);
      }
      exports.utils = {
        bytesToHex,
        concatBytes,
        hexToBytes,
        utf8ToBytes
      };
      var RLP2 = { encode, decode };
      exports.default = RLP2;
    }
  });

  // src/script.js
  var import_js_sha3 = __toESM(require_sha3());
  var import_rlp2 = __toESM(require_dist());

  // src/util.js
  var import_rlp = __toESM(require_dist());
  var bufferFromHex = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  var arrToJSON = (ba) => {
    if (ba instanceof Uint8Array) {
      return import_rlp.utils.bytesToHex(ba);
    } else if (ba instanceof Array) {
      const arr = [];
      for (let i = 0; i < ba.length; i++) {
        arr.push(arrToJSON(ba[i]));
      }
      return arr;
    }
  };

  // src/script.js
  async function queryLevelDB(key) {
    return await (await fetch(`http://leveldb.logisol.io/query/${key}`)).json();
  }
  window.basicStorageSlotKeys = (() => {
    const keys = {};
    for (let i = 0; i < 100; i++) {
      const index = i.toString(16).padStart(64, "0");
      const indexAsBuffer = Uint8Array.from(index.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
      keys[(0, import_js_sha3.keccak256)(indexAsBuffer)] = index;
    }
    return keys;
  })();
  window.exhaustStorageTrie = async (storageRoot, currentPath = "", slots = {}) => {
    const rootNode = await queryLevelDB(storageRoot);
    const buf = bufferFromHex(rootNode.value);
    const decoded = import_rlp2.default.decode(buf);
    const arr = arrToJSON(decoded);
    if (arr.length === 17) {
      for (let [i, key] of arr.slice(0, 16).entries()) {
        if (key === "")
          continue;
        const digit = i.toString(16);
        await window.exhaustStorageTrie(key, `${currentPath}${digit}`, slots);
      }
    } else if (arr.length === 2) {
      let flag = arr[0].slice(0, 1);
      let trailingPath;
      if (["1", "0"].includes(flag)) {
        if (flag === "0")
          trailingPath = arr[0].slice(1);
        else
          trailingPath = arr[0].slice(2);
        const nextKey = arr[1];
        await window.exhaustStorageTrie(nextKey, `${currentPath}${trailingPath}`, slots);
      } else if (["2", "3"].includes(flag)) {
        if (flag === "3")
          trailingPath = arr[0].slice(1);
        else
          trailingPath = arr[0].slice(2);
        const finalPath = `${currentPath}${trailingPath}`;
        const decodedSlot = basicStorageSlotKeys[finalPath];
        const bufVal = bufferFromHex(arr[1]);
        const decodedVal = import_rlp2.default.decode(bufVal);
        const arrVal = arrToJSON(decodedVal);
        slots[decodedSlot ?? finalPath] = arrVal;
      }
    }
    return slots;
  };
  var _NotebookCell = class {
    constructor() {
      this.element = document.createElement("div");
      this.element.classList.add("cell");
      this.element.innerHTML = _NotebookCell.template;
      this.mapElements();
      this.setupEvents();
    }
    onInitialResult(fn) {
      this._resultCb = fn;
    }
    mapElements() {
      const els = this.element.querySelectorAll("[data-el]");
      this.elements = {};
      for (let el of Array.from(els)) {
        this.elements[el.dataset.el] = el;
      }
    }
    setupEvents() {
      this.elements.button.addEventListener("click", async () => {
        const key = this.elements.key.value;
        const response = await queryLevelDB(key);
        const value = response.blobValue ?? response.value;
        this.elements.value.textContent = value;
        this.elements.decodedValue.textContent = "";
        if (this._resultCbInvoked !== true) {
          this._resultCbInvoked = true;
          this._resultCb();
        }
      });
      const rlp = () => {
        const value = this.elements.value.textContent;
        const buf = bufferFromHex(value);
        const decoded = import_rlp2.default.decode(buf);
        const arr = arrToJSON(decoded);
        return arr;
      };
      this.elements.decodeRLP.addEventListener("click", async () => {
        this.elements.decodedValue.textContent = JSON.stringify(rlp());
      });
      const fromRlpToObject = (keys) => {
        const values = rlp();
        const data = {};
        for (let [i, k] of keys.entries()) {
          data[k] = values[i];
        }
        this.elements.decodedValue.textContent = JSON.stringify(data, null, 4);
      };
      this.elements.decodeBlockHeader.addEventListener("click", async () => {
        fromRlpToObject([
          "parentHash",
          "ommersHash",
          "beneficiary",
          "stateRoot",
          "transactionRoot",
          "receiptsRoot",
          "logsBloom",
          "difficulty",
          "number",
          "gasLimit",
          "gasUsed",
          "timestamp",
          "extraData",
          "mixHash",
          "nonce"
        ]);
      });
      this.elements.decodePatriciaNode.addEventListener("click", async () => {
        const result = rlp();
        if (result.length === 17) {
          fromRlpToObject([
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "value"
          ]);
        } else if (result.length === 2) {
          if (["0", "1"].includes(result[0].charAt(0))) {
            fromRlpToObject(["path", "nextKey"]);
          } else if (["2", "3"].includes(result[0].charAt(0))) {
            fromRlpToObject(["path", "value"]);
          }
        }
      });
      this.elements.decodeAccountNode.addEventListener("click", async () => {
        const result = rlp();
        const value = result[1];
        const buf = bufferFromHex(value);
        const decoded = import_rlp2.default.decode(buf);
        const account = arrToJSON(decoded);
        const data = {
          remainingPath: result[0],
          accountDetails: {
            nonce: account[0],
            balance: account[1],
            storageRoot: account[2],
            codeHash: account[3]
          }
        };
        this.elements.decodedValue.textContent = JSON.stringify(data, null, 4);
      });
    }
  };
  var NotebookCell = _NotebookCell;
  __publicField(NotebookCell, "template", `
        <div style="display:flex">
            <input data-el="key" type=text style="flex:1 1 auto" />
            <button data-el="button" style="flex:0 0 auto" >Query</button>
        </div>
        <pre data-el="value" style="white-space:pre-wrap;word-break:break-all"></pre>
        <div style="display:flex">
            <span>Decode:</span>
            <button data-el="decodeRLP">Basic RLP</button>
            <button data-el="decodeBlockHeader">Block Header</button>
            <button data-el="decodePatriciaNode">Patricia Node</button>
            <button data-el="decodeAccountNode">Account Leaf Node</button>
        </div>
        <pre data-el="decodedValue" style="white-space:pre-wrap;word-break:break-all"></pre>
    `);
  createCell(document.getElementById("notebook"));
  function createCell(notebook) {
    const notebookCell = new NotebookCell();
    notebookCell.onInitialResult(() => {
      createCell(notebook);
      window.scrollTo(0, document.body.scrollHeight);
    });
    notebook.appendChild(notebookCell.element);
  }
  queryLevelDB("4c617374426c6f636b").then((r) => r.value).then((hash) => queryLevelDB(`48${hash}`)).then((r) => parseInt(r.value, 16)).then((blockNum) => {
    document.getElementById("lastBlock").textContent = blockNum;
  });
})();
/*! Bundled license information:

js-sha3/src/sha3.js:
  (**
   * [js-sha3]{@link https://github.com/emn178/js-sha3}
   *
   * @version 0.8.0
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2015-2018
   * @license MIT
   *)
*/
