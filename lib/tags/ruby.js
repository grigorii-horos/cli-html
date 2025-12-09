import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getCustomAttributes, applyCustomColor } from '../utilities.js';

// Ruby annotations are used for showing pronunciation of East Asian characters
// In CLI, we'll show base text with annotation in parentheses
export const ruby = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  return applyCustomColor(custom.color, context.theme.span.color, value, chalkString);
});

// rt (ruby text) - the annotation/pronunciation
export const rt = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const styled = applyCustomColor(custom.color, context.theme.span.color, value, chalkString);
  return ` (${styled})`;
});

// rp (ruby parenthesis) - fallback parentheses for browsers that don't support ruby
// We'll hide these since we're adding our own parentheses
export const rp = () => null;
