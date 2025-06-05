import chalk from 'chalk';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utils.js';

const {
  bgBlack, bgWhite,
} = chalk;

export const progress = inlineTag((value, tag) => {
  const value2 = getAttribute(tag, 'value', '0');
  const max = getAttribute(tag, 'max', '0');

  let ratio = Number(value2) / (Number(max) || 1);
  ratio = Math.min(1, Math.max(0, ratio));
  const pads = Math.round(ratio * 20);

  const progressStart = '█'.repeat(pads);
  const progressEnd = '█'.repeat(20 - pads);

  return ` ${
    bgWhite.green(progressStart)
  }${
    bgBlack.grey(progressEnd)
  }`;
});
