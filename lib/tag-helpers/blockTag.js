/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');

const concatTwoInlineTags = require('../concatTwoInlineTags');
const wrapLineWidth = require('../wrapLineWidth');

const blockTag = (wrapper) => (tag, context, contextModifier) => {
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


    if (accumulator.inline != null && accumulator.inline.value != null) {
      accumulator.inline.value = wrapLineWidth(accumulator.inline.value, context.lineWidth, context.pre);
    }

    return {
      block: [
        ...accumulator.block,
        accumulator.inline,
        nodeTag,
      ],
      inline: null,
    };
  }, {
    block: [],
    inline: null,
  });

  if (value.inline != null && value.inline.value != null) {
    value.inline.value = wrapLineWidth(value.inline.value, context.lineWidth, context.pre);
  }

  const concatTwoTags = ([...value.block, value.inline]).filter((value) => !!value && !!value.value).map((value) => value.value).join(context.pre ? '' : '\n');


  if (!concatTwoTags) {
    return null;
  }


  return {
    value: wrapFn(concatTwoTags),
    type: 'block',
    nodeName: tag.nodeName,
  };
};

module.exports = blockTag;
