import { blockTag } from '../tag-helpers/block-tag.js';
import { boxContentWidth, getBoxSettings, renderBox } from '../tag-helpers/box.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

export const details = (tag, context) => {
  const theme = context.theme.details ?? {};
  const settings = getBoxSettings(tag, theme);

  const summaryTag = tag.childNodes.find((child) => child.tagName === 'summary');
  const summary = inlineTag()(summaryTag || null, context);

  const state = getAttribute(tag, 'open', null) === null ? 'closed' : 'open';
  const marker = getAttr(tag, `${state}.marker`) ?? theme.indicator?.[state]?.marker ?? '';
  const markerColor = getAttr(tag, `${state}.color`) ?? theme.indicator?.[state]?.color;
  const summaryText = summary?.value ? summary.value.replaceAll('\n', ' ') : 'Details';

  return blockTag(
    (value) => renderBox(applyThemeColor(getAttr(tag, 'color'), theme.color, value), {
      ...settings,
      title: `${applyColor(markerColor, marker)}${summaryText}`,
      lineWidth: context.lineWidth,
    }),
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: boxContentWidth(context.lineWidth, settings.padding) });
};
