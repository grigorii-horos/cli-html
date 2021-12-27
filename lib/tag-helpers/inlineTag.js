import tags from '../tags.js';

import { concatTwoInlineTags } from '../utils/concatInlineTags.js';

const inlineTag = (wrapper) => (tag, context) => {
  const wrapFunction = wrapper || ((argument) => argument);

  if (!tag || !tag.childNodes) {
    return null;
  }

  const value = tag.childNodes.reduce((accumulator, node) => {
    const tagFunction = tags[node.nodeName || '#text'] || tags.span;

    const nodeTag = tagFunction(node, context);

    if (!nodeTag) {
      return accumulator;
    }

    return {
      ...concatTwoInlineTags(accumulator, nodeTag),
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }, null);

  if (!value) {
    return value;
  }

  if (value.value) {
    return {
      pre: value.pre ? wrapFunction(value.pre, tag) : null,
      value: value.value ? wrapFunction(value.value, tag) : null,
      post: value.post ? wrapFunction(value.post, tag) : null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  return value;
};

export default inlineTag;
