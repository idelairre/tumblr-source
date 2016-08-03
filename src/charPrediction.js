import _ from 'lodash';
import { replaceEmails } from './blogInfoGenerator';
import R from '../lib/recurrent';
import following from '../dictionary/following.json';

const generateFollowingSeeds = () => {
  let seeds = [];
  following.forEach(user => {
    const desc = _.trim(replaceEmails(_.unescape(user.description)));
    const words = _.words(desc);
    words.forEach(word => {
      seeds.push(word);
    });
  });
  return seeds;
}

// prediction params
let sampleSoftmaxTemperature = 0.8 // how peaky model predictions should be
let maxCharsGen = 100; // max length of generated sentences

let generator = 'lstm'; // can be 'rnn' or 'lstm'
let hiddenSizes = [20,20]; // list of sizes of hidden layers
let letterSize = 5; // size of letter embeddings

// optimization
let regc = 0.000001; // L2 regularization strength
let learningRate = 0.01; // learning rate
let clipval = 5.0; // clip gradients at this value

// letious global let inits
let epochSize = -1;
let inputSize = -1;
let outputSize = -1;
let letterToIndex = {};
let indexToLetter = {};
let vocab = [];
let dataSents = [];
let solver = new R.Solver(); // should be class because it needs memory for step caches

let model = {};

const initVocab = (sents, countThreshold) => {
  // go over all characters and keep track of all unique ones seen
  let txt = sents.join(''); // concat all

  // count up all characters
  let d = {};
  for (let i = 0, n = txt.length; i < n; i++) {
    let txti = txt[i];
    if (txti in d) {
      d[txti] += 1;
    } else {
      d[txti] = 1;
    }
  }

  // filter by count threshold and create pointers
  letterToIndex = {};
  indexToLetter = {};
  vocab = [];
  // NOTE: start at one because we will have START and END tokens!
  // that is, START token will be index 0 in model letter vectors
  // and END token will be index 0 in the next character softmax
  let q = 1;
  for (const ch in d) {
    if (d.hasOwnProperty(ch)) {
      if (d[ch] >= countThreshold) {
        // add character to vocab
        letterToIndex[ch] = q;
        indexToLetter[q] = ch;
        vocab.push(ch);
        q++;
      }
    }
  }

  // console.log(indexToLetter);
  // console.log(letterToIndex);

  // globals written: indexToLetter, letterToIndex, vocab (list), and:
  inputSize = vocab.length + 1;
  outputSize = vocab.length + 1;
  epochSize = sents.length;
  console.log('found ' + vocab.length + ' distinct characters: ' + vocab.join(''));
}

const reinit = seed => {// NOTE: reinit writes global lets
  solver = new R.Solver(); // reinit solver

  pplList = [];
  tickIter = 0;

  // process the input, filter out blanks
  const dataSentsRaw = seed;
  dataSents = [];
  for (let i = 0; i < dataSentsRaw.length; i += 1) {
    const sent = dataSentsRaw[i].trim();
    if (sent.length > 0) {
      dataSents.push(sent);
    }
  }

  initVocab(dataSents, 1); // takes count threshold for characters
  model = initModel();
}

const utilAddToModel = (modelto, modelfrom) => {
  for (const k in modelfrom) {
    if (modelfrom.hasOwnProperty(k)) {
      // copy over the pointer but change the key to use the append
      modelto[k] = modelfrom[k];
    }
  }
}

const initModel = () => {
  // letter embedding vectors
  const model = {};
  model['Wil'] = new R.RandMat(inputSize, letterSize , 0, 0.08);
  if (generator === 'rnn') {
    const rnn = R.initRNN(letterSize, hiddenSizes, outputSize);
    utilAddToModel(model, rnn);
  } else {
    const lstm = R.initLSTM(letterSize, hiddenSizes, outputSize);
    utilAddToModel(model, lstm);
  }
  return model;
}

const forwardIndex = (G, model, ix, prev) => {
  const x = G.rowPluck(model['Wil'], ix);
  // forward prop the sequence learner
  if (generator === 'rnn') {
    return R.forwardRNN(G, model, hiddenSizes, x, prev);
  } else {
    return R.forwardLSTM(G, model, hiddenSizes, x, prev);
  }
}

const predictSentence = (model, samplei, temperature) => {
  if (typeof samplei === 'undefined') {
    samplei = false;
  }
  if (typeof temperature === 'undefined') {
    temperature = 1.0;
  }

  let G = new R.Graph(false);
  let s = '';
  let prev = {};
  while (true) {
    // RNN tick
    let ix = s.length === 0 ? 0 : letterToIndex[s[s.length - 1]];
    let lh = forwardIndex(G, model, ix, prev);
    prev = lh;

    // sample predicted letter
    let logprobs = lh.o;
    if (temperature !== 1.0 && samplei) {
      // scale log probabilities by temperature and renormalize
      // if temperature is high, logprobs will go towards zero
      // and the softmax outputs will be more diffuse. if temperature is
      // very low, the softmax outputs will be more peaky
      for (let q = 0, nq = logprobs.w.length; q < nq; q++) {
        logprobs.w[q] /= temperature;
      }
    }

    let probs = R.softmax(logprobs);
    if (samplei) {
      ix = R.samplei(probs.w);
    } else {
      ix = R.maxi(probs.w);
    }

    if (ix === 0) {
      break; // END token predicted, break out
    }
    if (s.length > maxCharsGen) {
      break;
    } // something is wrong

    let letter = indexToLetter[ix];
    s += letter;
  }
  return s;
}

const costfun = (model, sent) => {
  // takes a model and a sentence and
  // calculates the loss. Also returns the Graph
  // object which can be used to do backprop
  let n = sent.length;
  let G = new R.Graph();
  let log2ppl = 0.0;
  let cost = 0.0;
  let prev = {};
  for (let i = -1; i < n; i++) {
    // start and end tokens are zeros
    let ixSource = i === -1 ? 0 : letterToIndex[sent[i]]; // first step: start with START token
    let ixTarget = i === n - 1 ? 0 : letterToIndex[sent[i + 1]]; // last step: end with END token

    let lh = forwardIndex(G, model, ixSource, prev);
    prev = lh;

    // set gradients into logprobabilities
    let logprobs = lh.o; // interpret output as logprobs
    let probs = R.softmax(logprobs); // compute the softmax probabilities

    log2ppl += -Math.log2(probs.w[ixTarget]); // accumulate base 2 log prob and do smoothing
    cost += -Math.log(probs.w[ixTarget]);

    // write gradients into log probabilities
    logprobs.dw = probs.w;
    logprobs.dw[ixTarget] -= 1
  }
  let ppl = Math.pow(2, log2ppl / (n - 1));
  return {
    'G': G,
    'ppl': ppl,
    'cost': cost
  };
}

const median = values => {
  values.sort((a, b) => {
    return a - b;
  });
  const half = Math.floor(values.length / 2);
  if (values.length % 2) {
    return values[half];
  } else {
    return (values[half - 1] + values[half]) / 2.0;
  }
}

const tick = () => {
  // sample sentence fromd data
  let sentix = R.randi(0, dataSents.length);
  let sent = dataSents[sentix];

  let t0 = +new Date(); // log start timestamp
  // evaluate cost function on a sentence
  let costStruct = costfun(model, sent);

  // use built up graph to compute backprop (set .dw fields in mats)
  costStruct.G.backward();
  // perform param update
  let solverStats = solver.step(model, learningRate, regc, clipval);

  let t1 = +new Date();
  let tickTime = t1 - t0;

  pplList.push(costStruct.ppl); // keep track of perplexity

  // evaluate now and then
  tickIter += 1;
  if (tickIter % 50 === 0) {
    // draw samples
    for (let q = 0; q < 5; q++) {
      const pred = predictSentence(model, true, sampleSoftmaxTemperature);
      console.log('prediction:', pred);
    }
  }
  if (tickIter % 10 === 0) {
    // draw argmax prediction
    const pred = predictSentence(model, false);
    console.log('argmax prediction:', pred);
    // console.log('epoch: ' + (tickIter / epochSize).toFixed(2));
    // console.log('perplexity: ' + costStruct.ppl.toFixed(2));
    // console.log('forw/bwd time per example: ' + tickTime.toFixed(1) + 'ms');
    if (tickIter % 100 === 0) {
      let medianPpl = median(pplList);
      pplList = [];
    }
  }
}

let pplList = [];
let tickIter = 0;

reinit(generateFollowingSeeds());

setInterval(tick, 0);
