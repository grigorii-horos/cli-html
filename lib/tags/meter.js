import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';

/**
 * Meter element - represents a scalar measurement within a known range
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {object} - Rendered meter
 */
const parseNumber = (value, fallback) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : fallback;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getRegion = (value, low, high) => {
  if (value < low) return 'low';
  if (value > high) return 'high';
  return 'medium';
};

// Which theme range to use for a value region, depending on where the optimum is
// (HTML spec: the region containing `optimum` is the good one)
const REGION_STYLES = {
  high: { low: 'low', medium: 'medium', high: 'high' },
  low: { low: 'high', medium: 'medium', high: 'low' },
  medium: { low: 'medium', medium: 'high', high: 'medium' },
};

/**
 * Meter element - represents a scalar measurement within a known range
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {object} - Rendered meter
 */
export const meter = (tag, context) => {
  return inlineTag(() => {
    const meterConfig = context.theme.meter;

    // Sanitize attributes like browsers do: max >= min, low/high/value within range
    const min = parseNumber(getAttribute(tag, 'min', null), 0);
    const max = Math.max(min, parseNumber(getAttribute(tag, 'max', null), 100));
    const range = max - min;
    const value = clamp(parseNumber(getAttribute(tag, 'value', null), 0), min, max);
    const lowThreshold = meterConfig?.ranges?.low?.threshold;
    const highThreshold = meterConfig?.ranges?.medium?.threshold;
    const low = clamp(parseNumber(getAttribute(tag, 'low', null), min + (range * lowThreshold)), min, max);
    const high = clamp(parseNumber(getAttribute(tag, 'high', null), min + (range * highThreshold)), low, max);
    const optimumAttribute = getAttribute(tag, 'optimum', null);
    const optimum = optimumAttribute === null ? max : clamp(parseNumber(optimumAttribute, max), min, max);

    const width = parseNumber(getAttr(tag, 'width'), meterConfig?.width ?? Math.floor(context.lineWidth * 0.3));
    const clampedWidth = clamp(Math.round(width), 10, 60);

    const ratio = range > 0 ? (value - min) / range : 1;
    const percentage = ratio * 100;
    const filledWidth = Math.round(ratio * clampedWidth);

    const rangeType = REGION_STYLES[getRegion(optimum, low, high)][getRegion(value, low, high)];

    // Get range configuration
    const rangeConfig = meterConfig?.ranges?.[rangeType];
    const filledMarker = rangeConfig?.marker;
    const filledColorSpec = rangeConfig?.color;

    // Get empty configuration
    const emptyConfig = meterConfig?.empty;
    const emptyMarker = emptyConfig?.marker;
    const emptyColorSpec = emptyConfig?.color;

    // Build meter bar
    const filled = filledMarker.repeat(filledWidth);
    const empty = emptyMarker.repeat(clampedWidth - filledWidth);

    const styledFilled = applyColor(filledColorSpec, filled);
    const styledEmpty = applyColor(emptyColorSpec, empty);

    const bar = `[${styledFilled}${styledEmpty}]`;

    // Labels
    const labelsConfig = meterConfig?.labels;
    const customLabelsEnabled = getAttr(tag, 'labels.enabled');
    const showLabels = customLabelsEnabled !== null
      ? customLabelsEnabled === 'true'
      : labelsConfig?.enabled !== false;

    if (!showLabels) {
      return bar;
    }

    // Format label
    const format = getAttr(tag, 'labels.format') ?? labelsConfig?.format;
    const label = format
      .replaceAll('%v', String(value))
      .replaceAll('%m', String(max))
      .replaceAll('%n', String(min))
      .replaceAll('%%', String(Math.round(percentage)));

    const labelColorSpec = getAttr(tag, 'labels.color') ?? labelsConfig?.color;
    const styledLabel = applyColor(labelColorSpec, label);
    const position = getAttr(tag, 'labels.position') ?? labelsConfig?.position;

    return position === 'left' ? `${styledLabel} ${bar}` : `${bar} ${styledLabel}`;
  })(tag, context);
};
