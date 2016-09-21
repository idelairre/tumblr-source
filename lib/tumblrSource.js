(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tumblrSource", [], factory);
	else if(typeof exports === 'object')
		exports["tumblrSource"] = factory();
	else
		root["tumblrSource"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Options = Options;
	exports.Silent = Silent;
	exports.Verbose = Verbose;
	exports.DecorateFn = DecorateFn;
	var decoratedFuncs = ['fetch', 'load', 'save'];
	
	function decorateFn(name, fn) {
	  return function (target) {
	    target.prototype[name] = function () {
	      return fn.apply(target.prototype, arguments);
	    };
	    return target;
	  };
	}
	
	function Options(options) {
	  return function (target) {
	    Object.assign(target.prototype, {
	      options: options
	    });
	    return target;
	  };
	}
	
	function Silent() {
	  var val = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	  return function (target) {
	    Object.assign(target.prototype, {
	      silent: val
	    });
	    return target;
	  };
	}
	
	function Verbose() {
	  var val = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	  return function (target) {
	    Object.assign(target.prototype, {
	      silent: !val
	    });
	    return target;
	  };
	}
	
	function DecorateFn(klass, name, fn) {
	  name = decoratedFuncs.includes(name) ? '_' + name : name;
	  klass.prototype[name] = function () {
	    return fn.apply(klass.prototype, arguments);
	  };
	}
	
	var Condition = exports.Condition = decorateFn.bind(undefined, 'condition');
	
	var Fetch = exports.Fetch = decorateFn.bind(undefined, '_fetch');
	
	var Step = exports.Step = decorateFn.bind(undefined, 'step');
	
	var Load = exports.Load = decorateFn.bind(undefined, '_load');
	
	var Save = exports.Save = decorateFn.bind(undefined, '_save');
	
	var Parse = exports.Parse = decorateFn.bind(undefined, 'parse');

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tumblrSource.js.map