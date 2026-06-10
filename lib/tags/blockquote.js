import { blockTag } from "../tag-helpers/block-tag.js";
import { indentify } from "../utilities.js";
import { markerToAscii } from "../utils/string.js";
import { getAttr } from "../core/attr.js";
import { applyColor, applyThemeColor } from "../core/color.js";

/**
 * Get blockquote indicator by depth (cycles through indicators array)
 * @param {number} depth - Blockquote nesting depth (0-based)
 * @param {Array} indicators - Array of indicator configurations
 * @param {boolean} asciiMode - Whether ASCII mode is enabled
 * @returns {object} - Indicator configuration {marker, color}
 */
const getBlockquoteIndicator = (depth, indicators, asciiMode) => {
  if (!indicators || !Array.isArray(indicators) || indicators.length === 0) {
    // Fallback to undefined - config.yaml always provides indicators via deepMerge
    return {
      marker: undefined,
      color: undefined,
    };
  }

  // Cycle through indicators based on depth
  const index = depth % indicators.length;
  const indicator = indicators[index];

  return {
    marker: markerToAscii(indicator.marker, asciiMode),
    color: indicator.color,
  };
};

export const blockquote = (tag, context) => {
  // Track blockquote depth (start from 0)
  const blockquoteDepth = context.blockquoteDepth === undefined ? 0 : context.blockquoteDepth;

  // Get indicators array from theme
  const indicators = context.theme.blockquote?.indicators;

  // Get indicator for current depth
  const indicatorConfig = getBlockquoteIndicator(blockquoteDepth, indicators, context.asciiMode);

  // Custom marker/color overrides
  const marker = getAttr(tag, 'indicator.marker') ?? indicatorConfig.marker;
  const styledMarker = applyThemeColor(
    getAttr(tag, 'indicator.color'),
    indicatorConfig.color,
    marker
  );

  // Increment depth for nested blockquotes
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 2,
    blockquoteDepth: blockquoteDepth + 1,
  };

  return blockTag(
    indentify(styledMarker, false),
    { marginTop: 1, marginBottom: 1 }
  )(tag, newContext);
};
