import boxen_ from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';

export const fieldset = (tag, context) => {
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'legend');
  const summary = inlineTag()(summaryTag || null, context);

  return blockTag(
    (value) => `${boxen_(value, {
      title: summary && summary.value ? summary.value.replaceAll('\n', ' ') : null,
      dimTitle: false,
      titleColor: 'yellow',
      padding: {
        bottom: 0, top: 0, left: 1, right: 1,
      },
      borderColor: 'gray',
      borderStyle: 'single',
    })}`,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};
