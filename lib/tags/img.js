const ansiStyles = require('ansi-colors');

const {
  getAttribute,
} = require('../utils');

const img = (tag, context) => {
  const text = getAttribute(tag, 'alt', null)
  || getAttribute(tag, 'title', null)
  || 'Image';

  return {
    pre: ' ',
    value: ansiStyles.blue('!')
     + ansiStyles.grey('[')
      + ansiStyles.blue(text)
     + ansiStyles.grey(']'),
    post: ' ',
    type: 'inline',
  };
};

module.exports.img = img;
