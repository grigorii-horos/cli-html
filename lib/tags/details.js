const boxen = require('boxen');
const blockTag = require('../tag-helpers/blockTag');
const inlineTag = require('../tag-helpers/inlineTag');


const details = (tag, context) => {
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'summary');
  const summary = inlineTag()(
    summaryTag || null, context,
  );

  return blockTag(
    (value) => `${boxen(value, {
      title: (summary && summary.value)
        ? `> ${summary.value}`
        : '> Summary',
      dimTitle: false,
      titleColor: 'red',
      padding: 1,
      borderColor: 'gray',
      borderStyle: 'single',
    })}`,
    { pre: '\n\n', post: '\n\n' },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};


module.exports.details = details;
