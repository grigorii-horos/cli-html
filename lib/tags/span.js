import ansiEscapes from 'ansi-escapes';
import chalkString from "chalk-string";

import inlineTag from '../tag-helpers/inline-tag.js';
import { getCustomAttributes, applyCustomColor } from '../utilities.js';

export const span = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const styledValue = applyCustomColor(custom.color, context.theme.span.color, value, chalkString);
  return styledValue;
});
