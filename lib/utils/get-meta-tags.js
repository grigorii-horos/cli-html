export const getMetaTags = (document) => {
  const metaTags = [];

  if (document.nodeName === 'meta') {
    metaTags.push(document);
  }

  if (document.childNodes) {
    document.childNodes.map((childNode) => {
      metaTags.push(...getMetaTags(childNode));
    });
  }

  return metaTags;
};
