import tags from '../tags.js';
import { concatTwoInlineTags } from '../utils/concat-inline-tags.js';
import { renderTag } from '../utils/render-tag.js';

const inlineTag = (wrapper) => (tag, context) => {
  const wrapFunction = wrapper || ((argument) => argument);

  if (!tag || !tag.childNodes) {
    return null;
  }

  const value = tag.childNodes.reduce((accumulator, node) => {
    const nodeTag = renderTag(node, context, tags.span);

    if (!nodeTag) {
      return accumulator;
    }

    return {
      ...concatTwoInlineTags(accumulator, nodeTag),
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }, null);

  return {
    pre: value?.pre ? wrapFunction(value.pre, tag, context) : null,
    value: wrapFunction(value?.value, tag, context),
    post: value?.post ? wrapFunction(value.post, tag, context) : null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
};

export default inlineTag;
