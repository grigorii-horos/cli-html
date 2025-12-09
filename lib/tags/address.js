import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getCustomAttributes, applyCustomColor } from '../utilities.js';

export const address = blockTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const styledValue = applyCustomColor(custom.color, context.theme.address.color, value, chalkString);
  return styledValue;
});
