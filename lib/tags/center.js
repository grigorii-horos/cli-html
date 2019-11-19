const ansiAlign = require('ansi-align');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');

const center = (tag, context) => blockTag(
  compose(
    (value) => ansiAlign(value, { align: 'center' }),
  ),
)(tag, context);

module.exports.center = center;
