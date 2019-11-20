/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');

const { concatTwoBlockTags } = require('../utils/concatBlockTags');

const inlineTag = (wrapper, localContext, options) => (tag, context) => {
  const wrapFn = wrapper || ((argument) => (argument));

  if (!tag || !tag.childNodes) {
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


    return {
      ...concatTwoBlockTags(accumulator, nodeTag),
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }, null);

  if (!value) {
    return value;
  }

  if (value.value) {
    return {
      pre: value.pre
        ? wrapFn(value.pre, tag)
        : null,
      value: value.value
      ? wrapFn(value.value, tag)
      :null,
      post: value.post
        ? wrapFn(value.post, tag)
        : null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  return value;
};

module.exports = inlineTag;
