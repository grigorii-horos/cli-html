const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const q = inlineTag((value) => `"${value}"`);

const noStyle = inlineTag();

const italic = inlineTag((value) => ansiStyles.italic(value));
const del = inlineTag((value) => ansiStyles.strikethrough(value));
const underline = inlineTag((value) => ansiStyles.underline(value));
const bold = inlineTag((value) => ansiStyles.bold(value));
const samp = inlineTag((value) => ansiStyles.grey(value));
const kbd = inlineTag((value) => ansiStyles.white.bgBlack(value));
const varTag = inlineTag((value) => ansiStyles.green(value));
const mark = inlineTag((value) => ansiStyles.bgYellow.black.dim(value));
const small = inlineTag((value) => ansiStyles.dim(value));


module.exports.b = bold;

module.exports.del = del;
module.exports.s = del;

module.exports.em = italic;
module.exports.i = italic;
module.exports.cite = italic;

module.exports.strong = bold;

module.exports.u = underline;
module.exports.ins = underline;

module.exports.samp = samp;

module.exports.kbd = kbd;

module.exports.var = varTag;

module.exports.mark = mark;

module.exports.q = q;

module.exports.small = small;

module.exports.sub = noStyle;
module.exports.sup = noStyle;
module.exports.time = noStyle;
