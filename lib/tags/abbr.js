import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';

export const abbr = inlineTag((value, tag, context) => {
  const title = getAttribute(tag, 'title', null);

  let abbrValue = context.theme.abbr.color(value);

  abbrValue = title
    ? `${abbrValue} ${context.theme.abbr.parens.color('(')}${context.theme.abbr.title.color(title)}${context.theme.abbr.parens.color(')')}`
    : abbrValue;

  return abbrValue;
});

export const dfn = inlineTag((value, tag, context) => {
  const title = getAttribute(tag, 'title', null);

  let abbrValue = context.theme.dfn.color(value);

  abbrValue = title
    ? `${abbrValue} ${context.theme.abbr.parens.color('(')}${context.theme.abbr.title.color(title)}${context.theme.abbr.parens.color(')')}`
    : abbrValue;

  return abbrValue;
});

export const acronym = abbr;
