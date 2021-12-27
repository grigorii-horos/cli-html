import ansiColors from 'ansi-colors';
import inlineTag from '../tag-helpers/inlineTag.js';

const noStyle = inlineTag();

export const q = inlineTag((value) => `"${value}"`);

export const del = inlineTag((value) => ansiColors.bgRed.black(value));
export const ins = inlineTag((value) => ansiColors.bgGreen.black(value));
export const italic = inlineTag((value) => ansiColors.italic(value));
export const strikethrough = inlineTag((value) => ansiColors.strikethrough(value));
export const underline = inlineTag((value) => ansiColors.underline(value));
export const bold = inlineTag((value) => ansiColors.bold(value));
export const samp = inlineTag((value) => ansiColors.grey(value));
export const kbd = inlineTag((value) => ansiColors.white.bgBlack(value));
export const variableTag = inlineTag((value) => ansiColors.green(value));
export const mark = inlineTag((value) => ansiColors.bgYellow.black(value));

export const b = bold;

export const s = strikethrough;
export const strike = strikethrough;

export const em = italic;
export const i = italic;
export const cite = italic;

export const strong = bold;

export const u = underline;

export const small = noStyle;
export const big = noStyle;
export const sub = noStyle;
export const sup = noStyle;
export const time = noStyle;
export const tt = noStyle;
export const font = noStyle;
export const data = noStyle;
export const wbr = noStyle;
