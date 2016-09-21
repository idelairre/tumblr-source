import Constants from 'constant-fox';
import credentials from './keys.json';

const constants = new Constants({
  credentials,
  iterator: '',
  item: '',
  limit: null,
  offset: null
});

export default constants;
