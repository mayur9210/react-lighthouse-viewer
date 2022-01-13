/**
 * @license
 * Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openTreemap = openTreemap;
exports.openViewer = openViewer;
exports.openViewerAndSendData = openViewerAndSendData;

var _textEncoding = require("./text-encoding.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-env browser */
function getAppsOrigin() {
  var isVercel = window.location.host.endsWith('.vercel.app');
  var isDev = new URLSearchParams(window.location.search).has('dev');
  if (isVercel) return "https://".concat(window.location.host, "/gh-pages");
  if (isDev) return 'http://localhost:8000';
  return 'https://googlechrome.github.io/lighthouse';
}
/**
 * The popup's window.name is keyed by version+url+fetchTime, so we reuse/select tabs correctly.
 * @param {LH.Result} json
 * @protected
 */


function computeWindowNameSuffix(json) {
  // @ts-expect-error - If this is a v2 LHR, use old `generatedTime`.
  var fallbackFetchTime =
  /** @type {string} */
  json.generatedTime;
  var fetchTime = json.fetchTime || fallbackFetchTime;
  return "".concat(json.lighthouseVersion, "-").concat(json.requestedUrl, "-").concat(fetchTime);
}
/**
 * Opens a new tab to an external page and sends data using postMessage.
 * @param {{lhr: LH.Result} | LH.Treemap.Options} data
 * @param {string} url
 * @param {string} windowName
 * @protected
 */


function openTabAndSendData(data, url, windowName) {
  var origin = new URL(url).origin; // Chrome doesn't allow us to immediately postMessage to a popup right
  // after it's created. Normally, we could also listen for the popup window's
  // load event, however it is cross-domain and won't fire. Instead, listen
  // for a message from the target app saying "I'm open".

  window.addEventListener('message', function msgHandler(messageEvent) {
    if (messageEvent.origin !== origin) {
      return;
    }

    if (popup && messageEvent.data.opened) {
      popup.postMessage(data, origin);
      window.removeEventListener('message', msgHandler);
    }
  });
  var popup = window.open(url, windowName);
}
/**
 * Opens a new tab to an external page and sends data via base64 encoded url params.
 * @param {{lhr: LH.Result} | LH.Treemap.Options} data
 * @param {string} url_
 * @param {string} windowName
 * @protected
 */


function openTabWithUrlData(_x, _x2, _x3) {
  return _openTabWithUrlData.apply(this, arguments);
}
/**
 * Opens a new tab to the online viewer and sends the local page's JSON results
 * to the online viewer using URL.fragment
 * @param {LH.Result} lhr
 * @protected
 */


function _openTabWithUrlData() {
  _openTabWithUrlData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, url_, windowName) {
    var url, gzip;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = new URL(url_);
            gzip = Boolean(window.CompressionStream);
            _context.next = 4;
            return _textEncoding.TextEncoding.toBase64(JSON.stringify(data), {
              gzip: gzip
            });

          case 4:
            url.hash = _context.sent;
            if (gzip) url.searchParams.set('gzip', '1');
            window.open(url.toString(), windowName);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _openTabWithUrlData.apply(this, arguments);
}

function openViewer(_x4) {
  return _openViewer.apply(this, arguments);
}
/**
 * Same as openViewer, but uses postMessage.
 * @param {LH.Result} lhr
 * @protected
 */


function _openViewer() {
  _openViewer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(lhr) {
    var windowName, url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            windowName = 'viewer-' + computeWindowNameSuffix(lhr);
            url = getAppsOrigin() + '/viewer/';
            _context2.next = 4;
            return openTabWithUrlData({
              lhr: lhr
            }, url, windowName);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _openViewer.apply(this, arguments);
}

function openViewerAndSendData(_x5) {
  return _openViewerAndSendData.apply(this, arguments);
}
/**
 * Opens a new tab to the treemap app and sends the JSON results using URL.fragment
 * @param {LH.Result} json
 */


function _openViewerAndSendData() {
  _openViewerAndSendData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(lhr) {
    var windowName, url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            windowName = 'viewer-' + computeWindowNameSuffix(lhr);
            url = getAppsOrigin() + '/viewer/';
            openTabAndSendData({
              lhr: lhr
            }, url, windowName);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _openViewerAndSendData.apply(this, arguments);
}

function openTreemap(json) {
  var treemapData = json.audits['script-treemap-data'].details;

  if (!treemapData) {
    throw new Error('no script treemap data found');
  }
  /** @type {LH.Treemap.Options} */


  var treemapOptions = {
    lhr: {
      requestedUrl: json.requestedUrl,
      finalUrl: json.finalUrl,
      audits: {
        'script-treemap-data': json.audits['script-treemap-data']
      },
      configSettings: {
        locale: json.configSettings.locale
      }
    }
  };
  var url = getAppsOrigin() + '/treemap/';
  var windowName = 'treemap-' + computeWindowNameSuffix(json);
  openTabWithUrlData(treemapOptions, url, windowName);
}