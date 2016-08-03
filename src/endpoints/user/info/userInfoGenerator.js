import Faker from 'faker';
import { first, find, sample } from 'lodash';
import pos from 'pos';
import generateTumblelogName from '../../generators/name/nameGenerator';
import generateResponse from '../../utils/utils';

export const generateUserInfo = (name = generateTumblelogName()) => {
  const user = {
    name,
    title: generateTitleByTemplate(),
    updated: Date.parse(Faker.date.past()),
    tweet: sample(['auto', 'Y', 'N']),
    primary: true,
    followers: Faker.number.random()
  };
  return user;
}

export const generateUserInfos = num => {
  const following = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateUserInfo());
  }
  return following;
}

export const generateResponse = name => {
  const blogs = generateUserInfos(Faker.random.number({
    min: 1, max: 4
  }));
  return generateResponse({
    user: {
      following: Faker.number.random(),
      default_post_format: sample(['html', 'markdown', 'raw']);
      name,
      likes: Faker.number.random(),
      blogs
    }
  });
}
