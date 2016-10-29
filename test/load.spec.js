import { Generator } from 'tumblr-faker';
import Constants from 'constant-fox';
import Source from '../src/source';

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const constants = new Constants({
  userName: 'luxfoks',
  nextBlogSourceSlug: {
    offset: 10,
    limit: 10,
    iterator: 'offset',
    item: 'posts',
    until: 1000
  }
});

class TestSource extends Source {
  options = {
    offset: 0,
    limit: 10,
    iterator: 'offset',
    item: 'posts',
    until: 1000
  };

  constructor() {
    super();
  }

  fetch() {
    return Generator.posts.generateMany(5);
  }

  load() {
    this.loadConstants(constants);

    if (this.constants.get('nextBlogSourceSlug')) {
      Object.assign(this.options, this.constants.get('nextBlogSourceSlug'));
    }
    if (!this.options.url) {
      this.options.url = `https://www.tumblr.com/blog/${this.constants.get('userName')}`;
    }
  }
};

describe('Load', () => {
  describe('constructor()', () => {
    it ('should work', () => {
      const source = new TestSource();
      expect(source).toBeDefined();
    });
  });

  describe('load()', () => {
    // it ('should automatically be called on initialization', () => {
    //   const source = new TestSource();
    //
    //   spyOn(source, 'load').and.callThrough();
    //
    //   setTimeout(() => {
    //     expect(source.load).toHaveBeenCalled();
    //   }, 0);
    // });

    it ('should allow load logic to be defined in the extended Source class', () => {
      const source = new TestSource();

      setTimeout(() => {
        expect(source.constants).toBeDefined();
        expect(source.options.offset).toEqual(5);
        expect(source.options.url).toEqual('https://www.tumblr.com/blog/luxfoks');
      }, 0);
    });
  });
});
