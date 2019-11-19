const boxen = require('boxen');
const blockTag = require('../tag-helpers/blockTag');
const inlineTag = require('../tag-helpers/inlineTag');


const fieldset = (tag, context) => {
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'legend');
  const summary = inlineTag()(
    summaryTag || null, context,
  );

  return blockTag(
    (value) => `${boxen(value, {
      title: (summary && summary.value)
        ? summary.value
        : null,
      dimTitle: false,
      titleColor: 'yellow',
      padding: 1,
      borderColor: 'gray',
      borderStyle: 'single',
    })}`,
    { pre: '\n\n', post: '\n\n' },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};


module.exports.fieldset = fieldset;
