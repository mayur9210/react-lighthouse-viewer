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
/** @typedef {import('./dom.js').DOM} DOM */

/** @typedef {import('./report-renderer.js').ReportRenderer} ReportRenderer */

/** @typedef {import('./details-renderer.js').DetailsRenderer} DetailsRenderer */

/** @typedef {'failed'|'warning'|'manual'|'passed'|'notApplicable'} TopLevelClumpId */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CategoryRenderer = void 0;

var _util = require("./util.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CategoryRenderer = /*#__PURE__*/function () {
  /**
   * @param {DOM} dom
   * @param {DetailsRenderer} detailsRenderer
   */
  function CategoryRenderer(dom, detailsRenderer) {
    _classCallCheck(this, CategoryRenderer);

    /** @type {DOM} */
    this.dom = dom;
    /** @type {DetailsRenderer} */

    this.detailsRenderer = detailsRenderer;
  }
  /**
   * Display info per top-level clump. Define on class to avoid race with Util init.
   */


  _createClass(CategoryRenderer, [{
    key: "_clumpTitles",
    get: function get() {
      return {
        warning: _util.Util.i18n.strings.warningAuditsGroupTitle,
        manual: _util.Util.i18n.strings.manualAuditsGroupTitle,
        passed: _util.Util.i18n.strings.passedAuditsGroupTitle,
        notApplicable: _util.Util.i18n.strings.notApplicableAuditsGroupTitle
      };
    }
    /**
     * @param {LH.ReportResult.AuditRef} audit
     * @return {Element}
     */

  }, {
    key: "renderAudit",
    value: function renderAudit(audit) {
      var component = this.dom.createComponent('audit');
      return this.populateAuditValues(audit, component);
    }
    /**
     * Populate an DOM tree with audit details. Used by renderAudit and renderOpportunity
     * @param {LH.ReportResult.AuditRef} audit
     * @param {DocumentFragment} component
     * @return {!Element}
     */

  }, {
    key: "populateAuditValues",
    value: function populateAuditValues(audit, component) {
      var _this = this;

      var strings = _util.Util.i18n.strings;
      var auditEl = this.dom.find('.lh-audit', component);
      auditEl.id = audit.result.id;
      var scoreDisplayMode = audit.result.scoreDisplayMode;

      if (audit.result.displayValue) {
        this.dom.find('.lh-audit__display-text', auditEl).textContent = audit.result.displayValue;
      }

      var titleEl = this.dom.find('.lh-audit__title', auditEl);
      titleEl.appendChild(this.dom.convertMarkdownCodeSnippets(audit.result.title));
      var descEl = this.dom.find('.lh-audit__description', auditEl);
      descEl.appendChild(this.dom.convertMarkdownLinkSnippets(audit.result.description));

      var _iterator = _createForOfIteratorHelper(audit.relevantMetrics || []),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var relevantMetric = _step.value;
          var adornEl = this.dom.createChildOf(descEl, 'span', 'lh-audit__adorn');
          adornEl.title = "Relevant to ".concat(relevantMetric.result.title);
          adornEl.textContent = relevantMetric.acronym || relevantMetric.id;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (audit.stackPacks) {
        audit.stackPacks.forEach(function (pack) {
          var packElm = _this.dom.createElement('div');

          packElm.classList.add('lh-audit__stackpack');

          var packElmImg = _this.dom.createElement('img');

          packElmImg.classList.add('lh-audit__stackpack__img');
          packElmImg.src = pack.iconDataURL;
          packElmImg.alt = pack.title;
          packElm.appendChild(packElmImg);
          packElm.appendChild(_this.dom.convertMarkdownLinkSnippets(pack.description));

          _this.dom.find('.lh-audit__stackpacks', auditEl).appendChild(packElm);
        });
      }

      var header = this.dom.find('details', auditEl);

      if (audit.result.details) {
        var elem = this.detailsRenderer.render(audit.result.details);

        if (elem) {
          elem.classList.add('lh-details');
          header.appendChild(elem);
        }
      } // Add chevron SVG to the end of the summary


      this.dom.find('.lh-chevron-container', auditEl).appendChild(this._createChevron());

      this._setRatingClass(auditEl, audit.result.score, scoreDisplayMode);

      if (audit.result.scoreDisplayMode === 'error') {
        auditEl.classList.add("lh-audit--error");
        var textEl = this.dom.find('.lh-audit__display-text', auditEl);
        textEl.textContent = strings.errorLabel;
        textEl.classList.add('lh-tooltip-boundary');
        var tooltip = this.dom.createChildOf(textEl, 'div', 'lh-tooltip lh-tooltip--error');
        tooltip.textContent = audit.result.errorMessage || strings.errorMissingAuditInfo;
      } else if (audit.result.explanation) {
        var explEl = this.dom.createChildOf(titleEl, 'div', 'lh-audit-explanation');
        explEl.textContent = audit.result.explanation;
      }

      var warnings = audit.result.warnings;
      if (!warnings || warnings.length === 0) return auditEl; // Add list of warnings or singular warning

      var summaryEl = this.dom.find('summary', header);
      var warningsEl = this.dom.createChildOf(summaryEl, 'div', 'lh-warnings');
      this.dom.createChildOf(warningsEl, 'span').textContent = strings.warningHeader;

      if (warnings.length === 1) {
        warningsEl.appendChild(this.dom.createTextNode(warnings.join('')));
      } else {
        var warningsUl = this.dom.createChildOf(warningsEl, 'ul');

        var _iterator2 = _createForOfIteratorHelper(warnings),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var warning = _step2.value;
            var item = this.dom.createChildOf(warningsUl, 'li');
            item.textContent = warning;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      return auditEl;
    }
    /**
     * Inject the final screenshot next to the score gauge of the first category (likely Performance)
     * @param {HTMLElement} categoriesEl
     * @param {LH.ReportResult['audits']} audits
     * @param {Element} scoreScaleEl
     */

  }, {
    key: "injectFinalScreenshot",
    value: function injectFinalScreenshot(categoriesEl, audits, scoreScaleEl) {
      var audit = audits['final-screenshot'];
      if (!audit || audit.scoreDisplayMode === 'error') return null;
      if (!audit.details || audit.details.type !== 'screenshot') return null;
      var imgEl = this.dom.createElement('img', 'lh-final-ss-image');
      var finalScreenshotDataUri = audit.details.data;
      imgEl.src = finalScreenshotDataUri;
      imgEl.alt = audit.title;
      var firstCatHeaderEl = this.dom.find('.lh-category .lh-category-header', categoriesEl);
      var leftColEl = this.dom.createElement('div', 'lh-category-headercol');
      var separatorEl = this.dom.createElement('div', 'lh-category-headercol lh-category-headercol--separator');
      var rightColEl = this.dom.createElement('div', 'lh-category-headercol');
      leftColEl.append.apply(leftColEl, _toConsumableArray(firstCatHeaderEl.childNodes));
      leftColEl.append(scoreScaleEl);
      rightColEl.append(imgEl);
      firstCatHeaderEl.append(leftColEl, separatorEl, rightColEl);
      firstCatHeaderEl.classList.add('lh-category-header__finalscreenshot');
    }
    /**
     * @return {Element}
     */

  }, {
    key: "_createChevron",
    value: function _createChevron() {
      var component = this.dom.createComponent('chevron');
      var chevronEl = this.dom.find('svg.lh-chevron', component);
      return chevronEl;
    }
    /**
     * @param {Element} element DOM node to populate with values.
     * @param {number|null} score
     * @param {string} scoreDisplayMode
     * @return {!Element}
     */

  }, {
    key: "_setRatingClass",
    value: function _setRatingClass(element, score, scoreDisplayMode) {
      var rating = _util.Util.calculateRating(score, scoreDisplayMode);

      element.classList.add("lh-audit--".concat(scoreDisplayMode.toLowerCase()));

      if (scoreDisplayMode !== 'informative') {
        element.classList.add("lh-audit--".concat(rating));
      }

      return element;
    }
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @param {{gatherMode: LH.Result.GatherMode}=} options
     * @return {DocumentFragment}
     */

  }, {
    key: "renderCategoryHeader",
    value: function renderCategoryHeader(category, groupDefinitions, options) {
      var component = this.dom.createComponent('categoryHeader');
      var gaugeContainerEl = this.dom.find('.lh-score__gauge', component);
      var gaugeEl = this.renderCategoryScore(category, groupDefinitions, options);
      gaugeContainerEl.appendChild(gaugeEl);

      if (category.description) {
        var descEl = this.dom.convertMarkdownLinkSnippets(category.description);
        this.dom.find('.lh-category-header__description', component).appendChild(descEl);
      }

      return component;
    }
    /**
     * Renders the group container for a group of audits. Individual audit elements can be added
     * directly to the returned element.
     * @param {LH.Result.ReportGroup} group
     * @return {[Element, Element | null]}
     */

  }, {
    key: "renderAuditGroup",
    value: function renderAuditGroup(group) {
      var groupEl = this.dom.createElement('div', 'lh-audit-group');
      var auditGroupHeader = this.dom.createElement('div', 'lh-audit-group__header');
      this.dom.createChildOf(auditGroupHeader, 'span', 'lh-audit-group__title').textContent = group.title;
      groupEl.appendChild(auditGroupHeader);
      var footerEl = null;

      if (group.description) {
        footerEl = this.dom.convertMarkdownLinkSnippets(group.description);
        footerEl.classList.add('lh-audit-group__description', 'lh-audit-group__footer');
        groupEl.appendChild(footerEl);
      }

      return [groupEl, footerEl];
    }
    /**
     * Takes an array of auditRefs, groups them if requested, then returns an
     * array of audit and audit-group elements.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @param {Object<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {Array<Element>}
     */

  }, {
    key: "_renderGroupedAudits",
    value: function _renderGroupedAudits(auditRefs, groupDefinitions) {
      // Audits grouped by their group (or under notAGroup).

      /** @type {Map<string, Array<LH.ReportResult.AuditRef>>} */
      var grouped = new Map(); // Add audits without a group first so they will appear first.

      var notAGroup = 'NotAGroup';
      grouped.set(notAGroup, []);

      var _iterator3 = _createForOfIteratorHelper(auditRefs),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var auditRef = _step3.value;
          var groupId = auditRef.group || notAGroup;
          var groupAuditRefs = grouped.get(groupId) || [];
          groupAuditRefs.push(auditRef);
          grouped.set(groupId, groupAuditRefs);
        }
        /** @type {Array<Element>} */

      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var auditElements = [];

      var _iterator4 = _createForOfIteratorHelper(grouped),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _step4$value = _slicedToArray(_step4.value, 2),
              _groupId = _step4$value[0],
              _groupAuditRefs = _step4$value[1];

          if (_groupId === notAGroup) {
            // Push not-grouped audits individually.
            var _iterator5 = _createForOfIteratorHelper(_groupAuditRefs),
                _step5;

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var _auditRef = _step5.value;
                auditElements.push(this.renderAudit(_auditRef));
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }

            continue;
          } // Push grouped audits as a group.


          var groupDef = groupDefinitions[_groupId];

          var _this$renderAuditGrou = this.renderAuditGroup(groupDef),
              _this$renderAuditGrou2 = _slicedToArray(_this$renderAuditGrou, 2),
              auditGroupElem = _this$renderAuditGrou2[0],
              auditGroupFooterEl = _this$renderAuditGrou2[1];

          var _iterator6 = _createForOfIteratorHelper(_groupAuditRefs),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var _auditRef2 = _step6.value;
              auditGroupElem.insertBefore(this.renderAudit(_auditRef2), auditGroupFooterEl);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          auditGroupElem.classList.add("lh-audit-group--".concat(_groupId));
          auditElements.push(auditGroupElem);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return auditElements;
    }
    /**
     * Take a set of audits, group them if they have groups, then render in a top-level
     * clump that can't be expanded/collapsed.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @param {Object<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {Element}
     */

  }, {
    key: "renderUnexpandableClump",
    value: function renderUnexpandableClump(auditRefs, groupDefinitions) {
      var clumpElement = this.dom.createElement('div');

      var elements = this._renderGroupedAudits(auditRefs, groupDefinitions);

      elements.forEach(function (elem) {
        return clumpElement.appendChild(elem);
      });
      return clumpElement;
    }
    /**
     * Take a set of audits and render in a top-level, expandable clump that starts
     * in a collapsed state.
     * @param {Exclude<TopLevelClumpId, 'failed'>} clumpId
     * @param {{auditRefs: Array<LH.ReportResult.AuditRef>, description?: string}} clumpOpts
     * @return {!Element}
     */

  }, {
    key: "renderClump",
    value: function renderClump(clumpId, _ref) {
      var auditRefs = _ref.auditRefs,
          description = _ref.description;
      var clumpComponent = this.dom.createComponent('clump');
      var clumpElement = this.dom.find('.lh-clump', clumpComponent);

      if (clumpId === 'warning') {
        clumpElement.setAttribute('open', '');
      }

      var headerEl = this.dom.find('.lh-audit-group__header', clumpElement);
      var title = this._clumpTitles[clumpId];
      this.dom.find('.lh-audit-group__title', headerEl).textContent = title;
      var itemCountEl = this.dom.find('.lh-audit-group__itemcount', clumpElement);
      itemCountEl.textContent = "(".concat(auditRefs.length, ")"); // Add all audit results to the clump.

      var auditElements = auditRefs.map(this.renderAudit.bind(this));
      clumpElement.append.apply(clumpElement, _toConsumableArray(auditElements));
      var el = this.dom.find('.lh-audit-group', clumpComponent);

      if (description) {
        var descriptionEl = this.dom.convertMarkdownLinkSnippets(description);
        descriptionEl.classList.add('lh-audit-group__description', 'lh-audit-group__footer');
        el.appendChild(descriptionEl);
      }

      this.dom.find('.lh-clump-toggletext--show', el).textContent = _util.Util.i18n.strings.show;
      this.dom.find('.lh-clump-toggletext--hide', el).textContent = _util.Util.i18n.strings.hide;
      clumpElement.classList.add("lh-clump--".concat(clumpId.toLowerCase()));
      return el;
    }
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @param {{gatherMode: LH.Result.GatherMode, omitLabel?: boolean, onPageAnchorRendered?: (link: HTMLAnchorElement) => void}=} options
     * @return {DocumentFragment}
     */

  }, {
    key: "renderCategoryScore",
    value: function renderCategoryScore(category, groupDefinitions, options) {
      var categoryScore;

      if (options && _util.Util.shouldDisplayAsFraction(options.gatherMode)) {
        categoryScore = this.renderCategoryFraction(category);
      } else {
        categoryScore = this.renderScoreGauge(category, groupDefinitions);
      }

      if (options !== null && options !== void 0 && options.omitLabel) {
        var label = this.dom.find('.lh-gauge__label,.lh-fraction__label', categoryScore);
        label.remove();
      }

      if (options !== null && options !== void 0 && options.onPageAnchorRendered) {
        var anchor = this.dom.find('a', categoryScore);
        options.onPageAnchorRendered(anchor);
      }

      return categoryScore;
    }
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {DocumentFragment}
     */

  }, {
    key: "renderScoreGauge",
    value: function renderScoreGauge(category, groupDefinitions) {
      // eslint-disable-line no-unused-vars
      var tmpl = this.dom.createComponent('gauge');
      var wrapper = this.dom.find('a.lh-gauge__wrapper', tmpl);

      if (_util.Util.isPluginCategory(category.id)) {
        wrapper.classList.add('lh-gauge__wrapper--plugin');
      } // Cast `null` to 0


      var numericScore = Number(category.score);
      var gauge = this.dom.find('.lh-gauge', tmpl);
      var gaugeArc = this.dom.find('circle.lh-gauge-arc', gauge);
      if (gaugeArc) this._setGaugeArc(gaugeArc, numericScore);
      var scoreOutOf100 = Math.round(numericScore * 100);
      var percentageEl = this.dom.find('div.lh-gauge__percentage', tmpl);
      percentageEl.textContent = scoreOutOf100.toString();

      if (category.score === null) {
        percentageEl.textContent = '?';
        percentageEl.title = _util.Util.i18n.strings.errorLabel;
      } // Render a numerical score if the category has applicable audits, or no audits whatsoever.


      if (category.auditRefs.length === 0 || this.hasApplicableAudits(category)) {
        wrapper.classList.add("lh-gauge__wrapper--".concat(_util.Util.calculateRating(category.score)));
      } else {
        wrapper.classList.add("lh-gauge__wrapper--not-applicable");
        percentageEl.textContent = '-';
        percentageEl.title = _util.Util.i18n.strings.notApplicableAuditsGroupTitle;
      }

      this.dom.find('.lh-gauge__label', tmpl).textContent = category.title;
      return tmpl;
    }
    /**
     * @param {LH.ReportResult.Category} category
     * @return {DocumentFragment}
     */

  }, {
    key: "renderCategoryFraction",
    value: function renderCategoryFraction(category) {
      var tmpl = this.dom.createComponent('fraction');
      var wrapper = this.dom.find('a.lh-fraction__wrapper', tmpl);

      var _Util$calculateCatego = _util.Util.calculateCategoryFraction(category),
          numPassed = _Util$calculateCatego.numPassed,
          numPassableAudits = _Util$calculateCatego.numPassableAudits,
          totalWeight = _Util$calculateCatego.totalWeight;

      var fraction = numPassed / numPassableAudits;
      var content = this.dom.find('.lh-fraction__content', tmpl);
      var text = this.dom.createElement('span');
      text.textContent = "".concat(numPassed, "/").concat(numPassableAudits);
      content.appendChild(text);

      var rating = _util.Util.calculateRating(fraction); // If none of the available audits can affect the score, a rating isn't useful.
      // The flow report should display the fraction with neutral icon and coloring in this case.


      if (totalWeight === 0) {
        rating = 'null';
      }

      wrapper.classList.add("lh-fraction__wrapper--".concat(rating));
      this.dom.find('.lh-fraction__label', tmpl).textContent = category.title;
      return tmpl;
    }
    /**
     * Returns true if an LH category has any non-"notApplicable" audits.
     * @param {LH.ReportResult.Category} category
     * @return {boolean}
     */

  }, {
    key: "hasApplicableAudits",
    value: function hasApplicableAudits(category) {
      return category.auditRefs.some(function (ref) {
        return ref.result.scoreDisplayMode !== 'notApplicable';
      });
    }
    /**
     * Define the score arc of the gauge
     * Credit to xgad for the original technique: https://codepen.io/xgad/post/svg-radial-progress-meters
     * @param {SVGCircleElement} arcElem
     * @param {number} percent
     */

  }, {
    key: "_setGaugeArc",
    value: function _setGaugeArc(arcElem, percent) {
      var circumferencePx = 2 * Math.PI * Number(arcElem.getAttribute('r')); // The rounded linecap of the stroke extends the arc past its start and end.
      // First, we tweak the -90deg rotation to start exactly at the top of the circle.

      var strokeWidthPx = Number(arcElem.getAttribute('stroke-width'));
      var rotationalAdjustmentPercent = 0.25 * strokeWidthPx / circumferencePx;
      arcElem.style.transform = "rotate(".concat(-90 + rotationalAdjustmentPercent * 360, "deg)"); // Then, we terminate the line a little early as well.

      var arcLengthPx = percent * circumferencePx - strokeWidthPx / 2; // Special cases. No dot for 0, and full ring if 100

      if (percent === 0) arcElem.style.opacity = '0';
      if (percent === 1) arcLengthPx = circumferencePx;
      arcElem.style.strokeDasharray = "".concat(Math.max(arcLengthPx, 0), " ").concat(circumferencePx);
    }
    /**
     * @param {LH.ReportResult.AuditRef} audit
     * @return {boolean}
     */

  }, {
    key: "_auditHasWarning",
    value: function _auditHasWarning(audit) {
      var _audit$result$warning;

      return Boolean((_audit$result$warning = audit.result.warnings) === null || _audit$result$warning === void 0 ? void 0 : _audit$result$warning.length);
    }
    /**
     * Returns the id of the top-level clump to put this audit in.
     * @param {LH.ReportResult.AuditRef} auditRef
     * @return {TopLevelClumpId}
     */

  }, {
    key: "_getClumpIdForAuditRef",
    value: function _getClumpIdForAuditRef(auditRef) {
      var scoreDisplayMode = auditRef.result.scoreDisplayMode;

      if (scoreDisplayMode === 'manual' || scoreDisplayMode === 'notApplicable') {
        return scoreDisplayMode;
      }

      if (_util.Util.showAsPassed(auditRef.result)) {
        if (this._auditHasWarning(auditRef)) {
          return 'warning';
        } else {
          return 'passed';
        }
      } else {
        return 'failed';
      }
    }
    /**
     * Renders a set of top level sections (clumps), under a status of failed, warning,
     * manual, passed, or notApplicable. The result ends up something like:
     *
     * failed clump
     *   ├── audit 1 (w/o group)
     *   ├── audit 2 (w/o group)
     *   ├── audit group
     *   |  ├── audit 3
     *   |  └── audit 4
     *   └── audit group
     *      ├── audit 5
     *      └── audit 6
     * other clump (e.g. 'manual')
     *   ├── audit 1
     *   ├── audit 2
     *   ├── …
     *   ⋮
     * @param {LH.ReportResult.Category} category
     * @param {Object<string, LH.Result.ReportGroup>=} groupDefinitions
     * @param {{gatherMode: LH.Result.GatherMode}=} options
     * @return {Element}
     */

  }, {
    key: "render",
    value: function render(category) {
      var groupDefinitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 ? arguments[2] : undefined;
      var element = this.dom.createElement('div', 'lh-category');
      element.id = category.id;
      element.appendChild(this.renderCategoryHeader(category, groupDefinitions, options)); // Top level clumps for audits, in order they will appear in the report.

      /** @type {Map<TopLevelClumpId, Array<LH.ReportResult.AuditRef>>} */

      var clumps = new Map();
      clumps.set('failed', []);
      clumps.set('warning', []);
      clumps.set('manual', []);
      clumps.set('passed', []);
      clumps.set('notApplicable', []); // Sort audits into clumps.

      var _iterator7 = _createForOfIteratorHelper(category.auditRefs),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var auditRef = _step7.value;

          var clumpId = this._getClumpIdForAuditRef(auditRef);

          var clump =
          /** @type {Array<LH.ReportResult.AuditRef>} */
          clumps.get(clumpId); // already defined

          clump.push(auditRef);
          clumps.set(clumpId, clump);
        } // Sort audits by weight.

      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      var _iterator8 = _createForOfIteratorHelper(clumps.values()),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var auditRefs = _step8.value;
          auditRefs.sort(function (a, b) {
            return b.weight - a.weight;
          });
        } // Render each clump.

      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      var _iterator9 = _createForOfIteratorHelper(clumps),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var _step9$value = _slicedToArray(_step9.value, 2),
              _clumpId = _step9$value[0],
              _auditRefs = _step9$value[1];

          if (_auditRefs.length === 0) continue;

          if (_clumpId === 'failed') {
            var _clumpElem = this.renderUnexpandableClump(_auditRefs, groupDefinitions);

            _clumpElem.classList.add("lh-clump--failed");

            element.appendChild(_clumpElem);
            continue;
          }

          var description = _clumpId === 'manual' ? category.manualDescription : undefined;
          var clumpElem = this.renderClump(_clumpId, {
            auditRefs: _auditRefs,
            description: description
          });
          element.appendChild(clumpElem);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      return element;
    }
  }]);

  return CategoryRenderer;
}();

exports.CategoryRenderer = CategoryRenderer;