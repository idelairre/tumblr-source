import Source from '../src/source';
import client from './tumblr';
import { sanitize, writeToDisk } from './helpers';

/**
* The following is a node example of a tumblr-source instance which functions more like a Backbone model.
* This pattern might be preferable for use as single purpose "one-off" object which only fetches data.
*/

// define source

const source = new Source({
  options: {
    iterator: 'offset',
    item: 'blogs',
    limit: 25,
    offset: 0,
    verbose: true
  },
  parse(items) {
    items = items.blogs.map(item => {
      item.title = escape(sanitize(item.title));
      item.description = escape(sanitize(item.description));
      return item;
    });
    return items;
  },
  fetch() {
    return client.userFollowing({
      offset: this.options.offset,
      limit: this.options.limit
    });
  }
});

// assign actions to events

let following = [];

source.on('items', items => {
  following = following.concat(items);
  writeToDisk('./following.json', following);
  source.next();
});

source.on('error', msg => {
  console.error(msg);
});

source.on('done', msg => {
  console.log('[DONE]', msg);
});

source.start();
