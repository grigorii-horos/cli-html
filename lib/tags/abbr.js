const ansiStyles = require('ansi-colors');
const inlineTag = require('../tag-helpers/inlineTag');

const {
  getAttribute,
} = require('../utils');

const abbr = inlineTag(
  (value, tag) => {
    const title = getAttribute(tag, 'title', null);

    let abbrValue = ansiStyles.underline(value);

    abbrValue = title
      ? `${abbrValue} ${
        ansiStyles.grey('(')
      }${
        ansiStyles.cyan(title)
      }${
        ansiStyles.grey(')')
      }`
      : abbrValue;


    return abbrValue;
  },
);

const dfn = inlineTag(
  (value, tag) => {
    const title = getAttribute(tag, 'title', null);

    let abbrValue = ansiStyles.italic.underline(value);

    abbrValue = title
      ? `${abbrValue} ${
        ansiStyles.grey('(')
      }${
        ansiStyles.cyan(title)
      }${
        ansiStyles.grey(')')
      }`
      : abbrValue;


    return abbrValue;
  },
);

module.exports.abbr = abbr;
module.exports.acronym = abbr;
module.exports.dfn = dfn;
