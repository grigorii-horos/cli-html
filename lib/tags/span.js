import ansiEscapes from 'ansi-escapes';
import chalkString from 'chalk-string';
import { stdout } from 'supports-hyperlinks';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getColorFromClass } from '../utils.js';

const newStyle = chalkString();

export const span = inlineTag((value, tag, context) => {
  const classAttributes = getAttribute(tag, 'class', '')
    ?.split(' ')
    ?.find((classAttribute) => classAttribute.startsWith('x-cli-color-'));

  const color = getColorFromClass(classAttributes);

  const text = color ? newStyle(color, value) : context.theme.a(value);

  return text;
});
