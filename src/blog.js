import Faker from 'faker';
import _, { first, find, sample } from 'lodash';
import MarkovChain from 'markovchain';
import pos from 'pos';
import corpus from '../corpus/nameCorpus.json';
import following from '../dictionary/following.json';
import names from '../corpus/names.json';
import prefixes from '../corpus/prefixes.json';

let seed = '';

following.forEach(user => {
  seed += _.trim(_.unescape(user.description));
});

let descriptions = new MarkovChain(seed);

console.log(descriptions.start('').end(25).process());

const flavor = tumblelog => {
  const seperators = ['-', '_', '', '-and-'];
  let modifier = sample(_.concat(corpus, ['girl', 'asexual', 'buddy', 'hoe', 'biddy', 'demonic', 'anarchy', 'left', 'succubus', 'soft', 'rude', 'grunge', 'slut', 'blood', 'minus', 'communist', 'loser', 'mermaid', 'fox', 'scorpio', 'queer', 'antifa', '69', 'trans', 'supa', 'slayin', 'words', 'poly']));
  const rand = Faker.random.number({
    min: 0,
    max: 7
  });
  switch (rand) {
    case 0:
      return tumblelog + sample(seperators) + modifier;
    case 1:
      return modifier + sample(seperators) + tumblelog;
    case 3:
      return tumblelog + sample(corpus);
    case 4:
      return tumblelog + sample(corpus) + sample(corpus);
    case 5:
      return tumblelog + sample(corpus) + sample(corpus);
    case 6:
      return sample(prefixes) + sample(seperators) + tumblelog;
    default:
      return sample(prefixes) + tumblelog;
  }
}

const contentRating = () => {
  return sample(['adult', 'nsfw']);
}

export const generateTumblelogName = () => {
  return flavor(sample(corpus));
}

export const generateUser = (name = generateTumblelogName()) => {
  const user = {
    title: name,
    posts: Faker.random.number(),
    updated: Date.parse(Faker.date.past()),
    description: Faker.lorem.sentence(),
    ask: Faker.random.boolean(),
    likes: Faker.random.number()
  };
  if (user.ask) {
    user.ask_anon = Faker.random.boolean();
  }
  if (Faker.random.boolean()) {
    user.is_nsfw = Faker.random.boolean();
  }
  return user;
}

export const generateUsers = num => {
  const tumblelogs = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateUser());
  }
  return tumblelogs;
}

console.log();
