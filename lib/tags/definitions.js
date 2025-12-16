import chalkString from 'chalk-string';
import compose from 'compose-function';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getCustomAttributes, applyCustomColor, indentify } from '../utilities.js';

export const dt = (tag, context) => {
  const custom = getCustomAttributes(tag);

  const colorFunction = (value) => {
    return applyCustomColor(custom.color, context.theme.dt.color, value, chalkString);
  };

  return blockTag(
    colorFunction,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 1 });
};

export const dd = (tag, context) => {
  const custom = getCustomAttributes(tag);

  const colorFunction = (value) => {
    return applyCustomColor(custom.color, context.theme.dd.color, value, chalkString);
  };

  return blockTag(compose(
    colorFunction,
    indentify('  ', false),
  ), { marginTop: 1, marginBottom: 1 })(tag, {
    ...context,
    lineWidth: context.lineWidth - 3,
  });
};

export const dl = (tag, context) => {
  const custom = getCustomAttributes(tag);

  const colorFunction = (value) => {
    return applyCustomColor(custom.color, context.theme.dl.color, value, chalkString);
  };

  return blockTag(
    colorFunction,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 1 });
};
