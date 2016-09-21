import constants from './constants';
import client from './tumblr';
import Source from '../src/source';
import { writeToDisk } from './helpers';

/**
* The following is a node example of an extensible tumblr-source class.
* A good use-case would be as a data source class with other methods for posting and fetching data.
* This is also preferable if you want more control over fetching and parsing.
* It will fetch blog posts froom the selected blog until the client errors out.
*/

constants.set({
  offset: 50,
  iterator: 'offset',
  item: 'posts',
  limit: 10,
  until: 100
});

class BlogSource extends Source {
  constructor() {
    super();
    this.options = {
      offset: 0,
      limit: 10,
      iterator: 'offset',
      item: 'posts',
      until: 100
    };
    this.silent = false;
  }

  condition() {
    return this.options.offset < this.options.until;
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

source.load(constants.toJSON());

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
