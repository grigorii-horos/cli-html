import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getCustomAttributes, getAttribute } from '../utilities.js';

// Helper function to create header
const createHeader = (level, defaultMarker) => blockTag(
  (value, tag, context) => {
    const custom = getCustomAttributes(tag);
    const themeConfig = context.theme[`h${level}`];

    // Get marker from custom attributes or theme indicator
    const marker = custom.marker === null
      ? (themeConfig.indicator?.marker || defaultMarker)
      : custom.marker;

    // Get color function for text
    const textColorFunction = custom.color
      ? (text) => chalkString(custom.color, { colors: true })(text)
      : themeConfig.color;

    // Get color function for marker/indicator
    const markerColorFunction = custom.markerColor
      ? (text) => chalkString(custom.markerColor, { colors: true })(text)
      : themeConfig.indicator?.color;

    // Style marker and text
    const styledMarker = markerColorFunction ? markerColorFunction(marker) : marker;
    const styledText = textColorFunction ? textColorFunction(value) : value;

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
