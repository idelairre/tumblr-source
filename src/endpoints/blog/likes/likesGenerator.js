import Faker from 'faker';
import { first, find, sample } from 'lodash';
import generateTumblelogName from './name/nameGenerator';

export const generateLike = () => {
  const post = generatePost();
  post.liked = true;
  return post;
}

export const generateLikes = num => {
  const tumblelogs = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateBlogInfo());
  }
  return tumblelogs;
}

export const generateLikesResponse = name => {
  const response = {
    posts: generateLikes(name)
  };
  return generateResponse(response);
}
