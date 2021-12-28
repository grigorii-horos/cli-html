import chalk from 'chalk';
import { blockTag } from '../tag-helpers/blockTag.js';
import { indentify, getAttribute } from '../utils.js';
import { getListSymbol, getListType, getListItemNumber } from '../utils/list.js';

const {
  blue,
  red,
} = chalk;

export const ol = (tag, context) => {
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: true,
    compact: true,
    listType: getAttribute(tag, 'type'),
  };

  return blockTag((value) => indentify(context.compact ? '' : ' ')(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

export const ul = (tag, context) => {
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: false,
    compact: true,
    listType: getListType(getAttribute(tag, 'type', null), context.listType),
  };

  return blockTag((value) => indentify(context.compact ? '' : ' ')(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

export const li = (tag, context) => {
  if (context.orderedList) {
    return blockTag((value) => `${blue(
      `${getListItemNumber(context.liItemNumber, context.listType)}.`,
    )} ${indentify('   ', true)(value)}`)(tag, { ...context, lineWidth: context.lineWidth - 3 });
  }

  return blockTag((value) => `${indentify('  ')(value)}`.replace(
    / {2}/,
    `${red(getListSymbol(context.listType))} `,
  ))(tag, { ...context, lineWidth: context.lineWidth - 2 });
};
