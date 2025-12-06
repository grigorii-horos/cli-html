import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';

const BAR_LENGTH = 20;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const parseNumericAttribute = (tag, attributeName) => {
  const parsed = Number.parseFloat(getAttribute(tag, attributeName, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const progress = inlineTag((value, tag, context) => {
  const current = parseNumericAttribute(tag, 'value');
  const maxValue = parseNumericAttribute(tag, 'max') || 1;

  const ratio = clamp(current / maxValue, 0, 1);
  const filled = Math.round(ratio * BAR_LENGTH);
  const empty = BAR_LENGTH - filled;

  const filledMarker = context.theme.progress.filled.marker ?? '█';
  const emptyMarker = context.theme.progress.empty.marker ?? '█';

  return ` ${context.theme.progress.filled.color(filledMarker.repeat(filled))}${context.theme.progress.empty.color(emptyMarker.repeat(empty))}`;
});

export const meter = inlineTag((value, tag, context) => {
  const currentValue = parseNumericAttribute(tag, 'value');
  const minValue = parseNumericAttribute(tag, 'min') || 0;
  const maxValue = parseNumericAttribute(tag, 'max') || 1;
  const low = parseNumericAttribute(tag, 'low');
  const high = parseNumericAttribute(tag, 'high');
  const optimum = parseNumericAttribute(tag, 'optimum');

  const range = maxValue - minValue;
  const ratio = range > 0 ? clamp((currentValue - minValue) / range, 0, 1) : 0;
  const filled = Math.round(ratio * BAR_LENGTH);
  const empty = BAR_LENGTH - filled;

  // Determine color based on value and thresholds
  // For now, use the same styling as progress
  // Could be extended with low/high/optimum logic for different colors
  const filledMarker = context.theme.progress.filled.marker ?? '█';
  const emptyMarker = context.theme.progress.empty.marker ?? '█';

  return ` ${context.theme.progress.filled.color(filledMarker.repeat(filled))}${context.theme.progress.empty.color(emptyMarker.repeat(empty))}`;
});
