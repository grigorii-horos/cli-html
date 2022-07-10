import ansiAlign from 'ansi-align';
import boxen from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';

export const figure = (tag, context) => blockTag(
  (value, tag) => {
    const valueInBox = boxen(ansiAlign(value, { align: 'center' }), {
      padding: {
        top: 0,
        bottom: 0,
        left: 1,
        right: 1,
      },
      borderColor: 'gray',
      dimBorder: false,
      borderStyle: 'round',
      titleColor: 'red',
      dimTitle: true,
    });

    return valueInBox;
  },
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 4 });
