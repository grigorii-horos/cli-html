import boxen_ from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, extractBaseColor } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';

export const fieldset = (tag, context) => {
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;
  const isRequired = getAttribute(tag, 'required', null) !== null;
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'legend');
  const summary = inlineTag()(summaryTag || null, context);

  const borderColorRaw = getAttr(tag, 'border') ?? context.theme.fieldset?.border?.color;
  const borderColor = extractBaseColor(borderColorRaw);
  const borderStyle = getAttr(tag, 'border-style') ?? context.theme.fieldset?.border?.style;
  const borderDimAttr = getAttr(tag, 'border-dim');
  const dimBorder = borderDimAttr !== null ? borderDimAttr === 'true' : (context.theme.fieldset?.border?.dim ?? false);
  const titleColorRaw = getAttr(tag, 'title.color') ?? context.theme.fieldset?.title?.color;
  const titleColor = extractBaseColor(titleColorRaw);
  const padding = context.theme.fieldset?.padding;

  // Get required marker attributes
  const requiredMarker = getAttr(tag, 'required-marker') ?? context.theme.input?.required?.indicator?.marker;
  const requiredColor = getAttr(tag, 'required-color') ?? context.theme.input?.required?.indicator?.color;
  const requiredPosition = getAttr(tag, 'required-position') ?? context.theme.input?.required?.indicator?.position;

  return blockTag(
    (value) => {
      let title = summary && summary.value ? summary.value.replaceAll('\n', ' ') : null;

      // Add required marker to title if fieldset is required
      if (isRequired && title) {
        const styledMarker = applyColor(requiredColor, requiredMarker);
        if (requiredPosition === 'before') {
          title = `${styledMarker} ${title}`;
        } else if (requiredPosition === 'after') {
          title = `${title} ${styledMarker}`;
        }
      }

      const boxedValue = boxen_(value, {
        title,
        dimTitle: false,
        titleColor,
        padding,
        borderColor,
        dimBorder,
        borderStyle,
      });
      const disabledColor = getAttr(tag, 'disabled.color') ?? context.theme.fieldset?.disabled?.color;
      return isDisabled ? applyColor(disabledColor, boxedValue) : boxedValue;
    },
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};
