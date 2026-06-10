import ansiAlign from 'ansi-align';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const center = blockTag((value, tag, context) => {
  const aligned = ansiAlign(value, { align: 'center' });
  return applyThemeColor(getAttr(tag, 'color'), context.theme.center?.color, aligned);
});
