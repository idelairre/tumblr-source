import { isEqual, sortBy, union, without } from 'lodash';
import fs from 'fs';
import following from '../dictionary/following.json';

export const formatDictionary = dictionary => {
  dictionary = dictionary.split('\n').map(word => {
    if (word.indexOf('/') !== -1) {
      return word.substring(0, word.indexOf('/'));
    } else {
      return word;
    }
  });
  return without(dictionary, '', undefined);
}

const formatNames = names => {
  return names.map(name => name.toLowerCase());
}

const generatePosHash = (input, property = false) => {
  const tagger = new pos.Tagger();
  const posHash = {
    'CC': [],
    'CD': [],
    'DT': [],
    'EX': [],
    'FW': [],
    'IN': [],
    'JJ': [],
    'JJR': [],
    'JJS': [],
    'LS': [],
    'MD': [],
    'NN': [],
    'NNS': [],
    'NNP': [],
    'NNPS': [],
    'PDT': [],
    'POS': [],
    'PRP': [],
    'PRP$': [],
    'RB': [],
    'RBR': [],
    'RBS': [],
    'RP': [],
    'SYM': [],
    'TO': [],
    'UH': [],
    'VB': [],
    'VBD': [],
    'VBG': [],
    'VBN': [],
    'VBP': [],
    'VBZ': [],
    'WDT': [],
    'WP': [],
    'WP$': [],
    'WRB': []
  };

  input.forEach(item => {
    const words = new pos.Lexer().lex(property ? item[property] : item);
    const tags = tagger.tag(words);
    tags.forEach(tag => {
      const key = tag[1];
      if (posHash[key]) {
        if (!posHash[key].includes(tag[0])) {
          posHash[key].push(tag[0]);
        }
      }
    });
  });

  return posHash;
}

// dictionary = _.union(dictionary, names, prefixes, ['anarcha', 'anhedonic', 'anarcho', 'alt', 'crit', 'duchamp', 'hauntology', 'goth', 'gothic', 'lenin', 'lit', 'miley', 'stoya']).sort();

export const breakUp = (input, dictionary) => {
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

  answer = sortBy(_.uniq(answer), 'length').reverse();

  for (let i = 0; i < answer.length; i++) {
    let word = answer[i];
    if (typeof word !== 'undefined') {
      for (let j = 0; j < answer.length; j++) {
        const test = answer[j];
        if (typeof test !== 'undefined') {
          if (word.includes(test) && !isEqual(word, test)) {
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
  positions = sortBy(positions, 'pos');
  return positions.map(entry => {
    return entry.word;
  });
}

export const generateCorpus = following => {
  let corpus = [];
  following.forEach(user => {
    if (typeof user !== 'undefined' && user.hasOwnProperty('name')) {
      corpus = union(corpus, breakUp(user.name, dictionary));
    }
  });
  return corpus;
}

export const readDictionary = (filename, encoding = 'utf8') => {
  if (filename.match(/\.json$/)) {
    return JSON.parse(fs.readFileSync(filename, encoding));
  } else {
    return fs.readFileSync(filename, encoding);
  }
}

export const saveDictionary = (filename, dictionary) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(dictionary));
    console.log(`Dictionary saved at ${filename}`);
  } catch (err) {
    console.error(err);
  }
}
