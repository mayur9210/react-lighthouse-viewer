/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/** @typedef {import('./details-renderer').DetailsRenderer} DetailsRenderer */

/** @typedef {import('./dom').DOM} DOM */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnippetRenderer = void 0;

var _util = require("./util.js");

var _classNamesByContentT;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @enum {number} */
var LineVisibility = {
  /** Show regardless of whether the snippet is collapsed or expanded */
  ALWAYS: 0,
  WHEN_COLLAPSED: 1,
  WHEN_EXPANDED: 2
};
/** @enum {number} */

var LineContentType = {
  /** A line of content */
  CONTENT_NORMAL: 0,

  /** A line of content that's emphasized by setting the CSS background color */
  CONTENT_HIGHLIGHTED: 1,

  /** Use when some lines are hidden, shows the "..." placeholder */
  PLACEHOLDER: 2,

  /** A message about a line of content or the snippet in general */
  MESSAGE: 3
};
/** @typedef {{
    content: string;
    lineNumber: string | number;
    contentType: LineContentType;
    truncated?: boolean;
    visibility?: LineVisibility;
}} LineDetails */

var classNamesByContentType = (_classNamesByContentT = {}, _defineProperty(_classNamesByContentT, LineContentType.CONTENT_NORMAL, ['lh-snippet__line--content']), _defineProperty(_classNamesByContentT, LineContentType.CONTENT_HIGHLIGHTED, ['lh-snippet__line--content', 'lh-snippet__line--content-highlighted']), _defineProperty(_classNamesByContentT, LineContentType.PLACEHOLDER, ['lh-snippet__line--placeholder']), _defineProperty(_classNamesByContentT, LineContentType.MESSAGE, ['lh-snippet__line--message']), _classNamesByContentT);
/**
 * @param {LH.Audit.Details.SnippetValue['lines']} lines
 * @param {number} lineNumber
 * @return {{line?: LH.Audit.Details.SnippetValue['lines'][0], previousLine?: LH.Audit.Details.SnippetValue['lines'][0]}}
 */

function getLineAndPreviousLine(lines, lineNumber) {
  return {
    line: lines.find(function (l) {
      return l.lineNumber === lineNumber;
    }),
    previousLine: lines.find(function (l) {
      return l.lineNumber === lineNumber - 1;
    })
  };
}
/**
 * @param {LH.Audit.Details.SnippetValue["lineMessages"]} messages
 * @param {number} lineNumber
 */


function getMessagesForLineNumber(messages, lineNumber) {
  return messages.filter(function (h) {
    return h.lineNumber === lineNumber;
  });
}
/**
 * @param {LH.Audit.Details.SnippetValue} details
 * @return {LH.Audit.Details.SnippetValue['lines']}
 */


function getLinesWhenCollapsed(details) {
  var SURROUNDING_LINES_TO_SHOW_WHEN_COLLAPSED = 2;
  return _util.Util.filterRelevantLines(details.lines, details.lineMessages, SURROUNDING_LINES_TO_SHOW_WHEN_COLLAPSED);
}
/**
 * Render snippet of text with line numbers and annotations.
 * By default we only show a few lines around each annotation and the user
 * can click "Expand snippet" to show more.
 * Content lines with annotations are highlighted.
 */


var SnippetRenderer = /*#__PURE__*/function () {
  function SnippetRenderer() {
    _classCallCheck(this, SnippetRenderer);
  }

  _createClass(SnippetRenderer, null, [{
    key: "renderHeader",
    value:
    /**
     * @param {DOM} dom
     * @param {LH.Audit.Details.SnippetValue} details
     * @param {DetailsRenderer} detailsRenderer
     * @param {function} toggleExpandedFn
     * @return {DocumentFragment}
     */
    function renderHeader(dom, details, detailsRenderer, toggleExpandedFn) {
      var linesWhenCollapsed = getLinesWhenCollapsed(details);
      var canExpand = linesWhenCollapsed.length < details.lines.length;
      var header = dom.createComponent('snippetHeader');
      dom.find('.lh-snippet__title', header).textContent = details.title;
      var _Util$i18n$strings = _util.Util.i18n.strings,
          snippetCollapseButtonLabel = _Util$i18n$strings.snippetCollapseButtonLabel,
          snippetExpandButtonLabel = _Util$i18n$strings.snippetExpandButtonLabel;
      dom.find('.lh-snippet__btn-label-collapse', header).textContent = snippetCollapseButtonLabel;
      dom.find('.lh-snippet__btn-label-expand', header).textContent = snippetExpandButtonLabel;
      var toggleExpandButton = dom.find('.lh-snippet__toggle-expand', header); // If we're already showing all the available lines of the snippet, we don't need an
      // expand/collapse button and can remove it from the DOM.
      // If we leave the button in though, wire up the click listener to toggle visibility!

      if (!canExpand) {
        toggleExpandButton.remove();
      } else {
        toggleExpandButton.addEventListener('click', function () {
          return toggleExpandedFn();
        });
      } // We only show the source node of the snippet in DevTools because then the user can
      // access the full element detail. Just being able to see the outer HTML isn't very useful.


      if (details.node && dom.isDevTools()) {
        var nodeContainer = dom.find('.lh-snippet__node', header);
        nodeContainer.appendChild(detailsRenderer.renderNode(details.node));
      }

      return header;
    }
    /**
     * Renders a line (text content, message, or placeholder) as a DOM element.
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LineDetails} lineDetails
     * @return {Element}
     */

  }, {
    key: "renderSnippetLine",
    value: function renderSnippetLine(dom, tmpl, _ref) {
      var content = _ref.content,
          lineNumber = _ref.lineNumber,
          truncated = _ref.truncated,
          contentType = _ref.contentType,
          visibility = _ref.visibility;
      var clonedTemplate = dom.createComponent('snippetLine');
      var contentLine = dom.find('.lh-snippet__line', clonedTemplate);
      var classList = contentLine.classList;
      classNamesByContentType[contentType].forEach(function (typeClass) {
        return classList.add(typeClass);
      });

      if (visibility === LineVisibility.WHEN_COLLAPSED) {
        classList.add('lh-snippet__show-if-collapsed');
      } else if (visibility === LineVisibility.WHEN_EXPANDED) {
        classList.add('lh-snippet__show-if-expanded');
      }

      var lineContent = content + (truncated ? '…' : '');
      var lineContentEl = dom.find('.lh-snippet__line code', contentLine);

      if (contentType === LineContentType.MESSAGE) {
        lineContentEl.appendChild(dom.convertMarkdownLinkSnippets(lineContent));
      } else {
        lineContentEl.textContent = lineContent;
      }

      dom.find('.lh-snippet__line-number', contentLine).textContent = lineNumber.toString();
      return contentLine;
    }
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {{message: string}} message
     * @return {Element}
     */

  }, {
    key: "renderMessage",
    value: function renderMessage(dom, tmpl, message) {
      return SnippetRenderer.renderSnippetLine(dom, tmpl, {
        lineNumber: ' ',
        content: message.message,
        contentType: LineContentType.MESSAGE
      });
    }
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LineVisibility} visibility
     * @return {Element}
     */

  }, {
    key: "renderOmittedLinesPlaceholder",
    value: function renderOmittedLinesPlaceholder(dom, tmpl, visibility) {
      return SnippetRenderer.renderSnippetLine(dom, tmpl, {
        lineNumber: '…',
        content: '',
        visibility: visibility,
        contentType: LineContentType.PLACEHOLDER
      });
    }
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LH.Audit.Details.SnippetValue} details
     * @return {DocumentFragment}
     */

  }, {
    key: "renderSnippetContent",
    value: function renderSnippetContent(dom, tmpl, details) {
      var template = dom.createComponent('snippetContent');
      var snippetEl = dom.find('.lh-snippet__snippet-inner', template); // First render messages that don't belong to specific lines

      details.generalMessages.forEach(function (m) {
        return snippetEl.append(SnippetRenderer.renderMessage(dom, tmpl, m));
      }); // Then render the lines and their messages, as well as placeholders where lines are omitted

      snippetEl.append(SnippetRenderer.renderSnippetLines(dom, tmpl, details));
      return template;
    }
    /**
     * @param {DOM} dom
     * @param {DocumentFragment} tmpl
     * @param {LH.Audit.Details.SnippetValue} details
     * @return {DocumentFragment}
     */

  }, {
    key: "renderSnippetLines",
    value: function renderSnippetLines(dom, tmpl, details) {
      var lineMessages = details.lineMessages,
          generalMessages = details.generalMessages,
          lineCount = details.lineCount,
          lines = details.lines;
      var linesWhenCollapsed = getLinesWhenCollapsed(details);
      var hasOnlyGeneralMessages = generalMessages.length > 0 && lineMessages.length === 0;
      var lineContainer = dom.createFragment(); // When a line is not shown in the collapsed state we try to see if we also need an
      // omitted lines placeholder for the expanded state, rather than rendering two separate
      // placeholders.

      var hasPendingOmittedLinesPlaceholderForCollapsedState = false;

      var _loop = function _loop(lineNumber) {
        var _getLineAndPreviousLi = getLineAndPreviousLine(lines, lineNumber),
            line = _getLineAndPreviousLi.line,
            previousLine = _getLineAndPreviousLi.previousLine;

        var _getLineAndPreviousLi2 = getLineAndPreviousLine(linesWhenCollapsed, lineNumber),
            lineWhenCollapsed = _getLineAndPreviousLi2.line,
            previousLineWhenCollapsed = _getLineAndPreviousLi2.previousLine;

        var showLineWhenCollapsed = !!lineWhenCollapsed;
        var showPreviousLineWhenCollapsed = !!previousLineWhenCollapsed; // If we went from showing lines in the collapsed state to not showing them
        // we need to render a placeholder

        if (showPreviousLineWhenCollapsed && !showLineWhenCollapsed) {
          hasPendingOmittedLinesPlaceholderForCollapsedState = true;
        } // If we are back to lines being visible in the collapsed and the placeholder
        // hasn't been rendered yet then render it now


        if (showLineWhenCollapsed && hasPendingOmittedLinesPlaceholderForCollapsedState) {
          lineContainer.append(SnippetRenderer.renderOmittedLinesPlaceholder(dom, tmpl, LineVisibility.WHEN_COLLAPSED));
          hasPendingOmittedLinesPlaceholderForCollapsedState = false;
        } // Render omitted lines placeholder if we have not already rendered one for this gap


        var isFirstOmittedLineWhenExpanded = !line && !!previousLine;
        var isFirstLineOverallAndIsOmittedWhenExpanded = !line && lineNumber === 1;

        if (isFirstOmittedLineWhenExpanded || isFirstLineOverallAndIsOmittedWhenExpanded) {
          // In the collapsed state we don't show omitted lines placeholders around
          // the edges of the snippet
          var hasRenderedAllLinesVisibleWhenCollapsed = !linesWhenCollapsed.some(function (l) {
            return l.lineNumber > lineNumber;
          });
          var onlyShowWhenExpanded = hasRenderedAllLinesVisibleWhenCollapsed || lineNumber === 1;
          lineContainer.append(SnippetRenderer.renderOmittedLinesPlaceholder(dom, tmpl, onlyShowWhenExpanded ? LineVisibility.WHEN_EXPANDED : LineVisibility.ALWAYS));
          hasPendingOmittedLinesPlaceholderForCollapsedState = false;
        }

        if (!line) {
          // Can't render the line if we don't know its content (instead we've rendered a placeholder)
          return "continue";
        } // Now render the line and any messages


        var messages = getMessagesForLineNumber(lineMessages, lineNumber);
        var highlightLine = messages.length > 0 || hasOnlyGeneralMessages;
        var contentLineDetails = Object.assign({}, line, {
          contentType: highlightLine ? LineContentType.CONTENT_HIGHLIGHTED : LineContentType.CONTENT_NORMAL,
          visibility: lineWhenCollapsed ? LineVisibility.ALWAYS : LineVisibility.WHEN_EXPANDED
        });
        lineContainer.append(SnippetRenderer.renderSnippetLine(dom, tmpl, contentLineDetails));
        messages.forEach(function (message) {
          lineContainer.append(SnippetRenderer.renderMessage(dom, tmpl, message));
        });
      };

      for (var lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        var _ret = _loop(lineNumber);

        if (_ret === "continue") continue;
      }

      return lineContainer;
    }
    /**
     * @param {DOM} dom
     * @param {LH.Audit.Details.SnippetValue} details
     * @param {DetailsRenderer} detailsRenderer
     * @return {!Element}
     */

  }, {
    key: "render",
    value: function render(dom, details, detailsRenderer) {
      var tmpl = dom.createComponent('snippet');
      var snippetEl = dom.find('.lh-snippet', tmpl);
      var header = SnippetRenderer.renderHeader(dom, details, detailsRenderer, function () {
        return snippetEl.classList.toggle('lh-snippet--expanded');
      });
      var content = SnippetRenderer.renderSnippetContent(dom, tmpl, details);
      snippetEl.append(header, content);
      return snippetEl;
    }
  }]);

  return SnippetRenderer;
}();

exports.SnippetRenderer = SnippetRenderer;