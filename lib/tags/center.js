import stringWidth from 'string-width';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const center = blockTag((value, tag, context) => {
  // Center each line within the available line width, not just the longest line
  const aligned = value
    .split('\n')
    .map((line) => ' '.repeat(Math.max(0, Math.floor((context.lineWidth - stringWidth(line)) / 2))) + line)
    .join('\n');
  return applyThemeColor(getAttr(tag, 'color'), context.theme.center?.color, aligned);
});
