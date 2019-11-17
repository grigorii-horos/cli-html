/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');

const concatTwoInlineTags = require('../concatTwoInlineTags');

const inlineTag = (wrapper) => (tag, context) => {
  if (!tag.childNodes) {
    return null;
  }

  const value = tag.childNodes.reduce((accumulator, node) => {
    if (!tags[node.nodeName]) {
      return accumulator;
    }

    const nodeTag = tags[node.nodeName](node, context);

    if (nodeTag === null) {
      return accumulator;
    }

    if (nodeTag.type !== 'inline') {
      return accumulator;
    }

    return {
      ...concatTwoInlineTags(accumulator, nodeTag),
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }, null);

  if (wrapper && value.value) {
    return {
      pre: value.pre,
      value: wrapper(value.value),
      post: value.post,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  return value;
};

module.exports = inlineTag;
