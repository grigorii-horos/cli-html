import boxen from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';

export const details = (tag, context) => {
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'summary');
  const summary = inlineTag()(summaryTag || null, context);

  const borderColor = context.theme.details?.border?.color ?? 'gray';
  const borderStyle = context.theme.details?.border?.style ?? 'single';
  const dimBorder = context.theme.details?.border?.dim ?? false;
  const marker = context.theme.details.marker || '> ';
  const padding = context.theme.details?.padding ?? { top: 0, bottom: 0, left: 1, right: 1 };

  return blockTag(
    (value) => `${boxen(value || '', {
      title: summary && summary.value ? `${marker}${summary.value.replaceAll('\n', ' ')}` : `${marker}Summary`,
      padding,
      borderColor,
      dimBorder,
      borderStyle,
    })}`,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};
