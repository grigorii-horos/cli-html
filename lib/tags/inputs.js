import ansiColors from 'ansi-colors';
import { getAttribute } from '../utils.js';
import inlineTag from '../tag-helpers/inlineTag.js';

const {
  grey, red, bgBlack,
} = ansiColors;

export const button = inlineTag(
  (value) => `${
    bgBlack.grey('[ ')
  }${
    bgBlack.bold(value)
  }${
    bgBlack.grey(' ]')
  }`,
);

export const input = (tag) => {
  if (getAttribute(tag, 'type', 'text') === 'checkbox') {
    return {
      pre: null,
      value: `${
        grey('[')
      }${
        getAttribute(tag, 'checked', ' ') === ''
          ? red.bold('☓')
          : red.bold(' ')
      }${
        grey(']')
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
        grey('(')
      }${
        getAttribute(tag, 'checked', ' ') === ''
          ? red.bold('☓')
          : red.bold(' ')
      }${
        grey(')')
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
        bgBlack.grey('[ ')
      }${
        bgBlack.bold(getAttribute(tag, 'value', ''))
      }${
        bgBlack.grey(' ]')
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

export const output = inlineTag();
