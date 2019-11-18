const ansiStyles = require('ansi-colors');
const compose = require('compose-function');

const blockTag = require('../tag-helpers/blockTag');

const paragraph = blockTag(
  compose(
    (value) => `${value}`,
  ),
);

module.exports.p = paragraph;
