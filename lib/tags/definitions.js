import compose from 'compose-function';
import {blockTag} from '../tag-helpers/blockTag.js';
import { indentify } from '../utils.js';
import ansiColors from "ansi-colors";
const { underline, grey, cyan, italic, blue, dim, yellow, bold } = ansiColors;

export const dt = (tag, context) => blockTag(
  compose(indentify(' '), (value) => bold.blue(value)),
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 1 });

export const dd = (tag, context) => blockTag(indentify('   '), { marginTop: 1, marginBottom: 1 })(tag, {
  ...context,
  lineWidth: context.lineWidth - 3,
});

export const dl = blockTag();
