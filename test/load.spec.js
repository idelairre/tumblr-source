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
  },
  load() {
    if (this.constants.get('nextBlogSourceSlug')) {
      Object.assign(this.options, this.constants.get('nextBlogSourceSlug'));
    }
    if (!this.options.url) {
      this.options.url = `https://www.tumblr.com/blog/${this.constants.get('userName')}`;
    }
  }
};

describe('Source', () => {
  describe('constructor()', () => {
    it ('should work', () => {
      const source = new TestSource();
      expect(source).toBeDefined();
    });
  });

  describe('load()', () => {
    it ('should allow load logic to load defined in the extended Source class', () => {
      const source = new TestSource();
      expect(source.options.url).toEqual('https://www.tumblr.com/blog/luxfoks');
    });
  });
});
