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
// Convenience types for localized AuditDetails.

/** @typedef {LH.FormattedIcu<LH.Audit.Details>} AuditDetails */

/** @typedef {LH.FormattedIcu<LH.Audit.Details.Opportunity>} OpportunityTable */

/** @typedef {LH.FormattedIcu<LH.Audit.Details.Table>} Table */

/** @typedef {LH.FormattedIcu<LH.Audit.Details.TableItem>} TableItem */

/** @typedef {LH.FormattedIcu<LH.Audit.Details.ItemValue>} TableItemValue */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DetailsRenderer = void 0;

var _util = require("./util.js");

var _crcDetailsRenderer = require("./crc-details-renderer.js");

var _snippetRenderer = require("./snippet-renderer.js");

var _elementScreenshotRenderer = require("./element-screenshot-renderer.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var URL_PREFIXES = ['http://', 'https://', 'data:'];

var DetailsRenderer = /*#__PURE__*/function () {
  /**
   * @param {DOM} dom
   * @param {{fullPageScreenshot?: LH.Audit.Details.FullPageScreenshot}} [options]
   */
  function DetailsRenderer(dom) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, DetailsRenderer);

    this._dom = dom;
    this._fullPageScreenshot = options.fullPageScreenshot;
  }
  /**
   * @param {AuditDetails} details
   * @return {Element|null}
   */


  _createClass(DetailsRenderer, [{
    key: "render",
    value: function render(details) {
      switch (details.type) {
        case 'filmstrip':
          return this._renderFilmstrip(details);

        case 'list':
          return this._renderList(details);

        case 'table':
          return this._renderTable(details);

        case 'criticalrequestchain':
          return _crcDetailsRenderer.CriticalRequestChainRenderer.render(this._dom, details, this);

        case 'opportunity':
          return this._renderTable(details);
        // Internal-only details, not for rendering.

        case 'screenshot':
        case 'debugdata':
        case 'full-page-screenshot':
        case 'treemap-data':
          return null;

        default:
          {
            // @ts-expect-error tsc thinks this is unreachable, but be forward compatible
            // with new unexpected detail types.
            return this._renderUnknown(details.type, details);
          }
      }
    }
    /**
     * @param {{value: number, granularity?: number}} details
     * @return {Element}
     */

  }, {
    key: "_renderBytes",
    value: function _renderBytes(details) {
      // TODO: handle displayUnit once we have something other than 'kb'
      // Note that 'kb' is historical and actually represents KiB.
      var value = _util.Util.i18n.formatBytesToKiB(details.value, details.granularity);

      var textEl = this._renderText(value);

      textEl.title = _util.Util.i18n.formatBytes(details.value);
      return textEl;
    }
    /**
     * @param {{value: number, granularity?: number, displayUnit?: string}} details
     * @return {Element}
     */

  }, {
    key: "_renderMilliseconds",
    value: function _renderMilliseconds(details) {
      var value = _util.Util.i18n.formatMilliseconds(details.value, details.granularity);

      if (details.displayUnit === 'duration') {
        value = _util.Util.i18n.formatDuration(details.value);
      }

      return this._renderText(value);
    }
    /**
     * @param {string} text
     * @return {HTMLElement}
     */

  }, {
    key: "renderTextURL",
    value: function renderTextURL(text) {
      var url = text;
      var displayedPath;
      var displayedHost;
      var title;

      try {
        var parsed = _util.Util.parseURL(url);

        displayedPath = parsed.file === '/' ? parsed.origin : parsed.file;
        displayedHost = parsed.file === '/' || parsed.hostname === '' ? '' : "(".concat(parsed.hostname, ")");
        title = url;
      } catch (e) {
        displayedPath = url;
      }

      var element = this._dom.createElement('div', 'lh-text__url');

      element.appendChild(this._renderLink({
        text: displayedPath,
        url: url
      }));

      if (displayedHost) {
        var hostElem = this._renderText(displayedHost);

        hostElem.classList.add('lh-text__url-host');
        element.appendChild(hostElem);
      }

      if (title) {
        element.title = url; // set the url on the element's dataset which we use to check 3rd party origins

        element.dataset.url = url;
      }

      return element;
    }
    /**
     * @param {{text: string, url: string}} details
     * @return {HTMLElement}
     */

  }, {
    key: "_renderLink",
    value: function _renderLink(details) {
      var a = this._dom.createElement('a');

      this._dom.safelySetHref(a, details.url);

      if (!a.href) {
        // Fall back to just the link text if invalid or protocol not allowed.
        var element = this._renderText(details.text);

        element.classList.add('lh-link');
        return element;
      }

      a.rel = 'noopener';
      a.target = '_blank';
      a.textContent = details.text;
      a.classList.add('lh-link');
      return a;
    }
    /**
     * @param {string} text
     * @return {HTMLDivElement}
     */

  }, {
    key: "_renderText",
    value: function _renderText(text) {
      var element = this._dom.createElement('div', 'lh-text');

      element.textContent = text;
      return element;
    }
    /**
     * @param {{value: number, granularity?: number}} details
     * @return {Element}
     */

  }, {
    key: "_renderNumeric",
    value: function _renderNumeric(details) {
      var value = _util.Util.i18n.formatNumber(details.value, details.granularity);

      var element = this._dom.createElement('div', 'lh-numeric');

      element.textContent = value;
      return element;
    }
    /**
     * Create small thumbnail with scaled down image asset.
     * @param {string} details
     * @return {Element}
     */

  }, {
    key: "_renderThumbnail",
    value: function _renderThumbnail(details) {
      var element = this._dom.createElement('img', 'lh-thumbnail');

      var strValue = details;
      element.src = strValue;
      element.title = strValue;
      element.alt = '';
      return element;
    }
    /**
     * @param {string} type
     * @param {*} value
     */

  }, {
    key: "_renderUnknown",
    value: function _renderUnknown(type, value) {
      // eslint-disable-next-line no-console
      console.error("Unknown details type: ".concat(type), value);

      var element = this._dom.createElement('details', 'lh-unknown');

      this._dom.createChildOf(element, 'summary').textContent = "We don't know how to render audit details of type `".concat(type, "`. ") + 'The Lighthouse version that collected this data is likely newer than the Lighthouse ' + 'version of the report renderer. Expand for the raw JSON.';
      this._dom.createChildOf(element, 'pre').textContent = JSON.stringify(value, null, 2);
      return element;
    }
    /**
     * Render a details item value for embedding in a table. Renders the value
     * based on the heading's valueType, unless the value itself has a `type`
     * property to override it.
     * @param {TableItemValue} value
     * @param {LH.Audit.Details.OpportunityColumnHeading} heading
     * @return {Element|null}
     */

  }, {
    key: "_renderTableValue",
    value: function _renderTableValue(value, heading) {
      if (value === undefined || value === null) {
        return null;
      } // First deal with the possible object forms of value.


      if (_typeof(value) === 'object') {
        // The value's type overrides the heading's for this column.
        switch (value.type) {
          case 'code':
            {
              return this._renderCode(value.value);
            }

          case 'link':
            {
              return this._renderLink(value);
            }

          case 'node':
            {
              return this.renderNode(value);
            }

          case 'numeric':
            {
              return this._renderNumeric(value);
            }

          case 'source-location':
            {
              return this.renderSourceLocation(value);
            }

          case 'url':
            {
              return this.renderTextURL(value.value);
            }

          default:
            {
              return this._renderUnknown(value.type, value);
            }
        }
      } // Next, deal with primitives.


      switch (heading.valueType) {
        case 'bytes':
          {
            var numValue = Number(value);
            return this._renderBytes({
              value: numValue,
              granularity: heading.granularity
            });
          }

        case 'code':
          {
            var strValue = String(value);
            return this._renderCode(strValue);
          }

        case 'ms':
          {
            var msValue = {
              value: Number(value),
              granularity: heading.granularity,
              displayUnit: heading.displayUnit
            };
            return this._renderMilliseconds(msValue);
          }

        case 'numeric':
          {
            var _numValue = Number(value);

            return this._renderNumeric({
              value: _numValue,
              granularity: heading.granularity
            });
          }

        case 'text':
          {
            var _strValue = String(value);

            return this._renderText(_strValue);
          }

        case 'thumbnail':
          {
            var _strValue2 = String(value);

            return this._renderThumbnail(_strValue2);
          }

        case 'timespanMs':
          {
            var _numValue2 = Number(value);

            return this._renderMilliseconds({
              value: _numValue2
            });
          }

        case 'url':
          {
            var _strValue3 = String(value);

            if (URL_PREFIXES.some(function (prefix) {
              return _strValue3.startsWith(prefix);
            })) {
              return this.renderTextURL(_strValue3);
            } else {
              // Fall back to <pre> rendering if not actually a URL.
              return this._renderCode(_strValue3);
            }
          }

        default:
          {
            return this._renderUnknown(heading.valueType, value);
          }
      }
    }
    /**
     * Get the headings of a table-like details object, converted into the
     * OpportunityColumnHeading type until we have all details use the same
     * heading format.
     * @param {Table|OpportunityTable} tableLike
     * @return {OpportunityTable['headings']}
     */

  }, {
    key: "_getCanonicalizedHeadingsFromTable",
    value: function _getCanonicalizedHeadingsFromTable(tableLike) {
      var _this = this;

      if (tableLike.type === 'opportunity') {
        return tableLike.headings;
      }

      return tableLike.headings.map(function (heading) {
        return _this._getCanonicalizedHeading(heading);
      });
    }
    /**
     * Get the headings of a table-like details object, converted into the
     * OpportunityColumnHeading type until we have all details use the same
     * heading format.
     * @param {Table['headings'][number]} heading
     * @return {OpportunityTable['headings'][number]}
     */

  }, {
    key: "_getCanonicalizedHeading",
    value: function _getCanonicalizedHeading(heading) {
      var subItemsHeading;

      if (heading.subItemsHeading) {
        subItemsHeading = this._getCanonicalizedsubItemsHeading(heading.subItemsHeading, heading);
      }

      return {
        key: heading.key,
        valueType: heading.itemType,
        subItemsHeading: subItemsHeading,
        label: heading.text,
        displayUnit: heading.displayUnit,
        granularity: heading.granularity
      };
    }
    /**
     * @param {Exclude<LH.Audit.Details.TableColumnHeading['subItemsHeading'], undefined>} subItemsHeading
     * @param {LH.Audit.Details.TableColumnHeading} parentHeading
     * @return {LH.Audit.Details.OpportunityColumnHeading['subItemsHeading']}
     */

  }, {
    key: "_getCanonicalizedsubItemsHeading",
    value: function _getCanonicalizedsubItemsHeading(subItemsHeading, parentHeading) {
      // Low-friction way to prevent committing a falsy key (which is never allowed for
      // a subItemsHeading) from passing in CI.
      if (!subItemsHeading.key) {
        // eslint-disable-next-line no-console
        console.warn('key should not be null');
      }

      return {
        key: subItemsHeading.key || '',
        valueType: subItemsHeading.itemType || parentHeading.itemType,
        granularity: subItemsHeading.granularity || parentHeading.granularity,
        displayUnit: subItemsHeading.displayUnit || parentHeading.displayUnit
      };
    }
    /**
     * Returns a new heading where the values are defined first by `heading.subItemsHeading`,
     * and secondly by `heading`. If there is no subItemsHeading, returns null, which will
     * be rendered as an empty column.
     * @param {LH.Audit.Details.OpportunityColumnHeading} heading
     * @return {LH.Audit.Details.OpportunityColumnHeading | null}
     */

  }, {
    key: "_getDerivedsubItemsHeading",
    value: function _getDerivedsubItemsHeading(heading) {
      if (!heading.subItemsHeading) return null;
      return {
        key: heading.subItemsHeading.key || '',
        valueType: heading.subItemsHeading.valueType || heading.valueType,
        granularity: heading.subItemsHeading.granularity || heading.granularity,
        displayUnit: heading.subItemsHeading.displayUnit || heading.displayUnit,
        label: ''
      };
    }
    /**
     * @param {TableItem} item
     * @param {(LH.Audit.Details.OpportunityColumnHeading | null)[]} headings
     */

  }, {
    key: "_renderTableRow",
    value: function _renderTableRow(item, headings) {
      var rowElem = this._dom.createElement('tr');

      var _iterator = _createForOfIteratorHelper(headings),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var heading = _step.value;

          // Empty cell if no heading or heading key for this column.
          if (!heading || !heading.key) {
            this._dom.createChildOf(rowElem, 'td', 'lh-table-column--empty');

            continue;
          }

          var value = item[heading.key];
          var valueElement = void 0;

          if (value !== undefined && value !== null) {
            valueElement = this._renderTableValue(value, heading);
          }

          if (valueElement) {
            var classes = "lh-table-column--".concat(heading.valueType);

            this._dom.createChildOf(rowElem, 'td', classes).appendChild(valueElement);
          } else {
            // Empty cell is rendered for a column if:
            // - the pair is null
            // - the heading key is null
            // - the value is undefined/null
            this._dom.createChildOf(rowElem, 'td', 'lh-table-column--empty');
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return rowElem;
    }
    /**
     * Renders one or more rows from a details table item. A single table item can
     * expand into multiple rows, if there is a subItemsHeading.
     * @param {TableItem} item
     * @param {LH.Audit.Details.OpportunityColumnHeading[]} headings
     */

  }, {
    key: "_renderTableRowsFromItem",
    value: function _renderTableRowsFromItem(item, headings) {
      var fragment = this._dom.createFragment();

      fragment.append(this._renderTableRow(item, headings));
      if (!item.subItems) return fragment;
      var subItemsHeadings = headings.map(this._getDerivedsubItemsHeading);
      if (!subItemsHeadings.some(Boolean)) return fragment;

      var _iterator2 = _createForOfIteratorHelper(item.subItems.items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var subItem = _step2.value;

          var rowEl = this._renderTableRow(subItem, subItemsHeadings);

          rowEl.classList.add('lh-sub-item-row');
          fragment.append(rowEl);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return fragment;
    }
    /**
     * @param {OpportunityTable|Table} details
     * @return {Element}
     */

  }, {
    key: "_renderTable",
    value: function _renderTable(details) {
      if (!details.items.length) return this._dom.createElement('span');

      var tableElem = this._dom.createElement('table', 'lh-table');

      var theadElem = this._dom.createChildOf(tableElem, 'thead');

      var theadTrElem = this._dom.createChildOf(theadElem, 'tr');

      var headings = this._getCanonicalizedHeadingsFromTable(details);

      var _iterator3 = _createForOfIteratorHelper(headings),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var heading = _step3.value;
          var valueType = heading.valueType || 'text';
          var classes = "lh-table-column--".concat(valueType);

          var labelEl = this._dom.createElement('div', 'lh-text');

          labelEl.textContent = heading.label;

          this._dom.createChildOf(theadTrElem, 'th', classes).appendChild(labelEl);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var tbodyElem = this._dom.createChildOf(tableElem, 'tbody');

      var even = true;

      var _iterator4 = _createForOfIteratorHelper(details.items),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var item = _step4.value;

          var rowsFragment = this._renderTableRowsFromItem(item, headings);

          var _iterator5 = _createForOfIteratorHelper(this._dom.findAll('tr', rowsFragment)),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var rowEl = _step5.value;
              // For zebra styling.
              rowEl.classList.add(even ? 'lh-row--even' : 'lh-row--odd');
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          even = !even;
          tbodyElem.append(rowsFragment);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return tableElem;
    }
    /**
     * @param {LH.Audit.Details.List} details
     * @return {Element}
     */

  }, {
    key: "_renderList",
    value: function _renderList(details) {
      var _this2 = this;

      var listContainer = this._dom.createElement('div', 'lh-list');

      details.items.forEach(function (item) {
        var snippetEl = _snippetRenderer.SnippetRenderer.render(_this2._dom, item, _this2);

        listContainer.appendChild(snippetEl);
      });
      return listContainer;
    }
    /**
     * @param {LH.Audit.Details.NodeValue} item
     * @return {Element}
     */

  }, {
    key: "renderNode",
    value: function renderNode(item) {
      var element = this._dom.createElement('span', 'lh-node');

      if (item.nodeLabel) {
        var nodeLabelEl = this._dom.createElement('div');

        nodeLabelEl.textContent = item.nodeLabel;
        element.appendChild(nodeLabelEl);
      }

      if (item.snippet) {
        var snippetEl = this._dom.createElement('div');

        snippetEl.classList.add('lh-node__snippet');
        snippetEl.textContent = item.snippet;
        element.appendChild(snippetEl);
      }

      if (item.selector) {
        element.title = item.selector;
      }

      if (item.path) element.setAttribute('data-path', item.path);
      if (item.selector) element.setAttribute('data-selector', item.selector);
      if (item.snippet) element.setAttribute('data-snippet', item.snippet);
      if (!this._fullPageScreenshot) return element;
      var rect = item.lhId && this._fullPageScreenshot.nodes[item.lhId];
      if (!rect || rect.width === 0 || rect.height === 0) return element;
      var maxThumbnailSize = {
        width: 147,
        height: 100
      };

      var elementScreenshot = _elementScreenshotRenderer.ElementScreenshotRenderer.render(this._dom, this._fullPageScreenshot.screenshot, rect, maxThumbnailSize);

      if (elementScreenshot) element.prepend(elementScreenshot);
      return element;
    }
    /**
     * @param {LH.Audit.Details.SourceLocationValue} item
     * @return {Element|null}
     * @protected
     */

  }, {
    key: "renderSourceLocation",
    value: function renderSourceLocation(item) {
      if (!item.url) {
        return null;
      } // Lines are shown as one-indexed.


      var generatedLocation = "".concat(item.url, ":").concat(item.line + 1, ":").concat(item.column);
      var sourceMappedOriginalLocation;

      if (item.original) {
        var file = item.original.file || '<unmapped>';
        sourceMappedOriginalLocation = "".concat(file, ":").concat(item.original.line + 1, ":").concat(item.original.column);
      } // We render slightly differently based on presence of source map and provenance of URL.


      var element;

      if (item.urlProvider === 'network' && sourceMappedOriginalLocation) {
        element = this._renderLink({
          url: item.url,
          text: sourceMappedOriginalLocation
        });
        element.title = "maps to generated location ".concat(generatedLocation);
      } else if (item.urlProvider === 'network' && !sourceMappedOriginalLocation) {
        element = this.renderTextURL(item.url);
        this._dom.find('.lh-link', element).textContent += ":".concat(item.line + 1, ":").concat(item.column);
      } else if (item.urlProvider === 'comment' && sourceMappedOriginalLocation) {
        element = this._renderText("".concat(sourceMappedOriginalLocation, " (from source map)"));
        element.title = "".concat(generatedLocation, " (from sourceURL)");
      } else if (item.urlProvider === 'comment' && !sourceMappedOriginalLocation) {
        element = this._renderText("".concat(generatedLocation, " (from sourceURL)"));
      } else {
        return null;
      }

      element.classList.add('lh-source-location');
      element.setAttribute('data-source-url', item.url); // DevTools expects zero-indexed lines.

      element.setAttribute('data-source-line', String(item.line));
      element.setAttribute('data-source-column', String(item.column));
      return element;
    }
    /**
     * @param {LH.Audit.Details.Filmstrip} details
     * @return {Element}
     */

  }, {
    key: "_renderFilmstrip",
    value: function _renderFilmstrip(details) {
      var filmstripEl = this._dom.createElement('div', 'lh-filmstrip');

      var _iterator6 = _createForOfIteratorHelper(details.items),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var thumbnail = _step6.value;

          var frameEl = this._dom.createChildOf(filmstripEl, 'div', 'lh-filmstrip__frame');

          var imgEl = this._dom.createChildOf(frameEl, 'img', 'lh-filmstrip__thumbnail');

          imgEl.src = thumbnail.data;
          imgEl.alt = "Screenshot";
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return filmstripEl;
    }
    /**
     * @param {string} text
     * @return {Element}
     */

  }, {
    key: "_renderCode",
    value: function _renderCode(text) {
      var pre = this._dom.createElement('pre', 'lh-code');

      pre.textContent = text;
      return pre;
    }
  }]);

  return DetailsRenderer;
}();

exports.DetailsRenderer = DetailsRenderer;