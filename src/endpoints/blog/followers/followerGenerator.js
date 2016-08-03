import Faker from 'faker';
import { first, find, sample } from 'lodash';
import pos from 'pos';
import generateTumblelogName from '../../../generators/name/nameGenerator';
import { generateResponse, generateTumblrUrl } from '../../../utils/utils';

export const generateFollower = (name = generateTumblelogName()) => {
  const follower = {
    name,
    following: true,
    url: generateTumblrUrl(name),
    updated: Date.parse(Faker.date.past())
  };
  return follower;
}

export const generateFollowers = num => {
  const tumblelogs = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateFollower());
  }
  return tumblelogs;
}

export const generateFollowersResponse = query => {
  const response = {
    total_followers: Faker.random.number(),
    users: generateFollowers(query.limit)
  };
  return generateResponse(response);
}
