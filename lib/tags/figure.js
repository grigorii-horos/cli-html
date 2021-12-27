import fieldset from 'fieldset';
import { blockTag } from '../tag-helpers/blockTag.js';

export const figure = (tag, context) => blockTag(
  (value, tag) => {
    const valueInBox = fieldset(value, {
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
