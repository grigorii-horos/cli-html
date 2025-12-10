import chalkString from "chalk-string";

import { blockTag } from "../tag-helpers/block-tag.js";
import { getCustomAttributes, applyCustomColor, indentify } from "../utilities.js";
import { markerToAscii } from "../utils/string.js";

export const blockquote = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const baseMarker = custom.marker || context.theme.blockquote.indicator?.marker || "│ ";

  // Apply ASCII conversion if ASCII mode is enabled
  const marker = markerToAscii(baseMarker, context.asciiMode);

  const styledMarker = applyCustomColor(
    custom.markerColor,
    context.theme.blockquote.indicator?.color,
    marker,
    chalkString
  );

  return blockTag(
    indentify(styledMarker, false),
    { marginTop: 1, marginBottom: 1 }
  )(tag, { ...context, lineWidth: context.lineWidth - 2 });
};
