import ansiAlign from 'ansi-align';
import boxen from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';

export const figure = (tag, context) => blockTag(
  (value) => {
    const borderColor = context.theme.figure?.border?.color ?? 'gray';
    const borderStyle = context.theme.figure?.border?.style ?? 'round';
    const dimBorder = context.theme.figure?.border?.dim ?? false;
    const padding = context.theme.figure?.padding ?? { top: 0, bottom: 0, left: 1, right: 1 };

    const valueInBox = boxen(ansiAlign(value, { align: 'center' }), {
      padding,
      borderColor,
      dimBorder,
      borderStyle,
    });

    return valueInBox;
  },
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 4 });
