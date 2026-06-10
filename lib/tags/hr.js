import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';
import { markerToAscii } from '../utils/string.js';

const HR_STYLES = {
  single: '─',
  double: '═',
  bold: '━',
  dashed: '╌',
  dotted: '·',
};

const hrLine = (marker, length) => {
  const len = length || process.stdout?.columns || 80;
  return marker.repeat(len);
};

export const hr = (tag, context) => {
  const theme = context.theme.hr || {};

  // Precedence: data-cli-marker > data-cli-style preset > theme.marker > theme.style preset > single
  const customMarker = getAttr(tag, 'marker');
  const customStyle = getAttr(tag, 'style');
  const themeMarker = theme.marker !== '' ? theme.marker : null; // treat empty string as unset
  const themeStyle = theme.style;

  let baseMarker;
  if (customMarker) {
    baseMarker = customMarker;
  } else if (customStyle) {
    baseMarker = HR_STYLES[customStyle] ?? HR_STYLES.single;
  } else if (themeMarker) {
    baseMarker = themeMarker;
  } else {
    baseMarker = HR_STYLES[themeStyle] ?? HR_STYLES.single;
  }

  const marker = markerToAscii(baseMarker, context.asciiMode);
  const line = hrLine(marker, context.lineWidth);
  const styledLine = applyThemeColor(getAttr(tag, 'color'), theme.color, line);

  return {
    marginTop: 1,
    value: styledLine,
    marginBottom: 1,
    type: 'block',
  };
};
