const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const { indentify } = require('../utils');

const ol = (tag, context) => {
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: true,
    compact: true,
  };

  // console.log('^^^%%--', newContext);

  return blockTag(
    compose(
      (value) => indentify(' ')(value),
    ), { pre: context.compact ? '' : '\n\n', post: context.compact ? '\n\n' : '' },
  )(tag, newContext);
};

const ul = (tag, context) => {
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: false,
    compact: true,
  };

  // console.log('^^^%%--', newContext);

  return blockTag(
    compose(
      (value) => indentify(' ')(value),
    ), { pre: context.compact ? '' : '\n\n', post: context.compact ? '\n\n' : '' },
  )(tag, newContext);
};

const li = (tag, context) => {
  if (context.orderedList) {
    return blockTag(
      compose(
        (value) => `${ansiStyles.blue(`${context.liItemNumber}.`)} ${indentify('   ')(value)}`.replace(/ {3}/, ''),
      ),
    )(tag, { ...context, lineWidth: context.lineWidth - 3 });
  }
  return blockTag(
    compose(
      (value) => `${indentify('  ')(value)}`.replace(/ {2}/, ansiStyles.red('• ')),
    ),
  )(tag, { ...context, lineWidth: context.lineWidth - 2 });
};

module.exports.ol = ol;
module.exports.ul = ul;
module.exports.li = li;
