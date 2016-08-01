import following from '../dictionary/following.json';
import prefixesRaw from 'raw!../dictionary/prefix.txt';
import wordsRaw from 'raw!../dictionary/words.txt';
import censusRaw from 'raw!../dictionary/names.txt';

const formatDictionary = dictionary => {
  dictionary = dictionary.split('\n').map(word => {
    if (word.indexOf('/') !== -1) {
      return word.substring(0, word.indexOf('/'));
    } else {
      return word;
    }
  });

  return _.without(dictionary, '', undefined);
}

const formatNames = names => {
  return names.map(name => name.toLowerCase());
}

let dictionary = formatDictionary(wordsRaw);
const names = formatNames(formatDictionary(censusRaw)).sort();
const prefixes = formatDictionary(prefixesRaw);


dictionary = _.union(dictionary, names, prefixes, ['anarcha', 'anhedonic', 'anarcho', 'alt', 'crit', 'duchamp', 'hauntology', 'goth', 'gothic', 'lenin', 'lit', 'miley', 'stoya']).sort();

const breakUp = (input, dictionary) => {
  if (!input) {
    console.log(`"argument ${input}" is not valid`);
    return;
  }
  let answer = [];
  if (input.match(/[0-9]+/g)) {
    const numbers = input.match(/[0-9]+/g)[0];
    answer.push(numbers);
  }

  for (let i = 0; i < dictionary.length - 1; i++) {
    const word = dictionary[i];
    if (input.indexOf(word) !== -1) {
      answer.push(word);
    }
  }

  answer = _.sortBy(_.uniq(answer), 'length').reverse();

  for (let i = 0; i < answer.length; i++) {
    let word = answer[i];
    if (typeof word !== 'undefined') {
      for (let j = 0; j < answer.length; j++) {
        const test = answer[j];
        if (typeof test !== 'undefined') {
          if (word.includes(test) && !_.isEqual(word, test)) {
            delete answer[j];
          }
        }
      }
    }
  }

  answer = _.without(answer, undefined);

  let positions = [];
  
  for (let i = 0; i < answer.length; i++) {
    const word = answer[i];
    const pos = input.indexOf(word);
    positions.push({ word, pos });
  }
  positions = _.sortBy(positions, 'pos');
  return positions.map(entry => {
    return entry.word;
  });
}

const generateCorpus = following => {
  let corpus = [];
  following.forEach(user => {
    if (typeof user !== 'undefined' && user.hasOwnProperty('name')) {
      corpus = _.union(corpus, breakUp(user.name, dictionary));
    }
  });
  return corpus;
}
