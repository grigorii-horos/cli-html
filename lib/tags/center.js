import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';
import { alignLines } from '../utils/align.js';

export const center = blockTag((value, tag, context) => {
  // Center each line within the available line width, not just the longest line
  const aligned = alignLines(value, 'center', context.lineWidth);
  return applyThemeColor(getAttr(tag, 'color'), context.theme.center?.color, aligned);
});
