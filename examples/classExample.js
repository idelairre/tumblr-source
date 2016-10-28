import client from './tumblr';
import Source from '../src/source';
import { sanitize, writeToDisk } from './helpers';

/**
* The following is a node example of an extensible tumblr-source class.
* A good use-case would be as a data source class with other methods for posting and fetching data.
* This is also preferable if you want more control over fetching and parsing.
* It will fetch blog posts froom the selected blog until the client errors out.
*/

class BlogSource extends Source {
  constructor() {
    super();
    this.options = {
      offset: 0,
      limit: 10,
      iterator: 'offset',
      item: 'posts',
      until: 1000,
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
      const posts = await client.blogPosts('hypocrite-lecteur', {
        type: 'text',
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
  posts = posts.concat(items);
  source.next();
});

source.on('error', msg => {
  console.error(msg);
});

source.on('done', msg => {
  let text = '';
  posts.forEach(post => {
    text += `${sanitize(post.body)}\n`;
  });
  writeToDisk('input.txt', text);
});

source.start();
