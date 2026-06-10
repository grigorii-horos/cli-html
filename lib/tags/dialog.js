import boxen from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';
import { extractBaseColor } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const dialog = (tag, context) => {
  const mainContent = blockTag()(tag, context);
  const contentValue = mainContent?.value ?? '';

  const styledContent = applyThemeColor(
    getAttr(tag, 'color'),
    context.theme.dialog?.color,
    contentValue,
  );

  const borderColorRaw = getAttr(tag, 'border.color') ?? context.theme.dialog?.border?.color;
  const borderColor = extractBaseColor(borderColorRaw);
  const borderStyle = getAttr(tag, 'border.style') ?? context.theme.dialog?.border?.style;
  const borderDimAttr = getAttr(tag, 'border.dim');
  const dimBorder = borderDimAttr !== null
    ? borderDimAttr === 'true'
    : (context.theme.dialog?.border?.dim ?? false);
  const padding = context.theme.dialog?.padding;

  const valueInBox = boxen(styledContent ?? '', {
    padding,
    borderColor,
    dimBorder,
    borderStyle,
  });

  return {
    marginTop: 1,
    value: valueInBox,
    marginBottom: 1,
    type: 'block',
  };
};
