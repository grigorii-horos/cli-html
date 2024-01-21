import { blockTag } from '../tag-helpers/block-tag.js';

const document = blockTag();

/**
 * @param {...any} arguments_
 * @returns {Function}
 */
export function html(...arguments_) {
  return document(...arguments_);
}

/**
 * @param {...any} arguments_
 * @returns {Function}
 */
export function body(...arguments_) {
  return document(...arguments_);
}
