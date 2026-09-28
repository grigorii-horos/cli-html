import { blockTag } from '../tag-helpers/block-tag.js';
import { boxContentWidth, getBoxSettings, renderBox } from '../tag-helpers/box.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const dialog = (tag, context) => {
  const theme = context.theme.dialog;
  const settings = getBoxSettings(tag, theme);

  const mainContent = blockTag()(tag, {
    ...context,
    lineWidth: boxContentWidth(context.lineWidth, settings.padding),
  });

  const styledContent = applyThemeColor(getAttr(tag, 'color'), theme?.color, mainContent?.value ?? '');

  return {
    marginTop: 1,
    value: renderBox(styledContent, { ...settings, lineWidth: context.lineWidth }),
    marginBottom: 1,
    type: 'block',
  };
};
