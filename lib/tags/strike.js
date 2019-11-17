const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const del = inlineTag((value) => ansiStyles.strikethrough(value));

module.exports.del = del;
