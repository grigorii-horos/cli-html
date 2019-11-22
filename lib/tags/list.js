const ansiStyles = require('ansi-colors');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const { indentify, getAttribute } = require('../utils');
const { getListSymbol, getListType, getListItemNumber } = require('../utils/list');

const ol = (tag, context) => {
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: true,
    compact: true,
    listType: getAttribute(tag, 'type', undefined),
  };

  return blockTag((value) => indentify(' ')(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

const ul = (tag, context) => {
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: false,
    compact: true,
    listType: getListType(getAttribute(tag, 'type', null), context.listType),
  };

  return blockTag((value) => indentify(' ')(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

const li = (tag, context) => {
  if (context.orderedList) {
    return blockTag((value) => `${ansiStyles.blue(
      `${getListItemNumber(context.liItemNumber, context.listType)}.`,
    )} ${indentify('   ')(value)}`.replace(/ {3}/, ''))(tag, { ...context, lineWidth: context.lineWidth - 3 });
  }

  return blockTag((value) => `${indentify('  ')(value)}`.replace(
    / {2}/,
    `${ansiStyles.red(getListSymbol(context.listType))} `,
  ))(tag, { ...context, lineWidth: context.lineWidth - 2 });
};

module.exports.ol = ol;
module.exports.ul = ul;
module.exports.li = li;
