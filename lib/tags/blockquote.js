import chalk from 'chalk';
import compose from 'compose-function';

import { blockTag } from '../tag-helpers/block-tag.js';
import { indentify } from '../utils.js';

export const blockquote = (tag, context) => blockTag(
  compose(
    (value, tag) => indentify(context.theme.blockquote('│ '))(value),
    (value, tag) => value,
  ),
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 2 });
