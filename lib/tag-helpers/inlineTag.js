/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');

const { concatTwoTags: concatTwoBlockTags } = require('../concat');

const inlineTag = (wrapper) => (tag, context) => {
  const wrapFn = wrapper || ((argument) => (argument));

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

    // if (nodeTag.type !== 'inline') {
    //   return accumulator;
    // }

    return {
      ...concatTwoBlockTags(accumulator, nodeTag),
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }, null);

  // console.log('^^^', value);

  if (!value) {
    return value;
  }

  if (value.value) {
    return {
      pre: value.pre,
      value: wrapFn(value.value, tag),
      post: value.post,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  return value;
};

module.exports = inlineTag;
