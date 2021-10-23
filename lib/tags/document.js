import { blockTag } from "../tag-helpers/blockTag.js";

const document = blockTag();

export function html(...args) {
  return document(...args);
}

export function body(...args) {
  return document(...args);
}
