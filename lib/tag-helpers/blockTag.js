/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');
const { getAttribute } = require('../utils');

const { concatTwoBlockTags } = require('../utils/concatBlockTags');
const { concatTwoInlineTags } = require('../utils/concatInlineTags');
const { inlineToBlockTag } = require('../utils/inlineToBlockTag');

const wrapLineWidth = require('../wrapLineWidth');

const blockTag = (wrapper, localContext) => (tag, context) => {
  const wrapFn = wrapper || ((argument) => (argument));

  if (!tag || !tag.childNodes) {
    return null;
  }

  let liItemNumber = parseInt(getAttribute(tag, 'start', '1'), 10);
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

    if (accumulator.inline && accumulator.inline.value != null) {
      if (!context.pre) {
        accumulator.inline.value = wrapLineWidth(accumulator.inline.value, context.lineWidth, context.pre);
      }
    }

    accumulator.block = concatTwoBlockTags(accumulator.block, inlineToBlockTag(accumulator.inline));

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
    if (!context.pre) {
      value.inline.value = wrapLineWidth(value.inline.value, context.lineWidth, context.pre);
    }
  }

  value.block = concatTwoBlockTags(value.block, inlineToBlockTag(value.inline));

  if (!value.block || !value.block.value) {
    return null;
  }

  let topBlock = (localContext && localContext.marginTop) || 0;


  topBlock = (!context || !context.pre)
    ? topBlock + 1
    : topBlock;

  let bottomBlock = (localContext && localContext.marginBottom) || 0;

  bottomBlock = (!context || !context.pre)
    ? bottomBlock + 1
    : bottomBlock;


  return {
    marginTop: (value.block.marginTop
      && value.block.marginTop > topBlock
    )
      ? value.block.marginTop
      : topBlock,
    value: wrapFn(value.block.value, tag),
    marginBottom: (value.block.marginBottom
      && value.block.marginBottom > bottomBlock
    )
      ? value.block.marginBottom
      : bottomBlock,
    type: 'block',
    nodeName: tag.nodeName,
  };
};

module.exports = blockTag;
