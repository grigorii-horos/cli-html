import chalk from 'chalk';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utils.js';

const {
  bgBlack, bgWhite,
} = chalk;

const BAR_LENGTH = 20;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const parseNumericAttribute = (tag, attributeName) => {
  const parsed = Number.parseFloat(getAttribute(tag, attributeName, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const progress = inlineTag((value, tag) => {
  const current = parseNumericAttribute(tag, 'value');
  const maxValue = parseNumericAttribute(tag, 'max') || 1;

  const ratio = clamp(current / maxValue, 0, 1);
  const filled = Math.round(ratio * BAR_LENGTH);
  const empty = BAR_LENGTH - filled;

  return ` ${bgWhite.green('█'.repeat(filled))}${bgBlack.grey('█'.repeat(empty))}`;
});
