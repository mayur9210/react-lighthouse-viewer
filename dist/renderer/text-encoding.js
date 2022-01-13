/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/* global CompressionStream */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextEncoding = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var btoa_ = typeof btoa !== 'undefined' ? btoa :
/** @param {string} str */
function (str) {
  return Buffer.from(str).toString('base64');
};
var atob_ = typeof atob !== 'undefined' ? atob :
/** @param {string} str */
function (str) {
  return Buffer.from(str, 'base64').toString();
};
/**
 * Takes an UTF-8 string and returns a base64 encoded string.
 * If gzip is true, the UTF-8 bytes are gzipped before base64'd, using
 * CompressionStream (currently only in Chrome), falling back to pako
 * (which is only used to encode in our Node tests).
 * @param {string} string
 * @param {{gzip: boolean}} options
 * @return {Promise<string>}
 */

function toBase64(_x, _x2) {
  return _toBase.apply(this, arguments);
}
/**
 * @param {string} encoded
 * @param {{gzip: boolean}} options
 * @return {string}
 */


function _toBase() {
  _toBase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(string, options) {
    var bytes, cs, writer, compAb, pako, binaryString, chunkSize, i;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bytes = new TextEncoder().encode(string);

            if (!options.gzip) {
              _context.next = 15;
              break;
            }

            if (!(typeof CompressionStream !== 'undefined')) {
              _context.next = 13;
              break;
            }

            cs = new CompressionStream('gzip');
            writer = cs.writable.getWriter();
            writer.write(bytes);
            writer.close();
            _context.next = 9;
            return new Response(cs.readable).arrayBuffer();

          case 9:
            compAb = _context.sent;
            bytes = new Uint8Array(compAb);
            _context.next = 15;
            break;

          case 13:
            /** @type {import('pako')=} */
            pako = window.pako;
            bytes = pako.gzip(string);

          case 15:
            binaryString = ''; // This is ~25% faster than building the string one character at a time.
            // https://jsbench.me/2gkoxazvjl

            chunkSize = 5000;

            for (i = 0; i < bytes.length; i += chunkSize) {
              binaryString += String.fromCharCode.apply(String, _toConsumableArray(bytes.subarray(i, i + chunkSize)));
            }

            return _context.abrupt("return", btoa_(binaryString));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _toBase.apply(this, arguments);
}

function fromBase64(encoded, options) {
  var binaryString = atob_(encoded);
  var bytes = Uint8Array.from(binaryString, function (c) {
    return c.charCodeAt(0);
  });

  if (options.gzip) {
    /** @type {import('pako')=} */
    var pako = window.pako;
    return pako.ungzip(bytes, {
      to: 'string'
    });
  } else {
    return new TextDecoder().decode(bytes);
  }
}

var TextEncoding = {
  toBase64: toBase64,
  fromBase64: fromBase64
};
exports.TextEncoding = TextEncoding;