const inlineToBlockTag = (value) => {
  if (!value) {
    return null;
  }

  return {
    ...value,
    pre: null,
    post: null,
    type: 'block',
    nodeName: 'div',
  };
};


module.exports.inlineToBlockTag = inlineToBlockTag;
