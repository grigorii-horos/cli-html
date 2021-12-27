import ansiColors from 'ansi-colors';

import { getAttribute } from '../utils.js';

const {
  grey, cyan, red,
} = ansiColors;

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
