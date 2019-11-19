const ansiStyles = require('ansi-colors');
const compose = require('compose-function');

const blockTag = require('../tag-helpers/blockTag');

const document = blockTag(
  compose(
    (value) => `${value}`,
  ),
);

module.exports.html = document;
module.exports.body = document;
