import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';

const getMediaTitle = (tag, fallback) => {
  const title = getAttribute(tag, 'title', null);
  if (title) return title;
  const src = getAttribute(tag, 'src', null);
  if (src) return src.split('/').pop();
  return fallback;
};

const createMediaTag = (themeKey, fallback) => (tag, context) => {
  const title = getMediaTitle(tag, fallback);
  const theme = context.theme[themeKey] || {};

  const indicatorMarker = getAttr(tag, 'indicator.marker') ?? theme.indicator?.marker;
  const prefixMarker = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker;
  const suffixMarker = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker;

  const indicatorColor = getAttr(tag, 'indicator.color') ?? theme.indicator?.color;
  const prefixColor = getAttr(tag, 'prefix.color') ?? theme.prefix?.color;
  const suffixColor = getAttr(tag, 'suffix.color') ?? theme.suffix?.color;
  const titleColor = getAttr(tag, 'title.color') ?? theme.title?.color;

  return {
    pre: null,
    value: `${applyColor(indicatorColor, indicatorMarker)}${applyColor(prefixColor, prefixMarker)}${applyColor(titleColor, title)}${applyColor(suffixColor, suffixMarker)}`,
    post: null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
};

export const video = createMediaTag('video', 'Video');
export const audio = createMediaTag('audio', 'Audio');
