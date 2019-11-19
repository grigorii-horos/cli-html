const filterAst = (ast) => {
  const removeTheseKeys = [
    'mode',
    'namespaceURI',
    'parentNode',
    'tagName',
  ];

  return Object.entries(ast).reduce((accumulator, [key, value]) => {
    if (removeTheseKeys.includes(key)) {
      return accumulator;
    }
    if (Array.isArray(value)) {
      return { ...accumulator, [key]: value.map(filterAst) };
    }
    return { ...accumulator, [key]: value };
  }, {});
};


module.exports.filterAst = filterAst;

/**
 *
 * @param {*} indent
 */
function indentify(indent) {
  return function indentify(text) {
    if (!text) return text;
    return indent + text.split('\n').join(`\n${indent}`);
  };
}
module.exports.indentify = indentify;


const getAttribute = (tag, attributeName, defaultValue) => {
  if (!tag || !tag.attrs || !tag.attrs[0]) {
    return defaultValue;
  }
  const attribute = tag.attrs.find((attribute) => attribute.name === attributeName);

  if (!attribute) {
    return defaultValue;
  }

  return attribute.value;
};

module.exports.getAttribute = getAttribute;
