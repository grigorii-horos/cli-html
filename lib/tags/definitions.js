const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const { indentify } = require('../utils');

const dt = (tag, context) => blockTag(
  compose(
    indentify(' '),
    (value) => ansiStyles.bold.blue(value),
  ), { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 1 });

const dd = (tag, context) => blockTag(
  indentify('   '),
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 3 });

const dl = blockTag();

module.exports.dt = dt;
module.exports.dd = dd;
module.exports.dl = dl;
