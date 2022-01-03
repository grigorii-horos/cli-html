const findParrentTag = (context, tags) => {
  let { parentNode: node } = context;
  let found = false;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (tags.includes(node.tagName)) {
      found = true;
      break;
    }

    if (node.parentNode) { node = node.parentNode; } else {
      break;
    }
  }

  return found;
};

export default findParrentTag;
