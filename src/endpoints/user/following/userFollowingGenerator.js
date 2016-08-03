import Faker from 'faker';
import { first, find, sample } from 'lodash';
import pos from 'pos';
import generateTumblelogName from '../../generators/name/nameGenerator';
import { generateResponse } from '../../utils/utils';

export const generateFollowing = (name = generateTumblelogName()) => {
  const user = {
    name,
    title: generateTitleByTemplate(),
    updated: Date.parse(Faker.date.past()),
    description: generateDescriptionByTemplate()
  };
  return user;
}

export const generateFollowings = num => {
  const following = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateFollowing());
  }
  return following;
}

export const generateResponse = request => {
  const blogs = generateFollowing(request.limit);
  return generateResponse(blogs);
}
