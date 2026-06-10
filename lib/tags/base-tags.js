import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

// Helper to create colored block element
const createColoredBlock = (themeName) => blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme[themeName]?.color, value),
);

// Helper to create colored inline element
const createColoredInline = (themeName) => inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme[themeName]?.color, value),
);

// Paragraph with margins
export const p = blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.p?.color, value),
{ marginTop: 1, marginBottom: 1 });

// Inline elements - each uses its own theme
export const label = createColoredInline('label');
export const blink = createColoredInline('blink');

// Block container elements - each uses its own theme
export const div = createColoredBlock('div');
export const header = createColoredBlock('header');
export const article = createColoredBlock('article');
export const footer = createColoredBlock('footer');
export const section = createColoredBlock('section');
export const main = createColoredBlock('main');
export const nav = createColoredBlock('nav');
export const aside = createColoredBlock('aside');
export const form = createColoredBlock('form');
export const picture = createColoredBlock('picture');
export const hgroup = createColoredBlock('hgroup');

// figcaption is now handled internally by figure.js (similar to table/caption)
// export moved to lib/tags/figure.js
