import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, validateNumber } from '../utilities.js';
import { markerToAscii } from '../utils/string.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Parse numeric attribute from tag with validation
 * @param {object} tag - HTML tag
 * @param {string} attributeName - Attribute name
 * @param {number} defaultValue - Default value if invalid
 * @returns {number} - Parsed and validated number
 */
const parseNumericAttribute = (tag, attributeName, defaultValue = 0) => {
  const attributeValue = getAttribute(tag, attributeName, null);
  if (attributeValue === null || attributeValue === undefined || attributeValue === '') {
    return defaultValue;
  }
  return validateNumber(attributeValue, -Infinity, Infinity, defaultValue);
};

/**
 * Calculate adaptive bar length based on context and custom attributes
 * @param {object} context - Rendering context with lineWidth
 * @param {object} custom - Custom attributes
 * @returns {number} - Bar length in characters (min 1, max lineWidth)
 */
const getBarLength = (context, custom) => {
  const MIN_WIDTH = 1;
  const DEFAULT_MIN = 10;
  const DEFAULT_MAX = 60;
  const DEFAULT_PERCENTAGE = 0.3;

  // Validate context
  if (!context || typeof context.lineWidth !== 'number' || context.lineWidth < 1) {
    return DEFAULT_MIN; // Fallback to safe default
  }

  const maxAllowed = Math.max(MIN_WIDTH, context.lineWidth);

  // Custom width takes priority
  if (custom && custom.width) {
    const parsed = validateNumber(custom.width, MIN_WIDTH, maxAllowed, null);
    if (parsed !== null) {
      return parsed;
    }
  }

  // Theme width
  const themeWidth = context.theme?.progress?.width;
  if (themeWidth !== null && themeWidth !== undefined) {
    const validated = validateNumber(themeWidth, MIN_WIDTH, maxAllowed, null);
    if (validated !== null) {
      return validated;
    }
  }

  // Adaptive: 30% of lineWidth, min 10, max 60 (but never exceed lineWidth)
  const adaptive = Math.floor(context.lineWidth * DEFAULT_PERCENTAGE);
  const minWidth = Math.min(DEFAULT_MIN, maxAllowed);
  const maxWidth = Math.min(DEFAULT_MAX, maxAllowed);

  return Math.max(minWidth, Math.min(maxWidth, adaptive));
};

export const progress = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const current = parseNumericAttribute(tag, 'value', 0);
  const maxValue = parseNumericAttribute(tag, 'max', 1);

  const barLength = getBarLength(context, custom);
  const ratio = clamp(current / maxValue, 0, 1);
  const filled = Math.round(ratio * barLength);
  const empty = barLength - filled;

  const baseFilledMarker = custom.filled.marker || context.theme.progress.filled.marker || '█';
  const baseEmptyMarker = custom.empty.marker || context.theme.progress.empty.marker || '█';

  // Apply ASCII conversion if ASCII mode is enabled
  const filledMarker = markerToAscii(baseFilledMarker, context.asciiMode);
  const emptyMarker = markerToAscii(baseEmptyMarker, context.asciiMode);

  const filledColorFunction = custom.filled.color
    ? (text) => chalkString(custom.filled.color, { colors: true })(text)
    : context.theme.progress.filled.color;

  const emptyColorFunction = custom.empty.color
    ? (text) => chalkString(custom.empty.color, { colors: true })(text)
    : context.theme.progress.empty.color;

  return ` ${filledColorFunction(filledMarker.repeat(filled))}${emptyColorFunction(emptyMarker.repeat(empty))}`;
});
