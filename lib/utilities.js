export const filterAst = (ast) => {
  const removeTheseKeys = new Set(['mode', 'namespaceURI', 'parentNode', 'tagName']);

  return Object.fromEntries(
    Object.entries(ast)
      .filter(([key]) => !removeTheseKeys.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value.map(filterAst) : value]),
  );
};

export const filterAst2 = (ast) => {
  const removeTheseKeys = new Set([
    'mode',
    'namespaceURI',
    'parentNode',
    'tagName',
    'rawAttrs',
    'nodeType',
    'id',
    'classList',
  ]);

  return Object.fromEntries(
    Object.entries(ast)
      .filter(([key]) => !removeTheseKeys.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value.map(filterAst2) : value]),
  );
};

/**
 * @param {string} indent
 * @param {boolean} skipFirst
 * @returns {Function}
 */
export const indentify = (indent, skipFirst) => (text) => {
  if (!text) return text;
  if (!text.includes('\n')) {
    return (skipFirst ? '' : indent) + text;
  }

  return (skipFirst ? '' : indent) + text.replaceAll('\n', `\n${indent}`);
};

export const getAttribute = (tag, attributeName, defaultValue) => {
  if (!tag || !tag.attrs || !tag.attrs[0]) {
    return defaultValue;
  }
  const attribute = tag.attrs.find(
    (attribute) => attribute.name === attributeName,
  );

  if (!attribute) {
    return defaultValue;
  }

  return attribute.value;
};

export const getColorFromClass = (classAttribute = '') => {
  if (classAttribute?.startsWith('x-cli-color-')) {
    return classAttribute?.slice(12);
  }

  return null;
};
