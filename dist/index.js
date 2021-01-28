"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.$delete = exports.$put = exports.$post = exports.$get = exports.remove = exports.put = exports.post = exports.get = exports.$fetch = exports.fetch = exports.create = void 0;

var _react = _interopRequireDefault(require("react"));

var _swr = _interopRequireDefault(require("swr"));

var _axios = _interopRequireDefault(require("axios"));

var _dispatch2 = _interopRequireDefault(require("./dispatch"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var expo = {
  create: function create(_ref) {
    var axios = _ref.axios,
        swr = _ref.swr,
        other = _objectWithoutProperties(_ref, ["axios", "swr"]);

    return Object.keys(expo).reduce(function (obj, e) {
      if (typeof expo[e] == 'function') {
        obj[e] = expo[e].bind(_objectSpread({
          axios: axios,
          swr: swr
        }, other));
      }

      return obj;
    }, {});
  },
  fetch: function fetch() {
    var _this$onStart,
        _this = this;

    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var url = arguments.length > 1 ? arguments[1] : undefined;
    var model = arguments.length > 2 ? arguments[2] : undefined;
    var body = arguments.length > 3 ? arguments[3] : undefined;
    var key = arguments.length > 4 ? arguments[4] : undefined;
    var config = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    this === null || this === void 0 ? void 0 : (_this$onStart = this.onStart) === null || _this$onStart === void 0 ? void 0 : _this$onStart.call(this, {
      method: method,
      url: url,
      model: model,
      body: body,
      key: key,
      config: config
    });
    return new Promise(function (resolve, reject) {
      var _this$axios;

      (0, _axios["default"])(_objectSpread(_objectSpread(_objectSpread({
        url: url,
        method: method,
        data: body
      }, _this === null || _this === void 0 ? void 0 : _this.axios), config === null || config === void 0 ? void 0 : config.axios), {}, {
        params: _objectSpread(_objectSpread({}, _this === null || _this === void 0 ? void 0 : (_this$axios = _this.axios) === null || _this$axios === void 0 ? void 0 : _this$axios.params), config === null || config === void 0 ? void 0 : config.params)
      })).then(function (result) {
        var _this$onSuccess;

        var _dispatch = {};

        if (model && _this !== null && _this !== void 0 && _this.store) {
          var _models = (model || '').split(',').map(function (e) {
            return e.trim();
          });

          var _key = (key || '').split(',').map(function (e) {
            return e.trim();
          });

          _dispatch = _models.reduce(function (obj, e, i) {
            var _method = (e || '').split('-')[0];
            var model = (e || '').split('-')[1];

            if (!model) {
              model = _method;
              _method = method;
            }

            obj[model] = (0, _dispatch2["default"])({
              method: _method,
              key: _key[i],
              model: model,
              data: (0, _utils.tryData)(result.data, model),
              store: _this === null || _this === void 0 ? void 0 : _this.store
            });
            return obj;
          }, {});
        }

        _this === null || _this === void 0 ? void 0 : (_this$onSuccess = _this.onSuccess) === null || _this$onSuccess === void 0 ? void 0 : _this$onSuccess.call(_this, _objectSpread(_objectSpread({}, result), {}, {
          model: model,
          key: key,
          dispatch: _dispatch
        }));
        resolve(_objectSpread(_objectSpread({}, result), {}, {
          model: model,
          key: key,
          dispatch: _dispatch
        }));
      })["catch"](function (error) {
        var _this$onError;

        _this === null || _this === void 0 ? void 0 : (_this$onError = _this.onError) === null || _this$onError === void 0 ? void 0 : _this$onError.call(_this, error);
        reject(error);
      });
    });
  },
  $fetch: function $fetch() {
    var _this2 = this,
        _this$$onSuccess;

    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var target = arguments.length > 1 ? arguments[1] : undefined;
    var model = arguments.length > 2 ? arguments[2] : undefined;
    var body = arguments.length > 3 ? arguments[3] : undefined;
    var key = arguments.length > 4 ? arguments[4] : undefined;
    var config = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

    var _useSWR = (0, _swr["default"])([target, this === null || this === void 0 ? void 0 : this.token], function (url) {
      return expo.fetch.call(_this2, method, url, model, body, key, config);
    }, _objectSpread(_objectSpread({}, this === null || this === void 0 ? void 0 : this.swr), config === null || config === void 0 ? void 0 : config.swr)),
        data = _useSWR.data,
        error = _useSWR.error,
        isValidating = _useSWR.isValidating,
        mutate = _useSWR.mutate;

    this === null || this === void 0 ? void 0 : (_this$$onSuccess = this.$onSuccess) === null || _this$$onSuccess === void 0 ? void 0 : _this$$onSuccess.call(this, data);
    return {
      data: data,
      error: error,
      isValidating: isValidating,
      mutate: mutate
    };
  },
  get: function get(target, model) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return expo.fetch.call(this, 'get', target, model, null, null, config);
  },
  post: function post(target, model, body) {
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return expo.fetch.call(this, 'post', target, model, body, null, config);
  },
  put: function put(target, model, body, key) {
    var config = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return expo.fetch.call(this, 'put', target, model, body, key, config);
  },
  remove: function remove(target, model, key) {
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return expo.fetch.call(this, 'delete', target, model, null, key, config);
  },
  $get: function $get(target, model) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return expo.$fetch.call(this, 'get', target, model, null, null, config);
  },
  $post: function $post(target, model, body) {
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return expo.$fetch.call(this, 'post', target, model, body, null, config);
  },
  $put: function $put(target, model, body, key) {
    var config = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return expo.$fetch.call(this, 'put', target, model, body, key, config);
  },
  $delete: function $delete(target, model, key) {
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return expo.$fetch.call(this, 'delete', target, model, null, key, config);
  }
};
var create = expo.create;
exports.create = create;
var fetch = expo.fetch;
exports.fetch = fetch;
var $fetch = expo.$fetch;
exports.$fetch = $fetch;
var get = expo.get;
exports.get = get;
var post = expo.post;
exports.post = post;
var put = expo.put;
exports.put = put;
var remove = expo.remove;
exports.remove = remove;
var $get = expo.$get;
exports.$get = $get;
var $post = expo.$post;
exports.$post = $post;
var $put = expo.$put;
exports.$put = $put;
var $delete = expo.$delete;
exports.$delete = $delete;
var _default = expo;
exports["default"] = _default;