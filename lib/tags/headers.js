import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

const createHeader = (level, defaultMarker) => blockTag(
  (value, tag, context) => {
    const themeConfig = context.theme[`h${level}`];

    const marker = getAttr(tag, 'indicator.marker') ?? themeConfig?.indicator?.marker ?? defaultMarker;

    const styledMarker = applyThemeColor(
      getAttr(tag, 'indicator.color'),
      themeConfig?.indicator?.color,
      marker,
    );
    const styledText = applyThemeColor(
      getAttr(tag, 'color'),
      themeConfig?.color,
      value,
    );

    return `${styledMarker} ${styledText}`;
  },
  {
    marginTop: 1,
    marginBottom: 1,
  },
);

export const h1 = createHeader(1, '#');
export const h2 = createHeader(2, '##');
export const h3 = createHeader(3, '###');
export const h4 = createHeader(4, '####');
export const h5 = createHeader(5, '#####');
export const h6 = createHeader(6, '######');
