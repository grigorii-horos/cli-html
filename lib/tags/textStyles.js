import ansiColors from 'ansi-colors';
import inlineTag from '../tag-helpers/inlineTag.js';

const {
  bgRed,
  bgGreen,
  italic: _italic,
  strikethrough: _strikethrough,
  underline: _underline,
  bold: _bold,
  grey,
  white,
  green,
  bgYellow,
} = ansiColors;

const noStyle = inlineTag();

export const q = inlineTag((value) => `"${value}"`);

export const del = inlineTag((value) => bgRed.black(value));
export const ins = inlineTag((value) => bgGreen.black(value));
export const italic = inlineTag((value) => _italic(value));
export const strikethrough = inlineTag((value) => _strikethrough(value));
export const underline = inlineTag((value) => _underline(value));
export const bold = inlineTag((value) => _bold(value));
export const samp = inlineTag((value) => grey(value));
export const kbd = inlineTag((value) => white.bgBlack(value));
export const variableTag = inlineTag((value) => green(value));
export const mark = inlineTag((value) => bgYellow.black(value));

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
