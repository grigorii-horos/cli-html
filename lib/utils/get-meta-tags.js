export const getMetaTags = (document) => {
  const metaTags = [];
  const stack = document ? [document] : [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.nodeName === 'meta') {
      metaTags.push(node);
    }
    const { childNodes } = node;
    if (childNodes && childNodes.length > 0) {
      for (let index = childNodes.length - 1; index >= 0; index -= 1) {
        stack.push(childNodes[index]);
      }
    }
  }

  return metaTags;
};
