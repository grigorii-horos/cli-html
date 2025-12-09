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
  const attrValue = getAttribute(tag, attributeName, null);
  if (attrValue === null || attrValue === undefined || attrValue === '') {
    return defaultValue;
  }
  return validateNumber(attrValue, -Infinity, Infinity, defaultValue);
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
  const current = parseNumericAttribute(tag, 'value');
  const maxValue = parseNumericAttribute(tag, 'max') || 1;

  const barLength = getBarLength(context, custom);
  const ratio = clamp(current / maxValue, 0, 1);
  const filled = Math.round(ratio * barLength);
  const empty = barLength - filled;

  const baseFilledMarker = custom.filledMarker || context.theme.progress.filled.marker || '█';
  const baseEmptyMarker = custom.emptyMarker || context.theme.progress.empty.marker || '█';

  // Apply ASCII conversion if ASCII mode is enabled
  const filledMarker = markerToAscii(baseFilledMarker, context.asciiMode);
  const emptyMarker = markerToAscii(baseEmptyMarker, context.asciiMode);

  const filledColorFn = custom.filledColor
    ? (text) => chalkString(custom.filledColor, { colors: true })(text)
    : context.theme.progress.filled.color;

  const emptyColorFn = custom.emptyColor
    ? (text) => chalkString(custom.emptyColor, { colors: true })(text)
    : context.theme.progress.empty.color;

  return ` ${filledColorFn(filledMarker.repeat(filled))}${emptyColorFn(emptyMarker.repeat(empty))}`;
});

export const meter = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const currentValue = parseNumericAttribute(tag, 'value');
  const minValue = parseNumericAttribute(tag, 'min') || 0;
  const maxValue = parseNumericAttribute(tag, 'max') || 1;
  const low = parseNumericAttribute(tag, 'low');
  const high = parseNumericAttribute(tag, 'high');
  const optimum = parseNumericAttribute(tag, 'optimum');

  const barLength = getBarLength(context, custom);
  const range = maxValue - minValue;
  const ratio = range > 0 ? clamp((currentValue - minValue) / range, 0, 1) : 0;
  const filled = Math.round(ratio * barLength);
  const empty = barLength - filled;

  // Determine color based on value and thresholds
  // For now, use the same styling as progress
  // Could be extended with low/high/optimum logic for different colors
  const baseFilledMarker = custom.filledMarker || context.theme.progress.filled.marker || '█';
  const baseEmptyMarker = custom.emptyMarker || context.theme.progress.empty.marker || '█';

  // Apply ASCII conversion if ASCII mode is enabled
  const filledMarker = markerToAscii(baseFilledMarker, context.asciiMode);
  const emptyMarker = markerToAscii(baseEmptyMarker, context.asciiMode);

  const filledColorFn = custom.filledColor
    ? (text) => chalkString(custom.filledColor, { colors: true })(text)
    : context.theme.progress.filled.color;

  const emptyColorFn = custom.emptyColor
    ? (text) => chalkString(custom.emptyColor, { colors: true })(text)
    : context.theme.progress.empty.color;

  return ` ${filledColorFn(filledMarker.repeat(filled))}${emptyColorFn(emptyMarker.repeat(empty))}`;
});
