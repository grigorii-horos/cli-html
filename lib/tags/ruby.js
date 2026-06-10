import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

export const ruby = inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.ruby?.color, value),
);

export const rt = inlineTag((value, tag, context) => {
  const theme = context.theme.ruby?.rt ?? {};
  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
  const prefix = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker;
  const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker;
  const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);
  return `${styledPrefix}${styledValue}${styledSuffix}`;
});

export const rp = () => null;
