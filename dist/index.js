'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.injectDeps = injectDeps;
exports.useDeps = useDeps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDisplayName = function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
};

function injectDeps(context, _actions, _services) {
  var actions = {};

  for (var key in _actions) {
    if (_actions.hasOwnProperty(key)) {
      var actionMap = _actions[key];
      var newActionMap = {};
      for (var actionName in actionMap) {
        if (actionMap.hasOwnProperty(actionName)) {
          newActionMap[actionName] = actionMap[actionName].bind(null, context);
        }
      }
      actions[key] = newActionMap;
    }
  }

  var services = {};
  for (var key in _services) {
    if (_services.hasOwnProperty(key)) {
      var serviceMap = _services[key];
      var newServiceMap = {};
      for (var serviceName in serviceMap) {
        if (serviceMap.hasOwnProperty(serviceName)) {
          newServiceMap[serviceName] = serviceMap[serviceName].bind(null, context);
        }
      }
      services[key] = newServiceMap;
    }
  }

  return function (Component) {
    var ComponentWithDeps = _react2.default.createClass({
      displayName: 'ComponentWithDeps',

      childContextTypes: {
        context: _react2.default.PropTypes.object,
        actions: _react2.default.PropTypes.object,
        services: _react2.default.PropTypes.object
      },

      getChildContext: function getChildContext() {
        return {
          context: context,
          actions: actions,
          services: services,
        };
      },
      render: function render() {
        return _react2.default.createElement(Component, this.props);
      }
    });

    ComponentWithDeps.displayName = 'WithDeps(' + getDisplayName(Component) + ')';
    return (0, _hoistNonReactStatics2.default)(ComponentWithDeps, Component);
  };
}

var defaultMapper = function defaultMapper(_context, _actions2, _services2) {
  return {
    context: function context() {
      return _context;
    },
    actions: function actions() {
      return _actions2;
    },
    services: function actions() {
      return _services2;
    }
  };
};

function useDeps() {
  var mapper = arguments.length <= 0 || arguments[0] === undefined ? defaultMapper : arguments[0];

  return function (Component) {
    var ComponentUseDeps = _react2.default.createClass({
      displayName: 'ComponentUseDeps',
      render: function render() {
        var _context2 = this.context;
        var context = _context2.context;
        var actions = _context2.actions;
        var services = _context2.services;

        var mappedProps = mapper(context, actions, services);

        var newProps = (0, _extends3.default)({}, this.props, mappedProps);

        return _react2.default.createElement(Component, newProps);
      },


      contextTypes: {
        context: _react2.default.PropTypes.object,
        actions: _react2.default.PropTypes.object,
        services: _react2.default.PropTypes.object
      }
    });

    ComponentUseDeps.displayName = 'UseDeps(' + getDisplayName(Component) + ')';
    return (0, _hoistNonReactStatics2.default)(ComponentUseDeps, Component);
  };
}
