import fieldset from 'fieldset';
import { blockTag } from '../tag-helpers/blockTag.js';

export const figure = (tag, context) => blockTag(
  (value, tag) => {
    const valueInBox = fieldset(value, {
      padding: {
        top: 1,
        bottom: 1,
        left: 2,
        right: 2,
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
)(tag, { ...context, lineWidth: context.lineWidth - 6 });
