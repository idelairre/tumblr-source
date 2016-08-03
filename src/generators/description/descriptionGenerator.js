import { first, find, sample, unescape, without } from 'lodash';
import { parseTemplate } from '../utils/utils';
import Faker from 'faker';
import MarkovChain from 'markovchain';
import pos from 'pos';
import generateTumblelogName from '../name/nameGenerator';
import followingCorpus from '../../dictionary/following.json';

let markov = null;

export const generateDescriptionByTemplate = (following = followingCorpus) => {
  const seeds = generateTemplateSeeds(following, 'description');
  return parseTemplate(seed);
}

export const generateDescriptionByMarkovChain = (following = followingCorpus) => {
  const geRandomStarter = wordList => {
    const tmpList = Object.keys(wordList).filter(word => {
      return word[0];
    });
    return sample(tmpList);
  }

  const terminator = sentence => {
    return !last(sentence).includes('', 'of', 'The', 'the', 'a', 'and', 'I', 'is', 'Is', 'could', 'And', 'your', ',');
  }

  let seed = '';

  following.forEach(user => {
    const desc = unescape(user.description).trim();
    seed += desc;
  });
  markov = markov || new MarkovChain(seed);
  return replaceTwitter(replaceEmails(markov.start(geRandomStarter).end(terminator).process()));
}
