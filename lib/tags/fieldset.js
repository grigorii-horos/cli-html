import boxen from 'boxen';
import { blockTag } from '../tag-helpers/blockTag.js';
import inlineTag from '../tag-helpers/inlineTag.js';

export const fieldset = (tag, context) => {
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'legend');
  const summary = inlineTag()(summaryTag || null, context);

  return blockTag(
    (value) => `${boxen(value, {
      title: summary && summary.value ? summary.value.replace(/\n/g, ' ') : null,
      dimTitle: false,
      titleColor: 'yellow',
      padding: 1,
      borderColor: 'gray',
      borderStyle: 'single',
    })}`,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};
