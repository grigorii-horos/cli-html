const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const noStyle = inlineTag();

const q = inlineTag((value) => `"${value}"`);

const del = inlineTag((value) => ansiStyles.bgRed.black(value));
const ins = inlineTag((value) => ansiStyles.bgGreen.black(value));
const italic = inlineTag((value) => ansiStyles.italic(value));
const strikethrough = inlineTag((value) => ansiStyles.strikethrough(value));
const underline = inlineTag((value) => ansiStyles.underline(value));
const bold = inlineTag((value) => ansiStyles.bold(value));
const samp = inlineTag((value) => ansiStyles.grey(value));
const kbd = inlineTag((value) => ansiStyles.white.bgBlack(value));
const varTag = inlineTag((value) => ansiStyles.green(value));
const mark = inlineTag((value) => ansiStyles.bgYellow.black(value));

module.exports.b = bold;

module.exports.s = strikethrough;
module.exports.strike = strikethrough;

module.exports.del = del;

module.exports.ins = ins;

module.exports.em = italic;
module.exports.i = italic;
module.exports.cite = italic;

module.exports.strong = bold;

module.exports.u = underline;

module.exports.samp = samp;

module.exports.kbd = kbd;

module.exports.var = varTag;

module.exports.mark = mark;

module.exports.q = q;

module.exports.small = noStyle;
module.exports.big = noStyle;
module.exports.sub = noStyle;
module.exports.sup = noStyle;
module.exports.time = noStyle;
module.exports.tt = noStyle;
module.exports.font = noStyle;
module.exports.data = noStyle;
