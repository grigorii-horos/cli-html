import { getAttribute } from '../utilities.js';

export const getAttr = (tag, dotPath) => {
  const attrName = 'data-cli-' + dotPath.replaceAll('.', '-');
  const value = getAttribute(tag, attrName, null);
  return value === 'null' ? null : value;
};
