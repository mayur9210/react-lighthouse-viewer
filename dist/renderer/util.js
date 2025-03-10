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
/** @template T @typedef {import('./i18n').I18n<T>} I18n */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Util = exports.UIStrings = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ELLIPSIS = "\u2026";
var NBSP = '\xa0';
var PASS_THRESHOLD = 0.9;
var SCREENSHOT_PREFIX = 'data:image/jpeg;base64,';
var RATINGS = {
  PASS: {
    label: 'pass',
    minScore: PASS_THRESHOLD
  },
  AVERAGE: {
    label: 'average',
    minScore: 0.5
  },
  FAIL: {
    label: 'fail'
  },
  ERROR: {
    label: 'error'
  }
}; // 25 most used tld plus one domains (aka public suffixes) from http archive.
// @see https://github.com/GoogleChrome/lighthouse/pull/5065#discussion_r191926212
// The canonical list is https://publicsuffix.org/learn/ but we're only using subset to conserve bytes

var listOfTlds = ['com', 'co', 'gov', 'edu', 'ac', 'org', 'go', 'gob', 'or', 'net', 'in', 'ne', 'nic', 'gouv', 'web', 'spb', 'blog', 'jus', 'kiev', 'mil', 'wi', 'qc', 'ca', 'bel', 'on'];

var Util = /*#__PURE__*/function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: "PASS_THRESHOLD",
    get:
    /** @type {I18n<typeof UIStrings>} */
    // @ts-expect-error: Is set in report renderer.
    function get() {
      return PASS_THRESHOLD;
    }
  }, {
    key: "MS_DISPLAY_VALUE",
    get: function get() {
      return "%10d".concat(NBSP, "ms");
    }
    /**
     * Returns a new LHR that's reshaped for slightly better ergonomics within the report rendereer.
     * Also, sets up the localized UI strings used within renderer and makes changes to old LHRs to be
     * compatible with current renderer.
     * The LHR passed in is not mutated.
     * TODO(team): we all agree the LHR shape change is technical debt we should fix
     * @param {LH.Result} result
     * @return {LH.ReportResult}
     */

  }, {
    key: "prepareReportResult",
    value: function prepareReportResult(result) {
      // If any mutations happen to the report within the renderers, we want the original object untouched
      var clone =
      /** @type {LH.ReportResult} */
      JSON.parse(JSON.stringify(result)); // If LHR is older (≤3.0.3), it has no locale setting. Set default.

      if (!clone.configSettings.locale) {
        clone.configSettings.locale = 'en';
      }

      if (!clone.configSettings.formFactor) {
        // @ts-expect-error fallback handling for emulatedFormFactor
        clone.configSettings.formFactor = clone.configSettings.emulatedFormFactor;
      }

      for (var _i = 0, _Object$values = Object.values(clone.audits); _i < _Object$values.length; _i++) {
        var audit = _Object$values[_i];

        // Turn 'not-applicable' (LHR <4.0) and 'not_applicable' (older proto versions)
        // into 'notApplicable' (LHR ≥4.0).
        // @ts-expect-error tsc rightly flags that these values shouldn't occur.
        // eslint-disable-next-line max-len
        if (audit.scoreDisplayMode === 'not_applicable' || audit.scoreDisplayMode === 'not-applicable') {
          audit.scoreDisplayMode = 'notApplicable';
        }

        if (audit.details) {
          // Turn `auditDetails.type` of undefined (LHR <4.2) and 'diagnostic' (LHR <5.0)
          // into 'debugdata' (LHR ≥5.0).
          // @ts-expect-error tsc rightly flags that these values shouldn't occur.
          if (audit.details.type === undefined || audit.details.type === 'diagnostic') {
            // @ts-expect-error details is of type never.
            audit.details.type = 'debugdata';
          } // Add the jpg data URL prefix to filmstrip screenshots without them (LHR <5.0).


          if (audit.details.type === 'filmstrip') {
            var _iterator = _createForOfIteratorHelper(audit.details.items),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var screenshot = _step.value;

                if (!screenshot.data.startsWith(SCREENSHOT_PREFIX)) {
                  screenshot.data = SCREENSHOT_PREFIX + screenshot.data;
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }
      } // For convenience, smoosh all AuditResults into their auditRef (which has just weight & group)


      if (_typeof(clone.categories) !== 'object') throw new Error('No categories provided.');
      /** @type {Map<string, Array<LH.ReportResult.AuditRef>>} */

      var relevantAuditToMetricsMap = new Map(); // This backcompat converts old LHRs (<9.0.0) to use the new "hidden" group.
      // Old LHRs used "no group" to identify audits that should be hidden in performance instead of the "hidden" group.
      // Newer LHRs use "no group" to identify opportunities and diagnostics whose groups are assigned by details type.

      var _clone$lighthouseVers = clone.lighthouseVersion.split('.').map(Number),
          _clone$lighthouseVers2 = _slicedToArray(_clone$lighthouseVers, 1),
          majorVersion = _clone$lighthouseVers2[0];

      var perfCategory = clone.categories['performance'];

      if (majorVersion < 9 && perfCategory) {
        if (!clone.categoryGroups) clone.categoryGroups = {};
        clone.categoryGroups['hidden'] = {
          title: ''
        };

        var _iterator2 = _createForOfIteratorHelper(perfCategory.auditRefs),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var auditRef = _step2.value;

            if (!auditRef.group) {
              auditRef.group = 'hidden';
            } else if (['load-opportunities', 'diagnostics'].includes(auditRef.group)) {
              delete auditRef.group;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      for (var _i2 = 0, _Object$values2 = Object.values(clone.categories); _i2 < _Object$values2.length; _i2++) {
        var category = _Object$values2[_i2];
        // Make basic lookup table for relevantAudits
        category.auditRefs.forEach(function (metricRef) {
          if (!metricRef.relevantAudits) return;
          metricRef.relevantAudits.forEach(function (auditId) {
            var arr = relevantAuditToMetricsMap.get(auditId) || [];
            arr.push(metricRef);
            relevantAuditToMetricsMap.set(auditId, arr);
          });
        });
        category.auditRefs.forEach(function (auditRef) {
          var result = clone.audits[auditRef.id];
          auditRef.result = result; // Attach any relevantMetric auditRefs

          if (relevantAuditToMetricsMap.has(auditRef.id)) {
            auditRef.relevantMetrics = relevantAuditToMetricsMap.get(auditRef.id);
          } // attach the stackpacks to the auditRef object


          if (clone.stackPacks) {
            clone.stackPacks.forEach(function (pack) {
              if (pack.descriptions[auditRef.id]) {
                auditRef.stackPacks = auditRef.stackPacks || [];
                auditRef.stackPacks.push({
                  title: pack.title,
                  iconDataURL: pack.iconDataURL,
                  description: pack.descriptions[auditRef.id]
                });
              }
            });
          }
        });
      }

      return clone;
    }
    /**
     * Used to determine if the "passed" for the purposes of showing up in the "failed" or "passed"
     * sections of the report.
     *
     * @param {{score: (number|null), scoreDisplayMode: string}} audit
     * @return {boolean}
     */

  }, {
    key: "showAsPassed",
    value: function showAsPassed(audit) {
      switch (audit.scoreDisplayMode) {
        case 'manual':
        case 'notApplicable':
          return true;

        case 'error':
        case 'informative':
          return false;

        case 'numeric':
        case 'binary':
        default:
          return Number(audit.score) >= RATINGS.PASS.minScore;
      }
    }
    /**
     * Convert a score to a rating label.
     * TODO: Return `'error'` for `score === null && !scoreDisplayMode`.
     *
     * @param {number|null} score
     * @param {string=} scoreDisplayMode
     * @return {string}
     */

  }, {
    key: "calculateRating",
    value: function calculateRating(score, scoreDisplayMode) {
      // Handle edge cases first, manual and not applicable receive 'pass', errored audits receive 'error'
      if (scoreDisplayMode === 'manual' || scoreDisplayMode === 'notApplicable') {
        return RATINGS.PASS.label;
      } else if (scoreDisplayMode === 'error') {
        return RATINGS.ERROR.label;
      } else if (score === null) {
        return RATINGS.FAIL.label;
      } // At this point, we're rating a standard binary/numeric audit


      var rating = RATINGS.FAIL.label;

      if (score >= RATINGS.PASS.minScore) {
        rating = RATINGS.PASS.label;
      } else if (score >= RATINGS.AVERAGE.minScore) {
        rating = RATINGS.AVERAGE.label;
      }

      return rating;
    }
    /**
     * Split a string by markdown code spans (enclosed in `backticks`), splitting
     * into segments that were enclosed in backticks (marked as `isCode === true`)
     * and those that outside the backticks (`isCode === false`).
     * @param {string} text
     * @return {Array<{isCode: true, text: string}|{isCode: false, text: string}>}
     */

  }, {
    key: "splitMarkdownCodeSpans",
    value: function splitMarkdownCodeSpans(text) {
      /** @type {Array<{isCode: true, text: string}|{isCode: false, text: string}>} */
      var segments = []; // Split on backticked code spans.

      var parts = text.split(/`(.*?)`/g);

      for (var i = 0; i < parts.length; i++) {
        var _text = parts[i]; // Empty strings are an artifact of splitting, not meaningful.

        if (!_text) continue; // Alternates between plain text and code segments.

        var isCode = i % 2 !== 0;
        segments.push({
          isCode: isCode,
          text: _text
        });
      }

      return segments;
    }
    /**
     * Split a string on markdown links (e.g. [some link](https://...)) into
     * segments of plain text that weren't part of a link (marked as
     * `isLink === false`), and segments with text content and a URL that did make
     * up a link (marked as `isLink === true`).
     * @param {string} text
     * @return {Array<{isLink: true, text: string, linkHref: string}|{isLink: false, text: string}>}
     */

  }, {
    key: "splitMarkdownLink",
    value: function splitMarkdownLink(text) {
      /** @type {Array<{isLink: true, text: string, linkHref: string}|{isLink: false, text: string}>} */
      var segments = [];
      var parts = text.split(/\[([^\]]+?)\]\((https?:\/\/.*?)\)/g);

      while (parts.length) {
        // Shift off the same number of elements as the pre-split and capture groups.
        var _parts$splice = parts.splice(0, 3),
            _parts$splice2 = _slicedToArray(_parts$splice, 3),
            preambleText = _parts$splice2[0],
            linkText = _parts$splice2[1],
            linkHref = _parts$splice2[2];

        if (preambleText) {
          // Skip empty text as it's an artifact of splitting, not meaningful.
          segments.push({
            isLink: false,
            text: preambleText
          });
        } // Append link if there are any.


        if (linkText && linkHref) {
          segments.push({
            isLink: true,
            text: linkText,
            linkHref: linkHref
          });
        }
      }

      return segments;
    }
    /**
     * @param {URL} parsedUrl
     * @param {{numPathParts?: number, preserveQuery?: boolean, preserveHost?: boolean}=} options
     * @return {string}
     */

  }, {
    key: "getURLDisplayName",
    value: function getURLDisplayName(parsedUrl, options) {
      // Closure optional properties aren't optional in tsc, so fallback needs undefined  values.
      options = options || {
        numPathParts: undefined,
        preserveQuery: undefined,
        preserveHost: undefined
      };
      var numPathParts = options.numPathParts !== undefined ? options.numPathParts : 2;
      var preserveQuery = options.preserveQuery !== undefined ? options.preserveQuery : true;
      var preserveHost = options.preserveHost || false;
      var name;

      if (parsedUrl.protocol === 'about:' || parsedUrl.protocol === 'data:') {
        // Handle 'about:*' and 'data:*' URLs specially since they have no path.
        name = parsedUrl.href;
      } else {
        name = parsedUrl.pathname;
        var parts = name.split('/').filter(function (part) {
          return part.length;
        });

        if (numPathParts && parts.length > numPathParts) {
          name = ELLIPSIS + parts.slice(-1 * numPathParts).join('/');
        }

        if (preserveHost) {
          name = "".concat(parsedUrl.host, "/").concat(name.replace(/^\//, ''));
        }

        if (preserveQuery) {
          name = "".concat(name).concat(parsedUrl.search);
        }
      }

      var MAX_LENGTH = 64; // Always elide hexadecimal hash

      name = name.replace(/([a-f0-9]{7})[a-f0-9]{13}[a-f0-9]*/g, "$1".concat(ELLIPSIS)); // Also elide other hash-like mixed-case strings

      name = name.replace(/([a-zA-Z0-9-_]{9})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9-_]{10,}/g, "$1".concat(ELLIPSIS)); // Also elide long number sequences

      name = name.replace(/(\d{3})\d{6,}/g, "$1".concat(ELLIPSIS)); // Merge any adjacent ellipses

      name = name.replace(/\u2026+/g, ELLIPSIS); // Elide query params first

      if (name.length > MAX_LENGTH && name.includes('?')) {
        // Try to leave the first query parameter intact
        name = name.replace(/\?([^=]*)(=)?.*/, "?$1$2".concat(ELLIPSIS)); // Remove it all if it's still too long

        if (name.length > MAX_LENGTH) {
          name = name.replace(/\?.*/, "?".concat(ELLIPSIS));
        }
      } // Elide too long names next


      if (name.length > MAX_LENGTH) {
        var dotIndex = name.lastIndexOf('.');

        if (dotIndex >= 0) {
          name = name.slice(0, MAX_LENGTH - 1 - (name.length - dotIndex)) + // Show file extension
          "".concat(ELLIPSIS).concat(name.slice(dotIndex));
        } else {
          name = name.slice(0, MAX_LENGTH - 1) + ELLIPSIS;
        }
      }

      return name;
    }
    /**
     * Split a URL into a file, hostname and origin for easy display.
     * @param {string} url
     * @return {{file: string, hostname: string, origin: string}}
     */

  }, {
    key: "parseURL",
    value: function parseURL(url) {
      var parsedUrl = new URL(url);
      return {
        file: Util.getURLDisplayName(parsedUrl),
        hostname: parsedUrl.hostname,
        origin: parsedUrl.origin
      };
    }
    /**
     * @param {string|URL} value
     * @return {!URL}
     */

  }, {
    key: "createOrReturnURL",
    value: function createOrReturnURL(value) {
      if (value instanceof URL) {
        return value;
      }

      return new URL(value);
    }
    /**
     * Gets the tld of a domain
     *
     * @param {string} hostname
     * @return {string} tld
     */

  }, {
    key: "getTld",
    value: function getTld(hostname) {
      var tlds = hostname.split('.').slice(-2);

      if (!listOfTlds.includes(tlds[0])) {
        return ".".concat(tlds[tlds.length - 1]);
      }

      return ".".concat(tlds.join('.'));
    }
    /**
     * Returns a primary domain for provided hostname (e.g. www.example.com -> example.com).
     * @param {string|URL} url hostname or URL object
     * @return {string}
     */

  }, {
    key: "getRootDomain",
    value: function getRootDomain(url) {
      var hostname = Util.createOrReturnURL(url).hostname;
      var tld = Util.getTld(hostname); // tld is .com or .co.uk which means we means that length is 1 to big
      // .com => 2 & .co.uk => 3

      var splitTld = tld.split('.'); // get TLD + root domain

      return hostname.split('.').slice(-splitTld.length).join('.');
    }
    /**
     * @param {LH.Result['configSettings']} settings
     * @return {!{deviceEmulation: string, networkThrottling: string, cpuThrottling: string, summary: string}}
     */

  }, {
    key: "getEmulationDescriptions",
    value: function getEmulationDescriptions(settings) {
      var cpuThrottling;
      var networkThrottling;
      var summary;
      var throttling = settings.throttling;

      switch (settings.throttlingMethod) {
        case 'provided':
          summary = networkThrottling = cpuThrottling = Util.i18n.strings.throttlingProvided;
          break;

        case 'devtools':
          {
            var cpuSlowdownMultiplier = throttling.cpuSlowdownMultiplier,
                requestLatencyMs = throttling.requestLatencyMs;
            cpuThrottling = "".concat(Util.i18n.formatNumber(cpuSlowdownMultiplier), "x slowdown (DevTools)");
            networkThrottling = "".concat(Util.i18n.formatNumber(requestLatencyMs)).concat(NBSP, "ms HTTP RTT, ") + "".concat(Util.i18n.formatNumber(throttling.downloadThroughputKbps)).concat(NBSP, "Kbps down, ") + "".concat(Util.i18n.formatNumber(throttling.uploadThroughputKbps)).concat(NBSP, "Kbps up (DevTools)");

            var isSlow4G = function isSlow4G() {
              return requestLatencyMs === 150 * 3.75 && throttling.downloadThroughputKbps === 1.6 * 1024 * 0.9 && throttling.uploadThroughputKbps === 750 * 0.9;
            };

            summary = isSlow4G() ? Util.i18n.strings.runtimeSlow4g : Util.i18n.strings.runtimeCustom;
            break;
          }

        case 'simulate':
          {
            var _cpuSlowdownMultiplier = throttling.cpuSlowdownMultiplier,
                rttMs = throttling.rttMs,
                throughputKbps = throttling.throughputKbps;
            cpuThrottling = "".concat(Util.i18n.formatNumber(_cpuSlowdownMultiplier), "x slowdown (Simulated)");
            networkThrottling = "".concat(Util.i18n.formatNumber(rttMs)).concat(NBSP, "ms TCP RTT, ") + "".concat(Util.i18n.formatNumber(throughputKbps)).concat(NBSP, "Kbps throughput (Simulated)");

            var _isSlow4G = function _isSlow4G() {
              return rttMs === 150 && throughputKbps === 1.6 * 1024;
            };

            summary = _isSlow4G() ? Util.i18n.strings.runtimeSlow4g : Util.i18n.strings.runtimeCustom;
            break;
          }

        default:
          summary = cpuThrottling = networkThrottling = Util.i18n.strings.runtimeUnknown;
      } // TODO(paulirish): revise Runtime Settings strings: https://github.com/GoogleChrome/lighthouse/pull/11796


      var deviceEmulation = {
        mobile: Util.i18n.strings.runtimeMobileEmulation,
        desktop: Util.i18n.strings.runtimeDesktopEmulation
      }[settings.formFactor] || Util.i18n.strings.runtimeNoEmulation;
      return {
        deviceEmulation: deviceEmulation,
        cpuThrottling: cpuThrottling,
        networkThrottling: networkThrottling,
        summary: summary
      };
    }
    /**
     * Returns only lines that are near a message, or the first few lines if there are
     * no line messages.
     * @param {LH.Audit.Details.SnippetValue['lines']} lines
     * @param {LH.Audit.Details.SnippetValue['lineMessages']} lineMessages
     * @param {number} surroundingLineCount Number of lines to include before and after
     * the message. If this is e.g. 2 this function might return 5 lines.
     */

  }, {
    key: "filterRelevantLines",
    value: function filterRelevantLines(lines, lineMessages, surroundingLineCount) {
      if (lineMessages.length === 0) {
        // no lines with messages, just return the first bunch of lines
        return lines.slice(0, surroundingLineCount * 2 + 1);
      }

      var minGapSize = 3;
      var lineNumbersToKeep = new Set(); // Sort messages so we can check lineNumbersToKeep to see how big the gap to
      // the previous line is.

      lineMessages = lineMessages.sort(function (a, b) {
        return (a.lineNumber || 0) - (b.lineNumber || 0);
      });
      lineMessages.forEach(function (_ref) {
        var lineNumber = _ref.lineNumber;
        var firstSurroundingLineNumber = lineNumber - surroundingLineCount;
        var lastSurroundingLineNumber = lineNumber + surroundingLineCount;

        while (firstSurroundingLineNumber < 1) {
          // make sure we still show (surroundingLineCount * 2 + 1) lines in total
          firstSurroundingLineNumber++;
          lastSurroundingLineNumber++;
        } // If only a few lines would be omitted normally then we prefer to include
        // extra lines to avoid the tiny gap


        if (lineNumbersToKeep.has(firstSurroundingLineNumber - minGapSize - 1)) {
          firstSurroundingLineNumber -= minGapSize;
        }

        for (var i = firstSurroundingLineNumber; i <= lastSurroundingLineNumber; i++) {
          var surroundingLineNumber = i;
          lineNumbersToKeep.add(surroundingLineNumber);
        }
      });
      return lines.filter(function (line) {
        return lineNumbersToKeep.has(line.lineNumber);
      });
    }
    /**
     * @param {string} categoryId
     */

  }, {
    key: "isPluginCategory",
    value: function isPluginCategory(categoryId) {
      return categoryId.startsWith('lighthouse-plugin-');
    }
    /**
     * @param {LH.Result.GatherMode} gatherMode
     */

  }, {
    key: "shouldDisplayAsFraction",
    value: function shouldDisplayAsFraction(gatherMode) {
      return gatherMode === 'timespan' || gatherMode === 'snapshot';
    }
    /**
     * @param {LH.ReportResult.Category} category
     */

  }, {
    key: "calculateCategoryFraction",
    value: function calculateCategoryFraction(category) {
      var numPassableAudits = 0;
      var numPassed = 0;
      var numInformative = 0;
      var totalWeight = 0;

      var _iterator3 = _createForOfIteratorHelper(category.auditRefs),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var auditRef = _step3.value;
          var auditPassed = Util.showAsPassed(auditRef.result); // Don't count the audit if it's manual, N/A, or isn't displayed.

          if (auditRef.group === 'hidden' || auditRef.result.scoreDisplayMode === 'manual' || auditRef.result.scoreDisplayMode === 'notApplicable') {
            continue;
          } else if (auditRef.result.scoreDisplayMode === 'informative') {
            if (!auditPassed) {
              ++numInformative;
            }

            continue;
          }

          ++numPassableAudits;
          totalWeight += auditRef.weight;
          if (auditPassed) numPassed++;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return {
        numPassed: numPassed,
        numPassableAudits: numPassableAudits,
        numInformative: numInformative,
        totalWeight: totalWeight
      };
    }
  }]);

  return Util;
}();
/**
 * Some parts of the report renderer require data found on the LHR. Instead of wiring it
 * through, we have this global.
 * @type {LH.ReportResult | null}
 */


exports.Util = Util;

_defineProperty(Util, "i18n", null);

Util.reportJson = null;
/**
 * An always-increasing counter for making unique SVG ID suffixes.
 */

Util.getUniqueSuffix = function () {
  var svgSuffix = 0;
  return function () {
    return svgSuffix++;
  };
}();
/**
 * Report-renderer-specific strings.
 */


var UIStrings = {
  /** Disclaimer shown to users below the metric values (First Contentful Paint, Time to Interactive, etc) to warn them that the numbers they see will likely change slightly the next time they run Lighthouse. */
  varianceDisclaimer: 'Values are estimated and may vary. The [performance score is calculated](https://web.dev/performance-scoring/) directly from these metrics.',

  /** Text link pointing to an interactive calculator that explains Lighthouse scoring. The link text should be fairly short. */
  calculatorLink: 'See calculator.',

  /** Label preceding a radio control for filtering the list of audits. The radio choices are various performance metrics (FCP, LCP, TBT), and if chosen, the audits in the report are hidden if they are not relevant to the selected metric. */
  showRelevantAudits: 'Show audits relevant to:',

  /** Column heading label for the listing of opportunity audits. Each audit title represents an opportunity. There are only 2 columns, so no strict character limit.  */
  opportunityResourceColumnLabel: 'Opportunity',

  /** Column heading label for the estimated page load savings of opportunity audits. Estimated Savings is the total amount of time (in seconds) that Lighthouse computed could be reduced from the total page load time, if the suggested action is taken. There are only 2 columns, so no strict character limit. */
  opportunitySavingsColumnLabel: 'Estimated Savings',

  /** An error string displayed next to a particular audit when it has errored, but not provided any specific error message. */
  errorMissingAuditInfo: 'Report error: no audit information',

  /** A label, shown next to an audit title or metric title, indicating that there was an error computing it. The user can hover on the label to reveal a tooltip with the extended error message. Translation should be short (< 20 characters). */
  errorLabel: 'Error!',

  /** This label is shown above a bulleted list of warnings. It is shown directly below an audit that produced warnings. Warnings describe situations the user should be aware of, as Lighthouse was unable to complete all the work required on this audit. For example, The 'Unable to decode image (biglogo.jpg)' warning may show up below an image encoding audit. */
  warningHeader: 'Warnings: ',

  /** Section heading shown above a list of passed audits that contain warnings. Audits under this section do not negatively impact the score, but Lighthouse has generated some potentially actionable suggestions that should be reviewed. This section is expanded by default and displays after the failing audits. */
  warningAuditsGroupTitle: 'Passed audits but with warnings',

  /** Section heading shown above a list of audits that are passing. 'Passed' here refers to a passing grade. This section is collapsed by default, as the user should be focusing on the failed audits instead. Users can click this heading to reveal the list. */
  passedAuditsGroupTitle: 'Passed audits',

  /** Section heading shown above a list of audits that do not apply to the page. For example, if an audit is 'Are images optimized?', but the page has no images on it, the audit will be marked as not applicable. This is neither passing or failing. This section is collapsed by default, as the user should be focusing on the failed audits instead. Users can click this heading to reveal the list. */
  notApplicableAuditsGroupTitle: 'Not applicable',

  /** Section heading shown above a list of audits that were not computed by Lighthouse. They serve as a list of suggestions for the user to go and manually check. For example, Lighthouse can't automate testing cross-browser compatibility, so that is listed within this section, so the user is reminded to test it themselves. This section is collapsed by default, as the user should be focusing on the failed audits instead. Users can click this heading to reveal the list. */
  manualAuditsGroupTitle: 'Additional items to manually check',

  /** Label shown preceding any important warnings that may have invalidated the entire report. For example, if the user has Chrome extensions installed, they may add enough performance overhead that Lighthouse's performance metrics are unreliable. If shown, this will be displayed at the top of the report UI. */
  toplevelWarningsMessage: 'There were issues affecting this run of Lighthouse:',

  /** String of text shown in a graphical representation of the flow of network requests for the web page. This label represents the initial network request that fetches an HTML page. This navigation may be redirected (eg. Initial navigation to http://example.com redirects to https://www.example.com). */
  crcInitialNavigation: 'Initial Navigation',

  /** Label of value shown in the summary of critical request chains. Refers to the total amount of time (milliseconds) of the longest critical path chain/sequence of network requests. Example value: 2310 ms */
  crcLongestDurationLabel: 'Maximum critical path latency:',

  /** Label for button that shows all lines of the snippet when clicked */
  snippetExpandButtonLabel: 'Expand snippet',

  /** Label for button that only shows a few lines of the snippet when clicked */
  snippetCollapseButtonLabel: 'Collapse snippet',

  /** Explanation shown to users below performance results to inform them that the test was done with a 4G network connection and to warn them that the numbers they see will likely change slightly the next time they run Lighthouse. 'Lighthouse' becomes link text to additional documentation. */
  lsPerformanceCategoryDescription: '[Lighthouse](https://developers.google.com/web/tools/lighthouse/) analysis of the current page on an emulated mobile network. Values are estimated and may vary.',

  /** Title of the lab data section of the Performance category. Within this section are various speed metrics which quantify the pageload performance into values presented in seconds and milliseconds. "Lab" is an abbreviated form of "laboratory", and refers to the fact that the data is from a controlled test of a website, not measurements from real users visiting that site.  */
  labDataTitle: 'Lab Data',

  /** This label is for a checkbox above a table of items loaded by a web page. The checkbox is used to show or hide third-party (or "3rd-party") resources in the table, where "third-party resources" refers to items loaded by a web page from URLs that aren't controlled by the owner of the web page. */
  thirdPartyResourcesLabel: 'Show 3rd-party resources',

  /** This label is for a button that opens a new tab to a webapp called "Treemap", which is a nested visual representation of a heierarchy of data related to the reports (script bytes and coverage, resource breakdown, etc.) */
  viewTreemapLabel: 'View Treemap',

  /** Option in a dropdown menu that opens a small, summary report in a print dialog.  */
  dropdownPrintSummary: 'Print Summary',

  /** Option in a dropdown menu that opens a full Lighthouse report in a print dialog.  */
  dropdownPrintExpanded: 'Print Expanded',

  /** Option in a dropdown menu that copies the Lighthouse JSON object to the system clipboard. */
  dropdownCopyJSON: 'Copy JSON',

  /** Option in a dropdown menu that saves the Lighthouse report HTML locally to the system as a '.html' file. */
  dropdownSaveHTML: 'Save as HTML',

  /** Option in a dropdown menu that saves the Lighthouse JSON object to the local system as a '.json' file. */
  dropdownSaveJSON: 'Save as JSON',

  /** Option in a dropdown menu that opens the current report in the Lighthouse Viewer Application. */
  dropdownViewer: 'Open in Viewer',

  /** Option in a dropdown menu that saves the current report as a new GitHub Gist. */
  dropdownSaveGist: 'Save as Gist',

  /** Option in a dropdown menu that toggles the themeing of the report between Light(default) and Dark themes. */
  dropdownDarkTheme: 'Toggle Dark Theme',

  /** Label for a row in a table that describes the kind of device that was emulated for the Lighthouse run.  Example values for row elements: 'No Emulation', 'Emulated Desktop', etc. */
  runtimeSettingsDevice: 'Device',

  /** Label for a row in a table that describes the network throttling conditions that were used during a Lighthouse run, if any. */
  runtimeSettingsNetworkThrottling: 'Network throttling',

  /** Label for a row in a table that describes the CPU throttling conditions that were used during a Lighthouse run, if any.*/
  runtimeSettingsCPUThrottling: 'CPU throttling',

  /** Label for a row in a table that shows the User Agent that was used to send out all network requests during the Lighthouse run. */
  runtimeSettingsUANetwork: 'User agent (network)',

  /** Label for a row in a table that shows the estimated CPU power of the machine running Lighthouse. Example row values: 532, 1492, 783. */
  runtimeSettingsBenchmark: 'CPU/Memory Power',

  /** Label for a row in a table that shows the version of the Axe library used. Example row values: 2.1.0, 3.2.3 */
  runtimeSettingsAxeVersion: 'Axe version',

  /** Label for button to create an issue against the Lighthouse GitHub project. */
  footerIssue: 'File an issue',

  /** Descriptive explanation for emulation setting when no device emulation is set. */
  runtimeNoEmulation: 'No emulation',

  /** Descriptive explanation for emulation setting when emulating a Moto G4 mobile device. */
  runtimeMobileEmulation: 'Emulated Moto G4',

  /** Descriptive explanation for emulation setting when emulating a generic desktop form factor, as opposed to a mobile-device like form factor. */
  runtimeDesktopEmulation: 'Emulated Desktop',

  /** Descriptive explanation for a runtime setting that is set to an unknown value. */
  runtimeUnknown: 'Unknown',

  /** Descriptive label that this analysis run was from a single pageload of a browser (not a summary of hundreds of loads) */
  runtimeSingleLoad: 'Single page load',

  /** Descriptive label that this analysis only considers the initial load of the page, and no interaction beyond when the page had "fully loaded" */
  runtimeAnalysisWindow: 'Initial page load',

  /** Descriptive explanation that this analysis run was from a single pageload of a browser, whereas field data often summarizes hundreds+ of page loads */
  runtimeSingleLoadTooltip: 'This data is taken from a single page load, as opposed to field data summarizing many sessions.',
  // eslint-disable-line max-len

  /** Descriptive explanation for environment throttling that was provided by the runtime environment instead of provided by Lighthouse throttling. */
  throttlingProvided: 'Provided by environment',

  /** Label for an interactive control that will reveal or hide a group of content. This control toggles between the text 'Show' and 'Hide'. */
  show: 'Show',

  /** Label for an interactive control that will reveal or hide a group of content. This control toggles between the text 'Show' and 'Hide'. */
  hide: 'Hide',

  /** Label for an interactive control that will reveal or hide a group of content. This control toggles between the text 'Expand view' and 'Collapse view'. */
  expandView: 'Expand view',

  /** Label for an interactive control that will reveal or hide a group of content. This control toggles between the text 'Expand view' and 'Collapse view'. */
  collapseView: 'Collapse view',

  /** Label indicating that Lighthouse throttled the page to emulate a slow 4G network connection. */
  runtimeSlow4g: 'Slow 4G throttling',

  /** Label indicating that Lighthouse throttled the page using custom throttling settings. */
  runtimeCustom: 'Custom throttling'
};
exports.UIStrings = UIStrings;
Util.UIStrings = UIStrings;