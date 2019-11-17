const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const { indentify } = require('../utils');

const blockquote = (tag, context) => blockTag(
  compose(
    (value) => `\n${value}\n`,
    (value) => ansiStyles.dim.italic(value),
    (value) => indentify(('  '))(value),
  ),
)(tag, { ...context, lineWidth: context.lineWidth - 2 });

module.exports.blockquote = blockquote;
