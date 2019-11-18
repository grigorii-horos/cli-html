/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');

const { concatTwoInlineTags, concatTwoBlockTags } = require('../concat');
const wrapLineWidth = require('../wrapLineWidth');

const blockTag = (wrapper, localContext) => (tag, context, contextModifier) => {
  const wrapFn = wrapper || ((argument) => (argument));

  if (!tag.childNodes) {
    return null;
  }

  let liItemNumber = 1;
  const value = tag.childNodes.reduce((accumulator, node) => {
    if (!tags[node.nodeName]) {
      return accumulator;
    }

    const nodeTag = tags[node.nodeName](node, { ...context, liItemNumber });

    if (nodeTag == null) {
      return accumulator;
    }

    if (nodeTag.nodeName === 'li') {
      liItemNumber += 1;
    }


    if (nodeTag.type === 'inline') {
      return {
        block: accumulator.block,
        inline: concatTwoInlineTags(accumulator.inline, nodeTag),
      };
    }
    // console.log('8****', accumulator.inline);

    if (accumulator.inline && !context.pre) {
      if (accumulator.inline.value != null) {
        accumulator.inline.value = wrapLineWidth(accumulator.inline.value, context.lineWidth, context.pre);
      }
    }

    if (accumulator.inline && accumulator.inline.value != null) {
      accumulator.inline.pre = '\n';
      accumulator.inline.post = '\n';
      accumulator.block = concatTwoBlockTags(accumulator.block, accumulator.inline);
    }

    accumulator.block = concatTwoBlockTags(accumulator.block, nodeTag);


    return {
      block: accumulator.block,
      inline: null,
    };
  }, {
    block: null,
    inline: null,
  });

  if (value.inline != null && value.inline.value != null) {
    value.inline.value = wrapLineWidth(value.inline.value, context.lineWidth, context.pre);
  }

  value.block = concatTwoInlineTags(value.block, value.inline);

  if (!value.block || !value.block.value) {
    return null;
  }

  // console.log('***', value);

  const preBlock = (localContext && localContext.pre)
    ? localContext.pre
    : '';
  const postBlock = (localContext && localContext.post)
    ? localContext.post
    : '';

  return {
    pre: `\n${preBlock}`,
    value: wrapFn(value.block.value),
    post: `${postBlock}\n`,
    type: 'block',
    nodeName: tag.nodeName,
  };
};

module.exports = blockTag;
