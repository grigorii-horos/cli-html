import boxen_ from 'boxen';
import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, extractBaseColor } from '../utilities.js';

export const fieldset = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;
  const isRequired = getAttribute(tag, 'required', null) !== null;
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'legend');
  const summary = inlineTag()(summaryTag || null, context);

  const borderColorRaw = custom.border || context.theme.fieldset?.border?.color || 'gray';
  const borderColor = extractBaseColor(borderColorRaw);
  const borderStyle = custom.borderStyle || context.theme.fieldset?.border?.style || 'single';
  const dimBorder = custom.borderDim === null ? (context.theme.fieldset?.border?.dim ?? false) : custom.borderDim;
  const titleColorRaw = custom.title.color || context.theme.fieldset?.title?.color || 'yellow';
  const titleColor = extractBaseColor(titleColorRaw);
  const padding = context.theme.fieldset?.padding ?? { top: 0, bottom: 0, left: 1, right: 1 };

  // Get required marker attributes
  const requiredMarker = custom.requiredMarker || getAttribute(tag, 'data-cli-required-marker') || '*';
  const requiredColor = custom.requiredColor || getAttribute(tag, 'data-cli-required-color') || 'red';
  const requiredPosition = custom.requiredPosition || getAttribute(tag, 'data-cli-required-position') || 'before';

  return blockTag(
    (value) => {
      let title = summary && summary.value ? summary.value.replaceAll('\n', ' ') : null;

      // Add required marker to title if fieldset is required
      if (isRequired && title) {
        const styledMarker = chalkString(requiredColor, { colors: true })(requiredMarker);
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
      const disabledColor = custom.disabled?.color || context.theme.fieldset?.disabled?.color || 'gray dim';
      return isDisabled ? chalkString(disabledColor, { colors: true })(boxedValue) : boxedValue;
    },
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};
