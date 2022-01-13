/**
 * @license
 * Copyright 2017 The Lighthouse Authors. All Rights Reserved.
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
/* eslint-env browser */

/** @typedef {HTMLElementTagNameMap & {[id: string]: HTMLElement}} HTMLElementByTagName */

/** @template {string} T @typedef {import('typed-query-selector/parser').ParseSelector<T, Element>} ParseSelector */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOM = void 0;

var _util = require("./util.js");

var _components = require("./components.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var DOM = /*#__PURE__*/function () {
  /**
   * @param {Document} document
   * @param {HTMLElement} rootEl
   */
  function DOM(document, rootEl) {
    _classCallCheck(this, DOM);

    /** @type {Document} */
    this._document = document;
    /** @type {string} */

    this._lighthouseChannel = 'unknown';
    /** @type {Map<string, DocumentFragment>} */

    this._componentCache = new Map();
    /** @type {HTMLElement} */
    // For legacy Report API users, this'll be undefined, but set in renderReport

    this.rootEl = rootEl;
  }
  /**
   * @template {string} T
   * @param {T} name
   * @param {string=} className
   * @return {HTMLElementByTagName[T]}
   */


  _createClass(DOM, [{
    key: "createElement",
    value: function createElement(name, className) {
      var element = this._document.createElement(name);

      if (className) {
        var _iterator = _createForOfIteratorHelper(className.split(/\s+/)),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var token = _step.value;
            if (token) element.classList.add(token);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return element;
    }
    /**
     * @param {string} namespaceURI
     * @param {string} name
     * @param {string=} className
     * @return {Element}
     */

  }, {
    key: "createElementNS",
    value: function createElementNS(namespaceURI, name, className) {
      var element = this._document.createElementNS(namespaceURI, name);

      if (className) {
        var _iterator2 = _createForOfIteratorHelper(className.split(/\s+/)),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var token = _step2.value;
            if (token) element.classList.add(token);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      return element;
    }
    /**
     * @return {!DocumentFragment}
     */

  }, {
    key: "createFragment",
    value: function createFragment() {
      return this._document.createDocumentFragment();
    }
    /**
     * @param {string} data
     * @return {!Node}
     */

  }, {
    key: "createTextNode",
    value: function createTextNode(data) {
      return this._document.createTextNode(data);
    }
    /**
     * @template {string} T
     * @param {Element} parentElem
     * @param {T} elementName
     * @param {string=} className
     * @return {HTMLElementByTagName[T]}
     */

  }, {
    key: "createChildOf",
    value: function createChildOf(parentElem, elementName, className) {
      var element = this.createElement(elementName, className);
      parentElem.appendChild(element);
      return element;
    }
    /**
     * @param {import('./components.js').ComponentName} componentName
     * @return {!DocumentFragment} A clone of the cached component.
     */

  }, {
    key: "createComponent",
    value: function createComponent(componentName) {
      var component = this._componentCache.get(componentName);

      if (component) {
        var _cloned =
        /** @type {DocumentFragment} */
        component.cloneNode(true); // Prevent duplicate styles in the DOM. After a template has been stamped
        // for the first time, remove the clone's styles so they're not re-added.


        this.findAll('style', _cloned).forEach(function (style) {
          return style.remove();
        });
        return _cloned;
      }

      component = (0, _components.createComponent)(this, componentName);

      this._componentCache.set(componentName, component);

      var cloned =
      /** @type {DocumentFragment} */
      component.cloneNode(true);
      return cloned;
    }
  }, {
    key: "clearComponentCache",
    value: function clearComponentCache() {
      this._componentCache.clear();
    }
    /**
     * @param {string} text
     * @return {Element}
     */

  }, {
    key: "convertMarkdownLinkSnippets",
    value: function convertMarkdownLinkSnippets(text) {
      var element = this.createElement('span');

      var _iterator3 = _createForOfIteratorHelper(_util.Util.splitMarkdownLink(text)),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var segment = _step3.value;

          if (!segment.isLink) {
            // Plain text segment.
            element.appendChild(this._document.createTextNode(segment.text));
            continue;
          } // Otherwise, append any links found.


          var url = new URL(segment.linkHref);
          var DOCS_ORIGINS = ['https://developers.google.com', 'https://web.dev'];

          if (DOCS_ORIGINS.includes(url.origin)) {
            url.searchParams.set('utm_source', 'lighthouse');
            url.searchParams.set('utm_medium', this._lighthouseChannel);
          }

          var a = this.createElement('a');
          a.rel = 'noopener';
          a.target = '_blank';
          a.textContent = segment.text;
          this.safelySetHref(a, url.href);
          element.appendChild(a);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return element;
    }
    /**
     * Set link href, but safely, preventing `javascript:` protocol, etc.
     * @see https://github.com/google/safevalues/
     * @param {HTMLAnchorElement} elem
     * @param {string} url
     */

  }, {
    key: "safelySetHref",
    value: function safelySetHref(elem, url) {
      // Defaults to '' to fix proto roundtrip issue. See https://github.com/GoogleChrome/lighthouse/issues/12868
      url = url || ''; // In-page anchor links are safe.

      if (url.startsWith('#')) {
        elem.href = url;
        return;
      }

      var allowedProtocols = ['https:', 'http:'];
      var parsed;

      try {
        parsed = new URL(url);
      } catch (_) {}

      if (parsed && allowedProtocols.includes(parsed.protocol)) {
        elem.href = parsed.href;
      }
    }
    /**
     * Only create blob URLs for JSON & HTML
     * @param {HTMLAnchorElement} elem
     * @param {Blob} blob
     */

  }, {
    key: "safelySetBlobHref",
    value: function safelySetBlobHref(elem, blob) {
      if (blob.type !== 'text/html' && blob.type !== 'application/json') {
        throw new Error('Unsupported blob type');
      }

      var href = URL.createObjectURL(blob);
      elem.href = href;
    }
    /**
     * @param {string} markdownText
     * @return {Element}
     */

  }, {
    key: "convertMarkdownCodeSnippets",
    value: function convertMarkdownCodeSnippets(markdownText) {
      var element = this.createElement('span');

      var _iterator4 = _createForOfIteratorHelper(_util.Util.splitMarkdownCodeSpans(markdownText)),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var segment = _step4.value;

          if (segment.isCode) {
            var pre = this.createElement('code');
            pre.textContent = segment.text;
            element.appendChild(pre);
          } else {
            element.appendChild(this._document.createTextNode(segment.text));
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return element;
    }
    /**
     * The channel to use for UTM data when rendering links to the documentation.
     * @param {string} lighthouseChannel
     */

  }, {
    key: "setLighthouseChannel",
    value: function setLighthouseChannel(lighthouseChannel) {
      this._lighthouseChannel = lighthouseChannel;
    }
    /**
     * ONLY use if `dom.rootEl` isn't sufficient for your needs. `dom.rootEl` is preferred
     * for all scoping, because a document can have multiple reports within it.
     * @return {Document}
     */

  }, {
    key: "document",
    value: function document() {
      return this._document;
    }
    /**
     * TODO(paulirish): import and conditionally apply the DevTools frontend subclasses instead of this
     * @return {boolean}
     */

  }, {
    key: "isDevTools",
    value: function isDevTools() {
      return !!this._document.querySelector('.lh-devtools');
    }
    /**
     * Guaranteed context.querySelector. Always returns an element or throws if
     * nothing matches query.
     * @template {string} T
     * @param {T} query
     * @param {ParentNode} context
     * @return {ParseSelector<T>}
     */

  }, {
    key: "find",
    value: function find(query, context) {
      var result = context.querySelector(query);

      if (result === null) {
        throw new Error("query ".concat(query, " not found"));
      } // Because we control the report layout and templates, use the simpler
      // `typed-query-selector` types that don't require differentiating between
      // e.g. HTMLAnchorElement and SVGAElement. See https://github.com/GoogleChrome/lighthouse/issues/12011


      return (
        /** @type {ParseSelector<T>} */
        result
      );
    }
    /**
     * Helper for context.querySelectorAll. Returns an Array instead of a NodeList.
     * @template {string} T
     * @param {T} query
     * @param {ParentNode} context
     */

  }, {
    key: "findAll",
    value: function findAll(query, context) {
      var elements = Array.from(context.querySelectorAll(query));
      return elements;
    }
    /**
     * Fires a custom DOM event on target.
     * @param {string} name Name of the event.
     * @param {Node=} target DOM node to fire the event on.
     * @param {*=} detail Custom data to include.
     */

  }, {
    key: "fireEventOn",
    value: function fireEventOn(name) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._document;
      var detail = arguments.length > 2 ? arguments[2] : undefined;
      var event = new CustomEvent(name, detail ? {
        detail: detail
      } : undefined);
      target.dispatchEvent(event);
    }
    /**
     * Downloads a file (blob) using a[download].
     * @param {Blob|File} blob The file to save.
     * @param {string} filename
     */

  }, {
    key: "saveFile",
    value: function saveFile(blob, filename) {
      var ext = blob.type.match('json') ? '.json' : '.html';
      var a = this.createElement('a');
      a.download = "".concat(filename).concat(ext);
      this.safelySetBlobHref(a, blob);

      this._document.body.appendChild(a); // Firefox requires anchor to be in the DOM.


      a.click(); // cleanup.

      this._document.body.removeChild(a);

      setTimeout(function () {
        return URL.revokeObjectURL(a.href);
      }, 500);
    }
  }]);

  return DOM;
}();

exports.DOM = DOM;