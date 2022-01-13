"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Template = void 0;
exports.default = ReportViewer;

var _react = _interopRequireDefault(require("react"));

var _dom = require("./renderer/dom");

var _reportRenderer = require("./renderer/report-renderer");

var _reportUiFeatures = require("./renderer/report-ui-features");

require("./report-styles.css");

var _templates = _interopRequireDefault(require("./templates"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Template = function Template() {
  return /*#__PURE__*/_react.default.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: _templates.default
    }
  });
};

exports.Template = Template;

function ReportViewer(_ref) {
  var _ref$id = _ref.id,
      id = _ref$id === void 0 ? 'react-lighthouse-viewer' : _ref$id,
      _ref$json = _ref.json,
      json = _ref$json === void 0 ? {} : _ref$json;

  _react.default.useEffect(function () {
    if (Object.keys(json).length === 0) return;

    if (json) {
      generateReport();
    }
  }, [json]);

  var generateReport = function generateReport() {
    var dom = new _dom.DOM(document);
    var renderer = new _reportRenderer.ReportRenderer(dom);
    var container = document.querySelector("#".concat(id));
    renderer.renderReport(json, container); // Hook in JS features and page-level event listeners after the report
    // is in the document.

    var features = new _reportUiFeatures.ReportUIFeatures(dom);
    features.initFeatures(json);
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "lh-root lh-vars"
  }, /*#__PURE__*/_react.default.createElement(Template, null), /*#__PURE__*/_react.default.createElement("div", {
    id: id
  }));
}