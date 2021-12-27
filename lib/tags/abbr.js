import ansiColors from 'ansi-colors';
import inlineTag from '../tag-helpers/inlineTag.js';

import { getAttribute } from '../utils.js';

const {
  underline, grey, cyan, italic,
} = ansiColors;

export const abbr = inlineTag((value, tag) => {
  const title = getAttribute(tag, 'title', null);

  let abbrValue = underline(value);

  abbrValue = title
    ? `${abbrValue} ${grey('(')}${cyan(title)}${grey(')')}`
    : abbrValue;

  return abbrValue;
});

export const dfn = inlineTag((value, tag) => {
  const title = getAttribute(tag, 'title', null);

  let abbrValue = italic.underline(value);

  abbrValue = title
    ? `${abbrValue} ${grey('(')}${cyan(title)}${grey(')')}`
    : abbrValue;

  return abbrValue;
});

export const acronym = abbr;
