import compose from 'compose-function';
import chalk from 'chalk';
import { blockTag } from '../tag-helpers/blockTag.js';
import { indentify } from '../utils.js';

const {
  underline, grey, cyan, italic, blue, dim,
} = chalk;

export const blockquote = (tag, context) => blockTag(
  compose(
    (value) => indentify(grey('│ '))(value),
    (value) => dim(value),
  ),
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 2 });
