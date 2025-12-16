import chalkString from "chalk-string";

import { blockTag } from "../tag-helpers/block-tag.js";
import { getCustomAttributes, applyCustomColor, indentify } from "../utilities.js";
import { markerToAscii } from "../utils/string.js";

/**
 * Get blockquote indicator by depth (cycles through indicators array)
 * @param {number} depth - Blockquote nesting depth (0-based)
 * @param {Array} indicators - Array of indicator configurations
 * @param {boolean} asciiMode - Whether ASCII mode is enabled
 * @returns {object} - Indicator configuration {marker, color}
 */
const getBlockquoteIndicator = (depth, indicators, asciiMode) => {
  if (!indicators || !Array.isArray(indicators) || indicators.length === 0) {
    // Fallback to default if no indicators array
    return {
      marker: markerToAscii("│ ", asciiMode),
      color: "blue",
    };
  }

  // Cycle through indicators based on depth
  const index = depth % indicators.length;
  const indicator = indicators[index];

  return {
    marker: markerToAscii(indicator.marker || "│ ", asciiMode),
    color: indicator.color || "blue",
  };
};

export const blockquote = (tag, context) => {
  const custom = getCustomAttributes(tag);

  // Track blockquote depth (start from 0)
  const blockquoteDepth = context.blockquoteDepth === undefined ? 0 : context.blockquoteDepth;

  // Get indicators array from theme
  const indicators = context.theme.blockquote?.indicators;

  // Get indicator for current depth
  const indicatorConfig = getBlockquoteIndicator(blockquoteDepth, indicators, context.asciiMode);

  // Custom marker/color overrides
  const marker = custom.marker || indicatorConfig.marker;
  const styledMarker = applyCustomColor(
    custom.markerColor,
    (text) => chalkString(indicatorConfig.color, { colors: true })(text),
    marker,
    chalkString
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
