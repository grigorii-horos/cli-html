/* eslint-disable unicorn/consistent-function-scoping */
const tags = require('../tags');

const { concatTwoTags: concatTwoBlockTags } = require('../concat');

const inlineTag = (wrapper, localContext, options) => (tag, context) => {
  const wrapFn = wrapper || ((argument) => (argument));
  const wrapFnPre = (options && options.wrapperPre)
    ? options.wrapperPost
    : wrapFn;
  const wrapFnPost = (options && options.wrapperPost)
    ? options.wrapperPre
    : wrapFn;

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
      pre: wrapFnPre(value.pre),
      value: wrapFn(value.value, tag),
      post: wrapFnPost(value.post),
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  return value;
};

module.exports = inlineTag;
