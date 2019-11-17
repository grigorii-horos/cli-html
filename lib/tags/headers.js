const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');

const h1 = blockTag(
  compose(
    (value) => `${value}\n`,
    (value) => ansiStyles.red.underline.bold(`§ ${value}`),
  ),
);
const h2 = blockTag(
  compose(
    (value) => `${value}\n`,
    (value) => ansiStyles.yellow.underline.bold(`§ ${value}`),
  ),
);
const h3 = blockTag(
  compose(
    (value) => `${value}\n`,
    (value) => ansiStyles.yellow.underline(`§ ${value}`),
  ),
);
const h4 = blockTag(
  compose(
    (value) => `${value}\n`,
    (value) => ansiStyles.green.underline(`§ ${value}`),
  ),
);
const h5 = blockTag(
  compose(
    (value) => `${value}\n`,
    (value) => ansiStyles.green(`§ ${value}`),
  ),
);
const h6 = blockTag(
  compose(
    (value) => `${value}\n`,
    (value) => ansiStyles.green.dim(`§ ${value}`),
  ),
);

module.exports.h1 = h1;
module.exports.h2 = h2;
module.exports.h3 = h3;
module.exports.h4 = h4;
module.exports.h5 = h5;
module.exports.h6 = h6;
