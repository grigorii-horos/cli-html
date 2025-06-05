const findParrentTag = (context, tags) => {
  let { parentNode: node } = context;
  let found = false;

   
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
