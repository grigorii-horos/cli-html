import { Chalk } from 'chalk';
import ColorNamer from 'color-namer';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utils.js';

const customChalk = new Chalk({ level: 1 });

export const font = inlineTag((value, tag, context) => {
  const color = getAttribute(tag, 'color', 'white');
  const names = ColorNamer(color, {
    pick: ['basic'],
  });

  if (context.fontAttrs) {
    return customChalk.hex(names.basic[0].hex)(value);
  }

  return (value);
});
