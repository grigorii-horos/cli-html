import chalkString from 'chalk-string';

import { getAttribute, getCustomAttributes } from '../utilities.js';

export const img = (tag, context) => {
  const custom = getCustomAttributes(tag);

  const text = getAttribute(tag, 'alt', null)
    || getAttribute(tag, 'title', null)
    || 'Image';

  const indicatorMarker = custom.indicatorMarker || context.theme.img.indicator.marker || '!';
  const prefixMarker = custom.prefixMarker || context.theme.img.prefix.marker || '[';
  const suffixMarker = custom.suffixMarker || context.theme.img.suffix.marker || ']';

  const indicatorColorFunction = custom.indicatorColor
    ? (text) => chalkString(custom.indicatorColor, { colors: true })(text)
    : context.theme.img.indicator.color;

  const prefixColorFunction = custom.prefixColor
    ? (text) => chalkString(custom.prefixColor, { colors: true })(text)
    : context.theme.img.prefix.color;

  const suffixColorFunction = custom.suffixColor
    ? (text) => chalkString(custom.suffixColor, { colors: true })(text)
    : context.theme.img.suffix.color;

  const textColorFunction = custom.alt?.color
    ? (text) => chalkString(custom.alt.color, { colors: true })(text)
    : context.theme.img.alt?.color;

  return {
    pre: null,
    value: `${indicatorColorFunction(indicatorMarker)}${prefixColorFunction(prefixMarker)}${textColorFunction(text)}${suffixColorFunction(suffixMarker)}`,
    post: null,
    type: 'inline',
  };
};
