import ansiAlign from 'ansi-align';
import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getCustomAttributes, applyCustomColor } from '../utilities.js';

export const center = blockTag((value, tag, context) => {
  const aligned = ansiAlign(value, { align: 'center' });
  const custom = getCustomAttributes(tag);
  return applyCustomColor(custom.color, context.theme.center?.color, aligned, chalkString);
});
