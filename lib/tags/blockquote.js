import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute, getColorFromClass, indentify } from '../utils.js';

const newStyle = chalkString();

export const blockquote = (tag, context) => {
  const classAttributes = getAttribute(tag, 'class', '')
    ?.split(' ')
    ?.find((classAttribute) => classAttribute.startsWith('x-cli-color-'));

  const color = getColorFromClass(classAttributes);

  return blockTag(
    indentify(
      color ? newStyle(color, '│ ') : context.theme.blockquote('│ '),
      false,
    ),

    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 2 });
};
