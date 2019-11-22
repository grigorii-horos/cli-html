const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');

const h1 = blockTag((value) => ansiStyles.red.underline.bold(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
const h2 = blockTag((value) => ansiStyles.yellow.underline.bold(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
const h3 = blockTag((value) => ansiStyles.yellow.underline(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
const h4 = blockTag((value) => ansiStyles.green.underline(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
const h5 = blockTag((value) => ansiStyles.green(`§ ${value}`), { marginTop: 1, marginBottom: 1 });
const h6 = blockTag((value) => ansiStyles.green.dim(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});

module.exports.h1 = h1;
module.exports.h2 = h2;
module.exports.h3 = h3;
module.exports.h4 = h4;
module.exports.h5 = h5;
module.exports.h6 = h6;
