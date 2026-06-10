import compose from 'compose-function';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
import { indentify } from '../utilities.js';

export const dt = (tag, context) => {
  const theme = context.theme.dt || {};
  return blockTag(
    (value) => {
      const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
      const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '';
      const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);
      return `${styledValue}${styledSuffix}`;
    },
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 1 });
};

export const dd = (tag, context) => {
  const colorFunction = (value) => {
    return applyThemeColor(getAttr(tag, 'color'), context.theme.dd?.color, value);
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
  const colorFunction = (value) => {
    return applyThemeColor(getAttr(tag, 'color'), context.theme.dl?.color, value);
  };

  return blockTag(
    colorFunction,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 1 });
};
