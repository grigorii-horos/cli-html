import chalk from 'chalk';
import compose from 'compose-function';

import { blockTag } from '../tag-helpers/block-tag.js';
import { indentify } from '../utils.js';

export const dt = (tag, context) => blockTag(
  compose((value) => chalk.bold.blue(value)),
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 1 });

export const dd = (tag, context) => blockTag(indentify('  '), { marginTop: 1, marginBottom: 1 })(tag, {
  ...context,
  lineWidth: context.lineWidth - 3,
});

export const dl = blockTag();
