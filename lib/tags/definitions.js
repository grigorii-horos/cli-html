const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const { indentify } = require('../utils');

const dt = (tag, context) => blockTag(
  compose(
    indentify(' '),
    (value) => ansiStyles.bold.blue(value),
  ), { pre: '\n', post: '' },
)(tag, { ...context, lineWidth: context.lineWidth - 1 });

const dd = (tag, context) => blockTag(
  indentify('   '),
  { pre: '', post: '\n' },
)(tag, { ...context, lineWidth: context.lineWidth - 3 });

const dl = blockTag();

module.exports.dt = dt;
module.exports.dd = dd;
module.exports.dl = dl;
