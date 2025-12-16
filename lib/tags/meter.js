import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes } from '../utilities.js';

/**
 * Meter element - represents a scalar measurement within a known range
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {object} - Rendered meter
 */
export const meter = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return inlineTag((textContent) => {
    // Get value, min, max, low, high, optimum from attributes
    const value = Number.parseFloat(getAttribute(tag, 'value', '0'));
    const min = Number.parseFloat(getAttribute(tag, 'min', '0'));
    const max = Number.parseFloat(getAttribute(tag, 'max', '100'));
    const low = Number.parseFloat(getAttribute(tag, 'low', String(min + (max - min) * 0.33)));
    const high = Number.parseFloat(getAttribute(tag, 'high', String(min + (max - min) * 0.66)));

    // Get width configuration
    const meterConfig = context.theme.meter;
    const width = custom.meter?.width
      ? Number.parseInt(custom.meter.width, 10)
      : (meterConfig?.width || Math.floor(context.lineWidth * 0.3));

    const clampedWidth = Math.max(10, Math.min(60, width));

    // Calculate percentage and filled width
    const range = max - min;
    const normalizedValue = Math.max(min, Math.min(max, value));
    const percentage = ((normalizedValue - min) / range) * 100;
    const filledWidth = Math.round((percentage / 100) * clampedWidth);

    // Determine which range the value falls into
    let rangeType = 'medium';
    const lowThreshold = ((low - min) / range);
    const highThreshold = ((high - min) / range);
    const valueRatio = (normalizedValue - min) / range;

    if (valueRatio < lowThreshold) {
      rangeType = 'low';
    } else if (valueRatio >= highThreshold) {
      rangeType = 'high';
    }

    // Get range configuration
    const rangeConfig = meterConfig?.ranges?.[rangeType];
    const filledMarker = rangeConfig?.marker || '█';
    const filledColorFunction = rangeConfig?.color
      ? (typeof rangeConfig.color === 'function'
          ? rangeConfig.color
          : (text) => chalkString(rangeConfig.color, { colors: true })(text))
      : (text) => text;

    // Get empty configuration
    const emptyConfig = meterConfig?.empty;
    const emptyMarker = emptyConfig?.marker || '░';
    const emptyColorFunction = emptyConfig?.color
      ? (typeof emptyConfig.color === 'function'
          ? emptyConfig.color
          : (text) => chalkString(emptyConfig.color, { colors: true })(text))
      : (text) => text;

    // Build meter bar
    const filled = filledMarker.repeat(Math.max(0, filledWidth));
    const empty = emptyMarker.repeat(Math.max(0, clampedWidth - filledWidth));

    const styledFilled = filledColorFunction(filled);
    const styledEmpty = emptyColorFunction(empty);

    const bar = `[${styledFilled}${styledEmpty}]`;

    // Labels
    const labelsConfig = meterConfig?.labels;
    const showLabels = labelsConfig?.enabled !== false;

    if (!showLabels) {
      return bar;
    }

    // Format label
    const format = labelsConfig?.format || '%v/%m';
    const label = format
      .replace('%v', String(value))
      .replace('%m', String(max))
      .replace('%n', String(min))
      .replace('%%', String(Math.round(percentage)));

    const labelColorFunction = labelsConfig?.color
      ? (typeof labelsConfig.color === 'function'
          ? labelsConfig.color
          : (text) => chalkString(labelsConfig.color, { colors: true })(text))
      : (text) => text;

    const styledLabel = labelColorFunction(label);
    const position = labelsConfig?.position || 'right';

    if (position === 'left') {
      return styledLabel + ' ' + bar;
    } else { // right
      return bar + ' ' + styledLabel;
    }
  })(tag, context);
};
