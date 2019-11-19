const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');

const h1 = blockTag(
  (value) => ansiStyles.red.underline.bold(`§ ${value}`),
  { pre: '\n', post: '\n' },
);
const h2 = blockTag(
  (value) => ansiStyles.yellow.underline.bold(`§ ${value}`),
  { pre: '\n', post: '\n' },
);
const h3 = blockTag(
  (value) => ansiStyles.yellow.underline(`§ ${value}`),
  { pre: '\n', post: '\n' },
);
const h4 = blockTag(
  (value) => ansiStyles.green.underline(`§ ${value}`),
  { pre: '\n', post: '\n' },
);
const h5 = blockTag(
  (value) => ansiStyles.green(`§ ${value}`),
  { pre: '\n', post: '\n' },
);
const h6 = blockTag(
  (value) => ansiStyles.green.dim(`§ ${value}`),
  { pre: '\n', post: '\n' },
);

module.exports.h1 = h1;
module.exports.h2 = h2;
module.exports.h3 = h3;
module.exports.h4 = h4;
module.exports.h5 = h5;
module.exports.h6 = h6;
