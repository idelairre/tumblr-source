import EventEmitter from 'eventemitter3';
import pick from 'lodash.pick';
export * from './decorators';

let DEBUG = false;

const debug = {};

Object.keys(console).forEach(key => {
	if (typeof console[key] === 'function') {
		debug[key] = function () {
			if (DEBUG) {
				const args = Array.from(arguments);
				args.unshift('[TUMBLR SOURCE]');
				return console[key].apply(console, args);
			}
		};
	}
});

function load(options) {
	let opts;
	if (typeof this._load === 'function') {
		opts = this._load();
	} else if (typeof this._load === 'object') {
		opts = this._load;
	} else {
		opts = options;
	}

	if (typeof this.options !== 'undefined') {
		for (const key in opts) {
			if ({}.hasOwnProperty.call(opts, key) && opts[key]) {
				this.options[key] = opts[key];
			}
		}
		this.loadedSaveState = true;
	} else {
		this._storedOptions = opts;
	}
	this.emit('loaded');
}

export default class Source extends EventEmitter {
  static options = {
    blog: null,
    offset: null,
    limit: null,
    page: null,
    iterator: null,
    item: 'items',
    url: null,
    until: null
  };
	options = {};
  initialized = false;
  stopFlag = false;
  sync = false;
  retryTimes = 3;
  retriedTimes = 0;
  lastError = null;

  STOP_FLAG_MESSAGE = 'Stop flag detected.';
  TIMEOUT_MESSAGE = 'Connection timed out.';
  STOP_CONDITION_MESSAGE = 'Stop condition reached.';
  UNDEFINED_RESPONSE_MESSAGE = 'Response is undefined.';
  EMPTY_RESPONSE_MESSAGE = 'Response was empty.';
  MAX_RETRIES_MESSAGE = 'Max retries reached, either there is a connection error or you have reached the maximum items you can fetch.';
  MAX_ITEMS_MESSAGE = 'Maximum fetchable items reached.';

  constructor(args) {
    super();
    if (typeof args !== 'undefined' && typeof args.options !== 'undefined') {
      this.options = args.options;
			if (typeof args.options.silent !== 'undefined') {
				this.silent = args.options.silent;
			}
			if (typeof args.options.verbose !== 'undefined') {
				this.silent = !args.options.verbose;
			}
      Object.assign(this, pick(args, ['condition', 'parse', 'step', 'sync']));

      this._fetch = typeof args.fetch === 'function' ? args.fetch : false;
      this._save = typeof args.save === 'function' ? args.save : false;
      this._load = typeof args.load === 'function' ? args.load : false;
    }

		this.debug = debug;

		this.on('continue', ::this.run);
		this.on('done', () => {
			this.stopFlag = false;
		});
		this.once('initialized', () => { // restores save state if the user is loading it via a decorator
			setTimeout(() => {
				if (!this.loadedSaveState) {
					Object.assign(this.options, this._storedOptions);
					this.loadedSaveState = true;
				}
			}, 0);
		});

		if (typeof this.load === 'function') {
			this.load();
		} else {
			this.load = load; // resort to default behavior where load is called by a decorator or explicitly
		}

    this.initialize();
  }

	set silent (newVal) {
		DEBUG = !newVal;
	}

	get silent () {
		return DEBUG;
	}

  initialize() {
    const init = () => {
      this.debug.log('done initializing.');
      this.emit('initialized');
      this.initialized = true;
    };
    if (this.options) {
      this.defaults = Object.assign({}, this.options);
    }

    if (typeof this.condition === 'undefined') {
      this.debug.warn(`no condition set for ${this.options.item}, using default condition`);
      this.condition = () => {
        return true;
      }
    }
    if (typeof this.parse === 'undefined') {
      this.debug.warn('no parse function defined, using default parse function');
      this.parse = data => {
        this.debug.log(this.options);
        return data[this.options.item];
      }
    }
    if (typeof this.step === 'undefined') {
      this.debug.warn(`no step set for ${this.options.item}, using default step function`);
      this.step = () => this.options.offset += this.options.limit;
    }
    if (typeof this._load !== 'undefined') {
      this.debug.log('load function detected, restoring state...');
      this.once('loaded', init);
      this.load();
    } else {
      init();
    }
  }

	loadConstants(constants, key, func) {
		if (Array.isArray(key)) {
			for (let i = key.length - 1; i >= 0; i--) {
				const val = constants.get(key[i]);
				if (val) {
					Object.assign(this.options, val);
				}
			}
		} else {
			const val = constants.get(key);
			if (val) {
				Object.assign(this.options, val);
			}
		}

		this.constants = constants;

		if (func) {
			func.call(this);
		}

		this.emit('loaded');
	}

  save() {
    return this._save(this.options);
  }

  start(options) {
    this.debug.log('starting ...');
		this.emit('start');
		this.stopFlag = false;
    if (options) {
      Object.assign(this.options, options);
      if (options.retryTimes) {
        this.retryTimes = options.retryTimes;
      }
      if (options.sync) {
        this.sync = options.sync;  // sets flag to run without calling "next()"
      }
    }
    if (this.initialized) {
      return this.run();
    }
    this.once('loaded', ::this.run);
  }

  async fetch(args = { offset: this.options[this.options.iterator], limit: this.options.limit }) {
    try {
			if (!this._fetch) {
				throw new Error('Fetch not defined');
			}
			let response;
			if (this._fetch instanceof Promise) {
				response = await this._fetch(args);
			} else {
				response = this._fetch(args);
			}
			if (typeof this.parse === 'function') {
				return Promise.resolve(this.parse(response));
			}
			return Promise.resolve(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  next() {
    return this.run();
  }

  async crawl(opts, retry) {
    return new Promise(async (resolve, reject) => {
      try {
        if (retry && this.retriedTimes && this.retriedTimes <= this.retryTimes) {
          this.debug.log(`Retrying... Retried times: ${this.retriedTimes}, retrying from ${opts.iterator}: ${this.options[opts.iterator]}...`);
        }
        const items = await this.fetch();
        if (typeof items === 'string') {
          this.debug.log(`✔ Crawled ${this.options.item} from ${opts.iterator}: ${this.options[opts.iterator]}`);
        } else if (Array.isArray(items)) {
          this.debug.log(`✔ Crawled ${items.length} ${this.options.item} from ${opts.iterator}: ${this.options[opts.iterator]}`);
        }
        resolve(items);
      } catch (err) {
        reject(err);
      }
    });
  }

  async run(retry = false) {
    try {
      if (this.stopFlag) {
        return this.done(this.STOP_FLAG_MESSAGE);
      }

      if (!this.condition()) { // NOTE: condition represents what must be true for run to crawl
        return this.done(this.STOP_CONDITION_MESSAGE);
      }

			this.debug.log('crawling...');

      const items = await this.crawl({
        iterator: this.options.iterator,
        item: this.options.item
      }, retry);

      this.retriedTimes = 0;

      if (typeof this.step === 'function') {
        this.step();
      }

      this.emit('items', items);
      if (typeof items === 'undefined') {
        return this.done(this.UNDEFINED_RESPONSE_MESSAGE);
      } else if (Array.isArray(items) && items.length === 0) {
        return this.done(this.MAX_ITEMS_MESSAGE);
      } else if (Object.keys(items).length === 0 && obj.constructor === Object) {
        return this.done(this.EMPTY_RESPONSE_MESSAGE);
      }
    } catch (err) {
      if (this.retriedTimes < this.retryTimes) {
        return this.handleError(err);
      }
      return this.done(this.MAX_RETRIES_MESSAGE);
    }
    if (this.sync && !this.stopFlag) {
      return this.run(retry);
    } else if (this.sync && this.stopFlag) {
			return this.done(this.STOP_FLAG_MESSAGE);
		}
		if (this.stopFlag) {
      return this.done(this.STOP_FLAG_MESSAGE);
    }
    this.emit('next'); // flags when the next run should be called for tests
  }

  stop() {
    this.emit('stop');
    this.stopFlag = true;
  }

  done(message) {
    this.emit('done', message);
		this.removeListeners();
  }

  handleError(error) {
		this.debug.error(error);
    this.emit('error', error);
    this.lastError = error;

		if (error.toString().includes('malformed API response')) {
			return this.stop();
		}

    if ((this.retryTimes - this.retriedTimes) === 0) {
      return this.stop();
    }

    this.debug.log(`Retry in 3s... will retry ${(this.retryTimes) - this.retriedTimes} more time(s)`);

    setTimeout(() => {
      this.retriedTimes += 1;
      return this.run(true);
    }, 6000);
  }

  reset() {
    return this.initialize();
  }

  removeListeners() {
    this.removeAllListeners();
  }
}
