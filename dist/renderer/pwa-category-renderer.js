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

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PwaCategoryRenderer = void 0;

var _util = require("./util.js");

var _categoryRenderer = require("./category-renderer.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PwaCategoryRenderer = /*#__PURE__*/function (_CategoryRenderer) {
  _inherits(PwaCategoryRenderer, _CategoryRenderer);

  var _super = _createSuper(PwaCategoryRenderer);

  function PwaCategoryRenderer() {
    _classCallCheck(this, PwaCategoryRenderer);

    return _super.apply(this, arguments);
  }

  _createClass(PwaCategoryRenderer, [{
    key: "render",
    value:
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Object<string, LH.Result.ReportGroup>} [groupDefinitions]
     * @return {Element}
     */
    function render(category) {
      var groupDefinitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var categoryElem = this.dom.createElement('div', 'lh-category');
      categoryElem.id = category.id;
      categoryElem.appendChild(this.renderCategoryHeader(category, groupDefinitions));
      var auditRefs = category.auditRefs; // Regular audits aren't split up into pass/fail/notApplicable clumps, they're
      // all put in a top-level clump that isn't expandable/collapsible.

      var regularAuditRefs = auditRefs.filter(function (ref) {
        return ref.result.scoreDisplayMode !== 'manual';
      });

      var auditsElem = this._renderAudits(regularAuditRefs, groupDefinitions);

      categoryElem.appendChild(auditsElem); // Manual audits are still in a manual clump.

      var manualAuditRefs = auditRefs.filter(function (ref) {
        return ref.result.scoreDisplayMode === 'manual';
      });
      var manualElem = this.renderClump('manual', {
        auditRefs: manualAuditRefs,
        description: category.manualDescription
      });
      categoryElem.appendChild(manualElem);
      return categoryElem;
    }
    /**
     * @param {LH.ReportResult.Category} category
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {DocumentFragment}
     */

  }, {
    key: "renderCategoryScore",
    value: function renderCategoryScore(category, groupDefinitions) {
      // Defer to parent-gauge style if category error.
      if (category.score === null) {
        return _get(_getPrototypeOf(PwaCategoryRenderer.prototype), "renderScoreGauge", this).call(this, category, groupDefinitions);
      }

      var tmpl = this.dom.createComponent('gaugePwa');
      var wrapper = this.dom.find('a.lh-gauge--pwa__wrapper', tmpl); // Correct IDs in case multiple instances end up in the page.

      var svgRoot = tmpl.querySelector('svg');
      if (!svgRoot) throw new Error('no SVG element found in PWA score gauge template');

      PwaCategoryRenderer._makeSvgReferencesUnique(svgRoot);

      var allGroups = this._getGroupIds(category.auditRefs);

      var passingGroupIds = this._getPassingGroupIds(category.auditRefs);

      if (passingGroupIds.size === allGroups.size) {
        wrapper.classList.add('lh-badged--all');
      } else {
        var _iterator = _createForOfIteratorHelper(passingGroupIds),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var passingGroupId = _step.value;
            wrapper.classList.add("lh-badged--".concat(passingGroupId));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      this.dom.find('.lh-gauge__label', tmpl).textContent = category.title;
      wrapper.title = this._getGaugeTooltip(category.auditRefs, groupDefinitions);
      return tmpl;
    }
    /**
     * Returns the group IDs found in auditRefs.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @return {!Set<string>}
     */

  }, {
    key: "_getGroupIds",
    value: function _getGroupIds(auditRefs) {
      var groupIds = auditRefs.map(function (ref) {
        return ref.group;
      }).filter(
      /** @return {g is string} */
      function (g) {
        return !!g;
      });
      return new Set(groupIds);
    }
    /**
     * Returns the group IDs whose audits are all considered passing.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @return {Set<string>}
     */

  }, {
    key: "_getPassingGroupIds",
    value: function _getPassingGroupIds(auditRefs) {
      var uniqueGroupIds = this._getGroupIds(auditRefs); // Remove any that have a failing audit.


      var _iterator2 = _createForOfIteratorHelper(auditRefs),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var auditRef = _step2.value;

          if (!_util.Util.showAsPassed(auditRef.result) && auditRef.group) {
            uniqueGroupIds.delete(auditRef.group);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return uniqueGroupIds;
    }
    /**
     * Returns a tooltip string summarizing group pass rates.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @param {Record<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {string}
     */

  }, {
    key: "_getGaugeTooltip",
    value: function _getGaugeTooltip(auditRefs, groupDefinitions) {
      var groupIds = this._getGroupIds(auditRefs);

      var tips = [];

      var _iterator3 = _createForOfIteratorHelper(groupIds),
          _step3;

      try {
        var _loop = function _loop() {
          var groupId = _step3.value;
          var groupAuditRefs = auditRefs.filter(function (ref) {
            return ref.group === groupId;
          });
          var auditCount = groupAuditRefs.length;
          var passedCount = groupAuditRefs.filter(function (ref) {
            return _util.Util.showAsPassed(ref.result);
          }).length;
          var title = groupDefinitions[groupId].title;
          tips.push("".concat(title, ": ").concat(passedCount, "/").concat(auditCount));
        };

        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return tips.join(', ');
    }
    /**
     * Render non-manual audits in groups, giving a badge to any group that has
     * all passing audits.
     * @param {Array<LH.ReportResult.AuditRef>} auditRefs
     * @param {Object<string, LH.Result.ReportGroup>} groupDefinitions
     * @return {Element}
     */

  }, {
    key: "_renderAudits",
    value: function _renderAudits(auditRefs, groupDefinitions) {
      var auditsElem = this.renderUnexpandableClump(auditRefs, groupDefinitions); // Add a 'badged' class to group if all audits in that group pass.

      var passsingGroupIds = this._getPassingGroupIds(auditRefs);

      var _iterator4 = _createForOfIteratorHelper(passsingGroupIds),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var groupId = _step4.value;
          var groupElem = this.dom.find(".lh-audit-group--".concat(groupId), auditsElem);
          groupElem.classList.add('lh-badged');
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return auditsElem;
    }
    /**
     * Alters SVG id references so multiple instances of an SVG element can coexist
     * in a single page. If `svgRoot` has a `<defs>` block, gives all elements defined
     * in it unique ids, then updates id references (`<use xlink:href="...">`,
     * `fill="url(#...)"`) to the altered ids in all descendents of `svgRoot`.
     * @param {SVGElement} svgRoot
     */

  }], [{
    key: "_makeSvgReferencesUnique",
    value: function _makeSvgReferencesUnique(svgRoot) {
      var defsEl = svgRoot.querySelector('defs');
      if (!defsEl) return;

      var idSuffix = _util.Util.getUniqueSuffix();

      var elementsToUpdate = defsEl.querySelectorAll('[id]');

      var _iterator5 = _createForOfIteratorHelper(elementsToUpdate),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var el = _step5.value;
          var oldId = el.id;
          var newId = "".concat(oldId, "-").concat(idSuffix);
          el.id = newId; // Update all <use>s.

          var useEls = svgRoot.querySelectorAll("use[href=\"#".concat(oldId, "\"]"));

          var _iterator6 = _createForOfIteratorHelper(useEls),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var useEl = _step6.value;
              useEl.setAttribute('href', "#".concat(newId));
            } // Update all fill="url(#...)"s.

          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          var fillEls = svgRoot.querySelectorAll("[fill=\"url(#".concat(oldId, ")\"]"));

          var _iterator7 = _createForOfIteratorHelper(fillEls),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var fillEl = _step7.value;
              fillEl.setAttribute('fill', "url(#".concat(newId, ")"));
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }]);

  return PwaCategoryRenderer;
}(_categoryRenderer.CategoryRenderer);

exports.PwaCategoryRenderer = PwaCategoryRenderer;