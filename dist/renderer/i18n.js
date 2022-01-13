/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict'; // Not named `NBSP` because that creates a duplicate identifier (util.js).

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I18n = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var NBSP2 = '\xa0';
var KiB = 1024;
var MiB = KiB * KiB;
/**
 * @template T
 */

var I18n = /*#__PURE__*/function () {
  /**
   * @param {LH.Locale} locale
   * @param {T} strings
   */
  function I18n(locale, strings) {
    _classCallCheck(this, I18n);

    // When testing, use a locale with more exciting numeric formatting.
    if (locale === 'en-XA') locale = 'de';
    this._numberDateLocale = locale;
    this._numberFormatter = new Intl.NumberFormat(locale);
    this._percentFormatter = new Intl.NumberFormat(locale, {
      style: 'percent'
    });
    this._strings = strings;
  }

  _createClass(I18n, [{
    key: "strings",
    get: function get() {
      return this._strings;
    }
    /**
     * Format number.
     * @param {number} number
     * @param {number=} granularity Number of decimal places to include. Defaults to 0.1.
     * @return {string}
     */

  }, {
    key: "formatNumber",
    value: function formatNumber(number) {
      var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
      var coarseValue = Math.round(number / granularity) * granularity;
      return this._numberFormatter.format(coarseValue);
    }
    /**
     * Format percent.
     * @param {number} number 0–1
     * @return {string}
     */

  }, {
    key: "formatPercent",
    value: function formatPercent(number) {
      return this._percentFormatter.format(number);
    }
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is, defaults to 0.1
     * @return {string}
     */

  }, {
    key: "formatBytesToKiB",
    value: function formatBytesToKiB(size) {
      var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;

      var formatter = this._byteFormatterForGranularity(granularity);

      var kbs = formatter.format(Math.round(size / 1024 / granularity) * granularity);
      return "".concat(kbs).concat(NBSP2, "KiB");
    }
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is, defaults to 0.1
     * @return {string}
     */

  }, {
    key: "formatBytesToMiB",
    value: function formatBytesToMiB(size) {
      var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;

      var formatter = this._byteFormatterForGranularity(granularity);

      var kbs = formatter.format(Math.round(size / Math.pow(1024, 2) / granularity) * granularity);
      return "".concat(kbs).concat(NBSP2, "MiB");
    }
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is, defaults to 1
     * @return {string}
     */

  }, {
    key: "formatBytes",
    value: function formatBytes(size) {
      var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var formatter = this._byteFormatterForGranularity(granularity);

      var kbs = formatter.format(Math.round(size / granularity) * granularity);
      return "".concat(kbs).concat(NBSP2, "bytes");
    }
    /**
     * @param {number} size
     * @param {number=} granularity Controls how coarse the displayed value is, defaults to 0.1
     * @return {string}
     */

  }, {
    key: "formatBytesWithBestUnit",
    value: function formatBytesWithBestUnit(size) {
      var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
      if (size >= MiB) return this.formatBytesToMiB(size, granularity);
      if (size >= KiB) return this.formatBytesToKiB(size, granularity);
      return this.formatNumber(size, granularity) + '\xa0B';
    }
    /**
     * Format bytes with a constant number of fractional digits, i.e. for a granularity of 0.1, 10 becomes '10.0'
     * @param {number} granularity Controls how coarse the displayed value is
     * @return {Intl.NumberFormat}
     */

  }, {
    key: "_byteFormatterForGranularity",
    value: function _byteFormatterForGranularity(granularity) {
      // assume any granularity above 1 will not contain fractional parts, i.e. will never be 1.5
      var numberOfFractionDigits = 0;

      if (granularity < 1) {
        numberOfFractionDigits = -Math.floor(Math.log10(granularity));
      }

      return new Intl.NumberFormat(this._numberDateLocale, _objectSpread(_objectSpread({}, this._numberFormatter.resolvedOptions()), {}, {
        maximumFractionDigits: numberOfFractionDigits,
        minimumFractionDigits: numberOfFractionDigits
      }));
    }
    /**
     * @param {number} ms
     * @param {number=} granularity Controls how coarse the displayed value is, defaults to 10
     * @return {string}
     */

  }, {
    key: "formatMilliseconds",
    value: function formatMilliseconds(ms) {
      var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var coarseTime = Math.round(ms / granularity) * granularity;
      return coarseTime === 0 ? "".concat(this._numberFormatter.format(0)).concat(NBSP2, "ms") : "".concat(this._numberFormatter.format(coarseTime)).concat(NBSP2, "ms");
    }
    /**
     * @param {number} ms
     * @param {number=} granularity Controls how coarse the displayed value is, defaults to 0.1
     * @return {string}
     */

  }, {
    key: "formatSeconds",
    value: function formatSeconds(ms) {
      var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
      var coarseTime = Math.round(ms / 1000 / granularity) * granularity;
      return "".concat(this._numberFormatter.format(coarseTime)).concat(NBSP2, "s");
    }
    /**
     * Format time.
     * @param {string} date
     * @return {string}
     */

  }, {
    key: "formatDateTime",
    value: function formatDateTime(date) {
      /** @type {Intl.DateTimeFormatOptions} */
      var options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      }; // Force UTC if runtime timezone could not be detected.
      // See https://github.com/GoogleChrome/lighthouse/issues/1056
      // and https://github.com/GoogleChrome/lighthouse/pull/9822

      var formatter;

      try {
        formatter = new Intl.DateTimeFormat(this._numberDateLocale, options);
      } catch (err) {
        options.timeZone = 'UTC';
        formatter = new Intl.DateTimeFormat(this._numberDateLocale, options);
      }

      return formatter.format(new Date(date));
    }
    /**
     * Converts a time in milliseconds into a duration string, i.e. `1d 2h 13m 52s`
     * @param {number} timeInMilliseconds
     * @return {string}
     */

  }, {
    key: "formatDuration",
    value: function formatDuration(timeInMilliseconds) {
      var timeInSeconds = timeInMilliseconds / 1000;

      if (Math.round(timeInSeconds) === 0) {
        return 'None';
      }
      /** @type {Array<string>} */


      var parts = [];
      /** @type {Record<string, number>} */

      var unitLabels = {
        d: 60 * 60 * 24,
        h: 60 * 60,
        m: 60,
        s: 1
      };
      Object.keys(unitLabels).forEach(function (label) {
        var unit = unitLabels[label];
        var numberOfUnits = Math.floor(timeInSeconds / unit);

        if (numberOfUnits > 0) {
          timeInSeconds -= numberOfUnits * unit;
          parts.push("".concat(numberOfUnits, "\xA0").concat(label));
        }
      });
      return parts.join(' ');
    }
  }]);

  return I18n;
}();

exports.I18n = I18n;