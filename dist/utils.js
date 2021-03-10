"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.tryData = void 0;
var expo = {
  tryData: function tryData(data, model) {
    try {
      return data[model] || data;
    } catch (err) {
      return data;
    }
  }
};
var tryData = expo.tryData;
exports.tryData = tryData;
var _default = expo;
exports["default"] = _default;