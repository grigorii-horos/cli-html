import boxen_ from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';

export const fieldset = (tag, context) => {
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'legend');
  const summary = inlineTag()(summaryTag || null, context);

  const borderColor = context.theme.fieldset?.border?.color ?? 'gray';
  const borderStyle = context.theme.fieldset?.border?.style ?? 'single';
  const dimBorder = context.theme.fieldset?.border?.dim ?? false;
  const titleColor = context.theme.fieldset?.title?.color ?? 'yellow';
  const padding = context.theme.fieldset?.padding ?? { top: 0, bottom: 0, left: 1, right: 1 };

  return blockTag(
    (value) => `${boxen_(value, {
      title: summary && summary.value ? summary.value.replaceAll('\n', ' ') : null,
      dimTitle: false,
      titleColor,
      padding,
      borderColor,
      dimBorder,
      borderStyle,
    })}`,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};
