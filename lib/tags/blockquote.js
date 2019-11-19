const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const { indentify } = require('../utils');

const blockquote = (tag, context) => blockTag(
  compose(
    (value) => indentify(ansiStyles.gray('│ '))(value),
    (value) => ansiStyles.dim.italic(value),
  ), { pre: '\n', post: '\n' },
)(tag, { ...context, lineWidth: context.lineWidth - 2 });

module.exports.blockquote = blockquote;
