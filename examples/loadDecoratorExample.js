import constants from './constants';
import client from './tumblr';
import Source from '../src/source';
import { Condition, DecorateFn, Fetch, Options, Load, Parse, Step, Verbose } from '../src/decorators';

constants.set({
  offset: 50,
  limit: 10,
  until: 100,
  iterator: 'offset',
  item: 'posts',
});

function condition() {
  if (this.options.until) {
    return this.options.offset <= this.options.until;
  }
  return true;
}

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
@Load(constants.toJSON())
@Verbose()
class DashboardSource extends Source { }

// DecorateFn(BlogSource, 'fetch', client.userDashboard); // demonstrates a way to plugin a fetch function, in this case using the tumblr client

const source = new DashboardSource();

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
