const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const bold = inlineTag((value) => ansiStyles.bold(value));

module.exports.b = bold;
module.exports.strong = bold;
