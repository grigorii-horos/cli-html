/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');

const { concatTwoTags: concatTwoBlockTags } = require('../concat');
const wrapLineWidth = require('../wrapLineWidth');

const blockTag = (wrapper, localContext) => (tag, context) => {
  const wrapFn = wrapper || ((argument) => (argument));

  if (!tag || !tag.childNodes) {
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
        inline: concatTwoBlockTags(accumulator.inline, nodeTag),
      };
    }
    // console.log('8****', accumulator.inline);

    if (accumulator.inline && accumulator.inline.value != null) {
      if (!context.pre) {
        accumulator.inline.value = wrapLineWidth(accumulator.inline.value, context.lineWidth, context.pre);
      }
    }

    accumulator.block = concatTwoBlockTags(accumulator.block, accumulator.inline);

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

  value.block = concatTwoBlockTags(value.block, value.inline);

  if (!value.block || !value.block.value) {
    return null;
  }

  let preBlock = (localContext && localContext.pre)
    ? localContext.pre
    : '';
  preBlock = (!context || !context.pre)
    ? `${preBlock}\n`
    : `${preBlock}`;

  let postBlock = (localContext && localContext.post)
    ? localContext.post
    : '';
  postBlock = (!context || !context.pre)
    ? `\n${postBlock}`
    : `${postBlock}`;

  return {
    pre: `${(
      value.block.pre
      && value.block.pre.replace(/\n/g, '     ') > preBlock.replace(/\n/g, '     ')
    )
      ? value.block.pre
      : preBlock}`,
    value: wrapFn(value.block.value, tag),
    post: `${(
      value.block.post
      && value.block.post.replace(/\n/g, '     ') > postBlock.replace(/\n/g, '     ')
    )
      ? value.block.post
      : postBlock}`,
    type: 'block',
    nodeName: tag.nodeName,
  };
};

module.exports = blockTag;
