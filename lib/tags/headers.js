import stringWidth from 'string-width';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';
import { indentify } from '../utilities.js';

const getMarker = (level, defaultMarker, tag, context) =>
  getAttr(tag, 'indicator.marker') ?? context.theme[`h${level}`]?.indicator?.marker ?? defaultMarker;

const createHeader = (level, defaultMarker) => (tag, context) => {
  // Wrap the text to the width left after the marker, and align continuation lines with it
  const markerWidth = stringWidth(getMarker(level, defaultMarker, tag, context) ?? '') + 1;

  return blockTag(
    (value, _tag, context_) => {
      const themeConfig = context_.theme[`h${level}`];

      const styledMarker = applyThemeColor(
        getAttr(tag, 'indicator.color'),
        themeConfig?.indicator?.color,
        getMarker(level, defaultMarker, tag, context_),
      );
      const styledText = applyThemeColor(
        getAttr(tag, 'color'),
        themeConfig?.color,
        value,
      );

      return `${styledMarker} ${indentify(' '.repeat(markerWidth), true)(styledText)}`;
    },
    {
      marginTop: 1,
      marginBottom: 1,
    },
  )(tag, { ...context, lineWidth: Math.max(1, context.lineWidth - markerWidth) });
};

export const h1 = createHeader(1, '#');
export const h2 = createHeader(2, '##');
export const h3 = createHeader(3, '###');
export const h4 = createHeader(4, '####');
export const h5 = createHeader(5, '#####');
export const h6 = createHeader(6, '######');
