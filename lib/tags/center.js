const ansiAlign = require('ansi-align');
const blockTag = require('../tag-helpers/blockTag');

const center = blockTag((value) => ansiAlign(value, { align: 'center' }));

module.exports.center = center;
