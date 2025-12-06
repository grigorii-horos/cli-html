import compose from 'compose-function';

import { blockTag } from '../tag-helpers/block-tag.js';
import { indentify } from '../utilities.js';

export const dt = (tag, context) => blockTag(
  context.theme.dt.color,
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 1 });

export const dd = (tag, context) => blockTag(compose(
  context.theme.dd.color,
  indentify('  ', false),
), { marginTop: 1, marginBottom: 1 })(tag, {
  ...context,
  lineWidth: context.lineWidth - 3,
});

export const dl = (tag, context) => blockTag(
  context.theme.dl.color,
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 1 });
