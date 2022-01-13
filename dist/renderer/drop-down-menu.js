/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/* eslint-env browser */

/** @typedef {import('./dom.js').DOM} DOM */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropDownMenu = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var DropDownMenu = /*#__PURE__*/function () {
  /**
   * @param {DOM} dom
   */
  function DropDownMenu(dom) {
    _classCallCheck(this, DropDownMenu);

    /** @type {DOM} */
    this._dom = dom;
    /** @type {HTMLElement} */

    this._toggleEl; // eslint-disable-line no-unused-expressions

    /** @type {HTMLElement} */

    this._menuEl; // eslint-disable-line no-unused-expressions

    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.onToggleClick = this.onToggleClick.bind(this);
    this.onToggleKeydown = this.onToggleKeydown.bind(this);
    this.onMenuFocusOut = this.onMenuFocusOut.bind(this);
    this.onMenuKeydown = this.onMenuKeydown.bind(this);
    this._getNextMenuItem = this._getNextMenuItem.bind(this);
    this._getNextSelectableNode = this._getNextSelectableNode.bind(this);
    this._getPreviousMenuItem = this._getPreviousMenuItem.bind(this);
  }
  /**
   * @param {function(MouseEvent): any} menuClickHandler
   */


  _createClass(DropDownMenu, [{
    key: "setup",
    value: function setup(menuClickHandler) {
      this._toggleEl = this._dom.find('.lh-topbar button.lh-tools__button', this._dom.rootEl);

      this._toggleEl.addEventListener('click', this.onToggleClick);

      this._toggleEl.addEventListener('keydown', this.onToggleKeydown);

      this._menuEl = this._dom.find('.lh-topbar div.lh-tools__dropdown', this._dom.rootEl);

      this._menuEl.addEventListener('keydown', this.onMenuKeydown);

      this._menuEl.addEventListener('click', menuClickHandler);
    }
  }, {
    key: "close",
    value: function close() {
      this._toggleEl.classList.remove('lh-active');

      this._toggleEl.setAttribute('aria-expanded', 'false');

      if (this._menuEl.contains(this._dom.document().activeElement)) {
        // Refocus on the tools button if the drop down last had focus
        this._toggleEl.focus();
      }

      this._menuEl.removeEventListener('focusout', this.onMenuFocusOut);

      this._dom.document().removeEventListener('keydown', this.onDocumentKeyDown);
    }
    /**
     * @param {HTMLElement} firstFocusElement
     */

  }, {
    key: "open",
    value: function open(firstFocusElement) {
      if (this._toggleEl.classList.contains('lh-active')) {
        // If the drop down is already open focus on the element
        firstFocusElement.focus();
      } else {
        // Wait for drop down transition to complete so options are focusable.
        this._menuEl.addEventListener('transitionend', function () {
          firstFocusElement.focus();
        }, {
          once: true
        });
      }

      this._toggleEl.classList.add('lh-active');

      this._toggleEl.setAttribute('aria-expanded', 'true');

      this._menuEl.addEventListener('focusout', this.onMenuFocusOut);

      this._dom.document().addEventListener('keydown', this.onDocumentKeyDown);
    }
    /**
     * Click handler for tools button.
     * @param {Event} e
     */

  }, {
    key: "onToggleClick",
    value: function onToggleClick(e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      if (this._toggleEl.classList.contains('lh-active')) {
        this.close();
      } else {
        this.open(this._getNextMenuItem());
      }
    }
    /**
     * Handler for tool button.
     * @param {KeyboardEvent} e
     */

  }, {
    key: "onToggleKeydown",
    value: function onToggleKeydown(e) {
      switch (e.code) {
        case 'ArrowUp':
          e.preventDefault();
          this.open(this._getPreviousMenuItem());
          break;

        case 'ArrowDown':
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.open(this._getNextMenuItem());
          break;

        default: // no op

      }
    }
    /**
     * Handler for tool DropDown.
     * @param {KeyboardEvent} e
     */

  }, {
    key: "onMenuKeydown",
    value: function onMenuKeydown(e) {
      var el =
      /** @type {?HTMLElement} */
      e.target;

      switch (e.code) {
        case 'ArrowUp':
          e.preventDefault();

          this._getPreviousMenuItem(el).focus();

          break;

        case 'ArrowDown':
          e.preventDefault();

          this._getNextMenuItem(el).focus();

          break;

        case 'Home':
          e.preventDefault();

          this._getNextMenuItem().focus();

          break;

        case 'End':
          e.preventDefault();

          this._getPreviousMenuItem().focus();

          break;

        default: // no op

      }
    }
    /**
     * Keydown handler for the document.
     * @param {KeyboardEvent} e
     */

  }, {
    key: "onDocumentKeyDown",
    value: function onDocumentKeyDown(e) {
      if (e.keyCode === 27) {
        // ESC
        this.close();
      }
    }
    /**
     * Focus out handler for the drop down menu.
     * @param {FocusEvent} e
     */

  }, {
    key: "onMenuFocusOut",
    value: function onMenuFocusOut(e) {
      var focusedEl =
      /** @type {?HTMLElement} */
      e.relatedTarget;

      if (!this._menuEl.contains(focusedEl)) {
        this.close();
      }
    }
    /**
     * @param {Array<Node>} allNodes
     * @param {?HTMLElement=} startNode
     * @return {HTMLElement}
     */

  }, {
    key: "_getNextSelectableNode",
    value: function _getNextSelectableNode(allNodes, startNode) {
      var nodes = allNodes.filter(
      /** @return {node is HTMLElement} */
      function (node) {
        if (!(node instanceof HTMLElement)) {
          return false;
        } // 'Save as Gist' option may be disabled.


        if (node.hasAttribute('disabled')) {
          return false;
        } // 'Save as Gist' option may have display none.


        if (window.getComputedStyle(node).display === 'none') {
          return false;
        }

        return true;
      });
      var nextIndex = startNode ? nodes.indexOf(startNode) + 1 : 0;

      if (nextIndex >= nodes.length) {
        nextIndex = 0;
      }

      return nodes[nextIndex];
    }
    /**
     * @param {?HTMLElement=} startEl
     * @return {HTMLElement}
     */

  }, {
    key: "_getNextMenuItem",
    value: function _getNextMenuItem(startEl) {
      var nodes = Array.from(this._menuEl.childNodes);
      return this._getNextSelectableNode(nodes, startEl);
    }
    /**
     * @param {?HTMLElement=} startEl
     * @return {HTMLElement}
     */

  }, {
    key: "_getPreviousMenuItem",
    value: function _getPreviousMenuItem(startEl) {
      var nodes = Array.from(this._menuEl.childNodes).reverse();
      return this._getNextSelectableNode(nodes, startEl);
    }
  }]);

  return DropDownMenu;
}();

exports.DropDownMenu = DropDownMenu;