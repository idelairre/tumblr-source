import { Load } from '../src/decorators';
import constants from './constants';
import client from './tumblr';
import Source from '../src/source';

constants.set({
  offset: 50,
  limit: 10,
  iterator: 'offset',
  item: 'posts',
  until: 100
})

@Load(constants.toJSON())
class BlogSource extends Source {
  constructor() {
    super();
    this.options = {
      offset: 0,
      limit: 10,
      iterator: 'offset',
      item: 'posts',
      until: 100,
    };
    this.silent = false;
  }

  condition() {
    return this.options.offset <= this.options.until;
  }

  step() {
    this.options.offset += this.options.limit;
  }

  async fetch() {
    try {
      const posts = await client.blogPosts('luxfoks', {
        offset: this.options.offset,
        limit: this.options.limit
      });
      return this.parse(posts);
    } catch (err) {
      console.error(err);
    }
  }

  parse(data) {
    return data.posts;
  }
}

const source = new BlogSource();

let posts = [];

source.on('items', items => {
  console.log(`Offset: ${source.options.offset}`);
  source.next();
});

source.on('error', msg => {
  console.error(msg);
});

source.on('done', msg => {
  console.log('[DONE]', msg);
});

source.start();
