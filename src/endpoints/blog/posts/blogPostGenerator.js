import Faker from 'faker';
import { first, find, sample } from 'lodash';
import generateTumblelogName from './name/nameGenerator';

export const generateBlogPost = () => {
  const post = generatePost();
  return post;
}

export const generateBlogPosts = num => {
  const tumblelogs = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateBlogPost());
  }
  return tumblelogs;
}

export const generateBlogPosts = name => {
  const response = {
    posts: generateBlogPosts(name)
  };
  return generateResponse(response);
}
