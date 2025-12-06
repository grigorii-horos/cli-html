import inlineTag from '../tag-helpers/inline-tag.js';

const noStyle = inlineTag();

export const q = inlineTag((value) => `"${value}"`);

export const del = inlineTag((value, tag, context) => context.theme.del.color(value));
export const ins = inlineTag((value, tag, context) => context.theme.ins.color(value));
export const italic = inlineTag((value, tag, context) => context.theme.italic.color(value));
export const strikethrough = inlineTag((value, tag, context) => context.theme.strike.color(value));
export const underline = inlineTag((value, tag, context) => context.theme.underline.color(value));
export const bold = inlineTag((value, tag, context) => context.theme.bold.color(value));
export const samp = inlineTag((value, tag, context) => context.theme.samp.color(value));
export const kbd = inlineTag((value, tag, context) => context.theme.kbd.color(value));
export const variableTag = inlineTag((value, tag, context) => context.theme.var.color(value));
export const mark = inlineTag((value, tag, context) => context.theme.mark.color(value));

export const b = bold;

export const s = strikethrough;
export const strike = strikethrough;

// eslint-disable-next-line unicorn/prevent-abbreviations
export const i = inlineTag((value, tag, context) => context.theme.i.color(value));
export const em = inlineTag((value, tag, context) => context.theme.em.color(value));
export const cite = inlineTag((value, tag, context) => context.theme.cite.color(value));

export const time = inlineTag((value, tag, context) => context.theme.time.color(value));

export const strong = bold;

export const u = underline;

export const small = noStyle;
export const big = noStyle;
export const sub = noStyle;
export const sup = noStyle;
export const tt = noStyle;
export const data = noStyle;
export const wbr = noStyle;
export const font = noStyle;

// Bidirectional text
export const bdi = noStyle; // Isolates text that might be formatted in a different direction
export const bdo = noStyle; // Overrides text direction

// Obsolete tags (kept for compatibility)
export const nobr = noStyle; // No line breaks
export const marquee = noStyle; // Scrolling text (obsolete)
