import chalk from 'chalk';

import inlineTag from '../tag-helpers/inline-tag.js';

const noStyle = inlineTag();

export const q = inlineTag((value) => `"${value}"`);

export const del = inlineTag((value) => chalk.bgRed.black(value));
export const ins = inlineTag((value) => chalk.bgGreen.black(value));
export const italic = inlineTag((value) => chalk.italic(value));
export const strikethrough = inlineTag((value) => chalk.strikethrough(value));
export const underline = inlineTag((value) => chalk.underline(value));
export const bold = inlineTag((value) => chalk.bold(value));
export const samp = inlineTag((value) => chalk.yellowBright(value));
export const kbd = inlineTag((value) => chalk.bgBlack(value));
export const variableTag = inlineTag((value) => chalk.blue.italic(value));
export const mark = inlineTag((value) => chalk.bgYellow.black(value));

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
export const data = noStyle;
export const wbr = noStyle;
