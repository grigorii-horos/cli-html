const ansiStyles = require('ansi-colors');
const blockTag = require('../tag-helpers/blockTag');

const address = blockTag((value) => ansiStyles.italic(value));

module.exports.address = address;
