import _ from 'lodash';

export const generateStrongPassword = (length: number = 16) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@#$%^&*-_=+';
  // https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript
  const randomNumbers = crypto.getRandomValues(new Uint32Array(length));
  const chars = _.map(randomNumbers, num => characters[num % characters.length]);
  return chars.join('');
};