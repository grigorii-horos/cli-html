import ansiEscapes from 'ansi-escapes';
import chalkString from "chalk-string";

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getColorFromClass } from '../utilities.js';

const newStyle = (color, string) => chalkString(color, { colors: true })(string);

export const span = inlineTag((value, tag, context) => {
  const classAttributes = getAttribute(tag, 'class', '')
    ?.split(' ')
    ?.find((classAttribute) => classAttribute.startsWith('x-cli-color-'));

  const color = getColorFromClass(classAttributes);

  const text = color ? newStyle(color, value) : context.theme.span.color(value);

  return text;
});
