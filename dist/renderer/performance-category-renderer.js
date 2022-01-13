/**
 * @license
 * Copyright 2018 The Lighthouse Authors. All Rights Reserved.
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
/** @typedef {import('./dom.js').DOM} DOM */

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PerformanceCategoryRenderer = void 0;

var _util = require("./util.js");

var _categoryRenderer = require("./category-renderer.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PerformanceCategoryRenderer = /*#__PURE__*/function (_CategoryRenderer) {
  _inherits(PerformanceCategoryRenderer, _CategoryRenderer);

  var _super = _createSuper(PerformanceCategoryRenderer);

  function PerformanceCategoryRenderer() {
    _classCallCheck(this, PerformanceCategoryRenderer);

    return _super.apply(this, arguments);
  }

  _createClass(PerformanceCategoryRenderer, [{
    key: "_renderMetric",
    value:
    /**
     * @param {LH.ReportResult.AuditRef} audit
     * @return {!Element}
     */
    function _renderMetric(audit) {
      var tmpl = this.dom.createComponent('metric');
      var element = this.dom.find('.lh-metric', tmpl);
      element.id = audit.result.id;

      var rating = _util.Util.calculateRating(audit.result.score, audit.result.scoreDisplayMode);

      element.classList.add("lh-metric--".concat(rating));
      var titleEl = this.dom.find('.lh-metric__title', tmpl);
      titleEl.textContent = audit.result.title;
      var valueEl = this.dom.find('.lh-metric__value', tmpl);
      valueEl.textContent = audit.result.displayValue || '';
      var descriptionEl = this.dom.find('.lh-metric__description', tmpl);
      descriptionEl.appendChild(this.dom.convertMarkdownLinkSnippets(audit.result.description));

      if (audit.result.scoreDisplayMode === 'error') {
        descriptionEl.textContent = '';
        valueEl.textContent = 'Error!';
        var tooltip = this.dom.createChildOf(descriptionEl, 'span');
        tooltip.textContent = audit.result.errorMessage || 'Report error: no metric information';
      }

      return element;
    }
    /**
     * @param {LH.ReportResult.AuditRef} audit
     * @param {number} scale
     * @return {!Element}
     */

  }, {
    key: "_renderOpportunity",
    value: function _renderOpportunity(audit, scale) {
      var oppTmpl = this.dom.createComponent('opportunity');
      var element = this.populateAuditValues(audit, oppTmpl);
      element.id = audit.result.id;

      if (!audit.result.details || audit.result.scoreDisplayMode === 'error') {
        return element;
      }

      var details = audit.result.details;

      if (details.type !== 'opportunity') {
        return element;
      } // Overwrite the displayValue with opportunity's wastedMs
      // TODO: normalize this to one tagName.


      var displayEl = this.dom.find('span.lh-audit__display-text, div.lh-audit__display-text', element);
      var sparklineWidthPct = "".concat(details.overallSavingsMs / scale * 100, "%");
      this.dom.find('div.lh-sparkline__bar', element).style.width = sparklineWidthPct;
      displayEl.textContent = _util.Util.i18n.formatSeconds(details.overallSavingsMs, 0.01); // Set [title] tooltips

      if (audit.result.displayValue) {
        var displayValue = audit.result.displayValue;
        this.dom.find('div.lh-load-opportunity__sparkline', element).title = displayValue;
        displayEl.title = displayValue;
      }

      return element;
    }
    /**
     * Get an audit's wastedMs to sort the opportunity by, and scale the sparkline width
     * Opportunities with an error won't have a details object, so MIN_VALUE is returned to keep any
     * erroring opportunities last in sort order.
     * @param {LH.ReportResult.AuditRef} audit
     * @return {number}
     */

  }, {
    key: "_getWastedMs",
    value: function _getWastedMs(audit) {
      if (audit.result.details && audit.result.details.type === 'opportunity') {
        var details = audit.result.details;

        if (typeof details.overallSavingsMs !== 'number') {
          throw new Error('non-opportunity details passed to _getWastedMs');
        }

        return details.overallSavingsMs;
      } else {
        return Number.MIN_VALUE;
      }
    }
    /**
     * Get a link to the interactive scoring calculator with the metric values.
     * @param {LH.ReportResult.AuditRef[]} auditRefs
     * @return {string}
     */

  }, {
    key: "_getScoringCalculatorHref",
    value: function _getScoringCalculatorHref(auditRefs) {
      // TODO: filter by !!acronym when dropping renderer support of v7 LHRs.
      var metrics = auditRefs.filter(function (audit) {
        return audit.group === 'metrics';
      });
      var fci = auditRefs.find(function (audit) {
        return audit.id === 'first-cpu-idle';
      });
      var fmp = auditRefs.find(function (audit) {
        return audit.id === 'first-meaningful-paint';
      });
      if (fci) metrics.push(fci);
      if (fmp) metrics.push(fmp);
      /**
       * Clamp figure to 2 decimal places
       * @param {number} val
       * @return {number}
       */

      var clampTo2Decimals = function clampTo2Decimals(val) {
        return Math.round(val * 100) / 100;
      };

      var metricPairs = metrics.map(function (audit) {
        var value;

        if (typeof audit.result.numericValue === 'number') {
          value = audit.id === 'cumulative-layout-shift' ? clampTo2Decimals(audit.result.numericValue) : Math.round(audit.result.numericValue);
          value = value.toString();
        } else {
          value = 'null';
        }

        return [audit.acronym || audit.id, value];
      });

      var paramPairs = _toConsumableArray(metricPairs);

      if (_util.Util.reportJson) {
        paramPairs.push(['device', _util.Util.reportJson.configSettings.formFactor]);
        paramPairs.push(['version', _util.Util.reportJson.lighthouseVersion]);
      }

      var params = new URLSearchParams(paramPairs);
      var url = new URL('https://googlechrome.github.io/lighthouse/scorecalc/');
      url.hash = params.toString();
      return url.href;
    }
    /**
     * For performance, audits with no group should be a diagnostic or opportunity.
     * The audit details type will determine which of the two groups an audit is in.
     *
     * @param {LH.ReportResult.AuditRef} audit
     * @return {'load-opportunity'|'diagnostic'|null}
     */

  }, {
    key: "_classifyPerformanceAudit",
    value: function _classifyPerformanceAudit(audit) {
      if (audit.group) return null;

      if (audit.result.details && audit.result.details.type === 'opportunity') {
        return 'load-opportunity';
      }

      return 'diagnostic';
    }
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Object<string, LH.Result.ReportGroup>} groups
     * @param {{gatherMode: LH.Result.GatherMode}=} options
     * @return {Element}
     * @override
     */

  }, {
    key: "render",
    value: function render(category, groups, options) {
      var _this = this;

      var strings = _util.Util.i18n.strings;
      var element = this.dom.createElement('div', 'lh-category');
      element.id = category.id;
      element.appendChild(this.renderCategoryHeader(category, groups, options)); // Metrics.

      var metricAudits = category.auditRefs.filter(function (audit) {
        return audit.group === 'metrics';
      });

      if (metricAudits.length) {
        var _this$renderAuditGrou = this.renderAuditGroup(groups.metrics),
            _this$renderAuditGrou2 = _slicedToArray(_this$renderAuditGrou, 2),
            metricsGroupEl = _this$renderAuditGrou2[0],
            metricsFooterEl = _this$renderAuditGrou2[1]; // Metric descriptions toggle.


        var checkboxEl = this.dom.createElement('input', 'lh-metrics-toggle__input');
        var checkboxId = "lh-metrics-toggle".concat(_util.Util.getUniqueSuffix());
        checkboxEl.setAttribute('aria-label', 'Toggle the display of metric descriptions');
        checkboxEl.type = 'checkbox';
        checkboxEl.id = checkboxId;
        metricsGroupEl.prepend(checkboxEl);
        var metricHeaderEl = this.dom.find('.lh-audit-group__header', metricsGroupEl);
        var labelEl = this.dom.createChildOf(metricHeaderEl, 'label', 'lh-metrics-toggle__label');
        labelEl.htmlFor = checkboxId;
        var showEl = this.dom.createChildOf(labelEl, 'span', 'lh-metrics-toggle__labeltext--show');
        var hideEl = this.dom.createChildOf(labelEl, 'span', 'lh-metrics-toggle__labeltext--hide');
        showEl.textContent = _util.Util.i18n.strings.expandView;
        hideEl.textContent = _util.Util.i18n.strings.collapseView;
        var metricsBoxesEl = this.dom.createElement('div', 'lh-metrics-container');
        metricsGroupEl.insertBefore(metricsBoxesEl, metricsFooterEl);
        metricAudits.forEach(function (item) {
          metricsBoxesEl.appendChild(_this._renderMetric(item));
        });
        var descriptionEl = this.dom.find('.lh-category-header__description', element);
        var estValuesEl = this.dom.createChildOf(descriptionEl, 'div', 'lh-metrics__disclaimer');
        var disclaimerEl = this.dom.convertMarkdownLinkSnippets(strings.varianceDisclaimer);
        estValuesEl.appendChild(disclaimerEl); // Add link to score calculator.

        var calculatorLink = this.dom.createChildOf(estValuesEl, 'a', 'lh-calclink');
        calculatorLink.target = '_blank';
        calculatorLink.textContent = strings.calculatorLink;
        this.dom.safelySetHref(calculatorLink, this._getScoringCalculatorHref(category.auditRefs));
        metricsGroupEl.classList.add('lh-audit-group--metrics');
        element.appendChild(metricsGroupEl);
      } // Filmstrip


      var timelineEl = this.dom.createChildOf(element, 'div', 'lh-filmstrip-container');
      var thumbnailAudit = category.auditRefs.find(function (audit) {
        return audit.id === 'screenshot-thumbnails';
      });
      var thumbnailResult = thumbnailAudit === null || thumbnailAudit === void 0 ? void 0 : thumbnailAudit.result;

      if (thumbnailResult !== null && thumbnailResult !== void 0 && thumbnailResult.details) {
        timelineEl.id = thumbnailResult.id;
        var filmstripEl = this.detailsRenderer.render(thumbnailResult.details);
        filmstripEl && timelineEl.appendChild(filmstripEl);
      } // Opportunities


      var opportunityAudits = category.auditRefs.filter(function (audit) {
        return _this._classifyPerformanceAudit(audit) === 'load-opportunity';
      }).filter(function (audit) {
        return !_util.Util.showAsPassed(audit.result);
      }).sort(function (auditA, auditB) {
        return _this._getWastedMs(auditB) - _this._getWastedMs(auditA);
      });
      var filterableMetrics = metricAudits.filter(function (a) {
        return !!a.relevantAudits;
      }); // TODO: only add if there are opportunities & diagnostics rendered.

      if (filterableMetrics.length) {
        this.renderMetricAuditFilter(filterableMetrics, element);
      }

      if (opportunityAudits.length) {
        // Scale the sparklines relative to savings, minimum 2s to not overstate small savings
        var minimumScale = 2000;
        var wastedMsValues = opportunityAudits.map(function (audit) {
          return _this._getWastedMs(audit);
        });
        var maxWaste = Math.max.apply(Math, _toConsumableArray(wastedMsValues));
        var scale = Math.max(Math.ceil(maxWaste / 1000) * 1000, minimumScale);

        var _this$renderAuditGrou3 = this.renderAuditGroup(groups['load-opportunities']),
            _this$renderAuditGrou4 = _slicedToArray(_this$renderAuditGrou3, 2),
            groupEl = _this$renderAuditGrou4[0],
            footerEl = _this$renderAuditGrou4[1];

        var tmpl = this.dom.createComponent('opportunityHeader');
        this.dom.find('.lh-load-opportunity__col--one', tmpl).textContent = strings.opportunityResourceColumnLabel;
        this.dom.find('.lh-load-opportunity__col--two', tmpl).textContent = strings.opportunitySavingsColumnLabel;
        var headerEl = this.dom.find('.lh-load-opportunity__header', tmpl);
        groupEl.insertBefore(headerEl, footerEl);
        opportunityAudits.forEach(function (item) {
          return groupEl.insertBefore(_this._renderOpportunity(item, scale), footerEl);
        });
        groupEl.classList.add('lh-audit-group--load-opportunities');
        element.appendChild(groupEl);
      } // Diagnostics


      var diagnosticAudits = category.auditRefs.filter(function (audit) {
        return _this._classifyPerformanceAudit(audit) === 'diagnostic';
      }).filter(function (audit) {
        return !_util.Util.showAsPassed(audit.result);
      }).sort(function (a, b) {
        var scoreA = a.result.scoreDisplayMode === 'informative' ? 100 : Number(a.result.score);
        var scoreB = b.result.scoreDisplayMode === 'informative' ? 100 : Number(b.result.score);
        return scoreA - scoreB;
      });

      if (diagnosticAudits.length) {
        var _this$renderAuditGrou5 = this.renderAuditGroup(groups['diagnostics']),
            _this$renderAuditGrou6 = _slicedToArray(_this$renderAuditGrou5, 2),
            _groupEl = _this$renderAuditGrou6[0],
            _footerEl = _this$renderAuditGrou6[1];

        diagnosticAudits.forEach(function (item) {
          return _groupEl.insertBefore(_this.renderAudit(item), _footerEl);
        });

        _groupEl.classList.add('lh-audit-group--diagnostics');

        element.appendChild(_groupEl);
      } // Passed audits


      var passedAudits = category.auditRefs.filter(function (audit) {
        return _this._classifyPerformanceAudit(audit) && _util.Util.showAsPassed(audit.result);
      });
      if (!passedAudits.length) return element;
      var clumpOpts = {
        auditRefs: passedAudits,
        groupDefinitions: groups
      };
      var passedElem = this.renderClump('passed', clumpOpts);
      element.appendChild(passedElem); // Budgets

      /** @type {Array<Element>} */

      var budgetTableEls = [];
      ['performance-budget', 'timing-budget'].forEach(function (id) {
        var audit = category.auditRefs.find(function (audit) {
          return audit.id === id;
        });

        if (audit !== null && audit !== void 0 && audit.result.details) {
          var table = _this.detailsRenderer.render(audit.result.details);

          if (table) {
            table.id = id;
            table.classList.add('lh-details', 'lh-details--budget', 'lh-audit');
            budgetTableEls.push(table);
          }
        }
      });

      if (budgetTableEls.length > 0) {
        var _this$renderAuditGrou7 = this.renderAuditGroup(groups.budgets),
            _this$renderAuditGrou8 = _slicedToArray(_this$renderAuditGrou7, 2),
            _groupEl2 = _this$renderAuditGrou8[0],
            _footerEl2 = _this$renderAuditGrou8[1];

        budgetTableEls.forEach(function (table) {
          return _groupEl2.insertBefore(table, _footerEl2);
        });

        _groupEl2.classList.add('lh-audit-group--budgets');

        element.appendChild(_groupEl2);
      }

      return element;
    }
    /**
     * Render the control to filter the audits by metric. The filtering is done at runtime by CSS only
     * @param {LH.ReportResult.AuditRef[]} filterableMetrics
     * @param {HTMLDivElement} categoryEl
     */

  }, {
    key: "renderMetricAuditFilter",
    value: function renderMetricAuditFilter(filterableMetrics, categoryEl) {
      var _this2 = this;

      var metricFilterEl = this.dom.createElement('div', 'lh-metricfilter');
      var textEl = this.dom.createChildOf(metricFilterEl, 'span', 'lh-metricfilter__text');
      textEl.textContent = _util.Util.i18n.strings.showRelevantAudits;
      var filterChoices =
      /** @type {LH.ReportResult.AuditRef[]} */
      [{
        acronym: 'All'
      }].concat(_toConsumableArray(filterableMetrics)); // Form labels need to reference unique IDs, but multiple reports rendered in the same DOM (eg PSI)
      // would mean ID conflict.  To address this, we 'scope' these radio inputs with a unique suffix.

      var uniqSuffix = _util.Util.getUniqueSuffix();

      var _iterator = _createForOfIteratorHelper(filterChoices),
          _step;

      try {
        var _loop = function _loop() {
          var _metric$result;

          var metric = _step.value;
          var elemId = "metric-".concat(metric.acronym, "-").concat(uniqSuffix);

          var radioEl = _this2.dom.createChildOf(metricFilterEl, 'input', 'lh-metricfilter__radio');

          radioEl.type = 'radio';
          radioEl.name = "metricsfilter-".concat(uniqSuffix);
          radioEl.id = elemId;

          var labelEl = _this2.dom.createChildOf(metricFilterEl, 'label', 'lh-metricfilter__label');

          labelEl.htmlFor = elemId;
          labelEl.title = (_metric$result = metric.result) === null || _metric$result === void 0 ? void 0 : _metric$result.title;
          labelEl.textContent = metric.acronym || metric.id;

          if (metric.acronym === 'All') {
            radioEl.checked = true;
            labelEl.classList.add('lh-metricfilter__label--active');
          }

          categoryEl.append(metricFilterEl); // Toggle class/hidden state based on filter choice.

          radioEl.addEventListener('input', function (_) {
            var _iterator2 = _createForOfIteratorHelper(categoryEl.querySelectorAll('label.lh-metricfilter__label')),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var elem = _step2.value;
                elem.classList.toggle('lh-metricfilter__label--active', elem.htmlFor === elemId);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            categoryEl.classList.toggle('lh-category--filtered', metric.acronym !== 'All');

            var _iterator3 = _createForOfIteratorHelper(categoryEl.querySelectorAll('div.lh-audit')),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var perfAuditEl = _step3.value;

                if (metric.acronym === 'All') {
                  perfAuditEl.hidden = false;
                  continue;
                }

                perfAuditEl.hidden = true;

                if (metric.relevantAudits && metric.relevantAudits.includes(perfAuditEl.id)) {
                  perfAuditEl.hidden = false;
                }
              } // Hide groups/clumps if all child audits are also hidden.

            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            var groupEls = categoryEl.querySelectorAll('div.lh-audit-group, details.lh-audit-group');

            var _iterator4 = _createForOfIteratorHelper(groupEls),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var groupEl = _step4.value;
                groupEl.hidden = false;
                var childEls = Array.from(groupEl.querySelectorAll('div.lh-audit'));
                var areAllHidden = !!childEls.length && childEls.every(function (auditEl) {
                  return auditEl.hidden;
                });
                groupEl.hidden = areAllHidden;
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          });
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return PerformanceCategoryRenderer;
}(_categoryRenderer.CategoryRenderer);

exports.PerformanceCategoryRenderer = PerformanceCategoryRenderer;