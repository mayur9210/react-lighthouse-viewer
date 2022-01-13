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
 *
 * Dummy text for ensuring report robustness: </script> pre$`post %%LIGHTHOUSE_JSON%%
 * (this is handled by terser)
 */
'use strict';
/** @typedef {import('./dom.js').DOM} DOM */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportRenderer = void 0;

var _categoryRenderer = require("./category-renderer.js");

var _detailsRenderer = require("./details-renderer.js");

var _elementScreenshotRenderer = require("./element-screenshot-renderer.js");

var _i18n = require("./i18n.js");

var _performanceCategoryRenderer = require("./performance-category-renderer.js");

var _pwaCategoryRenderer = require("./pwa-category-renderer.js");

var _util = require("./util.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ReportRenderer = /*#__PURE__*/function () {
  /**
   * @param {DOM} dom
   */
  function ReportRenderer(dom) {
    _classCallCheck(this, ReportRenderer);

    /** @type {DOM} */
    this._dom = dom;
    /** @type {LH.Renderer.Options} */

    this._opts = {};
  }
  /**
   * @param {LH.Result} lhr
   * @param {HTMLElement?} rootEl Report root element containing the report
   * @param {LH.Renderer.Options=} opts
   * @return {!Element}
   */


  _createClass(ReportRenderer, [{
    key: "renderReport",
    value: function renderReport(lhr, rootEl, opts) {
      // Allow legacy report rendering API
      if (!this._dom.rootEl && rootEl) {
        console.warn('Please adopt the new report API in renderer/api.js.');
        var closestRoot = rootEl.closest('.lh-root');

        if (closestRoot) {
          this._dom.rootEl =
          /** @type {HTMLElement} */
          closestRoot;
        } else {
          rootEl.classList.add('lh-root', 'lh-vars');
          this._dom.rootEl = rootEl;
        }
      } else if (this._dom.rootEl && rootEl) {
        // Handle legacy flow-report case
        this._dom.rootEl = rootEl;
      }

      if (opts) {
        this._opts = opts;
      }

      this._dom.setLighthouseChannel(lhr.configSettings.channel || 'unknown');

      var report = _util.Util.prepareReportResult(lhr);

      this._dom.rootEl.textContent = ''; // Remove previous report.

      this._dom.rootEl.appendChild(this._renderReport(report));

      return this._dom.rootEl;
    }
    /**
     * @param {LH.ReportResult} report
     * @return {DocumentFragment}
     */

  }, {
    key: "_renderReportTopbar",
    value: function _renderReportTopbar(report) {
      var el = this._dom.createComponent('topbar');

      var metadataUrl = this._dom.find('a.lh-topbar__url', el);

      metadataUrl.textContent = report.finalUrl;
      metadataUrl.title = report.finalUrl;

      this._dom.safelySetHref(metadataUrl, report.finalUrl);

      return el;
    }
    /**
     * @return {DocumentFragment}
     */

  }, {
    key: "_renderReportHeader",
    value: function _renderReportHeader() {
      var el = this._dom.createComponent('heading');

      var domFragment = this._dom.createComponent('scoresWrapper');

      var placeholder = this._dom.find('.lh-scores-wrapper-placeholder', el);

      placeholder.replaceWith(domFragment);
      return el;
    }
    /**
     * @param {LH.ReportResult} report
     * @return {DocumentFragment}
     */

  }, {
    key: "_renderReportFooter",
    value: function _renderReportFooter(report) {
      var footer = this._dom.createComponent('footer');

      this._renderMetaBlock(report, footer);

      this._dom.find('.lh-footer__version_issue', footer).textContent = _util.Util.i18n.strings.footerIssue;
      this._dom.find('.lh-footer__version', footer).textContent = report.lighthouseVersion;
      return footer;
    }
    /**
     * @param {LH.ReportResult} report
     * @param {DocumentFragment} footer
     */

  }, {
    key: "_renderMetaBlock",
    value: function _renderMetaBlock(report, footer) {
      var _report$environment$c;

      var envValues = _util.Util.getEmulationDescriptions(report.configSettings || {});

      var match = report.userAgent.match(/(\w*Chrome\/[\d.]+)/); // \w* to include 'HeadlessChrome'

      var chromeVer = Array.isArray(match) ? match[1].replace('/', ' ').replace('Chrome', 'Chromium') : 'Chromium';
      var channel = report.configSettings.channel;
      var benchmarkIndex = report.environment.benchmarkIndex.toFixed(0);
      var axeVersion = (_report$environment$c = report.environment.credits) === null || _report$environment$c === void 0 ? void 0 : _report$environment$c['axe-core']; // [CSS icon class, textContent, tooltipText]

      var metaItems = [['date', "Captured at ".concat(_util.Util.i18n.formatDateTime(report.fetchTime))], ['devices', "".concat(envValues.deviceEmulation, " with Lighthouse ").concat(report.lighthouseVersion), "".concat(_util.Util.i18n.strings.runtimeSettingsBenchmark, ": ").concat(benchmarkIndex) + "\n".concat(_util.Util.i18n.strings.runtimeSettingsCPUThrottling, ": ").concat(envValues.cpuThrottling) + (axeVersion ? "\n".concat(_util.Util.i18n.strings.runtimeSettingsAxeVersion, ": ").concat(axeVersion) : '')], ['samples-one', _util.Util.i18n.strings.runtimeSingleLoad, _util.Util.i18n.strings.runtimeSingleLoadTooltip], ['stopwatch', _util.Util.i18n.strings.runtimeAnalysisWindow], ['networkspeed', "".concat(envValues.summary), "".concat(_util.Util.i18n.strings.runtimeSettingsNetworkThrottling, ": ").concat(envValues.networkThrottling)], ['chrome', "Using ".concat(chromeVer) + (channel ? " with ".concat(channel) : ''), "".concat(_util.Util.i18n.strings.runtimeSettingsUANetwork, ": \"").concat(report.environment.networkUserAgent, "\"")]];

      var metaItemsEl = this._dom.find('.lh-meta__items', footer);

      for (var _i = 0, _metaItems = metaItems; _i < _metaItems.length; _i++) {
        var _metaItems$_i = _slicedToArray(_metaItems[_i], 3),
            iconname = _metaItems$_i[0],
            text = _metaItems$_i[1],
            tooltip = _metaItems$_i[2];

        var itemEl = this._dom.createChildOf(metaItemsEl, 'li', 'lh-meta__item');

        itemEl.textContent = text;

        if (tooltip) {
          itemEl.classList.add('lh-tooltip-boundary');

          var tooltipEl = this._dom.createChildOf(itemEl, 'div', 'lh-tooltip');

          tooltipEl.textContent = tooltip;
        }

        itemEl.classList.add('lh-report-icon', "lh-report-icon--".concat(iconname));
      }
    }
    /**
     * Returns a div with a list of top-level warnings, or an empty div if no warnings.
     * @param {LH.ReportResult} report
     * @return {Node}
     */

  }, {
    key: "_renderReportWarnings",
    value: function _renderReportWarnings(report) {
      if (!report.runWarnings || report.runWarnings.length === 0) {
        return this._dom.createElement('div');
      }

      var container = this._dom.createComponent('warningsToplevel');

      var message = this._dom.find('.lh-warnings__msg', container);

      message.textContent = _util.Util.i18n.strings.toplevelWarningsMessage;

      var warnings = this._dom.find('ul', container);

      var _iterator = _createForOfIteratorHelper(report.runWarnings),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var warningString = _step.value;
          var warning = warnings.appendChild(this._dom.createElement('li'));
          warning.appendChild(this._dom.convertMarkdownLinkSnippets(warningString));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return container;
    }
    /**
     * @param {LH.ReportResult} report
     * @param {CategoryRenderer} categoryRenderer
     * @param {Record<string, CategoryRenderer>} specificCategoryRenderers
     * @return {!DocumentFragment[]}
     */

  }, {
    key: "_renderScoreGauges",
    value: function _renderScoreGauges(report, categoryRenderer, specificCategoryRenderers) {
      var _this = this;

      // Group gauges in this order: default, pwa, plugins.
      var defaultGauges = [];
      var customGauges = []; // PWA.

      var pluginGauges = [];

      var _loop = function _loop() {
        var category = _Object$values[_i2];
        var renderer = specificCategoryRenderers[category.id] || categoryRenderer;
        var categoryGauge = renderer.renderCategoryScore(category, report.categoryGroups || {}, {
          gatherMode: report.gatherMode
        });

        var gaugeWrapperEl = _this._dom.find('a.lh-gauge__wrapper, a.lh-fraction__wrapper', categoryGauge);

        if (gaugeWrapperEl) {
          var _this$_opts$onPageAnc, _this$_opts;

          _this._dom.safelySetHref(gaugeWrapperEl, "#".concat(category.id)); // Handle navigation clicks by scrolling to target without changing the page's URL.
          // Why? Some report embedding clients have their own routing and updating the location.hash
          // can introduce problems. Others may have an unpredictable `<base>` URL which ensures
          // navigation to `${baseURL}#categoryid` will be unintended.


          gaugeWrapperEl.addEventListener('click', function (e) {
            if (!gaugeWrapperEl.matches('[href^="#"]')) return;
            var selector = gaugeWrapperEl.getAttribute('href');
            var reportRoot = _this._dom.rootEl;
            if (!selector || !reportRoot) return;

            var destEl = _this._dom.find(selector, reportRoot);

            e.preventDefault();
            destEl.scrollIntoView();
          });
          (_this$_opts$onPageAnc = (_this$_opts = _this._opts).onPageAnchorRendered) === null || _this$_opts$onPageAnc === void 0 ? void 0 : _this$_opts$onPageAnc.call(_this$_opts, gaugeWrapperEl);
        }

        if (_util.Util.isPluginCategory(category.id)) {
          pluginGauges.push(categoryGauge);
        } else if (renderer.renderCategoryScore === categoryRenderer.renderCategoryScore) {
          // The renderer for default categories is just the default CategoryRenderer.
          // If the functions are equal, then renderer is an instance of CategoryRenderer.
          // For example, the PWA category uses PwaCategoryRenderer, which overrides
          // CategoryRenderer.renderCategoryScore, so it would fail this check and be placed
          // in the customGauges bucket.
          defaultGauges.push(categoryGauge);
        } else {
          customGauges.push(categoryGauge);
        }
      };

      for (var _i2 = 0, _Object$values = Object.values(report.categories); _i2 < _Object$values.length; _i2++) {
        _loop();
      }

      return [].concat(defaultGauges, customGauges, pluginGauges);
    }
    /**
     * @param {LH.ReportResult} report
     * @return {!DocumentFragment}
     */

  }, {
    key: "_renderReport",
    value: function _renderReport(report) {
      var _report$audits$fullP;

      var i18n = new _i18n.I18n(report.configSettings.locale, _objectSpread(_objectSpread({}, _util.Util.UIStrings), report.i18n.rendererFormattedStrings));
      _util.Util.i18n = i18n;
      _util.Util.reportJson = report;
      var fullPageScreenshot = (_report$audits$fullP = report.audits['full-page-screenshot']) !== null && _report$audits$fullP !== void 0 && _report$audits$fullP.details && report.audits['full-page-screenshot'].details.type === 'full-page-screenshot' ? report.audits['full-page-screenshot'].details : undefined;
      var detailsRenderer = new _detailsRenderer.DetailsRenderer(this._dom, {
        fullPageScreenshot: fullPageScreenshot
      });
      var categoryRenderer = new _categoryRenderer.CategoryRenderer(this._dom, detailsRenderer);
      /** @type {Record<string, CategoryRenderer>} */

      var specificCategoryRenderers = {
        performance: new _performanceCategoryRenderer.PerformanceCategoryRenderer(this._dom, detailsRenderer),
        pwa: new _pwaCategoryRenderer.PwaCategoryRenderer(this._dom, detailsRenderer)
      };

      var headerContainer = this._dom.createElement('div');

      headerContainer.appendChild(this._renderReportHeader());

      var reportContainer = this._dom.createElement('div', 'lh-container');

      var reportSection = this._dom.createElement('div', 'lh-report');

      reportSection.appendChild(this._renderReportWarnings(report));
      var scoreHeader;
      var isSoloCategory = Object.keys(report.categories).length === 1;

      if (!isSoloCategory) {
        scoreHeader = this._dom.createElement('div', 'lh-scores-header');
      } else {
        headerContainer.classList.add('lh-header--solo-category');
      }

      var scoreScale = this._dom.createElement('div');

      scoreScale.classList.add('lh-scorescale-wrap');
      scoreScale.append(this._dom.createComponent('scorescale'));

      if (scoreHeader) {
        var _scoreHeader;

        var scoresContainer = this._dom.find('.lh-scores-container', headerContainer);

        (_scoreHeader = scoreHeader).append.apply(_scoreHeader, _toConsumableArray(this._renderScoreGauges(report, categoryRenderer, specificCategoryRenderers)));

        scoresContainer.appendChild(scoreHeader);
        scoresContainer.appendChild(scoreScale);

        var stickyHeader = this._dom.createElement('div', 'lh-sticky-header');

        stickyHeader.append.apply(stickyHeader, _toConsumableArray(this._renderScoreGauges(report, categoryRenderer, specificCategoryRenderers)));
        reportContainer.appendChild(stickyHeader);
      }

      var categories = reportSection.appendChild(this._dom.createElement('div', 'lh-categories'));
      var categoryOptions = {
        gatherMode: report.gatherMode
      };

      for (var _i3 = 0, _Object$values2 = Object.values(report.categories); _i3 < _Object$values2.length; _i3++) {
        var category = _Object$values2[_i3];
        var renderer = specificCategoryRenderers[category.id] || categoryRenderer; // .lh-category-wrapper is full-width and provides horizontal rules between categories.
        // .lh-category within has the max-width: var(--report-content-max-width);

        var wrapper = renderer.dom.createChildOf(categories, 'div', 'lh-category-wrapper');
        wrapper.appendChild(renderer.render(category, report.categoryGroups, categoryOptions));
      }

      categoryRenderer.injectFinalScreenshot(categories, report.audits, scoreScale);

      var reportFragment = this._dom.createFragment();

      if (!this._opts.omitGlobalStyles) {
        reportFragment.append(this._dom.createComponent('styles'));
      }

      if (!this._opts.omitTopbar) {
        reportFragment.appendChild(this._renderReportTopbar(report));
      }

      reportFragment.appendChild(reportContainer);
      reportContainer.appendChild(headerContainer);
      reportContainer.appendChild(reportSection);
      reportSection.appendChild(this._renderReportFooter(report));

      if (fullPageScreenshot) {
        _elementScreenshotRenderer.ElementScreenshotRenderer.installFullPageScreenshot(this._dom.rootEl, fullPageScreenshot.screenshot);
      }

      return reportFragment;
    }
  }]);

  return ReportRenderer;
}();

exports.ReportRenderer = ReportRenderer;