import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getCustomAttributes, applyCustomColor } from '../utilities.js';

const block = blockTag();

const colorableBlock = blockTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  return applyCustomColor(custom.color, context.theme.span.color, value, chalkString);
});

const inline = inlineTag();

const colorableInline = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  return applyCustomColor(custom.color, context.theme.span.color, value, chalkString);
});

const coloredParagraph = blockTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const themeColor = context.theme.p?.color ?? context.theme.span.color;
  return applyCustomColor(custom.color, themeColor, value, chalkString);
}, { marginTop: 1, marginBottom: 1 });

export const label = colorableInline;
export const blink = colorableInline;

export const p = coloredParagraph;

export const div = colorableBlock;
export const header = colorableBlock;
export const article = colorableBlock;
export const footer = colorableBlock;
export const section = colorableBlock;
export const main = colorableBlock;
export const nav = colorableBlock;
export const aside = colorableBlock;
export const form = colorableBlock;
export const picture = colorableBlock;
export const hgroup = colorableBlock;

// figcaption is now handled internally by figure.js (similar to table/caption)
// export moved to lib/tags/figure.js

export const dialog = colorableBlock;
