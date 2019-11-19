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
    value: ansiStyles.cyan('!')
     + ansiStyles.grey('[')
      + ansiStyles.cyan(text)
     + ansiStyles.grey(']'),
    post: ' ',
    type: 'inline',
  };
};

module.exports.img = img;
