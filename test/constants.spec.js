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
  fetch() {
    return Generator.posts.generateMany(10);
  }
};

describe('Constants', () => {
  describe('constructor()', () => {
    it ('should work', () => {
      const source = new TestSource();
      expect(source).toBeDefined();
    });
  });

  describe('loadConstants()', () => {
    it ('should exist', () => {
      const source = new TestSource();
      expect(source.loadConstants).toBeDefined();
    });

    it ('should initialize constants', () => {
      const source = new TestSource();
      source.loadConstants(constants, 'nextBlogSourceSlug');

      expect(source.constants).toBeDefined();
      expect(source.options.offset).toBe(10);
    });

    it ('should allow custom load function logic', () => {
      const source = new TestSource();
      source.loadConstants(constants, 'nextBlogSourceSlug', function () {
        if (!this.options.url) {
          this.options.url = `https://www.tumblr.com/blog/${this.constants.get('userName')}`;
        }
      });
      expect(source.options.url).toEqual('https://www.tumblr.com/blog/luxfoks');
    });
  });
});
