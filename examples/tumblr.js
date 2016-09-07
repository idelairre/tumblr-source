import tumblr from 'tumblr.js';
import Constants from 'constant-fox';
import credentials from './keys.json';

// create constants so that progress can be saved, see usage at https://github.com/idelairre/ConstantFox

const constants = new Constants({
  credentials,
  iterator: '',
  item: '',
  limit: null,
  offset: null
});

const client = tumblr.createClient({
  credentials: constants.get('credentials'),
  returnPromises: true
});

export default client;
