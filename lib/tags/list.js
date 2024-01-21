import chalk from 'chalk';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute, indentify } from '../utils.js';
import { getListItemNumber, getListSymbol, getListType } from '../utils/list.js';

const { blueBright, redBright } = chalk;

export const ol = (tag, context) => {
  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: true,
    compact: true,
    listType: getAttribute(tag, 'type'),
  };

  return blockTag((value) => indentify(context.compact ? '' : ' ', false)(value), {
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

  return blockTag((value) => indentify(context.compact ? '' : ' ', false)(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

export const li = (tag, context) => {
  if (context.orderedList) {
    return blockTag(
      (value) => `${blueBright(
        `${getListItemNumber(context.liItemNumber, context.listType)}.`,
      )} ${indentify('   ', true)(value)}`,
    )(tag, { ...context, lineWidth: context.lineWidth - 3 });
  }

  return blockTag((value) => `${indentify('  ', false)(value)}`.replace(
    / {2}/,
    `${redBright(getListSymbol(context.listType))} `,
  ))(tag, { ...context, lineWidth: context.lineWidth - 2 });
};
