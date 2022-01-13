/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/* eslint-env browser */

/** @typedef {import('./dom.js').DOM} DOM */

/** @typedef {import('./report-ui-features').ReportUIFeatures} ReportUIFeatures */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopbarFeatures = void 0;

var _dropDownMenu = require("./drop-down-menu.js");

var _featuresUtil = require("./features-util.js");

var _openTab = require("./open-tab.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var TopbarFeatures = /*#__PURE__*/function () {
  /**
   * @param {ReportUIFeatures} reportUIFeatures
   * @param {DOM} dom
   */
  function TopbarFeatures(reportUIFeatures, dom) {
    _classCallCheck(this, TopbarFeatures);

    /** @type {LH.Result} */
    this.lhr; // eslint-disable-line no-unused-expressions

    this._reportUIFeatures = reportUIFeatures;
    this._dom = dom;
    this._dropDownMenu = new _dropDownMenu.DropDownMenu(this._dom);
    this._copyAttempt = false;
    /** @type {HTMLElement} */

    this.topbarEl; // eslint-disable-line no-unused-expressions

    /** @type {HTMLElement} */

    this.categoriesEl; // eslint-disable-line no-unused-expressions

    /** @type {HTMLElement?} */

    this.stickyHeaderEl; // eslint-disable-line no-unused-expressions

    /** @type {HTMLElement} */

    this.highlightEl; // eslint-disable-line no-unused-expressions

    this.onDropDownMenuClick = this.onDropDownMenuClick.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.collapseAllDetails = this.collapseAllDetails.bind(this);
  }
  /**
   * @param {LH.Result} lhr
   */


  _createClass(TopbarFeatures, [{
    key: "enable",
    value: function enable(lhr) {
      var _this = this;

      this.lhr = lhr;

      this._dom.rootEl.addEventListener('keyup', this.onKeyUp);

      this._dom.document().addEventListener('copy', this.onCopy);

      this._dropDownMenu.setup(this.onDropDownMenuClick);

      this._setUpCollapseDetailsAfterPrinting();

      var topbarLogo = this._dom.find('.lh-topbar__logo', this._dom.rootEl);

      topbarLogo.addEventListener('click', function () {
        return (0, _featuresUtil.toggleDarkTheme)(_this._dom);
      });

      this._setupStickyHeader();
    }
    /**
     * Handler for tool button.
     * @param {Event} e
     */

  }, {
    key: "onDropDownMenuClick",
    value: function onDropDownMenuClick(e) {
      e.preventDefault();
      var el =
      /** @type {?Element} */
      e.target;

      if (!el || !el.hasAttribute('data-action')) {
        return;
      }

      switch (el.getAttribute('data-action')) {
        case 'copy':
          this.onCopyButtonClick();
          break;

        case 'print-summary':
          this.collapseAllDetails();

          this._print();

          break;

        case 'print-expanded':
          this.expandAllDetails();

          this._print();

          break;

        case 'save-json':
          {
            var jsonStr = JSON.stringify(this.lhr, null, 2);

            this._reportUIFeatures._saveFile(new Blob([jsonStr], {
              type: 'application/json'
            }));

            break;
          }

        case 'save-html':
          {
            var htmlStr = this._reportUIFeatures.getReportHtml();

            try {
              this._reportUIFeatures._saveFile(new Blob([htmlStr], {
                type: 'text/html'
              }));
            } catch (e) {
              this._dom.fireEventOn('lh-log', this._dom.document(), {
                cmd: 'error',
                msg: 'Could not export as HTML. ' + e.message
              });
            }

            break;
          }

        case 'open-viewer':
          {
            // DevTools cannot send data with postMessage, and we only want to use the URL fragment
            // approach for viewer when needed, so check the environment and choose accordingly.
            if (this._dom.isDevTools()) {
              (0, _openTab.openViewer)(this.lhr);
            } else {
              (0, _openTab.openViewerAndSendData)(this.lhr);
            }

            break;
          }

        case 'save-gist':
          {
            this._reportUIFeatures.saveAsGist();

            break;
          }

        case 'toggle-dark':
          {
            (0, _featuresUtil.toggleDarkTheme)(this._dom);
            break;
          }
      }

      this._dropDownMenu.close();
    }
    /**
     * Handle copy events.
     * @param {ClipboardEvent} e
     */

  }, {
    key: "onCopy",
    value: function onCopy(e) {
      // Only handle copy button presses (e.g. ignore the user copying page text).
      if (this._copyAttempt && e.clipboardData) {
        // We want to write our own data to the clipboard, not the user's text selection.
        e.preventDefault();
        e.clipboardData.setData('text/plain', JSON.stringify(this.lhr, null, 2));

        this._dom.fireEventOn('lh-log', this._dom.document(), {
          cmd: 'log',
          msg: 'Report JSON copied to clipboard'
        });
      }

      this._copyAttempt = false;
    }
    /**
     * Copies the report JSON to the clipboard (if supported by the browser).
     */

  }, {
    key: "onCopyButtonClick",
    value: function onCopyButtonClick() {
      this._dom.fireEventOn('lh-analytics', this._dom.document(), {
        cmd: 'send',
        fields: {
          hitType: 'event',
          eventCategory: 'report',
          eventAction: 'copy'
        }
      });

      try {
        if (this._dom.document().queryCommandSupported('copy')) {
          this._copyAttempt = true; // Note: In Safari 10.0.1, execCommand('copy') returns true if there's
          // a valid text selection on the page. See http://caniuse.com/#feat=clipboard.

          if (!this._dom.document().execCommand('copy')) {
            this._copyAttempt = false; // Prevent event handler from seeing this as a copy attempt.

            this._dom.fireEventOn('lh-log', this._dom.document(), {
              cmd: 'warn',
              msg: 'Your browser does not support copy to clipboard.'
            });
          }
        }
      } catch (e) {
        this._copyAttempt = false;

        this._dom.fireEventOn('lh-log', this._dom.document(), {
          cmd: 'log',
          msg: e.message
        });
      }
    }
    /**
     * Keyup handler for the document.
     * @param {KeyboardEvent} e
     */

  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      // Ctrl+P - Expands audit details when user prints via keyboard shortcut.
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 80) {
        this._dropDownMenu.close();
      }
    }
    /**
     * Expands all audit `<details>`.
     * Ideally, a print stylesheet could take care of this, but CSS has no way to
     * open a `<details>` element.
     */

  }, {
    key: "expandAllDetails",
    value: function expandAllDetails() {
      var details = this._dom.findAll('.lh-categories details', this._dom.rootEl);

      details.map(function (detail) {
        return detail.open = true;
      });
    }
    /**
     * Collapses all audit `<details>`.
     * open a `<details>` element.
     */

  }, {
    key: "collapseAllDetails",
    value: function collapseAllDetails() {
      var details = this._dom.findAll('.lh-categories details', this._dom.rootEl);

      details.map(function (detail) {
        return detail.open = false;
      });
    }
  }, {
    key: "_print",
    value: function _print() {
      self.print();
    }
    /**
     * Resets the state of page before capturing the page for export.
     * When the user opens the exported HTML page, certain UI elements should
     * be in their closed state (not opened) and the templates should be unstamped.
     */

  }, {
    key: "resetUIState",
    value: function resetUIState() {
      this._dropDownMenu.close();
    }
    /**
     * Finds the first scrollable ancestor of `element`. Falls back to the document.
     * @param {Element} element
     * @return {Element | Document}
     */

  }, {
    key: "_getScrollParent",
    value: function _getScrollParent(element) {
      var _window$getComputedSt = window.getComputedStyle(element),
          overflowY = _window$getComputedSt.overflowY;

      var isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

      if (isScrollable) {
        return element;
      }

      if (element.parentElement) {
        return this._getScrollParent(element.parentElement);
      }

      return document;
    }
    /**
     * Sets up listeners to collapse audit `<details>` when the user closes the
     * print dialog, all `<details>` are collapsed.
     */

  }, {
    key: "_setUpCollapseDetailsAfterPrinting",
    value: function _setUpCollapseDetailsAfterPrinting() {
      var _this2 = this;

      // FF and IE implement these old events.
      if ('onbeforeprint' in self) {
        self.addEventListener('afterprint', this.collapseAllDetails);
      } else {
        // Note: FF implements both window.onbeforeprint and media listeners. However,
        // it doesn't matchMedia doesn't fire when matching 'print'.
        self.matchMedia('print').addListener(function (mql) {
          if (mql.matches) {
            _this2.expandAllDetails();
          } else {
            _this2.collapseAllDetails();
          }
        });
      }
    }
  }, {
    key: "_setupStickyHeader",
    value: function _setupStickyHeader() {
      var _this3 = this;

      // Cache these elements to avoid qSA on each onscroll.
      this.topbarEl = this._dom.find('div.lh-topbar', this._dom.rootEl);
      this.categoriesEl = this._dom.find('div.lh-categories', this._dom.rootEl); // Defer behind rAF to avoid forcing layout.

      window.requestAnimationFrame(function () {
        return window.requestAnimationFrame(function () {
          // Only present in the DOM if it'll be used (>=2 categories)
          try {
            _this3.stickyHeaderEl = _this3._dom.find('div.lh-sticky-header', _this3._dom.rootEl);
          } catch (_unused) {
            return;
          } // Highlighter will be absolutely positioned at first gauge, then transformed on scroll.


          _this3.highlightEl = _this3._dom.createChildOf(_this3.stickyHeaderEl, 'div', 'lh-highlighter'); // Update sticky header visibility and highlight when page scrolls/resizes.

          var scrollParent = _this3._getScrollParent(_this3._dom.find('.lh-container', _this3._dom.rootEl)); // The 'scroll' handler must be should be on {Element | Document}...


          scrollParent.addEventListener('scroll', function () {
            return _this3._updateStickyHeader();
          }); // However resizeObserver needs an element, *not* the document.

          var resizeTarget = scrollParent instanceof window.Document ? document.documentElement : scrollParent;
          new window.ResizeObserver(function () {
            return _this3._updateStickyHeader();
          }).observe(resizeTarget);
        });
      });
    }
    /**
     * Toggle visibility and update highlighter position
     */

  }, {
    key: "_updateStickyHeader",
    value: function _updateStickyHeader() {
      if (!this.stickyHeaderEl) return; // Show sticky header when the main 5 gauges clear the topbar.

      var topbarBottom = this.topbarEl.getBoundingClientRect().bottom;
      var categoriesTop = this.categoriesEl.getBoundingClientRect().top;
      var showStickyHeader = topbarBottom >= categoriesTop; // Highlight mini gauge when section is in view.
      // In view = the last category that starts above the middle of the window.

      var categoryEls = Array.from(this._dom.rootEl.querySelectorAll('.lh-category'));
      var categoriesAboveTheMiddle = categoryEls.filter(function (el) {
        return el.getBoundingClientRect().top - window.innerHeight / 2 < 0;
      });
      var highlightIndex = categoriesAboveTheMiddle.length > 0 ? categoriesAboveTheMiddle.length - 1 : 0; // Category order matches gauge order in sticky header.

      var gaugeWrapperEls = this.stickyHeaderEl.querySelectorAll('.lh-gauge__wrapper');
      var gaugeToHighlight = gaugeWrapperEls[highlightIndex];
      var origin = gaugeWrapperEls[0].getBoundingClientRect().left;
      var offset = gaugeToHighlight.getBoundingClientRect().left - origin; // Mutate at end to avoid layout thrashing.

      this.highlightEl.style.transform = "translate(".concat(offset, "px)");
      this.stickyHeaderEl.classList.toggle('lh-sticky-header--visible', showStickyHeader);
    }
  }]);

  return TopbarFeatures;
}();

exports.TopbarFeatures = TopbarFeatures;