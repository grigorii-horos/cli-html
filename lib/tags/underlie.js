const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const underline = inlineTag((value) => ansiStyles.underline(value));

module.exports.u = underline;
