import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getCustomAttributes, getAttribute } from '../utilities.js';

// Helper function to create header
const createHeader = (level, defaultMarker) => blockTag(
  (value, tag, context) => {
    const custom = getCustomAttributes(tag);
    const themeConfig = context.theme[`h${level}`];

    // Get marker from custom attributes or theme indicator
    const marker = custom.marker !== null
      ? custom.marker
      : (themeConfig.indicator?.marker || defaultMarker);

    // Get color function for text
    const textColorFn = custom.color
      ? (text) => chalkString(custom.color, { colors: true })(text)
      : themeConfig.color;

    // Get color function for marker/indicator
    const markerColorFn = custom.markerColor
      ? (text) => chalkString(custom.markerColor, { colors: true })(text)
      : themeConfig.indicator?.color;

    // Style marker and text
    const styledMarker = markerColorFn ? markerColorFn(marker) : marker;
    const styledText = textColorFn ? textColorFn(value) : value;

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
