const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const button = inlineTag(
  (value) => `${ansiStyles.bgBlack.grey('[ ')}${ansiStyles.bgBlack.bold(value)}${ansiStyles.bgBlack.grey(
    ' ]',
  )}`,
);

const output = inlineTag();

module.exports.button = button;
module.exports.output = output;
