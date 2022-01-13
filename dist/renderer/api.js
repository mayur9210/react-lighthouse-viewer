/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertMarkdownCodeSnippets = convertMarkdownCodeSnippets;
exports.createStylesElement = createStylesElement;
exports.renderCategoryScore = renderCategoryScore;
exports.renderReport = renderReport;
exports.saveFile = saveFile;

var _dom = require("../renderer/dom.js");

var _reportRenderer = require("../renderer/report-renderer.js");

var _reportUiFeatures = require("../renderer/report-ui-features.js");

var _categoryRenderer = require("./category-renderer.js");

var _detailsRenderer = require("./details-renderer.js");

/**
 * @param {LH.Result} lhr
 * @param {LH.Renderer.Options} opts
 * @return {HTMLElement}
 */
function renderReport(lhr) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var rootEl = document.createElement('article');
  rootEl.classList.add('lh-root', 'lh-vars');
  var dom = new _dom.DOM(rootEl.ownerDocument, rootEl);
  var renderer = new _reportRenderer.ReportRenderer(dom);
  renderer.renderReport(lhr, rootEl, opts); // Hook in JS features and page-level event listeners after the report
  // is in the document.

  var features = new _reportUiFeatures.ReportUIFeatures(dom, opts);
  features.initFeatures(lhr);
  return rootEl;
}
/**
 * @param {LH.ReportResult.Category} category
 * @param {Parameters<CategoryRenderer['renderCategoryScore']>[2]=} options
 * @return {DocumentFragment}
 */


function renderCategoryScore(category, options) {
  var dom = new _dom.DOM(document, document.documentElement);
  var detailsRenderer = new _detailsRenderer.DetailsRenderer(dom);
  var categoryRenderer = new _categoryRenderer.CategoryRenderer(dom, detailsRenderer);
  return categoryRenderer.renderCategoryScore(category, {}, options);
}
/**
 * @param {Blob} blob
 * @param {string} filename
 */


function saveFile(blob, filename) {
  var dom = new _dom.DOM(document, document.documentElement);
  dom.saveFile(blob, filename);
}
/**
 * @param {string} markdownText
 * @return {Element}
 */


function convertMarkdownCodeSnippets(markdownText) {
  var dom = new _dom.DOM(document, document.documentElement);
  return dom.convertMarkdownCodeSnippets(markdownText);
}
/**
 * @return {DocumentFragment}
 */


function createStylesElement() {
  var dom = new _dom.DOM(document, document.documentElement);
  return dom.createComponent('styles');
}