import { blockTag } from '../tag-helpers/block-tag.js';
import stringWidth from 'string-width';

import { boxContentWidth, getBoxSettings, renderBox, truncateAnsi } from '../tag-helpers/box.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

export const fieldset = (tag, context) => {
  const theme = context.theme.fieldset ?? {};
  const settings = getBoxSettings(tag, theme);
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;
  const isRequired = getAttribute(tag, 'required', null) !== null;
  const legendTag = tag.childNodes.find((child) => child.tagName === 'legend');
  const legend = inlineTag()(legendTag || null, context);

  const requiredEnabledAttribute = getAttr(tag, 'required.enabled');
  const requiredEnabled = requiredEnabledAttribute === null
    ? theme.required?.enabled !== false
    : requiredEnabledAttribute === 'true';
  const requiredMarker = getAttr(tag, 'required.marker') ?? theme.required?.indicator?.marker;
  const requiredColor = getAttr(tag, 'required.color') ?? theme.required?.indicator?.color;
  const requiredPosition = getAttr(tag, 'required.position') ?? theme.required?.indicator?.position;

  return blockTag(
    (value) => {
      let title = legend?.value ? legend.value.replaceAll('\n', ' ') : null;
      const titleColor = getAttr(tag, 'title.color') ?? theme.title?.color;

      const showRequired = title && isRequired && requiredEnabled && requiredMarker;

      if (title) {
        // Truncate the legend itself so a long legend never hides the required marker
        const reserved = 4 + (showRequired ? stringWidth(requiredMarker) + 1 : 0);
        title = truncateAnsi(title, Math.max(1, context.lineWidth - reserved));
      }

      if (title && titleColor) {
        title = applyColor(titleColor, title);
      }

      if (showRequired) {
        const styledMarker = applyColor(requiredColor, requiredMarker);
        title = requiredPosition === 'before' ? `${styledMarker} ${title}` : `${title} ${styledMarker}`;
      }

      const boxedValue = renderBox(applyThemeColor(getAttr(tag, 'color'), theme.color, value), {
        ...settings,
        title,
        lineWidth: context.lineWidth,
      });
      const disabledColor = getAttr(tag, 'disabled.color') ?? theme.disabled?.color;
      return isDisabled ? applyColor(disabledColor, boxedValue) : boxedValue;
    },
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: boxContentWidth(context.lineWidth, settings.padding) });
};
