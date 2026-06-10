import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const address = blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.address?.color, value),
);
