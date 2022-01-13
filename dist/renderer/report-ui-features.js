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
/**
 * @fileoverview Adds tools button, print, and other dynamic functionality to
 * the report.
 */

/** @typedef {import('./dom').DOM} DOM */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportUIFeatures = void 0;

var _elementScreenshotRenderer = require("./element-screenshot-renderer.js");

var _featuresUtil = require("./features-util.js");

var _openTab = require("./open-tab.js");

var _topbarFeatures = require("./topbar-features.js");

var _util = require("./util.js");

var _fileNamer = require("../generator/file-namer.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @param {HTMLTableElement} tableEl
 * @return {Array<HTMLElement>}
 */
function getTableRows(tableEl) {
  return Array.from(tableEl.tBodies[0].rows);
}

var ReportUIFeatures = /*#__PURE__*/function () {
  /**
   * @param {DOM} dom
   * @param {LH.Renderer.Options} opts
   */
  function ReportUIFeatures(dom) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ReportUIFeatures);

    /** @type {LH.Result} */
    this.json; // eslint-disable-line no-unused-expressions

    /** @type {DOM} */

    this._dom = dom;
    this._opts = opts;
    this._topbar = opts.omitTopbar ? null : new _topbarFeatures.TopbarFeatures(this, dom);
    this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }
  /**
   * Adds tools button, print, and other functionality to the report. The method
   * should be called whenever the report needs to be re-rendered.
   * @param {LH.Result} lhr
   */


  _createClass(ReportUIFeatures, [{
    key: "initFeatures",
    value: function initFeatures(lhr) {
      var _this = this;

      this.json = lhr;

      if (this._topbar) {
        this._topbar.enable(lhr);

        this._topbar.resetUIState();
      }

      this._setupMediaQueryListeners();

      this._setupThirdPartyFilter();

      this._setupElementScreenshotOverlay(this._dom.rootEl);

      var turnOffTheLights = false; // Do not query the system preferences for DevTools - DevTools should only apply dark theme
      // if dark is selected in the settings panel.

      var disableDarkMode = this._dom.isDevTools() || this._opts.disableAutoDarkModeAndFireworks;

      if (!disableDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        turnOffTheLights = true;
      } // Fireworks!
      // To get fireworks you need 100 scores in all core categories, except PWA (because going the PWA route is discretionary).


      var fireworksRequiredCategoryIds = ['performance', 'accessibility', 'best-practices', 'seo'];
      var scoresAll100 = fireworksRequiredCategoryIds.every(function (id) {
        var cat = lhr.categories[id];
        return cat && cat.score === 1;
      });

      if (scoresAll100) {
        turnOffTheLights = true;

        this._enableFireworks();
      }

      if (turnOffTheLights) {
        (0, _featuresUtil.toggleDarkTheme)(this._dom, true);
      } // Show the metric descriptions by default when there is an error.


      var hasMetricError = lhr.categories.performance && lhr.categories.performance.auditRefs.some(function (audit) {
        return Boolean(audit.group === 'metrics' && lhr.audits[audit.id].errorMessage);
      });

      if (hasMetricError) {
        var toggleInputEl = this._dom.find('input.lh-metrics-toggle__input', this._dom.rootEl);

        toggleInputEl.checked = true;
      }

      var showTreemapApp = this.json.audits['script-treemap-data'] && this.json.audits['script-treemap-data'].details;

      if (showTreemapApp) {
        this.addButton({
          text: _util.Util.i18n.strings.viewTreemapLabel,
          icon: 'treemap',
          onClick: function onClick() {
            return (0, _openTab.openTreemap)(_this.json);
          }
        });
      }

      if (this._opts.getStandaloneReportHTML) {
        this._dom.find('a[data-action="save-html"]', this._dom.rootEl).classList.remove('lh-hidden');
      } // Fill in all i18n data.


      var _iterator = _createForOfIteratorHelper(this._dom.findAll('[data-i18n]', this._dom.rootEl)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;
          // These strings are guaranteed to (at least) have a default English string in Util.UIStrings,
          // so this cannot be undefined as long as `report-ui-features.data-i18n` test passes.
          var i18nKey = node.getAttribute('data-i18n');
          var i18nAttr =
          /** @type {keyof typeof Util.i18n.strings} */
          i18nKey;
          node.textContent = _util.Util.i18n.strings[i18nAttr];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * @param {{text: string, icon?: string, onClick: () => void}} opts
     */

  }, {
    key: "addButton",
    value: function addButton(opts) {
      // Use qSA directly to as we don't want to throw (if this element is missing).
      var metricsEl = this._dom.rootEl.querySelector('.lh-audit-group--metrics');

      if (!metricsEl) return;
      var buttonsEl = metricsEl.querySelector('.lh-buttons');
      if (!buttonsEl) buttonsEl = this._dom.createChildOf(metricsEl, 'div', 'lh-buttons');
      var classes = ['lh-button'];

      if (opts.icon) {
        classes.push('lh-report-icon');
        classes.push("lh-report-icon--".concat(opts.icon));
      }

      var buttonEl = this._dom.createChildOf(buttonsEl, 'button', classes.join(' '));

      buttonEl.textContent = opts.text;
      buttonEl.addEventListener('click', opts.onClick);
      return buttonEl;
    }
  }, {
    key: "resetUIState",
    value: function resetUIState() {
      if (this._topbar) {
        this._topbar.resetUIState();
      }
    }
    /**
     * Returns the html that recreates this report.
     * @return {string}
     */

  }, {
    key: "getReportHtml",
    value: function getReportHtml() {
      if (!this._opts.getStandaloneReportHTML) {
        throw new Error('`getStandaloneReportHTML` is not set');
      }

      this.resetUIState();
      return this._opts.getStandaloneReportHTML();
    }
    /**
     * Save json as a gist. Unimplemented in base UI features.
     */

  }, {
    key: "saveAsGist",
    value: function saveAsGist() {
      // TODO ?
      throw new Error('Cannot save as gist from base report');
    }
  }, {
    key: "_enableFireworks",
    value: function _enableFireworks() {
      var scoresContainer = this._dom.find('.lh-scores-container', this._dom.rootEl);

      scoresContainer.classList.add('lh-score100');
      scoresContainer.addEventListener('click', function (_) {
        scoresContainer.classList.toggle('lh-fireworks-paused');
      });
    }
  }, {
    key: "_setupMediaQueryListeners",
    value: function _setupMediaQueryListeners() {
      var mediaQuery = self.matchMedia('(max-width: 500px)');
      mediaQuery.addListener(this.onMediaQueryChange); // Ensure the handler is called on init

      this.onMediaQueryChange(mediaQuery);
    }
    /**
     * Resets the state of page before capturing the page for export.
     * When the user opens the exported HTML page, certain UI elements should
     * be in their closed state (not opened) and the templates should be unstamped.
     */

  }, {
    key: "_resetUIState",
    value: function _resetUIState() {
      if (this._topbar) {
        this._topbar.resetUIState();
      }
    }
    /**
     * Handle media query change events.
     * @param {MediaQueryList|MediaQueryListEvent} mql
     */

  }, {
    key: "onMediaQueryChange",
    value: function onMediaQueryChange(mql) {
      this._dom.rootEl.classList.toggle('lh-narrow', mql.matches);
    }
  }, {
    key: "_setupThirdPartyFilter",
    value: function _setupThirdPartyFilter() {
      var _this2 = this;

      // Some audits should not display the third party filter option.
      var thirdPartyFilterAuditExclusions = [// These audits deal explicitly with third party resources.
      'uses-rel-preconnect', 'third-party-facades']; // Some audits should hide third party by default.

      var thirdPartyFilterAuditHideByDefault = [// Only first party resources are actionable.
      'legacy-javascript']; // Get all tables with a text url column.

      var tables = Array.from(this._dom.rootEl.querySelectorAll('table.lh-table'));
      var tablesWithUrls = tables.filter(function (el) {
        return el.querySelector('td.lh-table-column--url, td.lh-table-column--source-location');
      }).filter(function (el) {
        var containingAudit = el.closest('.lh-audit');
        if (!containingAudit) throw new Error('.lh-table not within audit');
        return !thirdPartyFilterAuditExclusions.includes(containingAudit.id);
      });
      tablesWithUrls.forEach(function (tableEl) {
        var rowEls = getTableRows(tableEl);

        var thirdPartyRows = _this2._getThirdPartyRows(rowEls, _this2.json.finalUrl); // create input box


        var filterTemplate = _this2._dom.createComponent('3pFilter');

        var filterInput = _this2._dom.find('input', filterTemplate);

        filterInput.addEventListener('change', function (e) {
          var shouldHideThirdParty = e.target instanceof HTMLInputElement && !e.target.checked;
          var even = true;
          var rowEl = rowEls[0];

          while (rowEl) {
            var shouldHide = shouldHideThirdParty && thirdPartyRows.includes(rowEl); // Iterate subsequent associated sub item rows.

            do {
              rowEl.classList.toggle('lh-row--hidden', shouldHide); // Adjust for zebra styling.

              rowEl.classList.toggle('lh-row--even', !shouldHide && even);
              rowEl.classList.toggle('lh-row--odd', !shouldHide && !even);
              rowEl =
              /** @type {HTMLElement} */
              rowEl.nextElementSibling;
            } while (rowEl && rowEl.classList.contains('lh-sub-item-row'));

            if (!shouldHide) even = !even;
          }
        });
        _this2._dom.find('.lh-3p-filter-count', filterTemplate).textContent = "".concat(thirdPartyRows.length);
        _this2._dom.find('.lh-3p-ui-string', filterTemplate).textContent = _util.Util.i18n.strings.thirdPartyResourcesLabel;
        var allThirdParty = thirdPartyRows.length === rowEls.length;
        var allFirstParty = !thirdPartyRows.length; // If all or none of the rows are 3rd party, hide the control.

        if (allThirdParty || allFirstParty) {
          _this2._dom.find('div.lh-3p-filter', filterTemplate).hidden = true;
        } // Add checkbox to the DOM.


        if (!tableEl.parentNode) return; // Keep tsc happy.

        tableEl.parentNode.insertBefore(filterTemplate, tableEl); // Hide third-party rows for some audits by default.

        var containingAudit = tableEl.closest('.lh-audit');
        if (!containingAudit) throw new Error('.lh-table not within audit');

        if (thirdPartyFilterAuditHideByDefault.includes(containingAudit.id) && !allThirdParty) {
          filterInput.click();
        }
      });
    }
    /**
     * @param {Element} rootEl
     */

  }, {
    key: "_setupElementScreenshotOverlay",
    value: function _setupElementScreenshotOverlay(rootEl) {
      var fullPageScreenshot = this.json.audits['full-page-screenshot'] && this.json.audits['full-page-screenshot'].details && this.json.audits['full-page-screenshot'].details.type === 'full-page-screenshot' && this.json.audits['full-page-screenshot'].details;
      if (!fullPageScreenshot) return;

      _elementScreenshotRenderer.ElementScreenshotRenderer.installOverlayFeature({
        dom: this._dom,
        rootEl: rootEl,
        overlayContainerEl: rootEl,
        fullPageScreenshot: fullPageScreenshot
      });
    }
    /**
     * From a table with URL entries, finds the rows containing third-party URLs
     * and returns them.
     * @param {HTMLElement[]} rowEls
     * @param {string} finalUrl
     * @return {Array<HTMLElement>}
     */

  }, {
    key: "_getThirdPartyRows",
    value: function _getThirdPartyRows(rowEls, finalUrl) {
      /** @type {Array<HTMLElement>} */
      var thirdPartyRows = [];

      var finalUrlRootDomain = _util.Util.getRootDomain(finalUrl);

      var _iterator2 = _createForOfIteratorHelper(rowEls),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var rowEl = _step2.value;
          if (rowEl.classList.contains('lh-sub-item-row')) continue;
          var urlItem = rowEl.querySelector('div.lh-text__url');
          if (!urlItem) continue;
          var datasetUrl = urlItem.dataset.url;
          if (!datasetUrl) continue;
          var isThirdParty = _util.Util.getRootDomain(datasetUrl) !== finalUrlRootDomain;
          if (!isThirdParty) continue;
          thirdPartyRows.push(rowEl);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return thirdPartyRows;
    }
    /**
     * DevTools uses its own file manager to download files, so it redefines this function.
     * Wrapper is necessary so DevTools can still override this function.
     *
     * @param {Blob|File} blob
     */

  }, {
    key: "_saveFile",
    value: function _saveFile(blob) {
      var filename = (0, _fileNamer.getLhrFilenamePrefix)(this.json);

      this._dom.saveFile(blob, filename);
    }
  }]);

  return ReportUIFeatures;
}();

exports.ReportUIFeatures = ReportUIFeatures;