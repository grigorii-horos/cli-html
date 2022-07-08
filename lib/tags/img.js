import chalk from 'chalk';

import { getAttribute } from '../utils.js';

const {
  grey, cyan,
} = chalk;

export const img = (tag) => {
  const text = getAttribute(tag, 'alt', null)
    || getAttribute(tag, 'title', null)
    || 'Image';

  return {
    pre: null,
    value: cyan('!') + grey('[') + cyan(text) + grey(']'),
    post: null,
    type: 'inline',
  };
};
