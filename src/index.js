import * as FollowerGenerator from './endpoints/blog/followers/followerGenerator';

const followers = FollowerGenerator.generateFollowersResponse({
  limit: 10,
  offset: 0
});

console.log(JSON.stringify(followers, null, 3));
