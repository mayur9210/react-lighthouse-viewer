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
 * Logs messages via a UI butter.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Logger = /*#__PURE__*/function () {
  /**
   * @param {HTMLElement} element - expected to have id #lh-log
   */
  function Logger(element) {
    _classCallCheck(this, Logger);

    this.el = element;
    var styleEl = document.createElement('style');
    styleEl.textContent =
    /* css */
    "\n      #lh-log {\n        position: fixed;\n        background-color: #323232;\n        color: #fff;\n        min-height: 48px;\n        min-width: 288px;\n        padding: 16px 24px;\n        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);\n        border-radius: 2px;\n        margin: 12px;\n        font-size: 14px;\n        cursor: default;\n        transition: transform 0.3s, opacity 0.3s;\n        transform: translateY(100px);\n        opacity: 0;\n        bottom: 0;\n        left: 0;\n        z-index: 3;\n        display: flex;\n        flex-direction: row;\n        justify-content: center;\n        align-items: center;\n      }\n      \n      #lh-log.lh-show {\n        opacity: 1;\n        transform: translateY(0);\n      }\n    ";
    if (!this.el.parentNode) throw new Error('element needs to be in the DOM');
    this.el.parentNode.insertBefore(styleEl, this.el);
    this._id = undefined;
  }
  /**
   * Shows a butter bar.
   * @param {string} msg The message to show.
   * @param {boolean=} autoHide True to hide the message after a duration.
   *     Default is true.
   */


  _createClass(Logger, [{
    key: "log",
    value: function log(msg) {
      var _this = this;

      var autoHide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this._id && clearTimeout(this._id);
      this.el.textContent = msg;
      this.el.classList.add('lh-show');

      if (autoHide) {
        this._id = setTimeout(function () {
          _this.el.classList.remove('lh-show');
        }, 7000);
      }
    }
    /**
     * @param {string} msg
     */

  }, {
    key: "warn",
    value: function warn(msg) {
      this.log('Warning: ' + msg);
    }
    /**
     * @param {string} msg
     */

  }, {
    key: "error",
    value: function error(msg) {
      this.log(msg); // Rethrow to make sure it's auditable as an error, but in a setTimeout so page
      // recovers gracefully and user can try loading a report again.

      setTimeout(function () {
        throw new Error(msg);
      }, 0);
    }
    /**
     * Explicitly hides the butter bar.
     */

  }, {
    key: "hide",
    value: function hide() {
      this._id && clearTimeout(this._id);
      this.el.classList.remove('lh-show');
    }
  }]);

  return Logger;
}();

exports.Logger = Logger;