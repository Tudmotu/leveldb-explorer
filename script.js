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
        const fetchResponse = await fetch(`http://leveldb.logisol.io/query/${key}`);
        const response = await fetchResponse.json();
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
      this.elements.decodeBranchNode.addEventListener("click", async () => {
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
      });
      this.elements.decodeExtensionNode.addEventListener("click", async () => {
        fromRlpToObject(["path", "nextKey"]);
      });
      this.elements.decodeLeafNode.addEventListener("click", async () => {
        fromRlpToObject(["path", "value"]);
      });
      this.elements.decodeAccountNode.addEventListener("click", async () => {
        const result = rlp();
        const value = result[1];
        const buf = bufferFromHex(value);
        const decoded = import_rlp2.default.decode(buf);
        const account = arrToJSON(decoded);
        const data = {
          key: result[0],
          rawValue: value,
          rlpDecodedValue: account,
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
            <button data-el="decodeRLP">RLP</button>
            <button data-el="decodeBlockHeader">Block Header JSON from RLP</button>
            <button data-el="decodeBranchNode">Patricia Branch Node</button>
            <button data-el="decodeExtensionNode">Patricia Extension Node</button>
            <button data-el="decodeLeafNode">Patricia Leaf Node</button>
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
})();
