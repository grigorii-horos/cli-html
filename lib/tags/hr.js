import chalkString from 'chalk-string';

import { getCustomAttributes, applyCustomColor } from '../utilities.js';
import { markerToAscii } from '../utils/string.js';

const hrLine = (inputHrString, length) => {
  const lengthHr = length || process.stdout?.columns || 80;
  return Array.from({ length: lengthHr }).join(inputHrString);
};

export const hr = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const baseMarker = custom.marker || context.theme.hr.marker || '─';

  // Apply ASCII conversion if ASCII mode is enabled
  const marker = markerToAscii(baseMarker, context.asciiMode);

  const line = hrLine(marker, context.lineWidth);
  const styledLine = applyCustomColor(custom.color, context.theme.hr.color, line, chalkString);

  return {
    marginTop: 1,
    value: styledLine,
    marginBottom: 1,
    type: 'block',
  };
};
