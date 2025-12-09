import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getCustomAttributes, getAttribute } from '../utilities.js';

// Helper function to create header
const createHeader = (level, defaultMarker) => blockTag(
  (value, tag, context) => {
    const custom = getCustomAttributes(tag);
    const themeConfig = context.theme[`h${level}`];
    const marker = custom.marker !== null ? custom.marker : (themeConfig.marker || defaultMarker);

    const colorFn = custom.color
      ? (text) => chalkString(custom.color, { colors: true })(text)
      : themeConfig.color;

    const result = `${marker} ${value}`;

    // Apply color to the entire header (marker + space + text) for continuous styling
    return colorFn(result);
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
