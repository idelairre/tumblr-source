# Tumblr Source

Utility to download a bunch of data from Tumblr. Basically a modular version of https://github.com/Leeiio/tumblr-downloader refactored to use events and to work in a browser environment.

Includes decorators to help simplify your classes.

# Usage

The module exports a fetcher class containing several methods to handle errors and stop conditions, increment values, and parse responses. The class is meant to be very "plug and play": the default increment, parsing, and run condition functions are configured on initialization. They can be overridden if you want custom behavior.

Define your class like so:

```
import client from './tumblr';
import Source from 'tumblr-source';

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
```

Once you've defined and instantiated your class, add event listeners to the instance object. The Tumblr source instance will emit an `items` event after each successful fetch, a `done` event when it has reached its stop condition

```
source.on('items', items => {
  console.log(items);
  source.next();
});

source.on('error', msg => {
  console.error(msg);
});

source.on('done', msg => {
  console.log(`Done: ${msg}`);
});

source.start();
```

# Configuration

Configuration is done by defining an `options` object in the class constructor with the below properties (e.g., `// in the constructor... this.options = { item: 'posts', offset: 0 };` or by passing an options object as a hash when initializing a new `Source` object (e.g., `new Source({ iterator: 'blah', item: 'posts' });`).

+ `iterator`: the property you want to increment after each fetch. Defaults to `offset`.
+ `offset` (optional): the default iterator property. Defaults to 0. If the user opts for a different iterator value, it must be defined in the options hash (for instance, if you want to iterate through `pages` instead).
+ `item`: the property of the response hash you want returned after each fetch
+ `until` (optional): sets the max iterator value the fetcher will reach before stopping. If the user doesn't define a `condition` function on the class then this value will be used to determine when to stop.
+ `verbose/silent`: determines whether the user receives debug messages.

# Class methods

The following functions are called and configured "automagically" unless they are overridden by the user:

+ `parse`: returns the `item` defined in the options hash.
+ `condition`: returns a true or false value which determines whether or not to continue fetching.
+ `fetch`: an async function which will be called with the arguments provided by the user, defaults to fetching with the `offset` and `limit` as its arguments.
+ `step`: increments the `iterator` item by a user defined value, defaults to incrementing `offset` by `limit`.

# Examples

## Instantiating the `Source` class:

```
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
```

## With decorators:

This is a contrived example but you can configure and define  everything with decorators if want to keep non-sense out of your class or share parsing functions between multiple source classes.

```
import client from './tumblr';
import Source from '../src/source';
import { Condition, Fetch, Options, Load, Parse, Step, Verbose } from '../src/decorators';

// run condition

function condition() {
  return this.options.offset <= this.options.until;
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
```
