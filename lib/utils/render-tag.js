import tags from '../tags.js';

export const renderTag = (node, context, defaultTag = tags.div) => {
  const tagFunction = tags[node.nodeName || '#text'] || defaultTag;
  const nodeTag = tagFunction(node, context);

  return nodeTag;
};
