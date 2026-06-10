import ansiEscapes from 'ansi-escapes';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const span = inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.span?.color, value),
);
