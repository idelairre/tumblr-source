import tumblr from 'tumblr.js';
import constants from './constants';
// create constants so that progress can be saved, see usage at https://github.com/idelairre/ConstantFox

const client = tumblr.createClient({
  credentials: constants.get('credentials'),
  returnPromises: true
});

export default client;
