const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const italic = inlineTag((value) => ansiStyles.italic(value));

module.exports.i = italic;
module.exports.em = italic;
