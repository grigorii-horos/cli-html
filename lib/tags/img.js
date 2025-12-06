import { getAttribute } from '../utilities.js';

export const img = (tag, context) => {
  const text = getAttribute(tag, 'alt', null)
    || getAttribute(tag, 'title', null)
    || 'Image';

  const prefixMarker = context.theme.img.prefix.marker || '!';
  const openMarker = context.theme.img.open.marker || '[';
  const closeMarker = context.theme.img.close.marker || ']';

  return {
    pre: null,
    value: `${context.theme.img.prefix.color(prefixMarker)}${context.theme.img.open.color(openMarker)}${context.theme.img.text.color(text)}${context.theme.img.close.color(closeMarker)}`,
    post: null,
    type: 'inline',
  };
};
