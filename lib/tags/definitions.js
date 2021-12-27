import compose from 'compose-function';
import ansiColors from 'ansi-colors';
import { blockTag } from '../tag-helpers/blockTag.js';
import { indentify } from '../utils.js';

export const dt = (tag, context) => blockTag(
  compose((value) => ansiColors.bold.blue(value)),
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 1 });

export const dd = (tag, context) => blockTag(indentify('  '), { marginTop: 1, marginBottom: 1 })(tag, {
  ...context,
  lineWidth: context.lineWidth - 3,
});

export const dl = blockTag();
