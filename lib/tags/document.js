import { blockTag } from '../tag-helpers/block-tag.js';

const document = blockTag();

/**
 * `<html>`: rendered as a plain block
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {object | null} - Rendered block
 */
export function html(tag, context) {
  return document(tag, context);
}

/**
 * `<body>`: rendered as a plain block
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {object | null} - Rendered block
 */
export function body(tag, context) {
  return document(tag, context);
}
