import compose from 'compose-function';

import { blockTag } from '../tag-helpers/block-tag.js';
import { indentify } from '../utils.js';

export const blockquote = (tag, context) => blockTag(
  compose(
    indentify(context.theme.blockquote('│ '), false),
  ),
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 2 });
