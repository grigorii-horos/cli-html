import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';

export const img = (tag, context) => {
  const text = getAttribute(tag, 'alt', null)
    || getAttribute(tag, 'title', null)
    || 'Image';

  const indicatorMarker = getAttr(tag, 'indicator.marker') || context.theme.img?.indicator?.marker || '!';
  const prefixMarker = getAttr(tag, 'prefix.marker') || context.theme.img?.prefix?.marker || '[';
  const suffixMarker = getAttr(tag, 'suffix.marker') || context.theme.img?.suffix?.marker || ']';

  const indicatorColorSpec = getAttr(tag, 'indicator.color') ?? context.theme.img?.indicator?.color;
  const prefixColorSpec = getAttr(tag, 'prefix.color') ?? context.theme.img?.prefix?.color;
  const suffixColorSpec = getAttr(tag, 'suffix.color') ?? context.theme.img?.suffix?.color;
  const textColorSpec = getAttr(tag, 'alt.color') ?? context.theme.img?.alt?.color;

  return {
    pre: null,
    value: `${applyColor(indicatorColorSpec, indicatorMarker)}${applyColor(prefixColorSpec, prefixMarker)}${applyColor(textColorSpec, text)}${applyColor(suffixColorSpec, suffixMarker)}`,
    post: null,
    type: 'inline',
  };
};
