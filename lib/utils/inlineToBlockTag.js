const inlineToBlockTag = (value) => {
  if (!value) {
    return null;
  }

  return {
    ...value,
    marginTop: 0,
    marginBottom: 0,
    type: 'block',
    nodeName: '#blockTag',
  };
};

export { inlineToBlockTag };
