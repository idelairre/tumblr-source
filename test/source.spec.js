import { Generator } from 'tumblr-faker';
import isEqual from 'lodash.isequal';
import pick from 'lodash.pick';
import Source from '../src/source';

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const args = {
  options: {
    url: 'https://www.tumblr.com/likes',
    page: 0,
    iterator: 'page',
    item: 'likes',
    until: true
  },
  fetch() {
    return Generator.posts.generateMany(5);
  },
  parse(items) {
    return items;
  },
  step: Function.prototype,
  condition() {
    return true;
  }
};

describe('Source', () => {
  describe('constructor()', () => {
    it ('should work', () => {
      const source = new Source(args);
      expect(source).toBeDefined();
    });

    it ('should assign arguments to the options hash', done => {
      const source = new Source(args);
      if (source.initialized) {
        expect(source.defaults).toBeDefined();
        expect(isEqual(source.defaults, pick(args.options, Object.keys(source.defaults)))).toBe(true);
        done();
      } else {
        source.addListener('initialized', () => {
          expect(source.defaults).toBeDefined();
          expect(isEqual(source.defaults, pick(args.options, Object.keys(source.defaults)))).toBe(true);
          done();
        });
      }
    });
  });

  describe('start()', () => {
    it ('should assign "sync" and "retryTime" properties to source object', () => {
      const source = new Source(args);
      source.start({
        sync: true,
        retryTimes: 1
      });
      expect(source.sync).toBe(true);
      expect(source.retryTimes).toBe(1);
      source.stop();
    });

    it ('should call run()', () => {
      const source = new Source(args);
      spyOn(source, 'run');
      source.start({
        sync: true,
        retryTimes: 1
      });
      expect(source.run).toHaveBeenCalled();
      source.stop();
    });
  });

  describe('fetch()', () => { // TODO: add tests for error handling and success
    // it ('should fetch items', done => {
    //   const source = new Source(args);
    //   source.fetch().then(response => {
    //     expect(response).toBeDefined();
    //     done();
    //   });
    // });

    it ('should call parse() if it is defined', done => {
      const source = new Source(args);
      spyOn(source, 'parse');
      source.fetch().then(() => {
        expect(source.parse).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('run()', () => {
    beforeEach(() => {
      args.step = function() {
        this.options.page += 1;
        this.options.url = `https://www.tumblr.com/likes/page/${this.options.page}`;
      }
    });

    it ('should call crawl()', done => {
      const source = new Source(args);
      spyOn(source, 'crawl').and.returnValue([]); // TODO: reimplement with generator
      source.run().then(() => {
        expect(source.crawl).toHaveBeenCalled();
        done();
      });
    });

    it ('should call step()', done => {
      const source = new Source(args);
      spyOn(source, 'step');
      source.run().then(() => {
        expect(source.step).toHaveBeenCalled();
        done();
      });
    });

    it ('should call stop() when its stop condition is met', done => {
      const condition = function () {
        return this.page === 1;
      }
      const source = new Source(args);

      spyOn(source, 'done');
      spyOn(source, 'condition').and.callFake(condition);

      source.run().then(() => {
        expect(source.condition).toHaveBeenCalled()
        expect(source.done).toHaveBeenCalled();
        done();
      });
    });

    it ('should emit "items" event after crawling', done => {
      const source = new Source(args);
      source.addListener('items', items => {
        expect(items).toBeDefined();
        source.stop();
        done();
      });
      source.run();
    });

    it ('should emit a "done" event when it is done', done => {
      args.condition = function () {
        return this.options.page < 2;
      }
      args.step = function () {
        this.options.page += 1;
        this.options.url = `https://www.tumblr.com/likes/page/${this.options.page}`;
      }

      const source = new Source(args);

      source.addListener('done', msg => {
        expect(msg).toBeDefined();
        source.stop();
        done();
      });
      source.run();
    });

    it ('should automatically call itself until its stop condition is met and if the "sync" param is set to true', done => {
      args.condition = function () {
        return this.options.page < 3;
      }
      args.step = function () {
        this.options.page += 1;
        this.options.url = `https://www.tumblr.com/likes/page/${this.options.page}`;
      }
      args.sync = true;

      const source = new Source(args);

      spyOn(source, 'crawl').and.callThrough();

      source.addListener('done', msg => {
        expect(source.crawl).toHaveBeenCalled();
        done();
      });

      source.run();
    });

    it ('should not automatically call itself if the "sync" param is not passed', done => {
      let count = 0;

      args.condition = function () {
        return this.options.page < 3;
      }
      args.step = function () {
        this.options.page += 1;
        this.options.url = `https://www.tumblr.com/likes/page/${this.options.page}`;
      }

      delete args.sync;

      const source = new Source(args);

      source.addListener('next', count++);

      source.run();

      setTimeout(() => {
        expect(count).toEqual(1);
        done();
      }, 4000);
    });
  });

  describe('stop()', () => {
    it ('should stop the run() method if it is in progress', done => { // NOTE: can't seem to interrupt this sooner
      args.condition = function () {
        return this.options.page < 3;
      }
      args.step = function () {
        this.options.page += 1;
        this.options.url = `https://www.tumblr.com/likes/page/${this.options.page}`;
      }

      delete args.sync;

      const source = new Source(args);

      spyOn(source, 'crawl');

      source.addListener('done', () => {
        expect(source.crawl).not.toHaveBeenCalled();
        done();
      });

      source.run();
      source.stop();
    });
  });
});
