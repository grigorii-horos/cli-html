import inlineTag from '../tag-helpers/inline-tag.js';

const noStyle = inlineTag();

export const q = inlineTag((value) => `"${value}"`);

export const del = inlineTag((value, tag, context) => context.theme.del(value));
export const ins = inlineTag((value, tag, context) => context.theme.ins(value));
export const italic = inlineTag((value, tag, context) => context.theme.italic(value));
export const strikethrough = inlineTag((value, tag, context) => context.theme.strike(value));
export const underline = inlineTag((value, tag, context) => context.theme.underline(value));
export const bold = inlineTag((value, tag, context) => context.theme.bold(value));
export const samp = inlineTag((value, tag, context) => context.theme.samp(value));
export const kbd = inlineTag((value, tag, context) => context.theme.kbd(value));
export const variableTag = inlineTag((value, tag, context) => context.theme.var(value));
export const mark = inlineTag((value, tag, context) => context.theme.mark(value));

export const b = bold;

export const s = strikethrough;
export const strike = strikethrough;

// eslint-disable-next-line unicorn/prevent-abbreviations
export const i = inlineTag((value, tag, context) => context.theme.i(value));
export const em = inlineTag((value, tag, context) => context.theme.em(value));
export const cite = inlineTag((value, tag, context) => context.theme.cite(value));

export const time = inlineTag((value, tag, context) => context.theme.time(value));

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
