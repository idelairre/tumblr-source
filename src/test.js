import verbs from 'wordnetjs/data/Verb';
import nouns from 'wordnetjs/data/Noun';
import pos from 'pos';
import Sentencer from 'sentencer';
import natural from 'natural';
import tensify from 'tensify';
import determiners from '../corpus/determiners.json';

const nounInflector = new natural.NounInflector();

const words = new pos.Lexer().lex('I need a simple random English sentence generator. I need to populate it with my own words, but it needs to be capable of making longer sentences that at least follow the rules of English, even if they don\'t make sense.');
const tagger = new pos.Tagger();
let taggedWords = tagger.tag(words);

taggedWords = taggedWords.map(pos => {
  if (pos[1].length > 1) {
    if (pos[0] === 'I' && pos[1] === 'NN'){
      return pos[0];
    } else if (pos[1] === 'NN') {
      return '{{ noun }}';
    } else if (pos[1] === 'JJ') {
      return '{{ adjective }}';
    } else {
      return `{{ ${pos[1]} }}`;
    }
  } else {
    return pos[1];
  }
}).join(' ');

Sentencer.configure({
  actions: {
    DT() {
      return sample(determiners);
    },
    NNS() {
      return nounInflector.pluralize(sample(nouns.data).words[0]);
    },
    VB() {
      return sample(verbs.data).words[0];
    },
    VBN() {
      return tensify(sample(verbs.data).words[0]).past_participle;
    },
    NNP() {
      return _.capitalize(sample(names));
    },
    TO() {
      return 'to';
    }
  }
});
