import { first, find, isArray, last, sample, unescape, union, without } from 'lodash';
import Faker from 'faker';
import MarkovChain from 'markovchain';
import { replaceEmails, replaceNames, replaceTwitter, parseTemplate, generateTemplateSeeds } from '../utils/utils';
import followingCorpus from '../../dictionary/following.json';
import pos from '../../corpus/pos.json';

const BAD_TERMINATORS = union(pos.WRB, pos.CC, pos.IN, pos.DT, ['A', 'be', 'by', 'with', 'of', 'that', 'That', 'The', 'the', 'THE', 'a', 'an', 'and', 'as', 'I', 'in', 'In', 'im', 'is', 'Is', 'IS', 'on', 'so', 'to', 'To', 'TO', 'no', 'No', 'could', 'And', 'your', ',', 'for', 'from', '&']);

let markov;

let seed = '';

export const generateTitleByTemplate = (following = followingCorpus) => {
  const seeds = generateTemplateSeeds(following, 'title');
  return parseTemplate(seeds).replace(/\s+(\W)/g, '$1');
}

export const generateTitleByMarkovChain = (following = followingCorpus) => {
  const randomStarter = wordList => {
    const tmpList = Object.keys(wordList).filter(word => {
      return first(word);
    });
    return sample(tmpList);
  }

  const terminator = sentence => {
    return sentence.split(' ').length >= 7 || last(sentence).includes(BAD_TERMINATORS);
  }
  if (seed.length === 0) {
    following.forEach(user => {
      const desc = unescape(user.title).trim();
      seed += desc;
    });
  }
  markov = markov || new MarkovChain(seed);
  let sentence = replaceNames(replaceTwitter(replaceEmails(markov.start(randomStarter).end(terminator).process())));
  return checkEndWord(sentence);
}

const checkEndWord = sentence => {
  sentence = sentence.split(' ');
  let endWord = last(sentence);
  if (BAD_TERMINATORS.includes(endWord)) {
    sentence = sentence.slice(0, -1).join(' ');
    return checkEndWord(sentence);
  }

  if (endWord.match(/,/g)) {
    endWord = endWord.replace(/,/, '');
    sentence[sentence.length - 1] = endWord;
  }

  if (isArray(sentence)) {
    sentence = sentence.join(' ');
  }

  return sentence;
}
