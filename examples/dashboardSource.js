import client from './tumblr';
import Source from '../src/source';
import { Condition, DecorateFn, Fetch, Options, Load, Parse, Step, Verbose } from '../src/decorators';
import { writeToDisk } from './helpers';

/**
* The following is a node example of an extensible tumblr-source class using decorators.
* A good use-case would be when you want to keep fetching configuration out of the class.
* It will fetch the authenticated user's dashboard until it reaches 100 posts or errors out
*/

// define run condition

function condition() {
  if (this.options.until) {
    return this.options.offset <= this.options.until;
  }
  return true;
}

// action performed after each fetch

function step() {
  this.options.offset += this.options.limit;
}

@Options({
  offset: 0,
  limit: 10,
  until: 100,
  iterator: 'offset',
  item: 'posts',
})
@Condition(condition)
@Fetch(client.userDashboard)
@Parse(data => data.posts)
@Step(step)
@Verbose()
class DashboardSource extends Source { }

// DecorateFn(BlogSource, 'fetch', client.userDashboard); // demonstrates a way to plugin a fetch function, in this case using the tumblr client

const source = new DashboardSource();

let posts = [];

source.on('items', items => {
  posts = posts.concat(items);
  writeToDisk('./posts.json', posts);
  source.next();
});

source.on('error', msg => {
  console.error(msg);
});

source.on('done', msg => {
  console.log('[DONE]', msg);
});

source.start();
