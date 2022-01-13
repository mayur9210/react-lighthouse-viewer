/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/**
 * @fileoverview Creates a <select> element, filled with all supported locales
 */

/** @typedef {import('./dom.js').DOM} DOM */

/** @typedef {import('./report-ui-features').ReportUIFeatures} ReportUIFeatures */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwapLocaleFeature = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var SwapLocaleFeature = /*#__PURE__*/function () {
  /**
   * @param {ReportUIFeatures} reportUIFeatures
   * @param {DOM} dom
   * @param {{onLocaleSelected: (localeModuleName: LH.Locale) => Promise<void>}} callbacks
   *        Specifiy the URL where the i18n module script can be found, and the URLS for the locale JSON files.
   */
  function SwapLocaleFeature(reportUIFeatures, dom, callbacks) {
    _classCallCheck(this, SwapLocaleFeature);

    this._reportUIFeatures = reportUIFeatures;
    this._dom = dom;
    this._localeSelectedCallback = callbacks.onLocaleSelected;
  }
  /**
   * @param {Array<LH.Locale>} locales
   */


  _createClass(SwapLocaleFeature, [{
    key: "enable",
    value: function enable(locales) {
      var _this = this;

      if (!this._reportUIFeatures.json.i18n.icuMessagePaths) {
        throw new Error('missing icuMessagePaths');
      }

      this._dom.find('.lh-tools-locale', this._dom.rootEl).classList.remove('lh-hidden');

      var currentLocale = this._reportUIFeatures.json.configSettings.locale;

      var containerEl = this._dom.find('.lh-tools-locale__selector-wrapper', this._dom.rootEl);

      containerEl.removeAttribute('aria-hidden');

      var selectEl = this._dom.createChildOf(containerEl, 'select', 'lh-locale-selector');

      selectEl.name = 'lh-locale-list';
      selectEl.setAttribute('role', 'menuitem');

      var toggleEl = this._dom.find('.lh-tool-locale__button', this._dom.rootEl);

      toggleEl.addEventListener('click', function () {
        toggleEl.classList.toggle('lh-active');
      });

      var _iterator = _createForOfIteratorHelper(locales),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var locale = _step.value;

          var optionEl = this._dom.createChildOf(selectEl, 'option', '');

          optionEl.value = locale;
          if (locale === currentLocale) optionEl.selected = true;

          if (window.Intl && Intl.DisplayNames) {
            var currentLocaleDisplay = new Intl.DisplayNames([currentLocale], {
              type: 'language'
            });
            var optionLocaleDisplay = new Intl.DisplayNames([locale], {
              type: 'language'
            });
            var optionLocaleName = optionLocaleDisplay.of(locale);
            var currentLocaleName = currentLocaleDisplay.of(locale);

            if (optionLocaleName !== currentLocaleName) {
              optionEl.textContent = "".concat(optionLocaleName, " \u2013 ").concat(currentLocaleName);
            } else {
              optionEl.textContent = currentLocaleName;
            }
          } else {
            optionEl.textContent = locale;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      selectEl.addEventListener('change', function () {
        var locale =
        /** @type {LH.Locale} */
        selectEl.value;

        _this._localeSelectedCallback(locale);
      });
    }
  }]);

  return SwapLocaleFeature;
}();

exports.SwapLocaleFeature = SwapLocaleFeature;