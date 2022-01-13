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
 * @fileoverview This file contains helpers for constructing and rendering the
 * critical request chains network tree.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CriticalRequestChainRenderer = void 0;

var _util = require("./util.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/** @typedef {import('./dom.js').DOM} DOM */

/** @typedef {import('./details-renderer.js').DetailsRenderer} DetailsRenderer */

/**
 * @typedef CRCSegment
 * @property {LH.Audit.Details.SimpleCriticalRequestNode[string]} node
 * @property {boolean} isLastChild
 * @property {boolean} hasChildren
 * @property {number} startTime
 * @property {number} transferSize
 * @property {boolean[]} treeMarkers
 */
var CriticalRequestChainRenderer = /*#__PURE__*/function () {
  function CriticalRequestChainRenderer() {
    _classCallCheck(this, CriticalRequestChainRenderer);
  }

  _createClass(CriticalRequestChainRenderer, null, [{
    key: "initTree",
    value:
    /**
     * Create render context for critical-request-chain tree display.
     * @param {LH.Audit.Details.SimpleCriticalRequestNode} tree
     * @return {{tree: LH.Audit.Details.SimpleCriticalRequestNode, startTime: number, transferSize: number}}
     */
    function initTree(tree) {
      var startTime = 0;
      var rootNodes = Object.keys(tree);

      if (rootNodes.length > 0) {
        var node = tree[rootNodes[0]];
        startTime = node.request.startTime;
      }

      return {
        tree: tree,
        startTime: startTime,
        transferSize: 0
      };
    }
    /**
     * Helper to create context for each critical-request-chain node based on its
     * parent. Calculates if this node is the last child, whether it has any
     * children itself and what the tree looks like all the way back up to the root,
     * so the tree markers can be drawn correctly.
     * @param {LH.Audit.Details.SimpleCriticalRequestNode} parent
     * @param {string} id
     * @param {number} startTime
     * @param {number} transferSize
     * @param {Array<boolean>=} treeMarkers
     * @param {boolean=} parentIsLastChild
     * @return {CRCSegment}
     */

  }, {
    key: "createSegment",
    value: function createSegment(parent, id, startTime, transferSize, treeMarkers, parentIsLastChild) {
      var node = parent[id];
      var siblings = Object.keys(parent);
      var isLastChild = siblings.indexOf(id) === siblings.length - 1;
      var hasChildren = !!node.children && Object.keys(node.children).length > 0; // Copy the tree markers so that we don't change by reference.

      var newTreeMarkers = Array.isArray(treeMarkers) ? treeMarkers.slice(0) : []; // Add on the new entry.

      if (typeof parentIsLastChild !== 'undefined') {
        newTreeMarkers.push(!parentIsLastChild);
      }

      return {
        node: node,
        isLastChild: isLastChild,
        hasChildren: hasChildren,
        startTime: startTime,
        transferSize: transferSize + node.request.transferSize,
        treeMarkers: newTreeMarkers
      };
    }
    /**
     * Creates the DOM for a tree segment.
     * @param {DOM} dom
     * @param {CRCSegment} segment
     * @param {DetailsRenderer} detailsRenderer
     * @return {Node}
     */

  }, {
    key: "createChainNode",
    value: function createChainNode(dom, segment, detailsRenderer) {
      var chainEl = dom.createComponent('crcChain'); // Hovering over request shows full URL.

      dom.find('.lh-crc-node', chainEl).setAttribute('title', segment.node.request.url);
      var treeMarkeEl = dom.find('.lh-crc-node__tree-marker', chainEl); // Construct lines and add spacers for sub requests.

      segment.treeMarkers.forEach(function (separator) {
        if (separator) {
          treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker lh-vert'));
          treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker'));
        } else {
          treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker'));
          treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker'));
        }
      });

      if (segment.isLastChild) {
        treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker lh-up-right'));
        treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker lh-right'));
      } else {
        treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker lh-vert-right'));
        treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker lh-right'));
      }

      if (segment.hasChildren) {
        treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker lh-horiz-down'));
      } else {
        treeMarkeEl.appendChild(dom.createElement('span', 'lh-tree-marker lh-right'));
      } // Fill in url, host, and request size information.


      var url = segment.node.request.url;
      var linkEl = detailsRenderer.renderTextURL(url);
      var treevalEl = dom.find('.lh-crc-node__tree-value', chainEl);
      treevalEl.appendChild(linkEl);

      if (!segment.hasChildren) {
        var _segment$node$request = segment.node.request,
            startTime = _segment$node$request.startTime,
            endTime = _segment$node$request.endTime,
            transferSize = _segment$node$request.transferSize;
        var span = dom.createElement('span', 'lh-crc-node__chain-duration');
        span.textContent = ' - ' + _util.Util.i18n.formatMilliseconds((endTime - startTime) * 1000) + ', ';
        var span2 = dom.createElement('span', 'lh-crc-node__chain-duration');
        span2.textContent = _util.Util.i18n.formatBytesToKiB(transferSize, 0.01);
        treevalEl.appendChild(span);
        treevalEl.appendChild(span2);
      }

      return chainEl;
    }
    /**
     * Recursively builds a tree from segments.
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {CRCSegment} segment
     * @param {Element} elem Parent element.
     * @param {LH.Audit.Details.CriticalRequestChain} details
     * @param {DetailsRenderer} detailsRenderer
     */

  }, {
    key: "buildTree",
    value: function buildTree(dom, tmpl, segment, elem, details, detailsRenderer) {
      elem.appendChild(CRCRenderer.createChainNode(dom, segment, detailsRenderer));

      if (segment.node.children) {
        for (var _i = 0, _Object$keys = Object.keys(segment.node.children); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          var childSegment = CRCRenderer.createSegment(segment.node.children, key, segment.startTime, segment.transferSize, segment.treeMarkers, segment.isLastChild);
          CRCRenderer.buildTree(dom, tmpl, childSegment, elem, details, detailsRenderer);
        }
      }
    }
    /**
     * @param {DOM} dom
     * @param {LH.Audit.Details.CriticalRequestChain} details
     * @param {DetailsRenderer} detailsRenderer
     * @return {Element}
     */

  }, {
    key: "render",
    value: function render(dom, details, detailsRenderer) {
      var tmpl = dom.createComponent('crc');
      var containerEl = dom.find('.lh-crc', tmpl); // Fill in top summary.

      dom.find('.lh-crc-initial-nav', tmpl).textContent = _util.Util.i18n.strings.crcInitialNavigation;
      dom.find('.lh-crc__longest_duration_label', tmpl).textContent = _util.Util.i18n.strings.crcLongestDurationLabel;
      dom.find('.lh-crc__longest_duration', tmpl).textContent = _util.Util.i18n.formatMilliseconds(details.longestChain.duration); // Construct visual tree.

      var root = CRCRenderer.initTree(details.chains);

      for (var _i2 = 0, _Object$keys2 = Object.keys(root.tree); _i2 < _Object$keys2.length; _i2++) {
        var key = _Object$keys2[_i2];
        var segment = CRCRenderer.createSegment(root.tree, key, root.startTime, root.transferSize);
        CRCRenderer.buildTree(dom, tmpl, segment, containerEl, details, detailsRenderer);
      }

      return dom.find('.lh-crc-container', tmpl);
    }
  }]);

  return CriticalRequestChainRenderer;
}(); // Alias b/c the name is really long.


exports.CriticalRequestChainRenderer = CriticalRequestChainRenderer;
var CRCRenderer = CriticalRequestChainRenderer;