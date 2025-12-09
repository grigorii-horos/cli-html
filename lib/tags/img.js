import chalkString from 'chalk-string';

import { getAttribute, getCustomAttributes } from '../utilities.js';

export const img = (tag, context) => {
  const custom = getCustomAttributes(tag);

  const text = getAttribute(tag, 'alt', null)
    || getAttribute(tag, 'title', null)
    || 'Image';

  const prefixMarker = custom.prefixMarker || context.theme.img.prefix.marker || '!';
  const openMarker = custom.openMarker || context.theme.img.open.marker || '[';
  const closeMarker = custom.closeMarker || context.theme.img.close.marker || ']';

  const prefixColorFn = custom.prefixColor
    ? (text) => chalkString(custom.prefixColor, { colors: true })(text)
    : context.theme.img.prefix.color;

  const openColorFn = custom.openColor
    ? (text) => chalkString(custom.openColor, { colors: true })(text)
    : context.theme.img.open.color;

  const closeColorFn = custom.closeColor
    ? (text) => chalkString(custom.closeColor, { colors: true })(text)
    : context.theme.img.close.color;

  const textColorFn = custom.textColor
    ? (text) => chalkString(custom.textColor, { colors: true })(text)
    : context.theme.img.text.color;

  return {
    pre: null,
    value: `${prefixColorFn(prefixMarker)}${openColorFn(openMarker)}${textColorFn(text)}${closeColorFn(closeMarker)}`,
    post: null,
    type: 'inline',
  };
};
