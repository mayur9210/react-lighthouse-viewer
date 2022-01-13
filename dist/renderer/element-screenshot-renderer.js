/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/**
 * @fileoverview These functions define {Rect}s and {Size}s using two different coordinate spaces:
 *   1. Screenshot coords (SC suffix): where 0,0 is the top left of the screenshot image
 *   2. Display coords (DC suffix): that match the CSS pixel coordinate space of the LH report's page.
 */

/** @typedef {import('./dom.js').DOM} DOM */

/** @typedef {LH.Audit.Details.Rect} Rect */

/** @typedef {{width: number, height: number}} Size */

/**
 * @typedef InstallOverlayFeatureParams
 * @property {DOM} dom
 * @property {Element} rootEl
 * @property {Element} overlayContainerEl
 * @property {LH.Audit.Details.FullPageScreenshot} fullPageScreenshot
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementScreenshotRenderer = void 0;

var _util = require("./util.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @param {LH.Audit.Details.FullPageScreenshot['screenshot']} screenshot
 * @param {LH.Audit.Details.Rect} rect
 * @return {boolean}
 */
function screenshotOverlapsRect(screenshot, rect) {
  return rect.left <= screenshot.width && 0 <= rect.right && rect.top <= screenshot.height && 0 <= rect.bottom;
}
/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */


function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
/**
 * @param {Rect} rect
 */


function getElementRectCenterPoint(rect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

var ElementScreenshotRenderer = /*#__PURE__*/function () {
  function ElementScreenshotRenderer() {
    _classCallCheck(this, ElementScreenshotRenderer);
  }

  _createClass(ElementScreenshotRenderer, null, [{
    key: "getScreenshotPositions",
    value:
    /**
     * Given the location of an element and the sizes of the preview and screenshot,
     * compute the absolute positions (in screenshot coordinate scale) of the screenshot content
     * and the highlighted rect around the element.
     * @param {Rect} elementRectSC
     * @param {Size} elementPreviewSizeSC
     * @param {Size} screenshotSize
     */
    function getScreenshotPositions(elementRectSC, elementPreviewSizeSC, screenshotSize) {
      var elementRectCenter = getElementRectCenterPoint(elementRectSC); // Try to center clipped region.

      var screenshotLeftVisibleEdge = clamp(elementRectCenter.x - elementPreviewSizeSC.width / 2, 0, screenshotSize.width - elementPreviewSizeSC.width);
      var screenshotTopVisisbleEdge = clamp(elementRectCenter.y - elementPreviewSizeSC.height / 2, 0, screenshotSize.height - elementPreviewSizeSC.height);
      return {
        screenshot: {
          left: screenshotLeftVisibleEdge,
          top: screenshotTopVisisbleEdge
        },
        clip: {
          left: elementRectSC.left - screenshotLeftVisibleEdge,
          top: elementRectSC.top - screenshotTopVisisbleEdge
        }
      };
    }
    /**
     * Render a clipPath SVG element to assist marking the element's rect.
     * The elementRect and previewSize are in screenshot coordinate scale.
     * @param {DOM} dom
     * @param {HTMLElement} maskEl
     * @param {{left: number, top: number}} positionClip
     * @param {Rect} elementRect
     * @param {Size} elementPreviewSize
     */

  }, {
    key: "renderClipPathInScreenshot",
    value: function renderClipPathInScreenshot(dom, maskEl, positionClip, elementRect, elementPreviewSize) {
      var clipPathEl = dom.find('clipPath', maskEl);
      var clipId = "clip-".concat(_util.Util.getUniqueSuffix());
      clipPathEl.id = clipId;
      maskEl.style.clipPath = "url(#".concat(clipId, ")"); // Normalize values between 0-1.

      var top = positionClip.top / elementPreviewSize.height;
      var bottom = top + elementRect.height / elementPreviewSize.height;
      var left = positionClip.left / elementPreviewSize.width;
      var right = left + elementRect.width / elementPreviewSize.width;
      var polygonsPoints = ["0,0             1,0            1,".concat(top, "          0,").concat(top), "0,".concat(bottom, "     1,").concat(bottom, "    1,1               0,1"), "0,".concat(top, "        ").concat(left, ",").concat(top, " ").concat(left, ",").concat(bottom, " 0,").concat(bottom), "".concat(right, ",").concat(top, " 1,").concat(top, "       1,").concat(bottom, "       ").concat(right, ",").concat(bottom)];

      for (var _i = 0, _polygonsPoints = polygonsPoints; _i < _polygonsPoints.length; _i++) {
        var points = _polygonsPoints[_i];
        var pointEl = dom.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        pointEl.setAttribute('points', points);
        clipPathEl.append(pointEl);
      }
    }
    /**
     * Called by report renderer. Defines a css variable used by any element screenshots
     * in the provided report element.
     * Allows for multiple Lighthouse reports to be rendered on the page, each with their
     * own full page screenshot.
     * @param {HTMLElement} el
     * @param {LH.Audit.Details.FullPageScreenshot['screenshot']} screenshot
     */

  }, {
    key: "installFullPageScreenshot",
    value: function installFullPageScreenshot(el, screenshot) {
      el.style.setProperty('--element-screenshot-url', "url('".concat(screenshot.data, "')"));
    }
    /**
     * Installs the lightbox elements and wires up click listeners to all .lh-element-screenshot elements.
     * @param {InstallOverlayFeatureParams} opts
     */

  }, {
    key: "installOverlayFeature",
    value: function installOverlayFeature(opts) {
      var dom = opts.dom,
          rootEl = opts.rootEl,
          overlayContainerEl = opts.overlayContainerEl,
          fullPageScreenshot = opts.fullPageScreenshot;
      var screenshotOverlayClass = 'lh-screenshot-overlay--enabled'; // Don't install the feature more than once.

      if (rootEl.classList.contains(screenshotOverlayClass)) return;
      rootEl.classList.add(screenshotOverlayClass); // Add a single listener to the provided element to handle all clicks within (event delegation).

      rootEl.addEventListener('click', function (e) {
        var target =
        /** @type {?HTMLElement} */
        e.target;
        if (!target) return; // Only activate the overlay for clicks on the screenshot *preview* of an element, not the full-size too.

        var el =
        /** @type {?HTMLElement} */
        target.closest('.lh-node > .lh-element-screenshot');
        if (!el) return;
        var overlay = dom.createElement('div', 'lh-element-screenshot__overlay');
        overlayContainerEl.append(overlay); // The newly-added overlay has the dimensions we need.

        var maxLightboxSize = {
          width: overlay.clientWidth * 0.95,
          height: overlay.clientHeight * 0.80
        };
        var elementRectSC = {
          width: Number(el.dataset['rectWidth']),
          height: Number(el.dataset['rectHeight']),
          left: Number(el.dataset['rectLeft']),
          right: Number(el.dataset['rectLeft']) + Number(el.dataset['rectWidth']),
          top: Number(el.dataset['rectTop']),
          bottom: Number(el.dataset['rectTop']) + Number(el.dataset['rectHeight'])
        };
        var screenshotElement = ElementScreenshotRenderer.render(dom, fullPageScreenshot.screenshot, elementRectSC, maxLightboxSize); // This would be unexpected here.
        // When `screenshotElement` is `null`, there is also no thumbnail element for the user to have clicked to make it this far.

        if (!screenshotElement) {
          overlay.remove();
          return;
        }

        overlay.appendChild(screenshotElement);
        overlay.addEventListener('click', function () {
          return overlay.remove();
        });
      });
    }
    /**
     * Given the size of the element in the screenshot and the total available size of our preview container,
     * compute the factor by which we need to zoom out to view the entire element with context.
     * @param {Rect} elementRectSC
     * @param {Size} renderContainerSizeDC
     * @return {number}
     */

  }, {
    key: "_computeZoomFactor",
    value: function _computeZoomFactor(elementRectSC, renderContainerSizeDC) {
      var targetClipToViewportRatio = 0.75;
      var zoomRatioXY = {
        x: renderContainerSizeDC.width / elementRectSC.width,
        y: renderContainerSizeDC.height / elementRectSC.height
      };
      var zoomFactor = targetClipToViewportRatio * Math.min(zoomRatioXY.x, zoomRatioXY.y);
      return Math.min(1, zoomFactor);
    }
    /**
     * Renders an element with surrounding context from the full page screenshot.
     * Used to render both the thumbnail preview in details tables and the full-page screenshot in the lightbox.
     * Returns null if element rect is outside screenshot bounds.
     * @param {DOM} dom
     * @param {LH.Audit.Details.FullPageScreenshot['screenshot']} screenshot
     * @param {Rect} elementRectSC Region of screenshot to highlight.
     * @param {Size} maxRenderSizeDC e.g. maxThumbnailSize or maxLightboxSize.
     * @return {Element|null}
     */

  }, {
    key: "render",
    value: function render(dom, screenshot, elementRectSC, maxRenderSizeDC) {
      if (!screenshotOverlapsRect(screenshot, elementRectSC)) {
        return null;
      }

      var tmpl = dom.createComponent('elementScreenshot');
      var containerEl = dom.find('div.lh-element-screenshot', tmpl);
      containerEl.dataset['rectWidth'] = elementRectSC.width.toString();
      containerEl.dataset['rectHeight'] = elementRectSC.height.toString();
      containerEl.dataset['rectLeft'] = elementRectSC.left.toString();
      containerEl.dataset['rectTop'] = elementRectSC.top.toString(); // Zoom out when highlighted region takes up most of the viewport.
      // This provides more context for where on the page this element is.

      var zoomFactor = this._computeZoomFactor(elementRectSC, maxRenderSizeDC);

      var elementPreviewSizeSC = {
        width: maxRenderSizeDC.width / zoomFactor,
        height: maxRenderSizeDC.height / zoomFactor
      };
      elementPreviewSizeSC.width = Math.min(screenshot.width, elementPreviewSizeSC.width);
      /* This preview size is either the size of the thumbnail or size of the Lightbox */

      var elementPreviewSizeDC = {
        width: elementPreviewSizeSC.width * zoomFactor,
        height: elementPreviewSizeSC.height * zoomFactor
      };
      var positions = ElementScreenshotRenderer.getScreenshotPositions(elementRectSC, elementPreviewSizeSC, {
        width: screenshot.width,
        height: screenshot.height
      });
      var contentEl = dom.find('div.lh-element-screenshot__content', containerEl);
      contentEl.style.top = "-".concat(elementPreviewSizeDC.height, "px");
      var imageEl = dom.find('div.lh-element-screenshot__image', containerEl);
      imageEl.style.width = elementPreviewSizeDC.width + 'px';
      imageEl.style.height = elementPreviewSizeDC.height + 'px';
      imageEl.style.backgroundPositionY = -(positions.screenshot.top * zoomFactor) + 'px';
      imageEl.style.backgroundPositionX = -(positions.screenshot.left * zoomFactor) + 'px';
      imageEl.style.backgroundSize = "".concat(screenshot.width * zoomFactor, "px ").concat(screenshot.height * zoomFactor, "px");
      var markerEl = dom.find('div.lh-element-screenshot__element-marker', containerEl);
      markerEl.style.width = elementRectSC.width * zoomFactor + 'px';
      markerEl.style.height = elementRectSC.height * zoomFactor + 'px';
      markerEl.style.left = positions.clip.left * zoomFactor + 'px';
      markerEl.style.top = positions.clip.top * zoomFactor + 'px';
      var maskEl = dom.find('div.lh-element-screenshot__mask', containerEl);
      maskEl.style.width = elementPreviewSizeDC.width + 'px';
      maskEl.style.height = elementPreviewSizeDC.height + 'px';
      ElementScreenshotRenderer.renderClipPathInScreenshot(dom, maskEl, positions.clip, elementRectSC, elementPreviewSizeSC);
      return containerEl;
    }
  }]);

  return ElementScreenshotRenderer;
}();

exports.ElementScreenshotRenderer = ElementScreenshotRenderer;