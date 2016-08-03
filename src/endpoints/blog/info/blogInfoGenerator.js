import Faker from 'faker';
import { first, find, sample } from 'lodash';
import generateTumblelogName from './name/nameGenerator';

export const generateBlogInfo = (name = generateTumblelogName()) => {
  const user = {
    title: name,
    posts: Faker.random.number(),
    updated: Date.parse(Faker.date.past()),
    description: generateDescriptionByTemplate(),
    ask: Faker.random.boolean(),
    likes: Faker.random.number(),
    is_nsfw: Faker.random.boolean()
  };
  if (user.ask) {
    user.ask_anon = Faker.random.boolean();
  }
  return user;
}

export const generateBlogInfos = num => {
  const tumblelogs = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateBlogInfo());
  }
  return tumblelogs;
}

export const generateBlogInfoResponse = name => {
  const response = {
    blog: generateBlogInfo(name)
  };
  return generateResponse(response);
}
