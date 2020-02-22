const ansiStyles = require('ansi-colors');
const { getAttribute } = require('../utils');
const inlineTag = require('../tag-helpers/inlineTag');

const button = inlineTag(
  (value) => `${
    ansiStyles.bgBlack.grey('[ ')
  }${
    ansiStyles.bgBlack.bold(value)
  }${
    ansiStyles.bgBlack.grey(' ]')
  }`,
);

const input = (tag) => {
  if (getAttribute(tag, 'type', 'text') === 'checkbox') {
    return {
      pre: null,
      value: `${
        ansiStyles.grey('[')
      }${
        getAttribute(tag, 'checked', ' ') === ''
          ? ansiStyles.red.bold('☓')
          : ansiStyles.red.bold(' ')
      }${
        ansiStyles.grey(']')
      }`,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'radio') {
    return {
      pre: null,
      value: `${
        ansiStyles.grey('(')
      }${
        getAttribute(tag, 'checked', ' ') === ''
          ? ansiStyles.red.bold('☓')
          : ansiStyles.red.bold(' ')
      }${
        ansiStyles.grey(')')
      }`,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'button') {
    return {
      pre: null,
      value: `${
        ansiStyles.bgBlack.grey('[ ')
      }${
        ansiStyles.bgBlack.bold(getAttribute(tag, 'value', ''))
      }${
        ansiStyles.bgBlack.grey(' ]')
      }`,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  return {
    pre: null,
    value: getAttribute(tag, 'value', ''),
    post: null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
};

const output = inlineTag();

module.exports.button = button;
module.exports.output = output;
module.exports.input = input;
