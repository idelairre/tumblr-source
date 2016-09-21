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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _class, _temp;
	
	var _decorators = __webpack_require__(1);
	
	Object.keys(_decorators).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _decorators[key];
	    }
	  });
	});
	
	var _eventemitter = __webpack_require__(2);
	
	var _eventemitter2 = _interopRequireDefault(_eventemitter);
	
	var _lodash = __webpack_require__(3);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DEBUG = false;
	
	var debug = {};
	
	Object.keys(console).forEach(function (key) {
	  if (typeof console[key] === 'function') {
	    debug[key] = function () {
	      if (DEBUG) {
	        var args = Array.from(arguments);
	        args.unshift('[TUMBLR SOURCE]');
	        return console[key].apply(console, args);
	      }
	    };
	  }
	});
	
	var Source = (_temp = _class = function (_EventEmitter) {
	  _inherits(Source, _EventEmitter);
	
	  function Source(args) {
	    _classCallCheck(this, Source);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Source).call(this));
	
	    _this.initialized = false;
	    _this.stopFlag = false;
	    _this.sync = false;
	    _this.retryTimes = 3;
	    _this.retriedTimes = 0;
	    _this.lastError = null;
	    _this.STOP_FLAG_MESSAGE = 'Stop flag detected.';
	    _this.TIMEOUT_MESSAGE = 'Connection timed out.';
	    _this.STOP_CONDITION_MESSAGE = 'Stop condition reached.';
	    _this.UNDEFINED_RESPONSE_MESSAGE = 'Response is undefined.';
	    _this.EMPTY_RESPONSE_MESSAGE = 'Response was empty.';
	    _this.MAX_RETRIES_MESSAGE = 'Max retries reached, either there is a connection error or you have reached the maximum items you can fetch.';
	    _this.MAX_ITEMS_MESSAGE = 'Maximum fetchable items reached.';
	
	    if (typeof args !== 'undefined' && typeof args.options !== 'undefined') {
	      _this.options = args.options;
	      if (typeof args.options.silent !== 'undefined') {
	        _this.silent = args.options.silent;
	      }
	      if (typeof args.options.verbose !== 'undefined') {
	        _this.silent = !args.options.verbose;
	      }
	      Object.assign(_this, (0, _lodash2.default)(args, ['condition', 'parse', 'step', 'sync']));
	      _this._fetch = typeof args.fetch === 'function' ? args.fetch : false;
	      _this._save = typeof args.save === 'function' ? args.save : false;
	      _this._load = typeof args.load === 'function' ? args.load : false;
	    }
	
	    _this.debug = debug;
	
	    _this.initialize();
	
	    _this.on('continue', _this.run.bind(_this));
	    _this.on('done', function () {
	      _this.stopFlag = false;
	    });
	    return _this;
	  }
	
	  _createClass(Source, [{
	    key: 'initialize',
	    value: function initialize() {
	      var _this2 = this;
	
	      var init = function init() {
	        _this2.debug.log('done initializing.');
	        _this2.emit('initialized');
	        _this2.initialized = true;
	      };
	      if (this.options) {
	        this.defaults = Object.assign({}, this.options);
	      }
	      if (typeof this.condition === 'undefined') {
	        this.debug.warn('no condition set for ' + this.options.item + ', using default condition');
	        this.condition = function () {
	          return true;
	        };
	      }
	      if (typeof this.parse === 'undefined') {
	        this.debug.warn('no parse function defined, using default parse function');
	        this.parse = function (data) {
	          _this2.debug.log(_this2.options);
	          return data[_this2.options.item];
	        };
	      }
	      if (typeof this.step === 'undefined') {
	        this.debug.warn('no step set for ' + this.options.item + ', using default step function');
	        this.step = function () {
	          return _this2.options.offset += _this2.options.limit;
	        };
	      }
	      if (typeof this._load !== 'undefined') {
	        this.debug.log('load function detected, restoring state...');
	        this.once('loaded', init);
	        this.load();
	      } else {
	        init();
	      }
	    }
	  }, {
	    key: 'load',
	    value: function load() {
	      var opts = typeof this._load === 'function' ? this._load() : undefined;
	      if (typeof opts !== 'undefined') {
	        this.options = {};
	        for (var key in opts) {
	          if ({}.hasOwnProperty.call(opts, key) && opts[key]) {
	            this.options[key] = opts[key];
	          }
	        }
	      }
	      this.loadedSaveState = true;
	      this.emit('loaded');
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      return this._save(this.options);
	    }
	  }, {
	    key: 'start',
	    value: function start(options) {
	      this.debug.log('starting ...');
	      this.stopFlag = false;
	      if (options) {
	        Object.assign(this.options, options);
	        if (options.retryTimes) {
	          this.retryTimes = options.retryTimes;
	        }
	        if (options.sync) {
	          this.sync = options.sync; // sets flag to run without calling "next()"
	        }
	      }
	      if (this.initialized) {
	        return this.run();
	      }
	      this.once('loaded', this.run.bind(this));
	    }
	  }, {
	    key: 'fetch',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	        var args = arguments.length <= 0 || arguments[0] === undefined ? { offset: this.options[this.options.iterator], limit: this.options.limit } : arguments[0];
	        var response;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                _context.next = 3;
	                return this._fetch.call(this, args);
	
	              case 3:
	                response = _context.sent;
	                return _context.abrupt('return', this.handleSuccess(response));
	
	              case 7:
	                _context.prev = 7;
	                _context.t0 = _context['catch'](0);
	                return _context.abrupt('return', this.handleError(_context.t0));
	
	              case 10:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this, [[0, 7]]);
	      }));
	
	      function fetch(_x) {
	        return _ref.apply(this, arguments);
	      }
	
	      return fetch;
	    }()
	  }, {
	    key: 'handleSuccess',
	    value: function handleSuccess(data) {
	      if (typeof this.parse === 'function') {
	        return this.parse(data);
	      }
	      return data;
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      return this.run();
	    }
	  }, {
	    key: 'crawl',
	    value: function () {
	      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(opts, retry) {
	        var _this3 = this;
	
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                return _context3.abrupt('return', new Promise(function () {
	                  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(resolve, reject) {
	                    var items;
	                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                      while (1) {
	                        switch (_context2.prev = _context2.next) {
	                          case 0:
	                            _context2.prev = 0;
	
	                            if (retry && _this3.retriedTimes && _this3.retriedTimes <= _this3.retryTimes) {
	                              _this3.debug.log('Retrying... Retried times: ' + _this3.retriedTimes + ', retrying from ' + opts.iterator + ': ' + _this3.options[opts.iterator] + '...');
	                            }
	                            _context2.next = 4;
	                            return _this3.fetch();
	
	                          case 4:
	                            items = _context2.sent;
	
	                            if (typeof items === 'string') {
	                              _this3.debug.log('✔ Crawled ' + _this3.options.item + ' from ' + opts.iterator + ': ' + _this3.options[opts.iterator]);
	                            } else if (Array.isArray(items)) {
	                              _this3.debug.log('✔ Crawled ' + items.length + ' ' + _this3.options.item + ' from ' + opts.iterator + ': ' + _this3.options[opts.iterator]);
	                            }
	                            resolve(items);
	                            _context2.next = 12;
	                            break;
	
	                          case 9:
	                            _context2.prev = 9;
	                            _context2.t0 = _context2['catch'](0);
	
	                            reject(_context2.t0);
	
	                          case 12:
	                          case 'end':
	                            return _context2.stop();
	                        }
	                      }
	                    }, _callee2, _this3, [[0, 9]]);
	                  }));
	
	                  return function (_x5, _x6) {
	                    return _ref3.apply(this, arguments);
	                  };
	                }()));
	
	              case 1:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));
	
	      function crawl(_x3, _x4) {
	        return _ref2.apply(this, arguments);
	      }
	
	      return crawl;
	    }()
	  }, {
	    key: 'run',
	    value: function () {
	      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(retry) {
	        var items;
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                _context4.prev = 0;
	
	                if (!this.stopFlag) {
	                  _context4.next = 3;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.done(this.STOP_FLAG_MESSAGE));
	
	              case 3:
	                if (this.condition()) {
	                  _context4.next = 5;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.done(this.STOP_CONDITION_MESSAGE));
	
	              case 5:
	                this.debug.log('crawling...');
	                _context4.next = 8;
	                return this.crawl({
	                  iterator: this.options.iterator,
	                  item: this.options.item
	                }, retry);
	
	              case 8:
	                items = _context4.sent;
	
	                this.retriedTimes = 0;
	                if (typeof this.step === 'function') {
	                  this.step();
	                }
	                this.emit('items', items);
	
	                if (!(typeof items === 'undefined')) {
	                  _context4.next = 16;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.done(this.UNDEFINED_RESPONSE_MESSAGE));
	
	              case 16:
	                if (!(Array.isArray(items) && items.length === 0)) {
	                  _context4.next = 20;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.done(this.MAX_ITEMS_MESSAGE));
	
	              case 20:
	                if (!(Object.keys(items).length === 0 && obj.constructor === Object)) {
	                  _context4.next = 22;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.done(this.EMPTY_RESPONSE_MESSAGE));
	
	              case 22:
	                _context4.next = 29;
	                break;
	
	              case 24:
	                _context4.prev = 24;
	                _context4.t0 = _context4['catch'](0);
	
	                if (!(this.retriedTimes < this.retryTimes)) {
	                  _context4.next = 28;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.handleError(_context4.t0));
	
	              case 28:
	                return _context4.abrupt('return', this.done(this.MAX_RETRIES_MESSAGE));
	
	              case 29:
	                if (!(this.sync && !this.stopFlag)) {
	                  _context4.next = 33;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.run(retry));
	
	              case 33:
	                if (!this.stopFlag) {
	                  _context4.next = 35;
	                  break;
	                }
	
	                return _context4.abrupt('return', this.done(this.STOP_FLAG_MESSAGE));
	
	              case 35:
	                this.emit('next'); // flags when the next run should be called for tests
	
	              case 36:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, this, [[0, 24]]);
	      }));
	
	      function run(_x7) {
	        return _ref4.apply(this, arguments);
	      }
	
	      return run;
	    }()
	  }, {
	    key: 'stop',
	    value: function stop() {
	      this.emit('stop');
	      this.stopFlag = true;
	    }
	  }, {
	    key: 'done',
	    value: function done(message) {
	      this.emit('done', message);
	      this.removeListeners();
	    }
	  }, {
	    key: 'handleError',
	    value: function handleError(error) {
	      var _this4 = this;
	
	      this.debug.error(error);
	      this.emit('error', error);
	      this.lastError = error;
	
	      if (error.toString().includes('malformed API response')) {
	        return this.stop();
	      }
	
	      if (this.retryTimes - this.retriedTimes === 0) {
	        return this.stop();
	      }
	
	      this.debug.log('Retry in 3s... will retry ' + (this.retryTimes - this.retriedTimes) + ' more time(s)');
	
	      setTimeout(function () {
	        _this4.retriedTimes += 1;
	        return _this4.run(true);
	      }, 6000);
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      return this.initialize();
	    }
	  }, {
	    key: 'removeListeners',
	    value: function removeListeners() {
	      this.removeAllListeners();
	    }
	  }, {
	    key: 'silent',
	    set: function set(newVal) {
	      DEBUG = !newVal;
	    },
	    get: function get() {
	      return DEBUG;
	    }
	  }]);
	
	  return Source;
	}(_eventemitter2.default), _class.options = {
	  blog: null,
	  offset: null,
	  limit: null,
	  page: null,
	  iterator: null,
	  item: 'items',
	  url: null,
	  until: null
	}, _temp);
	exports.default = Source;

/***/ },
/* 1 */
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var has = Object.prototype.hasOwnProperty;
	
	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} [once=false] Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }
	
	/**
	 * Hold the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var events = this._events
	    , names = []
	    , name;
	
	  if (!events) return names;
	
	  for (name in events) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }
	
	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }
	
	  return names;
	};
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events && this._events[evt];
	
	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];
	
	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return false;
	
	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	
	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	
	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return this;
	
	  var listeners = this._events[evt]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn) {
	      if (
	           listeners.fn !== fn
	        || (once && !listeners.once)
	        || (context && listeners.context !== context)
	      ) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (
	             listeners[i].fn !== fn
	          || (once && !listeners[i].once)
	          || (context && listeners[i].context !== context)
	        ) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[prefix ? prefix + event : event];
	  else this._events = prefix ? {} : Object.create(null);
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;
	
	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_SAFE_INTEGER = 9007199254740991;
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    symbolTag = '[object Symbol]';
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array ? array.length : 0,
	      result = Array(length);
	
	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}
	
	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;
	
	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var Symbol = root.Symbol,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;
	
	  predicate || (predicate = isFlattenable);
	  result || (result = []);
	
	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}
	
	/**
	 * The base implementation of `_.pick` without support for individual
	 * property identifiers.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} props The property identifiers to pick.
	 * @returns {Object} Returns the new object.
	 */
	function basePick(object, props) {
	  object = Object(object);
	  return basePickBy(object, props, function(value, key) {
	    return key in object;
	  });
	}
	
	/**
	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} props The property identifiers to pick from.
	 * @param {Function} predicate The function invoked per property.
	 * @returns {Object} Returns the new object.
	 */
	function basePickBy(object, props, predicate) {
	  var index = -1,
	      length = props.length,
	      result = {};
	
	  while (++index < length) {
	    var key = props[index],
	        value = object[key];
	
	    if (predicate(value, key)) {
	      result[key] = value;
	    }
	  }
	  return result;
	}
	
	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = array;
	    return apply(func, this, otherArgs);
	  };
	}
	
	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}
	
	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}
	
	/**
	 * Creates an object composed of the picked `object` properties.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {...(string|string[])} [props] The property identifiers to pick.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pick(object, ['a', 'c']);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var pick = baseRest(function(object, props) {
	  return object == null ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
	});
	
	module.exports = pick;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tumblrSource.js.map