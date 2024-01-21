export const getMetaTags = (document) => {
  const metaTags = [];

  if (document.nodeName === 'meta') {
    metaTags.push(document);
  }

  if (document.childNodes) {
    // eslint-disable-next-line no-restricted-syntax
    for (const childNode of document.childNodes) {
      metaTags.push(...getMetaTags(childNode));
    }
  }

  return metaTags;
};
