import { blockTag } from '../tag-helpers/blockTag.js';

const document = blockTag();

/**
 * @param {...any} arguments_
 */
export function html(...arguments_) {
  return document(...arguments_);
}

/**
 * @param {...any} arguments_
 */
export function body(...arguments_) {
  return document(...arguments_);
}
