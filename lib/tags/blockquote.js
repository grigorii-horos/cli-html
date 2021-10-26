import compose from 'compose-function';
import {blockTag} from '../tag-helpers/blockTag.js';
import { indentify } from '../utils.js';
import ansiColors from "ansi-colors";

const { underline, grey, cyan, italic, blue, dim } = ansiColors;

export const blockquote = (tag, context) =>
  blockTag(
    compose(
      (value) => indentify(grey("│ "))(value),
      (value) => dim(value)
    ),
    { marginTop: 1, marginBottom: 1 }
  )(tag, { ...context, lineWidth: context.lineWidth - 2 });
